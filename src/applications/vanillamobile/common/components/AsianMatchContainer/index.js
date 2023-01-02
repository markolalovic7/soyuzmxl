import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import cx from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { useGetMatchStatuses } from "../../../../../hooks/matchstatus-hooks";
import { makeGetBetslipOutcomeIds } from "../../../../../redux/reselect/betslip-selector";
import {
  getMobileBetslipMaxSelections,
  isMobileCompactBetslip,
} from "../../../../../redux/reselect/cms-layout-widgets";
import dayjs from "../../../../../services/dayjs";
import {
  ASIAN_MARKET_CRITERIA_MAPPING,
  ASIAN_MARKET_TYPE_1x2,
  ASIAN_MARKET_TYPE_DC,
  ASIAN_MARKET_TYPE_F5_HDP,
  ASIAN_MARKET_TYPE_F5_OU,
  ASIAN_MARKET_TYPE_FG,
  ASIAN_MARKET_TYPE_FH_1x2,
  ASIAN_MARKET_TYPE_FH_FG,
  ASIAN_MARKET_TYPE_FH_HDP,
  ASIAN_MARKET_TYPE_FH_LG,
  ASIAN_MARKET_TYPE_FH_ML,
  ASIAN_MARKET_TYPE_FH_OE,
  ASIAN_MARKET_TYPE_FH_OU,
  ASIAN_MARKET_TYPE_FOOT_CS,
  ASIAN_MARKET_TYPE_FS_ML,
  ASIAN_MARKET_TYPE_HDP,
  ASIAN_MARKET_TYPE_HTFT,
  ASIAN_MARKET_TYPE_LG,
  ASIAN_MARKET_TYPE_ML,
  ASIAN_MARKET_TYPE_OE,
  ASIAN_MARKET_TYPE_OU,
  ASIAN_MARKET_TYPE_SS_ML,
  ASIAN_MARKET_TYPE_TENN_CS,
  ASIAN_MARKET_TYPE_TG,
  DOUBLE_VIEW_ASIAN_SPORT_MARKET_MAPPING,
} from "../../../../../utils/asian-view/asianViewSportMarkets";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../utils/betslip-utils";
import { isNotEmpty } from "../../../../../utils/lodash";
import FontIcon from "../../../../slimmobile/common/components/FontIcon";
import { ASIAN_VIEW_TYPE_DOUBLE } from "../../../../vanilladesktop/pages/AsianSportsPage/components/AsianCentralColumn/components/AsianCoupon/constants";
import {
  MATCH_STATUS_END_OF_EVENT,
  MATCH_STATUS_PAUSED,
  MATCH_STATUS_STARTED,
  MATCH_TYPE_NO_TIME,
  MATCH_TYPE_REGULAR,
  MATCH_TYPE_REVERSE,
} from "../LiveEuropeanMatch/constants";

import AdditionalMarketContainer from "./AdditionalMarketContainer/AdditionalMarketContainer";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const propTypes = {
  additionalMarketsExpanded: PropTypes.bool.isRequired,
  event: PropTypes.object.isRequired,
  live: PropTypes.bool.isRequired,
  markets: PropTypes.array.isRequired,
  onToggleActiveEvent: PropTypes.func.isRequired,
};

const defaultProps = {};

const fallbackMarketTypes = DOUBLE_VIEW_ASIAN_SPORT_MARKET_MAPPING["DEFAULT"].find(
  (data) => data.criteria === "DEFAULT-DEFAULT",
).marketTypes;

const groupMarketTypes = (marketTypes) => {
  const denormalisedMarketTypes = [];
  marketTypes.forEach((x) => {
    x.marketGroup.forEach((y) => {
      denormalisedMarketTypes.push({ marketCode: y, periodCode: x.code });
    });
  });

  switch (denormalisedMarketTypes.length) {
    case 1:
    case 2:
    case 3:
      return [denormalisedMarketTypes];
    case 4:
      return [denormalisedMarketTypes.slice(0, 2), denormalisedMarketTypes.slice(2, 4)];
    case 5:
      return [denormalisedMarketTypes.slice(0, 3), denormalisedMarketTypes.slice(3, 5)];
    case 6:
      return [denormalisedMarketTypes.slice(0, 3), denormalisedMarketTypes.slice(3, 6)];
    case 7: // lose the 4th item (OE full time typically)
      return [denormalisedMarketTypes.slice(0, 3), denormalisedMarketTypes.slice(4, 7)];
    default:
      return [denormalisedMarketTypes.slice(0, 3)];
  }
};

function getCellPrefixes(t, outcomes, marketCode) {
  switch (marketCode) {
    case ASIAN_MARKET_TYPE_1x2:
    case ASIAN_MARKET_TYPE_FH_1x2:
      return ["1", "2", "X"];
    case ASIAN_MARKET_TYPE_OE:
    case ASIAN_MARKET_TYPE_FH_OE:
      return ["O", "E"];
    case ASIAN_MARKET_TYPE_ML:
    case ASIAN_MARKET_TYPE_FH_ML:
    case ASIAN_MARKET_TYPE_FS_ML:
    case ASIAN_MARKET_TYPE_SS_ML:
      return ["1", "2"];
    case ASIAN_MARKET_TYPE_OU:
    case ASIAN_MARKET_TYPE_FH_OU:
    case ASIAN_MARKET_TYPE_F5_OU:
      return [isNotEmpty(outcomes) ? outcomes[0].spread?.toLocaleString() : "O", "U"];
    case ASIAN_MARKET_TYPE_HDP:
    case ASIAN_MARKET_TYPE_FH_HDP:
    case ASIAN_MARKET_TYPE_F5_HDP:
      return outcomes.map((o) =>
        o.spread > 0 || 1 / o.spread === +Infinity ? `+${o.spread?.toLocaleString()}` : o.spread?.toLocaleString(),
      );

    case ASIAN_MARKET_TYPE_FH_FG:
    case ASIAN_MARKET_TYPE_FG:
    case ASIAN_MARKET_TYPE_FH_LG:
    case ASIAN_MARKET_TYPE_LG:
      return outcomes.map((o) => "");

    case ASIAN_MARKET_TYPE_DC:
    case ASIAN_MARKET_TYPE_HTFT:
    case ASIAN_MARKET_TYPE_FOOT_CS:
    case ASIAN_MARKET_TYPE_TENN_CS:
    case ASIAN_MARKET_TYPE_TG:
      return outcomes.map((o) => "");
    default:
      return outcomes.map((o) => "");
  }
}

const TimeHeaderCell = ({ cMin, cPeriod, cSec, cStatus, cType }) => {
  const dispatch = useDispatch();

  const [min, setMin] = useState(cMin);
  const [sec, setSec] = useState(cSec);

  const matchStatuses = useGetMatchStatuses(dispatch);

  // keep updated if the props evolve...
  useEffect(() => {
    setMin(cMin);
  }, [cMin]);

  // keep updated if the props evolve...
  useEffect(() => {
    setSec(cSec);
  }, [cSec]);

  useEffect(() => {
    function tickClocks() {
      switch (cType) {
        case MATCH_TYPE_REGULAR:
          if (cStatus === MATCH_STATUS_STARTED) {
            if (sec < 59) {
              setSec(sec + 1);
            } else {
              setSec(0);
              setMin(min + 1);
            }
          }
          break;
        case MATCH_TYPE_REVERSE:
          if (cStatus === MATCH_STATUS_STARTED) {
            if (sec > 0) {
              setSec(sec - 1);
            } else if (min > 0) {
              setSec(59);
              setMin(min - 1);
            }
          }
          break;
        default:
          break;
      }
    }

    const intervalId = setInterval(tickClocks, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [cStatus, cType, min, sec]);

  // todo: use translations + format function here.
  const periodAndClock = (cType, cStatus, min, sec) => {
    if (cType !== MATCH_TYPE_NO_TIME) {
      return `${`0${min}`.slice(-2)}:${`0${sec}`.slice(-2)}`;
    }

    return (
      {
        [MATCH_STATUS_END_OF_EVENT]: "Ended",
        [MATCH_STATUS_STARTED]: "About to Start",
      }[cStatus] ?? cStatus.charAt(0).toUpperCase() + cStatus.slice(1).toLowerCase()
    );
  };

  const clock = periodAndClock(cType, cStatus, min, sec);

  const currentPeriod = useMemo(
    () => (matchStatuses ? matchStatuses.find((period) => period.abbreviation === cPeriod)?.description : ""),
    [cPeriod, matchStatuses],
  );

  return (
    <div className={classes["bet__time"]}>
      {[MATCH_STATUS_STARTED].includes(cStatus) && (
        <span style={{ marginRight: "5px" }}>
          <FontIcon icon={faPlay} />
        </span>
      )}
      {[MATCH_STATUS_PAUSED].includes(cStatus) && (
        <span style={{ marginRight: "5px" }}>
          {" "}
          <FontIcon icon={faPause} />
        </span>
      )}
      {`${currentPeriod} / ${clock}`}
    </div>
  );
};

TimeHeaderCell.propTypes = {
  cMin: PropTypes.number.isRequired,
  cPeriod: PropTypes.string.isRequired,
  cSec: PropTypes.number.isRequired,
  cStatus: PropTypes.string.isRequired,
  cType: PropTypes.string.isRequired,
};

const DotsComponent = (props) => (
  <>
    {props.marketTypeGroups?.length > 1 && props.marketTypeIndex === 1 && (
      <div className={classes["asian-sports-table__dots"]} style={{ padding: "0px 16px" }} onClick={props.onClick}>
        <div
          className={cx(classes["asian-sports-table__dot"], {
            [classes["asian-sports-table__dot_active"]]: props.sliderPosition === 0,
          })}
        />
        <div
          className={cx(classes["asian-sports-table__dot"], {
            [classes["asian-sports-table__dot_active"]]: props.sliderPosition === 1,
          })}
        />
      </div>
    )}
  </>
);

DotsComponent.propTypes = {
  marketTypeGroups: PropTypes.any.isRequired,
  marketTypeIndex: PropTypes.any.isRequired,
  onClick: PropTypes.func.isRequired,
  sliderPosition: PropTypes.number.isRequired,
};

const AsianMatchContainer = ({ additionalMarketsExpanded, event, live, markets, onToggleActiveEvent }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { t } = useTranslation();

  const [sliderPosition, setSliderPosition] = useState(0);

  const displayedMarketIds = event.children ? Object.values(event.children).map((market) => market.id) : [];

  const sportCode = event?.code || event?.sport; // prematch vs live formatting

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const maxBetslipSelections = useSelector(getMobileBetslipMaxSelections);
  const compactBetslipMode = useSelector(isMobileCompactBetslip);

  const toggleBetslipHandler = (outcomeId, eventId) => {
    if (betslipOutcomeIds.length >= maxBetslipSelections && !betslipOutcomeIds.find((x) => x === outcomeId)) {
      alert(t("betslip_panel.too_many_selections", { value: maxBetslipSelections }));
    } else {
      onToggleSelection(dispatch, location.pathname, outcomeId, eventId, compactBetslipMode);
      onRefreshBetslipHandler(dispatch, location.pathname);
    }
  };

  const { currentViewType, marketTypeGroups } = useMemo(() => {
    // Based on the user preference (viewType), find out if we have a view to offer. Otherwise resort to alternative available views (including a default fallback)
    const desiredView = DOUBLE_VIEW_ASIAN_SPORT_MARKET_MAPPING[sportCode]?.find(
      (data) => data.criteria === `${sportCode}-DEFAULT`,
    );

    if (desiredView) {
      return {
        currentViewType: ASIAN_VIEW_TYPE_DOUBLE,
        marketTypeGroups: groupMarketTypes(desiredView.marketTypes),
      };
    }

    // if nothing else, go to the default...
    return {
      currentViewType: ASIAN_VIEW_TYPE_DOUBLE,
      marketTypeGroups: groupMarketTypes(fallbackMarketTypes),
    };
  }, [sportCode]);

  return (
    <div className={classes["asia-item"]}>
      <div className={classes["asian-sports-table"]}>
        <table>
          <thead>
            <tr className={classes["asian-sports-table__labels"]}>
              <th colSpan="1">
                <div className={classes["bet__numbers"]}>
                  {!live && <div className={classes["bet__time"]}>{dayjs.unix(event.epoch / 1000).calendar()}</div>}
                  {live && (
                    <TimeHeaderCell
                      cMin={event.cMin}
                      cPeriod={event.cPeriod}
                      cSec={event.cSec}
                      cStatus={event.cStatus}
                      cType={event.cType}
                    />
                  )}
                </div>
              </th>
              {marketTypeGroups &&
                marketTypeGroups[sliderPosition].map((marketType) => (
                  <th colSpan="1" key={`${marketType.periodCode} - ${marketType.marketCode}`}>
                    {`${t(`vanilladesktop.marketTypePeriod.${marketType.periodCode}`)} / ${t(
                      `vanilladesktop.marketType.${marketType.marketCode}`,
                    )}`}
                  </th>
                ))}
              <th colSpan="1" />
            </tr>
          </thead>
          <tbody>
            <tr className={classes["asian-sports-table__row"]}>
              <td className={classes["asian-sports-table__matches"]}>
                <div className={classes["asian-sports-table__match"]}>
                  <div className={classes["asian-sports-table__result"]}>
                    <span className={classes["asian-sports-table__team"]}>{event?.a || event?.opADesc}</span>
                    {live && <span className={classes["asian-sports-table__score"]}>{event?.hScore || 0}</span>}
                  </div>
                  <div className={classes["asian-sports-table__result"]}>
                    <span className={classes["asian-sports-table__team"]}>{event?.b || event?.opBDesc}</span>
                    {live && <span className={classes["asian-sports-table__score"]}>{event?.aScore || 0}</span>}
                  </div>
                </div>
              </td>
              {marketTypeGroups &&
                marketTypeGroups[sliderPosition].map((marketType, marketTypeIndex) => {
                  const market = markets.find(
                    (market) => market.criteria === ASIAN_MARKET_CRITERIA_MAPPING[marketType.marketCode],
                  );

                  if (!market) {
                    return (
                      <td>
                        <div className={classes["asian-sports-table__numbers"]} />

                        <DotsComponent
                          marketTypeGroups={marketTypeGroups}
                          marketTypeIndex={marketTypeIndex}
                          sliderPosition={sliderPosition}
                          onClick={() => setSliderPosition((prevState) => (prevState + 1) % 2)}
                        />
                      </td>
                    );
                  }
                  let outcomes = live ? market.sels : Object.values(market.children);

                  if (outcomes.length === 3) {
                    outcomes = [outcomes[0], outcomes[2], outcomes[1]];
                  }

                  const cellPrefixes = getCellPrefixes(t, outcomes, marketType.marketCode);

                  return (
                    <td key={`${marketType.periodCode} - ${marketType.marketCode}`}>
                      <div className={classes["asian-sports-table__numbers"]}>
                        {outcomes.map((o, index) => (
                          <div className={classes["asian-sports-table__coeficients"]} key={o.id}>
                            {index < cellPrefixes.length && (
                              <div
                                className={cx(
                                  classes["asian-sports-table__coeficient"],
                                  classes["asian-sports-table__coeficient_highlighted"],
                                )}
                              >
                                {cellPrefixes[index]}
                              </div>
                            )}
                            <div
                              className={cx(classes["asian-sports-table__coeficient"], {
                                [classes["asian-sports-table__coeficient_selected"]]:
                                  !o.hidden && betslipOutcomeIds.includes(o.id || o.oId),
                              })}
                              style={{ opacity: o.hidden ? 0.7 : 1, pointerEvents: o.hidden ? "none" : "auto" }}
                              onClick={() => toggleBetslipHandler(o.id || o.oId, event.id || event.eventId)}
                            >
                              <span>{o.formattedPrice || o.price}</span>

                              {o?.priceDir === "d" || o?.dir === "<" ? (
                                <div
                                  className={cx(
                                    classes["asian-sports-table__triangle"],
                                    classes["asian-sports-table__triangle_red"],
                                  )}
                                />
                              ) : null}

                              {o?.priceDir === "u" || o?.dir === ">" ? (
                                <div
                                  className={cx(
                                    classes["asian-sports-table__triangle"],
                                    classes["asian-sports-table__triangle_green"],
                                  )}
                                />
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                      <DotsComponent
                        marketTypeGroups={marketTypeGroups}
                        marketTypeIndex={marketTypeIndex}
                        sliderPosition={sliderPosition}
                        onClick={() => setSliderPosition((prevState) => (prevState + 1) % 2)}
                      />
                    </td>
                  );
                })}

              <td className={classes["asian-sports-table__icons-cell"]}>
                <div className={classes["asian-sports-table__icons"]}>
                  <div className={classes["asian-sports-table__icon"]} onClick={onToggleActiveEvent}>
                    <span>{`+${Math.max(
                      live ? event.mCount : event.children && event.count - Object.values(event.children).length > 0,
                      0,
                    )}`}</span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* // <div className={classes["bet"]}> */}
      {/* //   <div className={classes["bet__container"]}> */}
      {/* //     <PrematchMatchHeader */}
      {/* //       additionalMarketsExpanded={additionalMarketsExpanded} */}
      {/* //       event={event} */}
      {/* //       onToggleActiveEvent={onToggleActiveEvent} */}
      {/* //     /> */}
      {/* //     <PrematchMatchDefaultMarkets eventId={event.id} markets={event.children ? Object.values(event.children) : []} /> */}
      {/* //   </div> */}
      {/* // */}
      <div className={`${classes["matches"]} ${!live && additionalMarketsExpanded ? classes["active"] : ""}`}>
        {!live && additionalMarketsExpanded ? (
          <AdditionalMarketContainer eventId={event.id} excludedMarketIds={displayedMarketIds} live={live} />
        ) : null}
      </div>
      {/* // </div> */}
    </div>
  );
};

AsianMatchContainer.propTypes = propTypes;
AsianMatchContainer.defaultProps = defaultProps;

export default React.memo(AsianMatchContainer);
