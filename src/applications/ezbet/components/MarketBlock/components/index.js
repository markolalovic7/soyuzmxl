import cx from "classnames";
import PropTypes from "prop-types";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import useScrollLock from "use-scroll-lock";

import { getAuthLanguage } from "../../../../../redux/reselect/auth-selector";
import { makeGetBetslipOutcomeIds } from "../../../../../redux/reselect/betslip-selector";
import { acknowledgeErrors, onRefreshBetslipHandler, onToggleSelection } from "../../../../../utils/betslip-utils";
import { isNotEmpty } from "../../../../../utils/lodash";
import { openLinkInNewWindow } from "../../../../../utils/misc";
import classes from "../../../scss/ezbet.module.scss";

import { getInfoRules } from "./popup-utils";

import CloseRedSvg from "applications/ezbet/img/icons/close-red.svg";

const BetslipErrorModal = ({ message, onClose }) => {
  const { t } = useTranslation();

  return (
    <div
      className={cx(classes["confirmation-modal"], classes["confirm-error-modal"], classes["max-selections"])}
      id="confirmation-modal"
      style={{ display: "flex" }}
    >
      <div className={classes["modal-content"]}>
        <div className={classes["modal-body"]}>
          <i className={classes["ez-check-icon"]}>
            <img alt="White Check in blue circle" src={CloseRedSvg} />
          </i>
          <div>
            <p className={classes["warning"]} style={{ color: "#E32323", marginBottom: "11px" }}>
              {t("betslip_panel.unable_place_bet")}
            </p>
            <p>{message}</p>
          </div>
          <div className={cx(classes["modal-footer"], classes["flex-al-center"])}>
            <button className={cx(classes["primary"], classes["confirmation-button"])} type="button" onClick={onClose}>
              {t("ok")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

BetslipErrorModal.propTypes = { message: PropTypes.string.isRequired, onClose: PropTypes.func.isRequired };

const isCorrectScore = (feedcode) => {
  if (
    // Correct Score
    feedcode.includes("BR:MKT:U0207:") ||
    feedcode.includes("BR:MKT:U0199:") ||
    feedcode.includes("BR:MKT:U0081:") ||
    feedcode.includes("BR:MKT:U0430:") ||
    feedcode.includes("BR:MKT:U0456:") ||
    feedcode.includes("BR:MKT:U0427:") ||
    feedcode.includes("BR:MKT:U0431:") ||
    feedcode.includes("BR:MKT:U0135:") ||
    feedcode.includes("BR:MKT:U0329:") ||
    feedcode.includes("BR:MKT:U0045:") ||
    feedcode.includes("BR:MKT:U0046:") ||
    feedcode.includes("BR:MKT:U0532:") ||
    feedcode.includes("BR:MKT:U098:")
  ) {
    return true;
  }

  return false;
};

const isCorrectScoreLayout = (feedcode, children) => {
  if (isCorrectScore(feedcode)) {
    const hasDraw = isNotEmpty(
      children.filter((o) => {
        const score = o.desc.split(" ")[o.desc.split(" ").length - 1];

        if (score.includes(":")) {
          const scoreA = Number(score.split(":")[0].trim());
          const scoreB = Number(score.split(":")[1].trim());

          return scoreA === scoreB;
        }

        return true; // "other" counts like a "draw"
      }),
    );

    return hasDraw;
  }

  return false;
};

const decorateCorrectScoreRows = (feedcode, children) => {
  if (isCorrectScore(feedcode)) {
    // try to structure the correct score market in the expected format
    // We will start by identifying the home, draw and away winning scores
    // Then identify the "other" (if any)
    // We will then group at the same level (per "display" row), and add dummy scores where required.

    const homeScores = [];
    const drawScores = [];
    const awayScores = [];
    let other;

    children.forEach((o) => {
      // track the scores per winning side
      const score = o.desc.split(" ")[o.desc.split(" ").length - 1];
      if (!score.includes(":")) {
        other = o;
      } else {
        const scoreA = Number(score.split(":")[0].trim());
        const scoreB = Number(score.split(":")[1].trim());

        if (scoreA > scoreB) {
          homeScores.push({ o, score, scoreA, scoreB });
        }
        if (scoreA < scoreB) {
          awayScores.push({ o, score, scoreA, scoreB });
        }
        if (scoreA === scoreB) {
          drawScores.push({ o, score, scoreA, scoreB });
        }
      }
    });

    // sort this out
    homeScores.sort((a, b) => a.scoreA - b.scoreA);
    awayScores.sort((a, b) => a.scoreB - b.scoreB);
    drawScores.sort((a, b) => a.scoreA - b.scoreA);

    // what's the max score?
    const maxScore = Math.max(homeScores.length, awayScores.length, drawScores.length);

    // build the new children list!
    const newChildren = [];
    for (let i = 0; i < maxScore; i += 1) {
      if (homeScores.length - 1 >= i && homeScores[i]) {
        newChildren.push(homeScores[i].o);
      } else {
        newChildren.push({ desc: "xxx", hidden: true, id: -100 - 1 * i, placeholder: true });
      }

      if (isNotEmpty(drawScores) || other) {
        if (drawScores.length - 1 >= i && drawScores[i]) {
          newChildren.push(drawScores[i].o);
        } else if (other && drawScores.length === i) {
          // if we are one step after having exhausted real draw scores, use the "other" (if available)
          newChildren.push(other);
        } else {
          newChildren.push({ desc: "xxx", hidden: true, id: -200 - 1 * i, placeholder: true });
        }
      }

      if (homeScores.length - 1 >= i && awayScores[i]) {
        newChildren.push(awayScores[i].o);
      } else {
        newChildren.push({ desc: "xxx", hidden: true, id: -300 - 1 * i, placeholder: true });
      }
    }

    return newChildren;
  }

  return children;
};

const getRows = (feedcode, children) => {
  const arrays = [];
  if (children) {
    let size = children.length > 3 ? 2 : children.length; // If the size is > 3, split in groups of 2 (except if modules of 3!) This is HitBet specific

    // special cases
    if (
      // 1x2 & Total
      feedcode.includes("BR:MKT:U0037:") ||
      feedcode.includes("BR:MKT:U0079:") ||
      feedcode.includes("BR:MKT:U0265:") ||
      feedcode.includes("BR:MKT:U0292:")
    ) {
      size = 3;
    }

    if (
      // Correct Score
      isCorrectScoreLayout(feedcode, children)
    ) {
      size = 3;
    }

    for (let i = 0; i < children.length; i += size) {
      arrays.push(children.slice(i, i + size));
    }
  }

  return arrays;
};

const CashoutSVG = () => (
  <svg
    data-name="Group 33057"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <clipPath id="clip-path">
        <path
          d="M0 0H24V24H0z"
          data-name="Rectangle 17066"
          fill="#fff"
        />
      </clipPath>
    </defs>
    <g clipPath="url(#clip-path)" data-name="Group 33056" fill="#fff">
      <path
        d="M20.144 24H3.859A.266.266 0 003.8 24a3.745 3.745 0 01-1.045-.2A4.087 4.087 0 01.34 21.565 4.123 4.123 0 010 19.909V4.268c0-.173.013-.346.021-.52a3.347 3.347 0 01.135-.774A4.1 4.1 0 012.419.359 3.877 3.877 0 013.876.017.2.2 0 003.928 0H20.1a.165.165 0 00.041.016c.161.018.323.026.482.052a4.069 4.069 0 013.054 2.39 3.585 3.585 0 01.306 1.242.585.585 0 00.017.087v16.447a.35.35 0 00-.017.064c-.006.077 0 .156-.014.232A4.019 4.019 0 0122.634 23a3.938 3.938 0 01-2.434 1 .2.2 0 00-.052.018M22.8 12.012V4.068a2.672 2.672 0 00-.053-.552 2.839 2.839 0 00-.94-1.6 2.868 2.868 0 00-1.94-.7H4.281a4.438 4.438 0 00-.474.021 2.813 2.813 0 00-2.082 1.221 2.8 2.8 0 00-.512 1.656v15.888a2.241 2.241 0 00.029.357 2.834 2.834 0 00.931 1.717 2.767 2.767 0 001.881.731q7.915.008 15.83 0a3.021 3.021 0 00.4-.024 2.862 2.862 0 001.658-.809 2.772 2.772 0 00.6-.862 2.687 2.687 0 00.249-1.1v-8"
        data-name="Path 66438"
      />
      <path
        d="M97.211 152.231h-2.073v-1.18H96.9l-.266-.994h-1.496v-1.19h1.179l-.752-2.925c.093-.025 1.333-.033 1.571-.012l.682 2.929h2.9c.282-.972.551-1.953.833-2.932h1.575l.816 2.933h2.9l.682-2.931h1.6c-.122.493-.255.978-.381 1.465s-.255.969-.386 1.468h1.2v1.194h-1.5c-.1.323-.178.651-.271.991h1.775v1.181c-.137.007-.275 0-.412 0h-1.678l-1.143 4.346h-1.534l-1.2-4.341h-2.5l-1.216 4.342h-1.539l-1.128-4.348m9.131-1.189l.232-.978h-2.3l.277.978zm-6.229 0l.275-.979H98.1l.22.979zm1.586-.981c-.088.328-.194.647-.271.979h1.834l-.283-.979zm-3.1 2.176l.524 2.271h.028l.628-2.271zm7.469 0H104.9c.018.159.59 2.21.637 2.28l.53-2.28m-3.415-3.379l-.292-1.057h-.022l-.3 1.056z"
        data-name="Path 66439"
        transform="translate(-90.533 -138.855)"
      />
    </g>
  </svg>
);

const propTypes = {
  eventId: PropTypes.number.isRequired,
  feedcode: PropTypes.string.isRequired,
  marketGroup: PropTypes.object.isRequired,
  sportCode: PropTypes.string.isRequired,
};

const MarketBlock = ({ eventId, feedcode, marketGroup, sportCode }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();

  const language = useSelector(getAuthLanguage);

  const [currentPeriodOrdinal, setCurrentPeriodOrdinal] = useState(1);
  const [showMarketInfo, setShowMarketInfo] = useState(false);

  const [collapsed, setCollapsed] = useState(false);

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const maxBetslipSelections = 20; // ???
  const compactBetslipMode = false;
  const [maxSelections, setMaxSelections] = React.useState(false);

  const toggleBetslipHandler = (outcomeId, eventId) => {
    if (betslipOutcomeIds.length >= maxBetslipSelections && !betslipOutcomeIds.find((x) => x === outcomeId)) {
      // alert(t("betslip_panel.too_many_selections", { value: maxBetslipSelections }));
      setMaxSelections(true);
    } else {
      onToggleSelection(dispatch, location.pathname, outcomeId, eventId, compactBetslipMode);
      onRefreshBetslipHandler(dispatch, location.pathname);
    }
  };

  const popupInfo = useMemo(() => getInfoRules(marketGroup.periods[0].markets[0]), []);

  const decoratedPeriods = useMemo(() => {
    const decoratedPeriods = marketGroup.periods.map((x) => ({
      ...x,
      active: x.ordinal === currentPeriodOrdinal,
      available: true,
      ordinal: x.ordinal,
    }));

    return decoratedPeriods;
  }, [currentPeriodOrdinal, marketGroup.periods]);

  function onClose() {
    setMaxSelections(false);
  }

  const isAnyMarketForCurrentPeriodOpen = useMemo(
    () =>
      marketGroup.periods
        .filter((p) => p.ordinal === currentPeriodOrdinal)
        .findIndex((x) => x.markets.findIndex((y) => y.open) > -1) > -1,
    [currentPeriodOrdinal, marketGroup.periods],
  );

  const isAnyOutcomeForCurrentPeriodValid = useMemo(() => {
    const periodMarkets = marketGroup.periods.find((x) => x.ordinal === currentPeriodOrdinal);

    console.log(periodMarkets);
    const periodMarketsOutcomes = periodMarkets.markets.map((x) => x.children ?? []).flat();

    return periodMarketsOutcomes.findIndex((x) => !x.hidden) > -1;
  }, [currentPeriodOrdinal, marketGroup.periods]);

  useScrollLock(maxSelections);

  return (
    <>
      {maxSelections && (
        <BetslipErrorModal
          message={t("betslip_panel.too_many_selections", { value: maxBetslipSelections })}
          onClose={() => {
            acknowledgeErrors(dispatch, location.pathname);
            onClose();
          }}
        />
      )}
      <div className={classes["market-type"]}>
        <button
          className={cx(classes["accordion"], classes["colored-header"], { [classes["active"]]: !collapsed })}
          type="button"
        >
          <div className={classes["according-title"]}>
            <p>{marketGroup.desc}</p>
          </div>
          <div className={classes["down-wrapper"]}>
            {isAnyMarketForCurrentPeriodOpen && isAnyOutcomeForCurrentPeriodValid && (
              <div style={{ marginTop: "4px" }}>
                <CashoutSVG />
              </div>
            )}
            <div
              onClick={() => {
                openLinkInNewWindow(`https://s5.sir.sportradar.com/p8tech/${language}/match/${feedcode}`);
              }}
            >
              <i className={classes["icon-chart-bar-regular"]} />
            </div>
            <i
              className={cx(classes["icon-down-arrow"], classes["white"])}
              onClick={() => setCollapsed((prevState) => !prevState)}
            />
          </div>
        </button>
        {!collapsed && (
          <div className={cx(classes["panel"], classes["relative"])} style={{ display: "block" }}>
            <div className={cx(classes["flex-al-center"], classes["for-tabs"])}>
              <div className={classes["tab-wrapper"]}>
                <ul
                  className={cx(classes["tab-items"], { [classes["no-popup-info"]]: !popupInfo })}
                  disable-draggable="true"
                  id="tab-items"
                >
                  {decoratedPeriods
                    .filter((x) => x.available)
                    .map((period) => (
                      <li
                        className={cx(classes["tab-link"], {
                          [classes["tab-active"]]: period.active,
                        })}
                        disable-draggable="true"
                        key={period.desc}
                        style={{
                          opacity: period.available ? 1 : 0.5,
                          pointerEvents: period.available ? "auto" : "none",
                        }}
                        onClick={() => setCurrentPeriodOrdinal(period.ordinal)}
                      >
                        <p disable-draggable="true">{period.desc}</p>
                      </li>
                    ))}
                </ul>
              </div>
              {popupInfo && (
                <div className={cx(classes["info-wrapper"])}>
                  <button
                    className={cx(classes["info"], classes["link"])}
                    disabled={!popupInfo}
                    type="button"
                    onClick={() => setShowMarketInfo((prevState) => !prevState)}
                  >
                    <i
                      className={cx(
                        classes[`icon-info-square-light`],
                        classes[`${showMarketInfo ? "info-selected" : ""}`],
                      )}
                    />
                  </button>
                  {popupInfo && (
                    <div
                      className={cx(classes["absolute"], classes["info-popup"])}
                      id="info-popup"
                      style={{ display: showMarketInfo ? "block" : "none" }}
                    >
                      <div className={classes["relative"]}>
                        <span className={cx(classes["absolute"], classes["arrow"])} />
                        <div className={classes["info-popup-header"]}>
                          <button
                            className={cx(classes["absolute"], classes["close"], classes["link"])}
                            type="button"
                            onClick={() => setShowMarketInfo(false)}
                          >
                            <i className={classes["icon-close"]} />
                          </button>
                          <h2 className={classes["info-title"]}>{popupInfo.title}</h2>
                        </div>
                        <hr
                          className={classes["info-separator"]}
                          style={{ backgroundColor: "#e3e3e3", height: "1px" }}
                        />
                        <div className={classes["info-body"]}>
                          <ul>
                            {popupInfo.rules.map((r, index) => (
                              <li key={index}>
                                <span>{`${index + 1}.`}</span>
                                &nbsp;
                                {r}
                              </li>
                            ))}
                          </ul>
                          {popupInfo.notes.map((n, index) => (
                            <div key={index}>
                              <p>
                                <b
                                  style={{
                                    color: "#00acee",
                                    display: "block",
                                    marginBottom: "5px",
                                    marginTop: "10px",
                                  }}
                                >
                                  {n.title}
                                </b>
                              </p>
                              <p>{n.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div
                        className={classes["info-footer"]}
                        style={{
                          alignItems: "center",
                          display: "flex",
                          justifyContent: "center",
                          marginBottom: "20px",
                        }}
                      >
                        <button
                          className={cx(classes["primary"], classes["confirmation-button"])}
                          style={{ borderRadius: "16px" }}
                          type="button"
                          onClick={() => setShowMarketInfo(false)}
                        >
                          확인
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {!isAnyMarketForCurrentPeriodOpen && (
              <div className={classes["forecast-market-group-suspended"]}>
                <span className={classes["icon-lock"]} />
                <p>{t("ez.unavailable_market")}</p>
              </div>
            )}
            <div className={classes["forecasts-wrapper"]}>
              {marketGroup.periods
                .find((p) => p.ordinal === currentPeriodOrdinal)
                ?.markets.map((market, i) => {
                  const outcomeRows = market.children
                    ? getRows(
                      market.externalCode,
                      decorateCorrectScoreRows(market.externalCode, Object.values(market.children)),
                    )
                    : [];

                  const isWDW = market.marketTypeGroup === "MONEY_LINE" && market.style === "THREE_OUTCOME";
                  const isOpen = market.open;

                  return (
                    <div className={classes["forecasts-market-wrapper"]} key={market.id}>
                      {isAnyMarketForCurrentPeriodOpen && !isOpen && (
                        <div className={classes["forecast-market-suspended"]}>
                          <span className={classes["icon-lock"]} />
                          <p>{t("ez.unavailable_market")}</p>
                        </div>
                      )}
                      {outcomeRows.map((outcomes, index) => (
                        <div className={classes["forecasts"]} id="forecasts" key={`${market.id}-${index}`}>
                          {outcomes.map((sel) => (
                            <div
                              className={cx(classes["forecast"], {
                                [classes["x-option"]]: isWDW && sel.pos === 2,
                              })}
                              key={sel.id}
                              style={{ visibility: sel.placeholder ? "hidden" : "visible" }}
                            >
                              {market.open && sel.hidden && (
                                <div className={classes["forecast-selection-suspended"]}>
                                  <span className={classes["icon-lock"]} />
                                </div>
                              )}
                              <div
                                className={cx(classes["forecast-content"], {
                                  [classes["forecast-active"]]: betslipOutcomeIds.includes(sel.id),
                                })}
                                onClick={() => toggleBetslipHandler(sel.id, eventId)}
                              >
                                {sel.dir === "u" && (
                                  <i
                                    className={cx(
                                      classes["ez-icon-indicator"],
                                      classes["ez-market-block-icon-indicator"],
                                      classes["icon-up-green"],
                                      classes["arrow-blink-animation"],
                                    )}
                                  />
                                )}
                                {sel.dir === "d" && (
                                  <i
                                    className={cx(
                                      classes["ez-icon-indicator"],
                                      classes["ez-market-block-icon-indicator"],
                                      classes["icon-down-red"],
                                      classes["arrow-blink-animation"],
                                    )}
                                  />
                                )}
                                <div>
                                  <p>{sel.desc}</p>
                                  <p>{sel.price}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

MarketBlock.propTypes = propTypes;

export default React.memo(MarketBlock);
