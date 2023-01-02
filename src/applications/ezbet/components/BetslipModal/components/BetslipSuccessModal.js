import cx from "classnames";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import classes from "../../../scss/ezbet.module.scss";
import SportIcon from "../../SportIcon/SportIcon";

import RedAlertIcon from "./RedAlertIcon";

import CheckSvg from "applications/ezbet/img/icons/check.svg";
import { makeGetBetslipData, makeGetBetslipModelUpdateInProgress } from "redux/reselect/betslip-selector";
import { getSingleBetPotentialWin, getSingleStake, onRemoveSelectionHandler } from "utils/betslip-utils";

const getValidatedText = (outcomeValid, text) => {
  if (outcomeValid) return text;

  return <del>{text}</del>;
};

const BetslipSuccessModal = ({ activeTab, onClose, placeBetTime }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const getBetslipData = useMemo(makeGetBetslipData, []);
  const betslipData = useSelector((state) => getBetslipData(state, location.pathname));

  const betslipOutcomeInitialPrices = useSelector((state) => state.ezBetslipCache.betslipOutcomeInitialPrices);
  const autoApprovalMode = useSelector((state) => state.ez.autoApprovalMode); // AUTO_ALL, AUTO_HIGHER, MANUAL
  const getBetslipModelUpdateInProgress = useMemo(makeGetBetslipModelUpdateInProgress, []);
  const modelUpdateInProgress = useSelector((state) => getBetslipModelUpdateInProgress(state, location.pathname));

  const onNavigateToMyPage = () => {
    window.parent.postMessage(
      {
        action: "app.ez.navigation",
        goTo: "MY_PAGE",
      },
      "*",
    );
  };

  return (
    <div
      className={cx(
        classes["confirmation-modal"],
        classes["confirm-success-modal"],
        classes["confirm-success-modal-with-cards"],
      )}
      id="confirmation-modal"
      style={{ display: "flex" }}
    >
      <div className={classes["modal-content"]}>
        <div className={classes["modal-body"]}>
          <div className={classes["modal-top-wrapper"]}>
            <i className={classes["ez-check-icon"]}>
              <img alt="White Check in blue circle" src={CheckSvg} />
            </i>
            <p className={classes["text"]}>{t("ez.your_request")}</p>
            <div>
              <p className={classes["betting-details"]}>
                <span>
                  {t("ez.betting_history")} :
                  <span>
                    {activeTab && activeTab === "SINGLE"
                      ? betslipData.betData.singles.filter((x) => x.stake > 0).length === 1
                        ? t("ez.single")
                        : t("ez.multisingle")
                      : t("ez.multiple")}
                  </span>
                </span>
                <span>{placeBetTime}</span>
              </p>
            </div>

            <hr className={classes["solid-hr"]} />
          </div>

          {activeTab === "SINGLE" && (
            <div
              data-scroll-lock-scrollable
              className={cx(classes["success-modal-betslip-card-wrapper"], classes["success-modal-single"])}
            >
              {betslipData.model.outcomes.map((outcome, index) => {
                const currentStake = getSingleStake(betslipData, outcome.outcomeId);
                const potentialWin = getSingleBetPotentialWin(betslipData, outcome.outcomeId);

                if (currentStake <= 0) return null;

                return (
                  <div
                    className={cx(classes["betslip-card"], classes["single-card"], classes["default-card"])}
                    key={outcome.outcomeId}
                  >
                    <div>
                      <div className={classes["matches"]}>
                        <div className={classes["match"]}>
                          <div className={cx(classes["matches-header"], classes["flex-al-center"])}>
                            <h2 className={classes["flex-al-center"]}>
                              <SportIcon code={outcome.sportCode} />
                              <span>{outcome.tournamentDescription}</span>
                            </h2>
                            <div className={classes["switcher-wrap"]}>
                              {!outcome.live && (
                                <div className={classes["date-and-time"]}>
                                  <p>
                                    {dayjs.unix(outcome.startTime / 1000).format("MM-DD")}{" "}
                                    {dayjs.unix(outcome.startTime / 1000).format("HH:mm")}
                                  </p>
                                </div>
                              )}
                              {outcome.live && (
                                <div
                                  className={cx(classes["betslip-live-icon"], classes["confirmation"])}
                                  style={{ marginRight: "-4px" }}
                                >
                                  <i className={classes["icon-live-icon"]}>
                                    <span className={classes["path1"]} />
                                    <span className={classes["path2"]} />
                                    <span className={classes["path3"]} />
                                    <span className={classes["path4"]} />
                                    <span className={classes["path5"]} />
                                    <span className={classes["path6"]} />
                                    <span className={classes["path7"]} />
                                  </i>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className={classes["match-versus"]}>
                            <div className={cx(classes["flex-al-center"], classes["txt"])}>
                              <span>{outcome.eventDescription ? outcome.eventDescription.split(" vs ")[0] : ""}</span>
                              <b>VS</b>
                              <span>{outcome.eventDescription ? outcome.eventDescription.split(" vs ")[1] : ""}</span>
                            </div>
                            <div className={cx(classes["flex-al-center"], classes["txt"])}>
                              <p className={classes["flex-al-center"]}>
                                <span style={{ color: "#525252" }}>
                                  {outcome.marketDescription}[ {outcome.periodDescription} ]
                                </span>{" "}
                                :
                                <span style={{ marginLeft: "5px" }}>
                                  {" "}
                                  {getValidatedText(outcome.valid, outcome.outcomeDescription)}
                                </span>
                              </p>
                            </div>
                            <div className={cx(classes["flex-al-center"], classes["relative"])}>
                              <p className={cx(classes["flex-al-center"], classes["stake"])}>
                                {`${t("your_amount")}`}
                                <span className={classes["krw"]}>
                                  {currentStake > 0 ? currentStake.toLocaleString() : "-"}
                                  <em> KRW</em>
                                </span>
                              </p>
                              <div className={classes["changing-price-wrapper"]}>
                                <div className={cx(classes["flex-al-center"], classes["relative"])}>
                                  <span className={cx(classes["price"])}>{outcome.formattedPrice}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className={classes["sum"]}>
                            <div
                              className={cx(
                                classes["upload-and-settings-wrapper-no-button"],
                                classes["upload-and-settings-wrapper"],
                                classes["flex-al-center"],
                              )}
                            >
                              {/* <p>
                                {`${t("ez.estimated_potential_win")} : ${potentialWin.toLocaleString(undefined, {
                                  maximumFractionDigits: 2,
                                  minimumFractionDigits: 2,
                                })}`}
                              </p> */}
                              <p>
                                <div style={{ display: "unset", marginRight: "11px" }}>
                                  {t("ez.estimated_potential_win")} :
                                </div>
                                {`${
                                  !Number.isInteger(potentialWin) && potentialWin > 0
                                    ? potentialWin.toLocaleString(undefined, {
                                        maximumFractionDigits: 0,
                                        minimumFractionDigits: 0,
                                      })
                                    : potentialWin.toLocaleString(undefined, {
                                        maximumFractionDigits: 0,
                                        minimumFractionDigits: 0,
                                      })
                                }`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "MULTIPLE" && (
            <div
              data-scroll-lock-scrollable
              className={cx(classes["success-modal-betslip-card-wrapper"], classes["success-modal-multiple"])}
            >
              <section
                className={cx(
                  classes["betslip-card-wrapper"],
                  classes["more-games"],
                  classes["betslip-screen"],
                  classes["multiple"],
                )}
              >
                <div className={cx(classes["betslip-card"])}>
                  <div className={classes["matches"]}>
                    {betslipData.model.outcomes.map((outcome) => {
                      const priceChangeAlert =
                        (betslipOutcomeInitialPrices[outcome.outcomeId] !== outcome.price &&
                          autoApprovalMode === "MANUAL") ||
                        (betslipOutcomeInitialPrices[outcome.outcomeId] > outcome.price &&
                          autoApprovalMode === "AUTO_HIGHER");

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
                                    <p>
                                      {dayjs.unix(outcome.startTime / 1000).format("MM-DD")}{" "}
                                      {dayjs.unix(outcome.startTime / 1000).format("HH:mm")}
                                    </p>
                                  </div>
                                )}
                                {outcome.live && (
                                  <div
                                    className={cx(classes["betslip-live-icon"], classes["confirmation"])}
                                    style={{ marginRight: "-4px" }}
                                  >
                                    <i className={classes["icon-live-icon"]}>
                                      <span className={classes["path1"]} />
                                      <span className={classes["path2"]} />
                                      <span className={classes["path3"]} />
                                      <span className={classes["path4"]} />
                                      <span className={classes["path5"]} />
                                      <span className={classes["path6"]} />
                                      <span className={classes["path7"]} />
                                    </i>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className={classes["match-versus"]}>
                              <div className={cx(classes["flex-al-center"], classes["txt"])}>
                                <span>
                                  {outcome.eventDescription ? (
                                    <span>{outcome.eventDescription.split(" vs ")[0]}</span>
                                  ) : (
                                    ""
                                  )}
                                </span>
                                <b>VS</b>
                                <span>
                                  {outcome.eventDescription ? (
                                    <span>{outcome.eventDescription.split(" vs ")[1]}</span>
                                  ) : (
                                    ""
                                  )}
                                </span>
                              </div>
                              <div className={cx(classes["flex-al-center"], classes["relative"])}>
                                <p className={classes["flex-al-center"]}>
                                  <span style={{ color: "#525252" }}>
                                    {outcome.marketDescription}[ {outcome.periodDescription} ]
                                  </span>{" "}
                                  :<span style={{ marginLeft: "5px" }}> {outcome.outcomeDescription}</span>
                                </p>

                                <div className={classes["changing-price-wrapper"]}>
                                  <div className={cx(classes["flex-al-center"], classes["relative"])}>
                                    <span className={cx(classes["price"])}>{outcome.formattedPrice}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr className={classes[`${!priceChangeAlert ? "dashed-hr" : "solid-hr"}`]} />

                            {!outcome.valid && (
                              <div className={classes["sum"]}>
                                <div className={cx(classes["upload-and-settings-wrapper"], classes["flex-al-center"])}>
                                  <p>{t("ez.game_canceled_or_closed")}</p>
                                  <div className={classes["flex-al-center"]}>
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
                  </div>

                  {betslipData.betData.multiples
                    .filter((x) => x.numSubBets === 1)
                    .map((m) => (
                      <div className={classes["sum"]} key={m.typeId}>
                        <div className={classes["flex-al-center"]}>
                          <p style={{ marginBottom: "0" }}>
                            {`${t("ez.total_bet_stake")} : `}
                            <span>
                              {m.stake ? m.stake.toLocaleString() : "-"}
                              <em> KRW</em>
                            </span>
                          </p>
                          <p
                            className={classes["typeId"]}
                            style={{
                              marginRight: "0",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {`${modelUpdateInProgress ? "" : m.typeId} 멀티`}
                          </p>
                        </div>
                        <div className={classes["flex-al-center"]}>
                          <p style={{ marginBottom: "0" }}>
                            {/* {`당첨 예상 금액 : ${modelUpdateInProgress && !Number.isInteger(potentialWin) && potentialWin > 0
                      ? ""
                      : m.potentialWin.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })
                      }`} */}
                            <div style={{ display: "unset", marginRight: "11px" }}>
                              {t("ez.estimated_potential_win")} :
                            </div>
                            {`${
                              !modelUpdateInProgress && !Number.isInteger(m.potentialWin) && m.potentialWin > 0
                                ? m.potentialWin.toLocaleString(undefined, {
                                    maximumFractionDigits: 0,
                                    minimumFractionDigits: 0,
                                  })
                                : m.potentialWin.toLocaleString(undefined, {
                                    maximumFractionDigits: 0,
                                    minimumFractionDigits: 0,
                                  })
                            }`}
                          </p>
                          {!modelUpdateInProgress && (
                            <span className={classes["price"]}>{modelUpdateInProgress ? "" : m.price.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            </div>
          )}

          <div className={classes["modal-footer-wrapper"]}>
            <hr className={classes["solid-hr"]} />

            <div className={cx(classes["modal-footer"])}>
              <p className={classes["text"]}>
                {/* {t("ez.normally_request")} {t("ez.betting_details")}
                <span className={classes["blue-color"]}> MY PAGE </span>
                {t("ez.also_check")} */}
                회원님의 요청이 정상적으로 처리 되었습니다. <br />
                베팅내역은{" "}
                <span className={classes["blue-color"]} onClick={() => onNavigateToMyPage()}>
                  {" "}
                  MY PAGE{" "}
                </span>{" "}
                에서도 확인할 수 있습니다.
              </p>
              <button
                className={cx(classes["primary"], classes["confirmation-button"])}
                type="button"
                onClick={onClose}
              >
                {t("ok")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BetslipSuccessModal.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  placeBetTime: PropTypes.any.isRequired,
};
export default BetslipSuccessModal;
