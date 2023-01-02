import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import getSymbolFromCurrency from "currency-symbol-map";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { AnimateKeyframes } from "react-simple-animate";

import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import { ALERT_SUCCESS_BET_SUBMITTED } from "constants/alert-success-types";
import { getAuthIsIframe, getAuthLoggedIn, getAuthLoginURL } from "redux/reselect/auth-selector";
import { getBalance } from "redux/reselect/balance-selector";
import { makeGetBetslipData, makeGetBetslipModelUpdateInProgress } from "redux/reselect/betslip-selector";
import { getCmsLayoutMobileSlimBetslipWidget } from "redux/reselect/cms-layout-widgets";
import {
  getCmsConfigBettingMultipleStakeLimits,
  getCmsConfigBettingSingleStakeLimits,
  getCmsConfigBrandDetails,
  getCmsConfigIframeMode,
} from "redux/reselect/cms-selector";
import { changeMultipleStakes, changeSingleStakes } from "redux/slices/betslipSlice";
import { alertError } from "utils/alert-error";
import { alertSuccess, getAlertSuccessMessage } from "utils/alert-success";
import {
  acknowledgeErrors,
  acknowledgeSubmission,
  getGlobalTotalStake,
  obtainGlobalMaxStake,
  onClearBetslipHandler,
  onRefreshBetslipHandler,
  onRemoveSelectionHandler,
  onSubmitBetslip,
  onSubmitSingleWalletBetslip,
} from "utils/betslip-utils";

const propTypes = {
  accountPanelToggleHandler: PropTypes.func.isRequired,
  backdropClickHandler: PropTypes.func.isRequired,
  betslipDrawerCloseHandler: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
const defaultProps = {};

const getButtonAmount = (t, amount) => {
  if (amount >= 1000 && amount < 1000000) {
    return t("betslip_panel.formatted_thousands_amount", { value: amount / 1000 });
  }

  if (amount >= 1000000) {
    return t("betslip_panel.formatted_millions_amount", { value: amount / 1000000 });
  }

  return amount;
};

const BetslipPanel = ({ accountPanelToggleHandler, backdropClickHandler, betslipDrawerCloseHandler, open }) => {
  const { t } = useTranslation();

  const location = useLocation();
  const dispatch = useDispatch();

  const isSlaveApplication = useSelector(getCmsConfigIframeMode); // whether the application is configured to be a slave application in the CMS (typically an iframe)
  const isInIframe = useSelector(getAuthIsIframe); // whether the application is actually in an iframe

  const getBetslipData = useMemo(makeGetBetslipData, []);
  const betslipData = useSelector((state) => getBetslipData(state, location.pathname));

  // const dirtyPotentialWin = useSelector((state) => state.betslip.dirtyPotentialWin);
  const submitInProgress = useSelector((state) => state.betslip.submitInProgress);
  const balance = useSelector(getBalance);
  const submitError = useSelector((state) => state.betslip.submitError);
  const submitConfirmation = useSelector((state) => state.betslip.submitConfirmation);

  const getBetslipModelUpdateInProgress = useMemo(makeGetBetslipModelUpdateInProgress, []);
  const modelUpdateInProgress = useSelector((state) => getBetslipModelUpdateInProgress(state, location.pathname));

  const loggedIn = useSelector(getAuthLoggedIn);
  const currencyCode = useSelector((state) => state.auth.currencyCode);
  const authLoginURL = useSelector(getAuthLoginURL);

  const cmsConfigBrandDetails = useSelector(getCmsConfigBrandDetails);

  const singleStakeLimits = useSelector(getCmsConfigBettingSingleStakeLimits);
  const multipleStakeLimits = useSelector(getCmsConfigBettingMultipleStakeLimits);

  const betslipWidget = useSelector((state) => getCmsLayoutMobileSlimBetslipWidget(state, location));

  // Refresh betslips
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (betslipData?.model?.outcomes?.length > 0 && !submitInProgress) {
        onRefreshBetslipHandler(dispatch, location.pathname);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, betslipData?.model?.outcomes?.length, submitInProgress]);

  const [minMaxLimitBreached, setMinMaxLimitBreached] = useState(false);

  // Check for betslip breaches
  useEffect(() => {
    let limitBreach = false;

    betslipData.betData.singles.forEach((s) => {
      if (
        s.stake > 0 &&
        (s.stake < singleStakeLimits[currencyCode].min || s.stake > singleStakeLimits[currencyCode].max)
      ) {
        limitBreach = true;
      }
    });
    betslipData.betData.multiples.forEach((m) => {
      if (m.typeId === betslipData.model.outcomes.length) {
        if (
          m.unitStake > 0 &&
          (m.unitStake < multipleStakeLimits[currencyCode].min || m.unitStake > multipleStakeLimits[currencyCode].max)
        ) {
          limitBreach = true;
        }
      }
    });

    setMinMaxLimitBreached(limitBreach);

    return undefined;
  }, [betslipData, setMinMaxLimitBreached]);

  const onRequestBetAcceptance = (e) => {
    e.preventDefault();
    const confirmBox = window.confirm(t("confirm_bet_1"));
    if (confirmBox === true) {
      if (cmsConfigBrandDetails.data?.singleWalletMode) {
        onSubmitSingleWalletBetslip(dispatch, location.pathname);
      } else {
        onSubmitBetslip(dispatch, location.pathname);
      }
    }
  };

  const onLoginHandler = () => {
    if (isSlaveApplication) {
      if (isInIframe) {
        window.parent.postMessage(
          {
            action: "app.iframe_effects",
            code: "LOGIN",
          },
          "*",
        );
      } else {
        // if the authLoginURL was provided to this frame, then use it...
        if (authLoginURL) {
          window.location.href = authLoginURL;
        }
      }
    } else {
      accountPanelToggleHandler();
    }
  };

  useEffect(() => {
    if (submitConfirmation) {
      alertSuccess(getAlertSuccessMessage(ALERT_SUCCESS_BET_SUBMITTED, t));
      acknowledgeSubmission(dispatch, location.pathname, true);
    }

    return undefined;
  }, [dispatch, submitConfirmation, t]);

  useEffect(() => {
    if (submitError) {
      alertError(submitError);
      acknowledgeErrors(dispatch, location.pathname);
    }

    return undefined;
  }, [dispatch, submitError]);

  function updateStakeHandler(value) {
    if (betslipData.model.outcomes.length === 1) {
      dispatch(
        changeSingleStakes({ singleStakes: [{ outcomeId: betslipData.model.outcomes[0].outcomeId, stake: value }] }),
      );
    } else if (betslipData.betData.multiples.length > 0) {
      const singleStakes = betslipData.model.outcomes.map((outcome) =>
        // make sure to reset singles
        ({ outcomeId: outcome.outcomeId, stake: 0 }),
      );
      dispatch(changeSingleStakes({ singleStakes }));

      const multipleStakes = betslipData.betData.multiples.map((bet) => {
        // make sure to reset singles
        if (bet.typeId === betslipData.model.outcomes.length) {
          return {
            stake: value,
            typeId: bet.typeId,
            unitStake: value,
          };
        }

        return {
          stake: 0,
          typeId: bet.typeId,
          unitStake: 0,
        };
      });
      dispatch(changeMultipleStakes({ multipleStakes }));
    }
  }

  const stakeChangeHandler = (e) => {
    e.preventDefault();

    let value = 0;
    if (e.target.value !== "") {
      value = parseInt(e.target.value, 10);
    }

    if (value <= 0) {
      value = 0;
    }

    updateStakeHandler(value);
  };

  const stakeChangeConfirmedHandler = (e) => {
    e.preventDefault();

    if (betslipData.model.outcomes.length > 0) {
      onRefreshBetslipHandler(dispatch, location.pathname);
    }
  };

  const stakeButtonHandler = (value) => {
    if (betslipData.model.outcomes.length > 0) {
      if (betslipData.model.outcomes.length === 1) {
        value += betslipData.betData.singles[0].stake;
      } else {
        const betTypeId = betslipData.model.outcomes.length;
        const multiple = betslipData.betData.multiples.find(
          (bet) =>
            // make sure to reset singles
            bet.typeId === betTypeId,
        );
        value += multiple.stake;
      }

      updateStakeHandler(value);

      onRefreshBetslipHandler(dispatch, location.pathname);
    }
  };

  const getStake = () => {
    let stake = 0;
    if (betslipData.model.outcomes.length === 1) {
      if (betslipData.betData.singles.length === 1) {
        stake = betslipData.betData.singles[0].stake;
      }
    } else if (betslipData.betData.multiples.length > 0) {
      const typeId = betslipData.model.outcomes.length;
      const multiple = betslipData.betData.multiples.find((multiple) => multiple.typeId === typeId);
      if (multiple) stake = multiple.stake;
    }

    return stake;
  };

  const stake = getStake();

  const getPotentialWin = () => {
    let potentialWin = 0;
    if (betslipData.model.outcomes.length === 1) {
      if (betslipData.betData.singles.length === 1) {
        potentialWin = betslipData.betData.singles[0].potentialWin;
      }
    } else if (betslipData.betData.multiples.length > 0) {
      const typeId = betslipData.model.outcomes.length;
      const multiple = betslipData.betData.multiples.find((multiple) => multiple.typeId === typeId);
      if (multiple) potentialWin = multiple.potentialWin;
    }

    return potentialWin;
  };

  const potentialWin = getPotentialWin();

  const getTotalOdds = () => {
    let totalOdds = betslipData.model.outcomes.length > 0 ? 1 : 0;
    betslipData.model.outcomes.forEach((outcome) => {
      totalOdds *= outcome.price;
    });

    return totalOdds.toFixed(2);
  };

  const totalOdds = getTotalOdds();

  const hasOutcomes = betslipData.model.outcomes.length > 0;
  const allOutcomesValid = betslipData.model.outcomes.findIndex((outcome) => !outcome.valid) === -1;

  const maxStakeEnabled = loggedIn && hasOutcomes && allOutcomesValid && betslipWidget?.data?.maxStake;

  const betPlacementEnabled =
    loggedIn &&
    hasOutcomes &&
    allOutcomesValid &&
    getGlobalTotalStake(betslipData) > 0 &&
    getGlobalTotalStake(betslipData) <= balance?.availableBalance &&
    !minMaxLimitBreached &&
    betslipData?.model?.outcomes?.length <= parseInt(betslipWidget?.data?.maxSelections, 10) &&
    !submitInProgress;

  return (
    <div className={`${classes["overlay-wrapper"]} ${open ? classes["active"] : ""}`} onClick={backdropClickHandler}>
      <div className={`${classes["overlay-folder"]} ${open ? classes["active"] : ""}`}>
        <div className={classes["overlay-folder__container"]}>
          {modelUpdateInProgress ? (
            <div className={classes["betslip-spinner"]}>
              <div className={classes["inner"]}>
                <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
              </div>
            </div>
          ) : null}

          <div className={classes["overlay-folder__body"]}>
            <div className={classes["overlay-folder__title"]}>
              <h2>
                {t("betslip")}
                <div className={classes["count"]}>{betslipData.model.outcomes.length}</div>
              </h2>
              <span
                className={classes["overlay-folder__cross"]}
                id="folder-cross"
                onClick={betslipDrawerCloseHandler}
              />
            </div>
            {betslipData?.model?.outcomes?.length > parseInt(betslipWidget?.data?.maxSelections, 10) && (
              <div className={classes["login__notification"]}>
                <div className={classes["login__notification-content"]}>
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  {t("betslip_panel.too_many_selections", { value: betslipWidget?.data?.maxSelections })}
                </div>
              </div>
            )}
            <div className={classes["overlay-folder__bets"]}>
              {betslipData.model.outcomes.map((outcome) => {
                if (outcome.outcomeDescription) {
                  return (
                    <div
                      className={classes["overlay-folder__bet"]}
                      key={outcome.outcomeId}
                      style={{ opacity: outcome.valid ? 1 : 0.5 }}
                    >
                      <div className={classes["overlay-folder__bet-header"]}>
                        <span
                          className={classes["overlay-folder__delete"]}
                          onClick={() => {
                            onRemoveSelectionHandler(dispatch, location.pathname, outcome.outcomeId, false);
                            onRefreshBetslipHandler(dispatch, location.pathname);
                          }}
                        />
                        <h4>{outcome.outcomeDescription}</h4>
                        <div className={classes["overlay-folder__coefficient"]}>
                          <AnimateKeyframes
                            play
                            duration="0.5"
                            iterationCount="10"
                            key={outcome.formattedPrice}
                            keyframes={["opacity: 0", "opacity: 1"]}
                          >
                            <span>{outcome.formattedPrice}</span>
                          </AnimateKeyframes>
                        </div>
                      </div>
                      <div className={classes["overlay-folder__bet-content"]}>
                        <p>{outcome.eventDescription}</p>
                        <p>{`${outcome.marketDescription} - ${outcome.periodDescription}`}</p>
                      </div>
                    </div>
                  );
                }

                return null; // skip if the data is pending API initialization!
              })}
            </div>
            <div className={classes["overlay-folder__result"]}>
              <div className={classes["overlay-folder__buttons"]}>
                <button
                  className={classes["overlay-folder__button"]}
                  type="button"
                  onClick={() => onClearBetslipHandler(dispatch, location.pathname)}
                >
                  {t("betslip_panel.remove_all")}
                </button>
                {betslipWidget?.data?.maxStake && (
                  <button
                    className={classes["overlay-folder__button"]}
                    disabled={!maxStakeEnabled}
                    style={{ opacity: maxStakeEnabled ? 1 : 0.5, pointerEvents: maxStakeEnabled ? "auto" : "none" }}
                    type="button"
                    onClick={() => obtainGlobalMaxStake(dispatch, betslipData, 1)}
                  >
                    {t("betslip_panel.max_stake")}
                  </button>
                )}
              </div>
              {loggedIn && balance && (
                <div className={classes["overlay-folder__balance"]}>
                  <h5>{t("betslip_panel.balance")}</h5>
                  <span>{`${currencyCode} ${balance.availableBalance.toLocaleString()}`}</span>
                </div>
              )}
              <div className={classes["overlay-folder__total-odds"]}>
                <h5>{t("betslip_panel.total_odds")}</h5>
                <span>{totalOdds}</span>
              </div>
              <div className={classes["overlay-folder__stake"]}>
                <div className={classes["overlay-folder__stake-row"]}>
                  <div className={classes["overlay-folder__stake-text"]}>{t("betslip_panel.stake")}</div>
                  <div className={classes["overlay-folder__stake-input"]}>
                    <input
                      id="folder-search"
                      name="folder-search"
                      placeholder={0}
                      type="number"
                      value={stake > 0 ? stake : ""}
                      onBlur={stakeChangeConfirmedHandler}
                      onChange={stakeChangeHandler}
                    />
                  </div>
                </div>
                {stake > 0 &&
                  ((betslipData.model.outcomes.length === 1 && stake < singleStakeLimits[currencyCode]?.min) ||
                    (betslipData.model.outcomes.length > 1 && stake < multipleStakeLimits[currencyCode]?.min)) && (
                    <div className={classes["overlay-folder__stake-row"]}>
                      <div />
                      <div style={{ color: "red" }}>
                        {t("betslip_panel.minimum_stake_is", {
                          value: `${getSymbolFromCurrency(currencyCode)} ${
                            betslipData.model.outcomes.length === 1
                              ? singleStakeLimits[currencyCode].min
                              : multipleStakeLimits[currencyCode].min
                          }`,
                        })}
                      </div>
                    </div>
                  )}
                {((betslipData.model.outcomes.length === 1 && stake > singleStakeLimits[currencyCode]?.max) ||
                  (betslipData.model.outcomes.length > 1 && stake > multipleStakeLimits[currencyCode]?.max)) && (
                  <div className={classes["overlay-folder__stake-row"]}>
                    <div />
                    <div style={{ color: "red" }}>
                      {t("betslip_panel.maximum_stake_is", {
                        value: `${getSymbolFromCurrency(currencyCode)} ${
                          betslipData.model.outcomes.length === 1
                            ? singleStakeLimits[currencyCode].max
                            : multipleStakeLimits[currencyCode].max
                        }`,
                      })}
                    </div>
                  </div>
                )}
                {/* // CMS and translations driven */}
                <div className={classes["overlay-folder__stake-buttons"]}>
                  {betslipWidget?.data?.moneyButtons &&
                    betslipWidget.data.moneyButtons[currencyCode]?.map((amount) => {
                      const value = parseInt(amount, 10);

                      return (
                        <button
                          className={classes["overlay-folder__stake-button"]}
                          key={value}
                          type="button"
                          onClick={() => stakeButtonHandler(value)}
                        >
                          {getButtonAmount(t, value)}
                        </button>
                      );
                    })}
                </div>
              </div>
              <div className={classes["overlay-folder__returns"]}>
                <div className={classes["overlay-folder__returns-text"]}>
                  <h5>{t("betslip_panel.potential_returns")}</h5>
                  <span>{`${currencyCode} ${potentialWin}`}</span>
                </div>
                {loggedIn ? (
                  <button
                    className={classes["overlay-folder__login"]}
                    disabled={!betPlacementEnabled}
                    style={{
                      cursor: betPlacementEnabled ? "pointer" : "none",
                      opacity: betPlacementEnabled ? 1 : 0.5,
                      pointerEvents: betPlacementEnabled ? "auto" : "none",
                    }}
                    type="button"
                    onClick={onRequestBetAcceptance}
                  >
                    {t("betslip_panel.place_bet")}
                  </button>
                ) : (
                  <button className={classes["overlay-folder__login"]} type="button" onClick={onLoginHandler}>
                    {t("login")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BetslipPanel.propTypes = propTypes;
BetslipPanel.defaultProps = defaultProps;

export default BetslipPanel;
