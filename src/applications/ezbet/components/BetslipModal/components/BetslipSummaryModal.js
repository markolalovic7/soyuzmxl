import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import {
  makeGetBetslipData,
  makeGetBetslipModelUpdateInProgress,
  makeGetBetslipSubmitConfirmation,
  makeGetBetslipSubmitError,
  makeGetBetslipSubmitInProgress,
} from "../../../../../redux/reselect/betslip-selector";
import { getCmsConfigBrandDetails } from "../../../../../redux/reselect/cms-selector";
import {
  acknowledgeErrors,
  acknowledgeSubmission,
  getSingleBetPotentialWin,
  getSingleStake,
  onSubmitBetslip,
  onSubmitSingleWalletBetslip,
} from "../../../../../utils/betslip-utils";
import classes from "../../../scss/ezbet.module.scss";
import SportIcon from "../../SportIcon/SportIcon";

import BetslipSuccessModal from "./BetslipSuccessModal";

import CloseRedSvg from "applications/ezbet/img/icons/close-red.svg";

const BetslipErrorModal = ({ message, onClose }) => {
  const { t } = useTranslation();

  return (
    <div
      className={cx(classes["confirmation-modal"], classes["confirm-error-modal"])}
      id="confirmation-modal"
      style={{ display: "flex" }}
    >
      <div className={classes["modal-content"]}>
        <div className={classes["modal-body"]}>
          <i className={classes["ez-check-icon"]}>
            <img alt="White Check in blue circle" src={CloseRedSvg} />
          </i>
          <p className={classes["warning"]} style={{ color: "red", marginBottom: "11px" }}>
            요청이 정상적으로
          </p>
          <p>{message}</p>
          <div className={cx(classes["modal-footer"], classes["flex-al-center"])}>
            <button className={cx(classes["primary"], classes["confirmation-button"])} type="button" onClick={onClose}>
              {t("confirm")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

BetslipErrorModal.propTypes = { message: PropTypes.string.isRequired, onClose: PropTypes.func.isRequired };

const BetslipSummarySingleModal = ({ betType, onClose, onSubmit }) => {
  const location = useLocation();
  const { t } = useTranslation();

  const getBetslipData = useMemo(makeGetBetslipData, []);
  const betslipData = useSelector((state) => getBetslipData(state, location.pathname));

  const getSubmitInProgress = useMemo(makeGetBetslipSubmitInProgress, []);
  const submitInProgress = useSelector((state) => getSubmitInProgress(state, location.pathname));

  const isLoggedIn = useSelector((state) => state.auth.loggedIn);

  return (
    <div className={cx(classes["full-page-modal"], classes["single-confirmation-modal"])} style={{ display: "block" }}>
      <div className={classes["full-page-modal-content"]}>
        <div className={classes["full-page-modal-body"]}>
          <section
            className={cx(
              classes["betslip-card-wrapper"],
              classes["one-game"],
              classes["betslip-screen"],
              classes["single"],
            )}
          >
            <div className={classes["betslip-card"]}>
              <div className={classes["body-modal-header"]}>
                <h1>
                  <span className={classes["icon-wallet"]} />
                  {t("ez.betslip")}
                </h1>
              </div>
              <div data-scroll-lock-scrollable className={classes["modal-matches-wrapper"]}>
                {betslipData.model.outcomes
                  .filter((x) => x.enabled)
                  .map((outcome, index) => {
                    const currentStake = getSingleStake(betslipData, outcome.outcomeId);
                    const potentialWin = getSingleBetPotentialWin(betslipData, outcome.outcomeId);

                    if (currentStake <= 0) return null;

                    return (
                      <>
                        <div className={cx(classes["matches"], classes["place-bet-card"], classes["single-modal"])}>
                          <h1>{betType}</h1>
                          <div className={cx(classes["matches-header"], classes["flex-al-center"])} key={index}>
                            <div className={cx(classes["flex-al-center"], classes["league-name-and-time"])}>
                              <h2 className={classes["flex-al-center"]}>
                                <SportIcon code={outcome.sportCode} />
                                [<span>{outcome.tournamentDescription}</span>]
                              </h2>
                              <div className={classes["switcher-wrap"]}>
                                <div className={classes["date-and-time"]}>
                                  <span>{dayjs.unix(outcome.startTime / 1000).format("MM-DD")}</span>
                                  &nbsp;
                                  <span>{dayjs.unix(outcome.startTime / 1000).format("HH:mm")}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={classes["match"]}>
                            <div className={classes["match-versus"]}>
                              <div className={cx(classes["flex-al-center"], classes["txt"])}>
                                {outcome.eventDescription ? (
                                  <span>{outcome.eventDescription.split(" vs ")[0]}</span>
                                ) : (
                                  ""
                                )}
                                <b>VS</b>
                                {outcome.eventDescription ? (
                                  <span>{outcome.eventDescription.split(" vs ")[1]}</span>
                                ) : (
                                  ""
                                )}
                              </div>
                              <div className={cx(classes["flex-al-center"], classes["txt"])}>
                                <p>
                                  {`${outcome.marketDescription} [ ${outcome.periodDescription} ] : ${outcome.outcomeDescription}`}
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
                                <span className={classes["price"]}>{outcome.formattedPrice}</span>
                              </div>
                            </div>
                            <div className={classes["sum"]}>
                              <div
                                className={cx(
                                  classes["flex-al-center"],
                                  classes["upload-and-settings-wrapper-no-button"],
                                  classes["upload-and-settings-wrapper"],
                                )}
                              >
                                <p>
                                  <div style={{ display: "unset", marginRight: "11px" }}>
                                    {t("ez.estimated_potential_win")} :
                                  </div>
                                  {`${potentialWin.toLocaleString(undefined, {
                                    maximumFractionDigits: 0,
                                    minimumFractionDigits: 0,
                                  })}`}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {betslipData.model.outcomes.length - 1 > index && (
                          <>
                            <br />
                            <br />
                          </>
                        )}
                      </>
                    );
                  })}
              </div>
              <div className={classes["body-modal-footer"]}>
                <p>{t("ez.please_check_again")}</p>
                <div className={classes["flex-al-center"]}>
                  <button
                    className={cx(classes["primary"], classes["confirmation-button"])}
                    disabled={!isLoggedIn || submitInProgress}
                    type="button"
                    onClick={onSubmit}
                  >
                    {submitInProgress ? (
                      <FontAwesomeIcon
                        className="fa-spin"
                        icon={faSpinner}
                        style={{ "--fa-primary-color": "#00ACEE", "--fa-secondary-color": "#E6E6E6" }}
                      />
                    ) : (
                      t("confirm")
                    )}
                  </button>
                  <button
                    className={cx(classes["default"], classes["full-page-modal-close-single"])}
                    disabled={submitInProgress}
                    type="button"
                    onClick={onClose}
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

BetslipSummarySingleModal.propTypes = { onClose: PropTypes.func.isRequired, onSubmit: PropTypes.func.isRequired };

const BetslipSummaryMultipleModal = ({ betType, onClose, onSubmit }) => {
  const location = useLocation();
  const { t } = useTranslation();

  const getBetslipData = useMemo(makeGetBetslipData, []);
  const betslipData = useSelector((state) => getBetslipData(state, location.pathname));

  const getSubmitInProgress = useMemo(makeGetBetslipSubmitInProgress, []);
  const submitInProgress = useSelector((state) => getSubmitInProgress(state, location.pathname));

  const getBetslipModelUpdateInProgress = useMemo(makeGetBetslipModelUpdateInProgress, []);
  const modelUpdateInProgress = useSelector((state) => getBetslipModelUpdateInProgress(state, location.pathname));

  const isLoggedIn = useSelector((state) => state.auth.loggedIn);

  return (
    <div
      className={cx(classes["full-page-modal"], classes["multiple-confirmation-modal"])}
      style={{ display: "block" }}
    >
      <div className={classes["full-page-modal-content"]}>
        <div className={classes["full-page-modal-body"]}>
          <section
            data-scroll-lock-scrollable
            className={cx(
              classes["betslip-card-wrapper"],
              classes["more-games"],
              classes["betslip-screen"],
              classes["multiple"],
            )}
          >
            <div className={classes["betslip-card"]}>
              <div className={classes["body-modal-header"]}>
                <h1>
                  <span className={classes["icon-wallet"]} />
                  {t("ez.betslip")}
                </h1>
              </div>
              <div data-scroll-lock-scrollable className={classes["modal-matches-wrapper"]}>
                <div className={cx(classes["matches"], classes["place-bet-card"], classes["multiple-modal"])}>
                  {betslipData.model.outcomes
                    .filter((x) => x.enabled)
                    .map((outcome, index) => (
                      <div className={classes["match"]} key={index}>
                        <h1>{betType}</h1>
                        <div className={cx(classes["matches-header"], classes["flex-al-center"])}>
                          <div className={cx(classes["flex-al-center"], classes["league-name-and-time"])}>
                            <h2 className={classes["flex-al-center"]}>
                              <SportIcon code={outcome.sportCode} />
                              [<span>{outcome.tournamentDescription}</span>]
                            </h2>
                            <div className={classes["switcher-wrap"]}>
                              <div className={classes["date-and-time"]}>
                                <span>{dayjs.unix(outcome.startTime / 1000).format("MM-DD")}</span>
                                &nbsp;
                                <span>{dayjs.unix(outcome.startTime / 1000).format("HH:mm")}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className={classes["match-versus"]}>
                          <div className={cx(classes["flex-al-center"], classes["txt"])}>
                            {outcome.eventDescription ? (
                              <span>{outcome.eventDescription.split(" vs ")[0]}</span>
                            ) : (
                              ""
                            )}
                            <b>VS</b>
                            {outcome.eventDescription ? (
                              <span>{outcome.eventDescription.split(" vs ")[1]}</span>
                            ) : (
                              ""
                            )}
                          </div>
                          <div className={cx(classes["flex-al-center"], classes["relative"])}>
                            <p className={classes["flex-al-center"]} style={{ marginBottom: "0", maxWidth: "unset" }}>
                              {`${outcome.marketDescription} [ ${outcome.periodDescription} ] : ${outcome.outcomeDescription}`}
                            </p>
                            <span className={classes["price"]}>{outcome.formattedPrice}</span>
                          </div>
                          <hr className={classes["dashed-hr"]} />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              {betslipData.betData.multiples
                .filter((x) => x.numSubBets === 1)
                .map((m) => (
                  <div className={classes["sum"]} key={m.typeId}>
                    <div className={cx(classes["flex-al-center"])}>
                      <p>
                        {`${t("ez.total_bet_stake")} : `}
                        <span>
                          {m.stake ? m.stake.toLocaleString() : "-"} <em> KRW</em>
                        </span>
                      </p>
                      <p className={classes["typeId"]}>{`${modelUpdateInProgress ? "" : m.typeId} 콤보`}</p>
                    </div>
                    <div className={cx(classes["flex-al-center"])}>
                      <p>
                        {`당첨 예상 금액 : ${modelUpdateInProgress ? (
                          ""
                        ) : (
                          <span style={{ marginLeft: "11px" }}>
                            {m.potentialWin.toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                              minimumFractionDigits: 0,
                            })}
                          </span>
                        )
                          }`}
                      </p>
                      {!modelUpdateInProgress && (
                        <span className={classes["price"]}>{modelUpdateInProgress ? "" : m.price}</span>
                      )}
                    </div>
                  </div>
                ))}

              <div className={classes["body-modal-footer"]}>
                <p>{t("ez.please_check_again")}</p>
                <div className={classes["flex-al-center"]}>
                  <button
                    className={cx(classes["primary"], classes["confirmation-button"])}
                    disabled={!isLoggedIn || submitInProgress}
                    type="button"
                    onClick={onSubmit}
                  >
                    {submitInProgress ? (
                      <FontAwesomeIcon
                        className="fa-spin"
                        icon={faSpinner}
                        style={{ "--fa-primary-color": "#00ACEE", "--fa-secondary-color": "#E6E6E6" }}
                      />
                    ) : (
                      t("confirm")
                    )}
                  </button>
                  <button
                    className={cx(classes["default"], classes["full-page-modal-close-single"])}
                    disabled={submitInProgress}
                    type="button"
                    onClick={onClose}
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

BetslipSummaryMultipleModal.propTypes = { onClose: PropTypes.func.isRequired, onSubmit: PropTypes.func.isRequired };

const BetslipSummaryModal = ({ activeTab, onClose }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();

  const getBetslipSubmitError = useMemo(makeGetBetslipSubmitError, []);
  const submitError = useSelector((state) => getBetslipSubmitError(state, location.pathname));

  const getBetslipSubmitConfirmation = useMemo(makeGetBetslipSubmitConfirmation, []);
  const submitConfirmation = useSelector((state) => getBetslipSubmitConfirmation(state, location.pathname));

  const cmsConfigBrandDetails = useSelector(getCmsConfigBrandDetails);

  const onSubmitSingleBets = () => {
    if (cmsConfigBrandDetails.data?.singleWalletMode) {
      onSubmitSingleWalletBetslip(dispatch, location.pathname, false, true, false, false);
    } else {
      onSubmitBetslip(dispatch, location.pathname, false, true, false, false);
    }
  };

  const onSubmitMultipleBet = () => {
    if (cmsConfigBrandDetails.data?.singleWalletMode) {
      onSubmitSingleWalletBetslip(dispatch, location.pathname, false, false, true, false);
    } else {
      onSubmitBetslip(dispatch, location.pathname, false, false, true, false);
    }
  };

  return (
    <>
      {activeTab === "SINGLE" ? (
        <BetslipSummarySingleModal betType={t("ez.single")} onClose={onClose} onSubmit={() => onSubmitSingleBets()} />
      ) : (
        <BetslipSummaryMultipleModal
          betType={t("ez.multiple")}
          onClose={onClose}
          onSubmit={() => onSubmitMultipleBet()}
        />
      )}
      {submitConfirmation && (
        <BetslipSuccessModal
          activeTab={activeTab}
          onClose={() => {
            acknowledgeSubmission(dispatch, location.pathname, true);
            onClose();
          }}
        />
      )}
      {submitError && (
        <BetslipErrorModal
          message={submitError}
          onClose={() => {
            acknowledgeErrors(dispatch, location.pathname);
            onClose();
          }}
        />
      )}
    </>
  );
};

BetslipSummaryModal.propTypes = { activeTab: PropTypes.string.isRequired, onClose: PropTypes.func.isRequired };

export default React.memo(BetslipSummaryModal);
