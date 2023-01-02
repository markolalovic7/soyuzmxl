import Spinner from "applications/common/components/Spinner";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { AnimateKeyframes } from "react-simple-animate";

import { getAuthCurrencyCode } from "../../../../../../../redux/reselect/auth-selector";
import { getBalance } from "../../../../../../../redux/reselect/balance-selector";
import {
  makeGetBetslipData,
  makeGetBetslipSubmitConfirmation,
  makeGetBetslipSubmitError,
  makeGetBetslipSubmitInProgress,
} from "../../../../../../../redux/reselect/betslip-selector";
import { getCmsConfigBrandDetails } from "../../../../../../../redux/reselect/cms-selector";
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
} from "../../../../../../../utils/betslip-utils";
import { gaTrackBet } from "../../../../../../../utils/google-analytics-utils";
import { ReactComponent as ExclamationMarkSvg } from "../../../../../img/icons/exclamation-mark.svg";
import classes from "../../../../../scss/citywebstyle.module.scss";
import { isNotEmpty } from "../../../../../../../utils/lodash";

const BETSLIP_MODE_STANDARD = false;

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

const Betslip = ({ betslipMaxHeight }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const [userMadeAStakeAction, setUserMadeAStakeAction] = useState(false);

  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const cmsConfigBrandDetails = useSelector(getCmsConfigBrandDetails);

  const currencyCode = useSelector(getAuthCurrencyCode);

  const getBetslipData = useMemo(makeGetBetslipData, []);
  const betslipData = useSelector((state) => getBetslipData(state, location.pathname));

  const getSubmitInProgress = useMemo(makeGetBetslipSubmitInProgress, []);
  const submitInProgress = useSelector((state) => getSubmitInProgress(state, location.pathname));

  const getBetslipSubmitError = useMemo(makeGetBetslipSubmitError, []);
  const submitError = useSelector((state) => getBetslipSubmitError(state, location.pathname));

  const getBetslipSubmitConfirmation = useMemo(makeGetBetslipSubmitConfirmation, []);
  const submitConfirmation = useSelector((state) => getBetslipSubmitConfirmation(state, location.pathname));

  const savedBetslipReference = useSelector((state) => state.betslip.savedBetslipReference);

  const dirtyPotentialWin = useSelector((state) => state.betslip.dirtyPotentialWin);
  const balance = useSelector(getBalance);

  const allOutcomesValid = betslipData.model.outcomes.findIndex((outcome) => !outcome.valid) === -1;
  const [stakeChangeState, setStakeChangeState] = useState({}); // maintain a dirty state for stake changes (as opposed of sending it straight down to redux), else the betslip randomly refreshes

  // Refresh betslips
  const dispatch = useDispatch();
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (betslipData.model.outcomes.length > 0 && !stakeChangeState.typeId) {
        // do not refresh while the user is tinkering with the stakes
        onRefreshBetslipHandler(dispatch, location.pathname, true);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, betslipData.model.outcomes.length, stakeChangeState.typeId]);

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

    setUserMadeAStakeAction(true);
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
    setUserMadeAStakeAction(true);
  };

  const onClearStakes = () => {
    onClearAllStakesHandler(dispatch, location.pathname);
  };

  const [requestBetSubmission, setRequestBetSubmission] = useState(false);
  const onRequestBetAcceptance = (e) => {
    e.preventDefault();
    setRequestBetSubmission(true);
  };

  const onRejectBetSubmission = () => {
    setRequestBetSubmission(false);
  };

  const onAcceptBetSubmission = () => {
    if (cmsConfigBrandDetails.data?.singleWalletMode) {
      onSubmitSingleWalletBetslip(dispatch, location.pathname);
    } else {
      onSubmitBetslip(dispatch, location.pathname);
    }
    setRequestBetSubmission(false);
  };

  const getStake = () => {
    if (betslipData.model.outcomes.length === 0) {
      return 0;
    }
    if (betslipData.model.outcomes.length === 1) {
      return getSingleStake(betslipData, betslipData.model.outcomes[0].outcomeId);
    } // > 1

    return getMultipleStake(betslipData, betslipData.model.outcomes.length); // typeID == number of selections...
  };

  const stake = getStake();

  const getTotalOdds = () => {
    if (
      // if custom bet...
      betslipData.model.outcomes.length > 1 &&
      betslipData.betData.multiples.find((x) => x.typeId === betslipData.model.outcomes.length)?.customBet
    ) {
      return betslipData.betData.multiples.find((x) => x.typeId === betslipData.model.outcomes.length).price.toFixed(3);
    }

    let totalOdds = betslipData.model.outcomes.length > 0 ? 1 : 0;
    betslipData.model.outcomes.forEach((outcome) => (totalOdds *= outcome.price));

    return totalOdds.toFixed(2);
  };

  const sanitiseError = (submitError) => {
    if (submitError.includes("The maximum stake for the currently selected bet is")) {
      const amount = Number(submitError.split(" ")[submitError.split(" ").length - 1]).toLocaleString();

      return t("city.potential_win_error", { amount });
    }

    return submitError;
  };

  const totalOdds = getTotalOdds();
  const globalPotentialWin = getGlobalPotentialWin(betslipData);

  const insufficientBalance = loggedIn && balance?.availableBalance ? stake > balance.availableBalance : false;
  const invalidCustomBet =
    allOutcomesValid &&
    betslipData.model.outcomes.length > 1 &&
    isNotEmpty(betslipData.betData.singles) &&
    betslipData.betData.multiples.findIndex((x) => x.typeId === betslipData.model.outcomes.length) === -1;

  // gaTrackBet(currencyCode, stake, savedBetslipReference || Date.now().toString(), betslipData.model.outcomes);

  return (
    <div className={`${classes["betslip"]} ${classes["active"]}`}>
      {requestBetSubmission ? (
        <div className={`${classes["betslip__popup"]} ${classes["active"]}`}>
          <div className={classes["betslip__popup-body"]}>
            <div className={classes["betslip__popup-container"]}>
              <div className={classes["betslip__popup-content"]}>
                <p className={classes["betslip__popup-text"]}>{t("confirm_bet_1")}</p>
                <div className={classes["betslip__popup-buttons"]}>
                  <button
                    className={`${classes["betslip__popup-button"]} ${classes["betslip__popup-button_confirm"]}`}
                    onClick={onAcceptBetSubmission}
                  >
                    {t("confirm")}
                  </button>
                  <button
                    className={`${classes["betslip__popup-button"]} ${classes["betslip__popup-button_cancel"]}`}
                    onClick={onRejectBetSubmission}
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {submitInProgress ? (
        <div className={`${classes["betslip__popup"]} ${classes["active"]}`}>
          <div className={classes["betslip__popup-body"]}>
            <div className={classes["betslip__popup-container"]}>
              <div className={classes["betslip__popup-content"]}>
                <p className={classes["betslip__popup-text"]}>{t("bet_in_progress_header_1")}</p>
                <Spinner className={classes.loader} />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {submitConfirmation ? (
        <div className={`${classes["betslip__popup"]} ${classes["active"]}`}>
          <div className={classes["betslip__popup-body"]}>
            <div className={classes["betslip__popup-container"]}>
              <div className={classes["betslip__popup-content"]}>
                <p className={classes["betslip__popup-text"]}>{t("alert-success-bet-submitted")}</p>
                <div className={classes["betslip__popup-buttons"]}>
                  <button
                    className={`${classes["betslip__popup-button"]} ${classes["betslip__popup-button_cancel"]}`}
                    type="button"
                    onClick={() => {
                      acknowledgeSubmission(dispatch, location.pathname, true);
                      setUserMadeAStakeAction(false);
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
      ) : null}

      {submitError ? (
        <div className={`${classes["betslip__popup"]} ${classes["active"]}`}>
          <div className={classes["betslip__popup-body"]}>
            <div className={classes["betslip__popup-container"]}>
              <div className={classes["betslip__popup-content"]} style={{ whiteSpace: "pre-wrap" }}>
                {sanitiseError(submitError)
                  .split("__RT__")
                  .map((x, index) => (
                    <p className={classes["betslip__popup-text"]} key={index}>
                      {x}
                    </p>
                  ))}
                <p className={classes["betslip__popup-text"]}>{}</p>
                <div className={classes["betslip__popup-buttons"]}>
                  <button
                    className={`${classes["betslip__popup-button"]} ${classes["betslip__popup-button_cancel"]}`}
                    onClick={() => acknowledgeErrors(dispatch, location.pathname)}
                  >
                    {t("ok")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className={classes["betslip__body"]}>
        <div className={classes["betslip__items"]} style={{ maxHeight: betslipMaxHeight - 316, overflowY: "auto" }}>
          {betslipData &&
            betslipData.model.outcomes.map((outcome, index) => {
              if (!outcome.outcomeDescription) return null;

              return (
                <div
                  className={`${classes["betslip__item"]} ${!outcome.valid ? classes["betslip__item_closed"] : ""}`}
                  key={outcome.outcomeId}
                >
                  <div className={classes["betslip__row"]}>
                    <p className={`${classes["betslip__text"]} ${classes["betslip__text_bold"]}`}>
                      {outcome.outcomeDescription}
                    </p>
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
                      {`${outcome.marketDescription}-${outcome.periodDescription}`}
                    </p>
                    {outcome.priceDir ? (
                      <AnimateKeyframes play duration="0.5" iterationCount="4" keyframes={["opacity: 0", "opacity: 1"]}>
                        <span
                          className={`${classes["betslip__coeficient"]} ${
                            outcome.priceDir && outcome.priceDir === "u" ? classes["betslip__coeficient_green"] : ""
                          }  ${outcome.priceDir && outcome.priceDir === "d" ? classes["betslip__coeficient_red"] : ""}`}
                        >
                          {outcome.formattedPrice}
                        </span>
                      </AnimateKeyframes>
                    ) : (
                      <span className={`${classes["betslip__coeficient"]}`}>{outcome.formattedPrice}</span>
                    )}
                  </div>
                  {!outcome.valid ? (
                    <>
                      <div
                        className={classes["betslip__closed-button"]}
                        style={{ pointerEvents: "auto" }}
                        onClick={() => onRemoveSelectionHandler(dispatch, location.pathname, outcome.outcomeId, true)}
                      >
                        {t("line_closed")}
                      </div>
                      <div
                        className={classes["betslip__closed-wrapper"]}
                        style={{ pointerEvents: "auto" }}
                        onClick={() => onRemoveSelectionHandler(dispatch, location.pathname, outcome.outcomeId, true)}
                      />
                    </>
                  ) : null}
                </div>
              );
            })}
        </div>

        {betslipData.model.outcomes.length === 0 && userMadeAStakeAction ? (
          <div className={classes["betslip__message"]}>
            <span>{t("city.please_add_selection")}</span>
            <div>
              <ExclamationMarkSvg />
            </div>
          </div>
        ) : null}

        {insufficientBalance ? (
          <div className={classes["betslip__message"]}>
            <span>{t("city.insufficient_balance")}</span>
            <div>
              <ExclamationMarkSvg />
            </div>
          </div>
        ) : null}

        {invalidCustomBet ? (
          <div className={classes["betslip__message"]}>
            <span>{t("city.invalid_combination_of_selections")}</span>
            <div>
              <ExclamationMarkSvg />
            </div>
          </div>
        ) : null}

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
            <span>{t("odds")}</span>
            <span>{!dirtyPotentialWin ? totalOdds : ""}</span>
          </div>
          <div className={classes["betslip__result"]}>
            <span>{t("total_betting")}</span>
            <span>
              {!dirtyPotentialWin
                ? `₩ ${getGlobalTotalStake(betslipData).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}`
                : ""}
            </span>
          </div>
          <div className={classes["betslip__result"]}>
            <span>{t("total_return")}</span>
            <span>
              {!dirtyPotentialWin
                ? `₩ ${globalPotentialWin.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}`
                : ""}
            </span>
          </div>
        </div>
      </div>
      <button
        className={`${classes["betslip__button"]} ${
          !isDisabled(loggedIn, allOutcomesValid, submitInProgress, betslipData, stake, insufficientBalance)
            ? classes["active"]
            : ""
        }`}
        disabled={isDisabled(loggedIn, allOutcomesValid, submitInProgress, betslipData, stake, insufficientBalance)}
        onClick={onRequestBetAcceptance}
      >
        {submitInProgress ? `${t("sending")}...` : t("betting")}
      </button>
    </div>
  );
};

const propTypes = {};

const defaultProps = {};

Betslip.propTypes = propTypes;
Betslip.defaultProps = defaultProps;

export default Betslip;
