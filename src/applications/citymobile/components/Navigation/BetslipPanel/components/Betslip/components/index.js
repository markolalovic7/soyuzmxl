import cx from "classnames";
import * as PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { AnimateKeyframes } from "react-simple-animate";

import { getAuthCurrencyCode, getAuthLoggedIn } from "../../../../../../../../redux/reselect/auth-selector";
import { getActiveBetDetail } from "../../../../../../../../redux/slices/cashoutSlice";
import { gaTrackBet } from "../../../../../../../../utils/google-analytics-utils";
import ExclamationSVG from "../../../../../../img/icons/exclamation.svg";
import classes from "../../../../../../scss/citymobile.module.scss";

import Spinner from "applications/common/components/Spinner";
import { ALERT_SUCCESS_BET_SUBMITTED } from "constants/alert-success-types";
import { getBalance } from "redux/reselect/balance-selector";
import {
  makeGetBetslipData,
  makeGetBetslipOutcomeIds,
  makeGetBetslipSubmitConfirmation,
  makeGetBetslipSubmitError,
  makeGetBetslipSubmitInProgress,
} from "redux/reselect/betslip-selector";
import { getCmsConfigBrandDetails } from "redux/reselect/cms-selector";
import { getActiveBetCount } from "redux/slices/cashoutSlice";
import { getAlertSuccessMessage } from "utils/alert-success";
import {
  acknowledgeErrors,
  acknowledgeSubmission,
  getGlobalPotentialWin,
  getGlobalTotalStake,
  getMultipleStake,
  getSingleStake,
  obtainGlobalMaxStake,
  onClearAllStakesHandler,
  onGlobalStakeChangeHandler,
  onRefreshBetslipHandler,
  onRemoveSelectionHandler,
  onSpecificStakeChangeHandler,
  onSubmitBetslip,
  onSubmitSingleWalletBetslip,
} from "utils/betslip-utils";

function isDisabled(loggedIn, allOutcomesValid, submitInProgress, betslipData, stake, insufficientBalance) {
  return (
    !loggedIn ||
    !allOutcomesValid ||
    submitInProgress ||
    betslipData.model.outcomes.length === 0 ||
    stake < 5000 ||
    insufficientBalance
  );
}

const BETSLIP_MODE_STANDARD = false;

const Betslip = ({ betslipMaxHeight }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const myBetLoading = useSelector((state) => state.cashout.loading);
  const loggedIn = useSelector(getAuthLoggedIn);

  const currencyCode = useSelector(getAuthCurrencyCode);

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const getBetslipData = useMemo(makeGetBetslipData, []);
  const betslipData = useSelector((state) => getBetslipData(state, location.pathname));

  const getSubmitInProgress = useMemo(makeGetBetslipSubmitInProgress, []);
  const submitInProgress = useSelector((state) => getSubmitInProgress(state, location.pathname));

  const dirtyPotentialWin = useSelector((state) => state.betslip.dirtyPotentialWin);
  const balance = useSelector(getBalance);

  const savedBetslipReference = useSelector((state) => state.betslip.savedBetslipReference);

  const allOutcomesValid = betslipData.model.outcomes.findIndex((outcome) => !outcome.valid) === -1;
  const [stakeChangeState, setStakeChangeState] = useState({}); // maintain a dirty state for stake changes (as opposed of sending it straight down to redux), else the betslip randomly refreshes

  const [opened, setOpened] = useState(false);
  // const [activeTab, setActiveTab] = useState("BET");

  const getBetslipSubmitConfirmation = useMemo(makeGetBetslipSubmitConfirmation, []);
  const submitConfirmation = useSelector((state) => getBetslipSubmitConfirmation(state, location.pathname));

  const cmsConfigBrandDetails = useSelector(getCmsConfigBrandDetails);

  const [alertConfirmShow, setAlertConfirmShow] = useState(false);
  const [alertSuccessShow, setAlertSuccessShow] = useState(false);
  const [alertSuccessMessage, setAlertSuccessMessage] = useState(false);
  const [alertErrorShow, setAlertErrorShow] = useState(false);
  const [alertErrorMessage, setAlertErrorMessage] = useState(false);

  const getBetslipSubmitError = useMemo(makeGetBetslipSubmitError, []);
  const submitError = useSelector((state) => getBetslipSubmitError(state, location.pathname));

  // Refresh betslips
  const dispatch = useDispatch();

  const sanitiseError = (submitError) => {
    if (submitError.includes("The maximum stake for the currently selected bet is")) {
      const amount = Number(submitError.split(" ")[submitError.split(" ").length - 1]).toLocaleString();

      return t("city.potential_win_error", { amount });
    }

    return submitError;
  };

  useEffect(() => {
    if (submitError) {
      setAlertErrorMessage(sanitiseError(submitError));
      setAlertErrorShow(true);
    }
  }, [submitError]);

  useEffect(() => {
    if (submitConfirmation) {
      setAlertSuccessMessage(getAlertSuccessMessage(ALERT_SUCCESS_BET_SUBMITTED, t));
      setAlertSuccessShow(true);
    }
  }, [submitConfirmation]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (betslipData.model.outcomes.length > 0 && !stakeChangeState.typeId) {
        // do not refresh while the user is tinkering with the stakes
        onRefreshBetslipHandler(dispatch, location.pathname, true);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, betslipData.model.outcomes.length, stakeChangeState.typeId]);

  useEffect(() => {
    // When the tab is selected, load the bet history
    if (loggedIn) {
      dispatch(getActiveBetDetail({ compactSpread: true }));
    }
  }, [loggedIn]);

  const getStake = () => {
    if (betslipData.model.outcomes.length === 0) {
      return 0;
    }
    if (betslipData.model.outcomes.length === 1) {
      return getSingleStake(betslipData, betslipData.model.outcomes[0].outcomeId);
    }

    // > 1
    return getMultipleStake(betslipData, betslipData.model.outcomes.length); // typeID == number of selections...
  };

  const stake = getStake();

  const stakeChangeHandler = (e, typeId, index) => {
    e.preventDefault();

    let stake = e.target.value.trim().replace(/,/g, "");

    if (stake.length === 0) {
      stake = "0";
    }
    if (Number.isNaN(stake)) {
      return;
    }

    // Track changes, but only submit when the onblur condition is over
    setStakeChangeState({ dirty: true, index, typeId, value: parseFloat(stake) });
  };

  const stakeChangeConfirmedHandler = (e) => {
    e.preventDefault();

    if (stakeChangeState.dirty) {
      if (BETSLIP_MODE_STANDARD) {
        onSpecificStakeChangeHandler(
          dispatch,
          location.pathname,
          betslipData,
          stakeChangeState.value,
          stakeChangeState.typeId,
          stakeChangeState.index,
        );
      } else {
        onGlobalStakeChangeHandler(dispatch, location.pathname, betslipData, stakeChangeState.value);
      }

      if (betslipData.model.outcomes.length > 0) {
        onRefreshBetslipHandler(dispatch, location.pathname, true);
      }

      setStakeChangeState({}); // clear the dirty state for stake changes
    }
  };

  const onMoneyButtonClickHandler = (amount, typeId, index) => {
    if (BETSLIP_MODE_STANDARD) {
      onSpecificStakeChangeHandler(dispatch, location.pathname, betslipData, getStake() + amount, typeId, index);
    } else {
      onGlobalStakeChangeHandler(dispatch, location.pathname, betslipData, getStake() + amount);
    }
    if (betslipData.model.outcomes.length > 0) {
      onRefreshBetslipHandler(dispatch, location.pathname, true);
    }
  };

  const onClearStakes = () => {
    onClearAllStakesHandler(dispatch, location.pathname);
  };

  // const [requestBetSubmission, setRequestBetSubmission] = useState(false);
  const onRequestBetAcceptance = (e) => {
    e.preventDefault();
    setAlertConfirmShow(true);
  };

  const getTotalOdds = () => {
    if (betslipData.model.outcomes.length === 0) {
      return 0;
    }

    if (betslipData.model.outcomes.length === 1) {
      let totalOdds = betslipData.model.outcomes.length > 0 ? 1 : 0;
      betslipData.model.outcomes.forEach((outcome) => (totalOdds *= outcome.price));

      return totalOdds.toFixed(2);
    }

    // > 1
    const bet = betslipData.betData.multiples.find((multiple) => multiple.typeId === betslipData.model.outcomes.length); // typeID == number of selections...
    if (bet?.price) {
      return bet.price.toFixed(2);
    }

    return 0;
  };

  const totalOdds = getTotalOdds();
  const globalPotentialWin = getGlobalPotentialWin(betslipData);

  const insufficientBalance = loggedIn && balance?.availableBalance ? stake > balance.availableBalance : false;

  // my bets related

  // When loading the page for the first time, or logging in, find out the pending bets...

  useEffect(() => {
    if (loggedIn) {
      dispatch(getActiveBetCount());
    }
  }, [dispatch, loggedIn]);

  // useEffect(() => {
  //   // When the tab is selected, load the bet history
  //   if (activeTab === "MYBETS") {
  //     dispatch(getActiveBetDetail({ compactSpread: true }));
  //   }
  // }, [activeTab, dispatch]);

  // end my bets related

  const pathname = location.pathname;
  const show = !(
    pathname.includes("az") ||
    pathname.includes("search") ||
    pathname.includes("results") ||
    pathname.includes("settings")
  );
  const selectionCounter = betslipOutcomeIds.length;

  useEffect(() => {
    window.parent.postMessage(
      {
        action: "app.betslip_button_status",
        selectionCounter,
        show: show && !opened, // show only when the panel is not open (and provided we are not in the "forbidden" paths.
      },
      "*",
    );
  }, [opened, show, selectionCounter]);

  React.useEffect(() => {
    window.addEventListener(
      "message",
      (event) => {
        const data = event.data || {};

        if (data.action === "app.betslip_panel_toggle") {
          console.log("Received toggle");
          setOpened((prevState) => !prevState);
        }
      },
      false,
    );
  }, []); // never re-add

  React.useEffect(() => {
    window.parent.postMessage(
      {
        action: "app.scroll_lock",
        code: opened ? "LOCK" : "UNLOCK",
      },
      "*",
    );
  }, [opened]);

  const onAcceptBetSubmission = () => {
    if (cmsConfigBrandDetails.data?.singleWalletMode) {
      onSubmitSingleWalletBetslip(dispatch, location.pathname);
    } else {
      onSubmitBetslip(dispatch, location.pathname);
    }

    // setRequestBetSubmission(false);
  };

  const invalidCustomBet =
    allOutcomesValid &&
    betslipData.model.outcomes.length > 1 &&
    betslipData.betData.multiples.findIndex((x) => x.typeId === betslipData.model.outcomes.length) === -1;

  return myBetLoading ? (
    <Spinner className={classes.loader} />
  ) : (
    <>
      <div className={classes["betslip__top"]} style={{ maxHeight: betslipMaxHeight - 285 }}>
        <div className={classes["betslip__body"]}>
          <div className={classes["betslip__items"]}>
            {betslipData &&
              betslipData.model.outcomes.map((outcome, index) => {
                if (!outcome.outcomeDescription) return null;

                return (
                  <div
                    className={`${classes["betslip__item"]} ${!outcome.valid ? classes["betslip__item_closed"] : ""}`}
                    key={outcome.outcomeId}
                  >
                    <div onClick={() => onRemoveSelectionHandler(dispatch, location.pathname, outcome.outcomeId, true)}>
                      <span className={classes["betslip__closed-button"]}>{t("line_closed")}</span>
                      <div className={classes["betslip__closed-wrapper"]} />
                    </div>

                    <div className={classes["betslip__row"]}>
                      <p className={classes["betslip__text"]}>{outcome.outcomeDescription}</p>
                      <span
                        className={classes["betslip__close"]}
                        onClick={() => onRemoveSelectionHandler(dispatch, location.pathname, outcome.outcomeId, true)}
                      />
                    </div>
                    <div className={classes["betslip__row"]}>
                      <div className={classes["betslip__text"]}>
                        <h5>{outcome.eventDescription}</h5>
                      </div>
                    </div>
                    <div className={classes["betslip__row"]}>
                      <p className={classes["betslip__text"]}>
                        {`${outcome.marketDescription} - ${outcome.periodDescription}`}
                      </p>

                      {outcome.priceDir ? (
                        <AnimateKeyframes
                          play
                          duration="0.5"
                          iterationCount="4"
                          keyframes={["opacity: 0", "opacity: 1"]}
                        >
                          <span
                            className={`${classes["betslip__coeficient"]} ${
                              outcome.priceDir && outcome.priceDir === "u" ? classes["betslip__coeficient_green"] : ""
                            }  ${
                              outcome.priceDir && outcome.priceDir === "d" ? classes["betslip__coeficient_red"] : ""
                            }`}
                          >
                            {outcome.formattedPrice}
                          </span>
                        </AnimateKeyframes>
                      ) : (
                        <span className={classes["betslip__coeficient"]}>{outcome.formattedPrice}</span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
          <div className={classes["betslip__messages"]}>
            {insufficientBalance ? (
              <div className={classes["betslip__message"]}>
                <span>{t("city.insufficient_balance")}</span>
                <i>
                  <img alt="" src={ExclamationSVG} />
                </i>
              </div>
            ) : null}

            {invalidCustomBet ? (
              <div className={classes["betslip__message"]}>
                <span>{t("city.invalid_combination_of_selections")}</span>
                <i>
                  <img alt="" src={ExclamationSVG} />
                </i>
              </div>
            ) : null}

            {stake > 20000000 ? (
              <div className={classes["betslip__message"]}>
                <span>{t("city.mob_navigation.maximum_stake", { stake: "20,000,000 KRW" })}</span>
                <i>
                  <img alt="" src={ExclamationSVG} />
                </i>
              </div>
            ) : null}

            {false ? ( // to be decided if this is supported
              <div className={classes["betslip__message"]}>
                <span>
                  PRICE_CHANGE - Purcell, Max -Gombos,Norbert vs Purcell, Max - Selection odds have changed [1,570,000]
                </span>
                <i>
                  <img alt="" src={ExclamationSVG} />
                </i>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className={classes["betslip__bottom"]}>
        <div className={classes["betslip__body"]}>
          <div className={classes["betslip__input"]}>
            <input
              className={classes["bet-input"]}
              data-type="number"
              placeholder={0}
              type="text"
              value={
                stakeChangeState.dirty
                  ? stakeChangeState.value > 0
                    ? stakeChangeState.value.toLocaleString()
                    : ""
                  : stake > 0
                  ? stake.toLocaleString()
                  : ""
              }
              onBlur={(e) => {
                stakeChangeConfirmedHandler(e);
                e.target.placeholder = "0";
              }}
              onChange={(e) => stakeChangeHandler(e, betslipData.model.outcomes.length, 0)}
              onFocus={(e) => {
                e.target.placeholder = "";
              }}
            />
          </div>
          <div className={classes["betslip__stakes-wrapper"]}>
            <div className={classes["betslip__stakes"]}>
              <div
                className={classes["betslip__stake"]}
                onClick={() => onMoneyButtonClickHandler(10000, betslipData.model.outcomes.length, 0)}
              >
                <span>10K</span>
              </div>
              <div
                className={classes["betslip__stake"]}
                onClick={() => onMoneyButtonClickHandler(50000, betslipData.model.outcomes.length, 0)}
              >
                <span>50K</span>
              </div>
              <div
                className={classes["betslip__stake"]}
                onClick={() => onMoneyButtonClickHandler(100000, betslipData.model.outcomes.length, 0)}
              >
                <span>100K</span>
              </div>
              <div
                className={classes["betslip__stake"]}
                onClick={() => onMoneyButtonClickHandler(500000, betslipData.model.outcomes.length, 0)}
              >
                <span>500K</span>
              </div>
            </div>
            <div className={classes["betslip__stakes"]}>
              <div
                className={classes["betslip__stake"]}
                onClick={() => onMoneyButtonClickHandler(1000000, betslipData.model.outcomes.length, 0)}
              >
                <span>1M</span>
              </div>
              <div
                className={`${classes["betslip__stake"]} ${
                  !loggedIn || betslipData.model.outcomes.length === 0 ? classes["betslip__stake_disabled"] : ""
                }`}
                onClick={() => obtainGlobalMaxStake(dispatch, betslipData, 0.5)}
              >
                <span>{t("half")}</span>
              </div>
              <div
                className={`${classes["betslip__stake"]} ${
                  !loggedIn || betslipData.model.outcomes.length === 0 ? classes["betslip__stake_disabled"] : ""
                }`}
                onClick={() => obtainGlobalMaxStake(dispatch, betslipData, 1)}
              >
                <span>{t("max")}</span>
              </div>
              <div className={classes["betslip__stake"]} onClick={onClearStakes}>
                <span>{t("reset")}</span>
              </div>
            </div>
          </div>
          <div className={classes["betslip__results"]}>
            <div className={classes["betslip__result"]}>
              <span>{t("city.mob_navigation.odds")}</span>
              <span>{!dirtyPotentialWin ? totalOdds : ""}</span>
            </div>
            <div className={classes["betslip__result"]}>
              <span>{t("city.mob_navigation.total_betting")}</span>
              <span>{`₩${getGlobalTotalStake(betslipData).toLocaleString()}`}</span>
            </div>
            <div className={classes["betslip__result"]}>
              <span>{t("city.mob_navigation.total_return")}</span>
              <span>{!dirtyPotentialWin ? `₩${globalPotentialWin.toLocaleString()}` : ""}</span>
            </div>
          </div>
        </div>
        <span
          className={`${classes["betslip__button"]} ${
            !isDisabled(loggedIn, allOutcomesValid, submitInProgress, betslipData, stake, insufficientBalance)
              ? classes["active"]
              : ""
          }`}
          disabled={isDisabled(loggedIn, allOutcomesValid, submitInProgress, betslipData, stake, insufficientBalance)}
          onClick={onRequestBetAcceptance}
        >
          {submitInProgress ? `${t("sending")}...` : t("betting")}
        </span>
      </div>

      {alertConfirmShow && (
        <div className={cx(classes["new-popup"], { [classes["active"]]: alertConfirmShow })}>
          <div className={classes["new-popup__body"]}>
            <div className={classes["new-popup__container"]}>
              <div className={classes["new-popup__content"]}>
                <div className={classes["new-popup__text"]}>
                  <div className={classes["new-popup__title"]}>{t("confirm_bet_1")}</div>
                </div>
                <div className={classes["new-popup__buttons"]}>
                  <button
                    className={classes["new-popup__button"]}
                    type="button"
                    onClick={() => {
                      setAlertConfirmShow(false);
                    }}
                  >
                    {t("cancel")}
                  </button>
                  <button
                    className={classes["new-popup__button"]}
                    type="button"
                    onClick={() => {
                      setAlertConfirmShow(false);
                      onAcceptBetSubmission();
                    }}
                  >
                    {t("ok")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {alertSuccessShow && (
        <div className={cx(classes["new-popup"], { [classes["active"]]: alertSuccessShow })}>
          <div className={classes["new-popup__body"]}>
            <div className={classes["new-popup__container"]}>
              <div className={classes["new-popup__content"]}>
                <div className={classes["new-popup__text"]}>
                  <div className={classes["new-popup__title"]}>{alertSuccessMessage}</div>
                </div>
                <div className={classes["new-popup__buttons"]}>
                  <button
                    className={classes["new-popup__button"]}
                    type="button"
                    onClick={() => {
                      setAlertSuccessShow(false);
                      acknowledgeSubmission(dispatch, location.pathname, true);
                      gaTrackBet(currencyCode, stake, savedBetslipReference, betslipData.model.outcomes);
                    }}
                  >
                    {t("ok")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {alertErrorShow && (
        <div className={cx(classes["new-popup"], { [classes["active"]]: alertErrorShow })}>
          <div className={classes["new-popup__body"]}>
            <div className={classes["new-popup__container"]}>
              <div className={classes["new-popup__content"]}>
                <div className={classes["new-popup__text"]}>
                  <div className={classes["new-popup__title"]}>{alertErrorMessage.split("__RT__")[0]}</div>
                  {alertErrorMessage.split("__RT__").length > 1 &&
                    alertErrorMessage
                      .split("__RT__")
                      .slice(1, 1000)
                      .map((x, index) => (
                        <div className={classes["new-popup__title"]} key={index}>
                          {x}
                        </div>
                      ))}
                </div>
                <div className={classes["new-popup__buttons"]}>
                  <button
                    className={classes["new-popup__button"]}
                    type="button"
                    onClick={() => {
                      setAlertErrorShow(false);
                      acknowledgeErrors(dispatch, location.pathname);
                    }}
                  >
                    Ok
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const propTypes = {
  betslipMaxHeight: PropTypes.number.isRequired,
};

const defaultProps = {};

Betslip.propTypes = propTypes;
Betslip.defaultProps = defaultProps;

export default Betslip;
