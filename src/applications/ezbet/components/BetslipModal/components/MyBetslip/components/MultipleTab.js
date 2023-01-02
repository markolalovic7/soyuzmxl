import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import dayjs from "dayjs";
import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import {
  makeGetBetslipData,
  makeGetBetslipModelUpdateInProgress,
  makeGetBetslipOutcomeIds,
} from "../../../../../../../redux/reselect/betslip-selector";
import { persistLatestOutcomePrices } from "../../../../../../../redux/slices/ezBetslipCacheSlice";
import {
  onRefreshBetslipHandler,
  onRemoveSelectionHandler,
  onToggleOutcomeForMultiplesHandler,
} from "../../../../../../../utils/betslip-utils";
import classes from "../../../../../scss/ezbet.module.scss";
import SportIcon from "../../../../SportIcon/SportIcon";
import RedAlertIcon from "../../RedAlertIcon";

import DeleteConfirmationModal from "./DeleteConfirmationModal";

const getValidatedText = (outcomeValid, text) => {
  if (outcomeValid) return text;

  return <del>{text}</del>;
};

const propTypes = {
  deleteSelectionConfirmationPanel: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  setOpenDeleteSelectionConfirmationPanel: PropTypes.func.isRequired,
  setStakePanelStatus: PropTypes.func.isRequired,
};

const MultipleTab = ({
  deleteSelectionConfirmationPanel,
  isLoggedIn,
  setActiveTab,
  setOpenDeleteSelectionConfirmationPanel,
  setStakePanelStatus,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { t } = useTranslation();

  const [checked, setChecked] = useState({});

  const [arrows, setArrows] = useState({});

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const getBetslipData = useMemo(makeGetBetslipData, []);
  const betslipData = useSelector((state) => getBetslipData(state, location.pathname));

  const getBetslipModelUpdateInProgress = useMemo(makeGetBetslipModelUpdateInProgress, []);
  const modelUpdateInProgress = useSelector((state) => getBetslipModelUpdateInProgress(state, location.pathname));

  const betslipOutcomeInitialPrices = useSelector((state) => state.ezBetslipCache.betslipOutcomeInitialPrices);

  const autoApprovalMode = useSelector((state) => state.ez.autoApprovalMode); // AUTO_ALL, AUTO_HIGHER, MANUAL

  const [outcomeId, setOutcomeId] = React.useState(null);
  const [match, setMatch] = React.useState([]);

  const outcomes = useMemo(
    () => betslipData.model.outcomes.filter((o) => o.outcomeDescription), // avoid displaying data in the middle of a refresh (outcomes just added
    [betslipData.model.outcomes],
  );

  useEffect(() => {
    const map = outcomes.reduce((result, item) => ({ ...result, [item.outcomeId]: item.enabled }), {});
    setChecked(map);
  }, [outcomes]);

  // Effect to revert to the single tab if I no longer have sufficient outcomes for a multiple...
  useEffect(() => {
    if (outcomes.length < 2) {
      setActiveTab("SINGLE");
      // in case the stake panel was open, close it
      setStakePanelStatus((prevStatus) => ({
        ...prevStatus,
        outcomeId: undefined, // request the panel to open for "ALL" type 1s (singles)
        typeId: 1,
      }));
    }
  }, [outcomes, setActiveTab]);

  useEffect(() => {
    outcomes.forEach((o) => {
      if (o.priceDir) {
        setArrows((prevState) => ({
          ...prevState,
          [o.outcomeId]: { expiry: dayjs().add(10, "second"), priceDir: o.priceDir },
        }));
      }
    });

    setArrows((prevState) =>
      Object.fromEntries(Object.entries(prevState).filter(([key, value]) => dayjs().isBefore(value.expiry))),
    ); // Filter out expired arrows
  }, [outcomes]);

  const handleChange = useCallback((pathname, outcomeId) => {
    onToggleOutcomeForMultiplesHandler(dispatch, pathname, outcomeId);
    onRefreshBetslipHandler(dispatch, pathname);
  });

  const handleDeleteConfirmationModal = useCallback((id, match1, match2) => {
    setMatch([match1, match2]);
    setOutcomeId(id);
    setOpenDeleteSelectionConfirmationPanel(true);
  }, []);

  const handleDeleteMatches = useCallback((pathname, outcomeId) => {
    onRemoveSelectionHandler(dispatch, pathname, outcomeId, false);
    setOpenDeleteSelectionConfirmationPanel(false);
  }, []);

  if (outcomes.length === 0) return null;

  return (
    <>
      {deleteSelectionConfirmationPanel && (
        <DeleteConfirmationModal
          match={match}
          onClose={() => setOpenDeleteSelectionConfirmationPanel(false)}
          onOk={() => handleDeleteMatches(location.pathname, outcomeId)}
        />
      )}

      {outcomes && outcomes.length > 1 && (
        <section
          className={cx(
            classes["betslip-card-wrapper"],
            classes["betslip-multiple-tab"],
            classes["more-games"],
            classes["betslip-screen"],
            classes["multiple"],
          )}
          style={{ display: "block", paddingTop: `${isLoggedIn ? "40px" : "0"}` }}
        >
          <div className={cx(classes["betslip-card"], classes["multiple-tab-card"])}>
            <div className={classes["matches"]}>
              {outcomes.map((outcome) => {
                const priceChangeAlert =
                  (betslipOutcomeInitialPrices[outcome.outcomeId] !== outcome.price && autoApprovalMode === "MANUAL") ||
                  (betslipOutcomeInitialPrices[outcome.outcomeId] > outcome.price &&
                    autoApprovalMode === "AUTO_HIGHER");

                const marketPeriodDescription = outcome && (
                  <div className={classes["flex-center"]}>
                    <span>
                      {outcome.marketDescription}[ {outcome && outcome.periodDescription} ]
                    </span>{" "}
                    :{" "}
                  </div>
                );

                return (
                  <div
                    className={cx(classes["match"], {
                      [classes["multiple-match-alert"]]: !outcome.valid || priceChangeAlert,
                    })}
                    key={outcome.outcomeDescription}
                  >
                    <div className={classes["multiple-match-alert-inner"]}>
                      <div className={cx(classes["matches-header"], classes["flex-al-center"])}>
                        <h2 className={classes["flex-al-center"]}>
                          {(!outcome.valid || priceChangeAlert) && (
                            <div style={{ height: "16px", marginRight: "7px", width: "16px" }}>
                              <RedAlertIcon />
                            </div>
                          )}
                          <SportIcon code={outcome.sportCode} />[<span>{outcome.tournamentDescription}</span>]
                        </h2>
                        <div className={classes["switcher-wrap"]}>
                          {!outcome.live && (
                            <div className={classes["date-and-time"]}>
                              <span>{dayjs.unix(outcome.startTime / 1000).format("MM-DD")}</span>
                              &nbsp;
                              <span>{dayjs.unix(outcome.startTime / 1000).format("HH:mm")}</span>
                            </div>
                          )}
                          <div className={classes["flex-al-center"]}>
                            {false && ( // leaving it in case we re-add once again
                              <label className={classes["switch"]}>
                                <input
                                  checked={isEmpty(checked) || checked[outcome.outcomeId]}
                                  type="checkbox"
                                  onChange={() => handleChange(location.pathname, outcome.outcomeId)}
                                />
                                <span className={cx(classes["switch-slider"], classes["round"])} />
                              </label>
                            )}
                            {outcome.live && (
                              <div className={classes["betslip-live-icon"]}>
                                {!outcome.valid || priceChangeAlert ? (
                                  <i className={cx(classes["icon-live-icon"], classes["disabled-live-icon"])}>
                                    <span className={classes["path1"]} />
                                    <span className={classes["path2"]} />
                                    <span className={classes["path3"]} />
                                    <span className={classes["path4"]} />
                                    <span className={classes["path5"]} />
                                    <span className={classes["path6"]} />
                                    <span className={classes["path7"]} />
                                  </i>
                                ) : (
                                  <i className={classes["icon-live-icon"]}>
                                    <span className={classes["path1"]} />
                                    <span className={classes["path2"]} />
                                    <span className={classes["path3"]} />
                                    <span className={classes["path4"]} />
                                    <span className={classes["path5"]} />
                                    <span className={classes["path6"]} />
                                    <span className={classes["path7"]} />
                                  </i>
                                )}
                              </div>
                            )}
                            <button
                              className={classes["link"]}
                              type="button"
                              onClick={() =>
                                handleDeleteConfirmationModal(
                                  outcome.outcomeId,
                                  outcome.eventDescription.split(" vs ")[0],
                                  outcome.eventDescription.split(" vs ")[1],
                                )
                              }
                            >
                              <i className={classes["icon-delete-small"]} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className={classes["match-versus"]}>
                        <div className={cx(classes["flex-al-center"], classes["txt"])}>
                          {getValidatedText(
                            outcome.valid,
                            outcome.eventDescription ? <span>{outcome.eventDescription.split(" vs ")[0]}</span> : "",
                          )}
                          <b>VS</b>
                          {getValidatedText(
                            outcome.valid,
                            outcome.eventDescription ? <span>{outcome.eventDescription.split(" vs ")[1]}</span> : "",
                          )}
                        </div>
                        <div className={cx(classes["flex-al-center"], classes["relative"])}>
                          <p className={classes["flex-al-center"]}>
                            {getValidatedText(outcome.valid, marketPeriodDescription)}
                            {getValidatedText(
                              outcome.valid,
                              <span style={{ marginLeft: "5px" }}> {outcome.outcomeDescription}</span>,
                            )}
                          </p>

                          {priceChangeAlert && outcome.valid && (
                            <div className={classes["changing-price-wrapper"]}>
                              {betslipOutcomeInitialPrices[outcome.outcomeId] < outcome.price && (
                                <div className={cx(classes["flex-al-center"], classes["relative"])}>
                                  <i className={classes["icon-green-up"]} />
                                  <span className={cx(classes["price"], classes["color-green"])}>
                                    {outcome.formattedPrice}
                                  </span>
                                </div>
                              )}
                              {betslipOutcomeInitialPrices[outcome.outcomeId] > outcome.price && (
                                <div className={cx(classes["flex-al-center"], classes["relative"])}>
                                  <i className={classes["icon-red-down"]} />
                                  <span className={cx(classes["price"], classes["color-red"])}>
                                    {outcome.formattedPrice}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {!priceChangeAlert && outcome.valid && (
                            <div className={classes["changing-price-wrapper"]}>
                              <div className={cx(classes["flex-al-center"], classes["relative"])}>
                                {arrows[outcome.outcomeId.toString()]?.priceDir === "u" && (
                                  <i className={classes["icon-green-up"]} />
                                )}
                                {arrows[outcome.outcomeId.toString()]?.priceDir === "d" && (
                                  <i className={classes["icon-red-down"]} />
                                )}

                                <span
                                  className={cx(
                                    classes["price"],
                                    {
                                      [classes["color-green"]]: arrows[outcome.outcomeId.toString()]?.priceDir === "u",
                                    },
                                    { [classes["color-red"]]: arrows[outcome.outcomeId.toString()]?.priceDir === "d" },
                                  )}
                                >
                                  {outcome.formattedPrice}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <hr className={classes[`${!outcome.valid || priceChangeAlert ? "solid-hr" : "dashed-hr"}`]} />
                      {/* <hr className={classes[`solid-hr`]} /> */}
                      {!outcome.valid && (
                        <div className={classes["sum"]}>
                          <div className={cx(classes["upload-and-settings-wrapper"], classes["flex-al-center"])}>
                            <p>{t("ez.game_canceled_or_closed")}</p>
                            <div className={classes["flex-al-center"]}>
                              <button
                                className={classes["default"]}
                                style={{ minWidth: "86px" }}
                                type="button"
                                onClick={() =>
                                  onRemoveSelectionHandler(dispatch, location.pathname, outcome.outcomeId, false)
                                }
                              >
                                {t("ez.delete")}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {outcome.valid && priceChangeAlert && (
                        <div className={classes["sum"]}>
                          <div
                            className={cx(
                              classes["upload-and-settings-wrapper"],
                              classes["flex-al-center"],
                              classes["match-footer-actions"],
                              classes["alert-match-footer-actions-multiple"],
                            )}
                          >
                            <p>
                              {t("ez.apply_changed_dividend")}
                              <span>
                                {betslipOutcomeInitialPrices[outcome.outcomeId]?.toFixed(2)}
                                {betslipOutcomeInitialPrices[outcome.outcomeId] < outcome.price && (
                                  <i
                                    className={classes["icon-play-green"]}
                                    style={{ display: "inline-block", marginTop: "-4px" }}
                                  />
                                )}
                                {betslipOutcomeInitialPrices[outcome.outcomeId] > outcome.price && (
                                  <i
                                    className={classes["icon-play-red"]}
                                    style={{ display: "inline-block", marginTop: "-4px" }}
                                  />
                                )}
                                {outcome.formattedPrice}
                              </span>
                            </p>
                            <div className={cx(classes["flex-al-center"], classes["actions"])}>
                              <button
                                className={cx(classes["primary"], classes["confirmation-button"])}
                                type="button"
                                onClick={() => {
                                  dispatch(
                                    persistLatestOutcomePrices({
                                      betslipOutcomeInitialPrices: {
                                        ...betslipOutcomeInitialPrices,
                                        [[outcome.outcomeId]]: outcome.price,
                                      },
                                    }),
                                  );
                                }}
                              >
                                {t("confirm")}
                              </button>
                              <button
                                className={classes["default"]}
                                type="button"
                                onClick={() =>
                                  onRemoveSelectionHandler(dispatch, location.pathname, outcome.outcomeId, false)
                                }
                              >
                                {t("ez.delete")}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {betslipData.model.outcomes.length !== outcomes.length && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "32px" }}>
                  <FontAwesomeIcon
                    className="fa-spin"
                    icon={faSpinner}
                    size="3x"
                    style={{
                      "--fa-primary-color": "#00ACEE",
                      "--fa-secondary-color": "#E6E6E6",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  />
                </div>
              )}
            </div>

            {betslipData.betData.multiples
              .filter((x) => x.numSubBets === 1)
              .map((m) => (
                <div className={classes["sum"]} key={m.typeId}>
                  <div className={classes["flex-al-center"]}>
                    <p>
                      {`${t("ez.total_bet_stake")} : `}
                      <span onClick={() => setStakePanelStatus({ open: true, outcomeId: -1, typeId: m.typeId })}>
                        {m.stake ? m.stake.toLocaleString() : "-"}
                        <em> KRW</em>
                      </span>
                    </p>
                    <p className={classes["typeId"]}>{`${modelUpdateInProgress ? "" : m.typeId} 멀티`}</p>
                  </div>
                  <div className={classes["flex-al-center"]}>
                    <p>
                      {/* {`당첨 예상 금액 : ${modelUpdateInProgress && !Number.isInteger(potentialWin) && potentialWin > 0
                      ? ""
                      : m.potentialWin.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })
                      }`} */}
                      <div style={{ display: "unset", marginRight: "11px" }}>{`${t(
                        "ez.estimated_potential_win",
                      )} : `}</div>
                      {!modelUpdateInProgress && !Number.isInteger(m.potentialWin) && m.potentialWin > 0
                        ? m.potentialWin.toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0,
                          })
                        : m.potentialWin.toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0,
                          })}
                    </p>
                    {!modelUpdateInProgress && (
                      <span className={classes["price"]}>
                        {modelUpdateInProgress
                          ? ""
                          : parseFloat(m.price).toFixed(2).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}
    </>
  );
};

MultipleTab.propTypes = propTypes;
export default React.memo(MultipleTab);
