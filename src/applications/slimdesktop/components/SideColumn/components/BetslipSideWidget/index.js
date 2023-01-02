import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import * as PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { getBalance } from "../../../../../../redux/reselect/balance-selector";
import {
  makeGetBetslipData,
  makeGetBetslipSubmitConfirmation,
  makeGetBetslipSubmitError,
  makeGetBetslipSubmitInProgress,
} from "../../../../../../redux/reselect/betslip-selector";
import {
  getCmsConfigBettingMultipleStakeLimits,
  getCmsConfigBettingSingleStakeLimits,
  getCmsConfigBettingSpecialStakeLimits,
  getCmsConfigBrandDetails,
  getCmsConfigIframeMode,
} from "../../../../../../redux/reselect/cms-selector";
import { getActiveBetCount } from "../../../../../../redux/slices/cashoutSlice";
import {
  acknowledgeErrors,
  acknowledgeSubmission,
  getGlobalTotalStake,
  obtainGlobalMaxStake,
  onClearAllStakesHandler,
  onClearBetslipHandler,
  onGlobalStakeChangeHandler,
  onRefreshBetslipHandler,
  onRemoveSelectionHandler,
  onSubmitBetslip,
  onSubmitSingleWalletBetslip,
} from "../../../../../../utils/betslip-utils";
import classes from "../../../../scss/slimdesktop.module.scss";
import { UsernameContext } from "../../../../SlimDesktopApp";

const getButtonAmount = (t, amount) => {
  if (amount >= 1000 && amount < 1000000) {
    return t("betslip_panel.formatted_thousands_amount", { value: amount / 1000 });
  }

  if (amount >= 1000000) {
    return t("betslip_panel.formatted_millions_amount", { value: amount / 1000000 });
  }

  return amount;
};

const BetslipSideWidget = ({ widgetData }) => {
  const [minMaxLimitBreached, setMinMaxLimitBreached] = useState(false);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();

  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  const usernameInput = React.useContext(UsernameContext);

  const [isOpen, setIsOpen] = useState(true);

  const balance = useSelector(getBalance);

  const getBetslipData = useMemo(makeGetBetslipData, []);
  const betslipData = useSelector((state) => getBetslipData(state, location.pathname));

  const getSubmitInProgress = useMemo(makeGetBetslipSubmitInProgress, []);
  const submitInProgress = useSelector((state) => getSubmitInProgress(state, location.pathname));

  const getBetslipSubmitError = useMemo(makeGetBetslipSubmitError, []);
  const submitError = useSelector((state) => getBetslipSubmitError(state, location.pathname));

  const getBetslipSubmitConfirmation = useMemo(makeGetBetslipSubmitConfirmation, []);
  const submitConfirmation = useSelector((state) => getBetslipSubmitConfirmation(state, location.pathname));

  const activeBetCount = useSelector((state) => state.cashout.activeBetCount);
  const dirtyPotentialWin = useSelector((state) => state.betslip.dirtyPotentialWin);
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const currencyCode = useSelector((state) => state.auth.currencyCode);
  const cmsConfigBrandDetails = useSelector(getCmsConfigBrandDetails);

  const hasOutcomes = betslipData.model.outcomes.length > 0;
  const allOutcomesValid =
    betslipData.model.outcomes
      .filter((outcome) => outcome.outcomeDescription)
      .findIndex((outcome) => !outcome.valid) === -1;
  const [stakeChangeState, setStakeChangeState] = useState({}); // maintain a dirty state for stake changes (as opposed of sending it straight down to redux), else the betslip randomly refreshes

  const singleStakeLimits = useSelector(getCmsConfigBettingSingleStakeLimits);
  const multipleStakeLimits = useSelector(getCmsConfigBettingMultipleStakeLimits);
  const specialStakeLimits = useSelector(getCmsConfigBettingSpecialStakeLimits);

  // When loading the page for the first time, or logging in, find out the pending bets...
  useEffect(() => {
    if (loggedIn) {
      dispatch(getActiveBetCount());
    }
  }, [loggedIn]);

  // Refresh betslips
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (betslipData.model.outcomes.length > 0 && !stakeChangeState.typeId) {
        // do not refresh while the user is tinkering with the stakes
        onRefreshBetslipHandler(dispatch, location.pathname);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, betslipData.model.outcomes.length, stakeChangeState.typeId]);

  const onStakeChange = (e, typeId, index) => {
    e.preventDefault();

    if (Number.isNaN(e.target.value)) {
      return;
    }

    // Track changes, but only submit when the onblur condition is over
    setStakeChangeState({ index, typeId, value: e.target.value });
  };

  const onStakeChangeConfirmation = () => {
    if (Object.keys(stakeChangeState).length > 0) {
      onGlobalStakeChangeHandler(dispatch, location.pathname, betslipData, stakeChangeState.value);

      if (betslipData.model.outcomes.length > 0) {
        onRefreshBetslipHandler(dispatch, location.pathname);
      }

      setStakeChangeState({}); // clear the dirty state for stake changes
    }
  };

  const stakeChangeConfirmedHandler = (e) => {
    e.preventDefault();

    onStakeChangeConfirmation();
  };

  const onLoginHandler = () => {
    if (isApplicationEmbedded) {
      window.parent.postMessage(
        {
          action: "app.iframe_effects",
          code: "LOGIN",
        },
        "*",
      );
    } else {
      usernameInput.current.focus();
    }
  };

  // A bit after a change in stake happens, do apply the change (do not wait for a blur event on desktop)
  useEffect(() => {
    const timeOutId = setTimeout(() => onStakeChangeConfirmation(), 250);

    return () => clearTimeout(timeOutId);
  }, [stakeChangeState]);

  const onAddFixedAmountStakeHandler = (value) => {
    if (betslipData.model.outcomes.length > 0) {
      onGlobalStakeChangeHandler(dispatch, location.pathname, betslipData, getGlobalTotalStake(betslipData) + value);

      onRefreshBetslipHandler(dispatch, location.pathname);
    }
  };

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
    betslipData.betData.multiples.forEach((m) => {
      if (m.typeId !== betslipData.model.outcomes.length) {
        if (
          m.stake > 0 &&
          (m.stake < specialStakeLimits[currencyCode].min || m.stake > specialStakeLimits[currencyCode].max)
        ) {
          limitBreach = true;
        }
      }
    });

    setMinMaxLimitBreached(limitBreach);

    return undefined;
  }, [betslipData, setMinMaxLimitBreached]);

  const onClearStakes = () => {
    onClearAllStakesHandler(dispatch, location.pathname);
  };
  const onAcceptBetSubmission = () => {
    if (loggedIn) {
      if (cmsConfigBrandDetails.data?.singleWalletMode) {
        onSubmitSingleWalletBetslip(dispatch, location.pathname);
      } else {
        onSubmitBetslip(dispatch, location.pathname);
      }
    }
  };

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
    betslipData.model.outcomes
      .filter((x) => x.price)
      .forEach((outcome) => {
        totalOdds *= outcome.price;
      });

    return totalOdds.toFixed(2);
  };

  const totalOdds = getTotalOdds();

  const currentStake = stakeChangeState.typeId ? stakeChangeState.value : getGlobalTotalStake(betslipData);

  const betPlacementEnabled =
    // loggedIn &&
    hasOutcomes &&
    allOutcomesValid &&
    getGlobalTotalStake(betslipData) > 0 &&
    getGlobalTotalStake(betslipData) <= balance?.availableBalance &&
    !minMaxLimitBreached &&
    betslipData?.model?.outcomes?.length <= parseInt(widgetData?.maxSelections, 10) &&
    !submitInProgress;

  return (
    <div className={classes["sidebar__box"]}>
      <div className={cx(classes["box-title"], { [classes["active"]]: !isOpen })}>
        {t("betslip")}
        <span className={cx(classes["box-title__label"], classes["box-title__label-left"])}>
          {betslipData.model.outcomes.length}
        </span>
        {/* <div className={classes["switch"]}> */}
        {/*  <input className={classes["switch__inp"]} id="switch1" name="switch1" type="checkbox" /> */}
        {/*  <label className={classes["switch__label"]} data-off="off" data-on="on" htmlFor="switch1" /> */}
        {/* </div> */}
        <div
          className={cx(classes["box-title__arrow"], classes["js-dropdown"])}
          onClick={() => setIsOpen((prevState) => !prevState)}
        >
          <FontAwesomeIcon icon={faChevronUp} />
        </div>
      </div>
      <div
        className={cx(classes["betslip"], classes["js-dropdown-box"])}
        style={{ display: isOpen ? "block" : "none" }}
      >
        <div className={cx(classes["betslip__list"])}>
          {betslipData.model.outcomes.length > 0 &&
            betslipData.model.outcomes.map((outcome, index) => {
              if (outcome.outcomeDescription) {
                return (
                  <div className={classes["betslip-card"]}>
                    <div className={classes["betslip-card__top"]}>
                      <span
                        className={cx(
                          classes["qicon-times-circle"],
                          classes["betslip-card__close"],
                          classes["js-betslip-card-remove"],
                        )}
                        onClick={() => onRemoveSelectionHandler(dispatch, location.pathname, outcome.outcomeId, false)}
                      />
                      <span className={classes["betslip-card__title"]}>{outcome.outcomeDescription}</span>
                      <span className={classes["betslip-card__label"]}>{outcome.formattedPrice}</span>
                    </div>
                    <div className={classes["betslip-card__content"]}>
                      <div>{outcome.eventDescription}</div>
                      <div>{`${outcome.marketDescription} - ${outcome.periodDescription}`}</div>
                    </div>
                  </div>
                );
              }

              return null;
            })}
          {betslipData.model.outcomes.length === 0 && (
            <div className={classes["betslip__empty"]}>
              <div className={classes["betslip__empty-title"]}>{t("vanilladesktop.empty_betslip")}</div>
              <div className={classes["betslip__empty-text"]}>{t("vanilladesktop.select_bets")}</div>
            </div>
          )}
        </div>
        {betslipData.model.outcomes.length > 0 && (
          <>
            <div className={classes["betslip__stake-btns"]}>
              <div
                className={cx(classes["betslip__btn"], classes["betslip__btn-half"])}
                onClick={() => onClearBetslipHandler(dispatch, location.pathname)}
              >
                {t("betslip_panel.remove_all").toUpperCase()}
              </div>
              {loggedIn && widgetData?.maxStake && (
                <div
                  className={cx(classes["betslip__btn"], classes["betslip__btn-half"])}
                  onClick={() => obtainGlobalMaxStake(dispatch, betslipData, 1)}
                >
                  {t("betslip_panel.max_stake").toUpperCase()}
                </div>
              )}
            </div>
            <div className={classes["betslip__box"]}>
              {loggedIn && balance && (
                <div className={cx(classes["betslip__row"], classes["betslip__row-between"])}>
                  <b>{t("betslip_panel.balance")}</b>
                  <span className={classes["betslip__colored"]}>
                    <b>{`${currencyCode} ${balance.availableBalance.toLocaleString()}`}</b>
                  </span>
                </div>
              )}
              <div className={cx(classes["betslip__row"], classes["betslip__row-between"])}>
                <b>{t("betslip_panel.total_odds")}</b>
                <span className={classes["betslip__colored"]}>
                  <b>{totalOdds}</b>
                </span>
              </div>
            </div>
            <div className={classes["betslip__box"]}>
              <div className={cx(classes["betslip__row"], classes["betslip__row-between"])}>
                <label htmlFor="bet">{t("betslip_panel.stake")}</label>
                <input
                  className={classes["betslip__inp"]}
                  id="bet"
                  name="bet"
                  placeholder="0"
                  type="number"
                  value={currentStake > 0 ? currentStake : ""}
                  onBlur={onStakeChangeConfirmation}
                  onChange={(e) => onStakeChange(e, 1, 0)}
                />
              </div>
              {widgetData?.moneyButtons && widgetData.moneyButtons[currencyCode] && (
                <div className={cx(classes["betslip__buttons"])}>
                  {widgetData.moneyButtons[currencyCode].map((amount) => {
                    const value = Number(amount);

                    return (
                      <div
                        className={classes["betslip__bet"]}
                        key={amount}
                        onClick={() => onAddFixedAmountStakeHandler(value)}
                      >
                        {getButtonAmount(t, value)}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className={classes["betslip__box"]}>
              <div className={cx(classes["betslip__row"], classes["betslip__row-between"])}>
                <b>{t("betslip_panel.potential_returns")}</b>
                <span className={classes["betslip__colored"]}>
                  <b>{`${currencyCode} ${potentialWin || 0}`}</b>
                </span>
              </div>
              <div className={classes["betslip__row"]}>
                <div
                  className={cx(
                    classes["betslip__btn"],
                    classes["betslip-popup-activator"],
                    classes["betslip__btn-full"],
                  )}
                  style={{
                    opacity: !loggedIn || betPlacementEnabled ? 1 : 0.5,
                    pointerEvents: !loggedIn || betPlacementEnabled ? "auto" : "none",
                  }}
                  onClick={() => (loggedIn ? onAcceptBetSubmission() : onLoginHandler())}
                >
                  {submitInProgress ? (
                    <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} />
                  ) : (
                    t(loggedIn ? "betslip_panel.place_bet" : "login")
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        <div
          className={cx(classes["betslip-popup"], classes["betslip-popup_success"], {
            [classes["open"]]: submitConfirmation,
          })}
        >
          <div className={classes["betslip-popup__body"]}>
            <div className={classes["betslip-popup__content"]}>
              <div className={classes["betslip-popup__header"]}>
                <h5 className={classes["betslip-popup__title"]}>{t("success")}</h5>
              </div>
              <div className={classes["betslip-popup__message"]}>
                <div className={classes["betslip-popup__transaction"]}>
                  <svg height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8-1.41-1.42z" />
                  </svg>

                  <span>{t("betslip_panel.transaction_completed")}</span>
                </div>
                <div className={classes["betslip-popup__text"]}>{t("betslip_panel.bet_successfully_placed")}</div>
                <div
                  className={classes["betslip-popup__buttons"]}
                  onClick={() => acknowledgeSubmission(dispatch, location.pathname, true)}
                >
                  <div className={cx(classes["betslip-popup__button"], classes["betslip-popup-closer"])}>{t("ok")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={cx(classes["betslip-popup"], classes["betslip-popup_error"], {
            [classes["open"]]: !!submitError,
          })}
        >
          <div className={classes["betslip-popup__body"]}>
            <div className={classes["betslip-popup__content"]}>
              <div className={classes["betslip-popup__header"]}>
                <h5 className={classes["betslip-popup__title"]}>{t("bet_error_header_1")}</h5>
              </div>
              <div className={classes["betslip-popup__message"]}>
                <div className={classes["betslip-popup__transaction"]}>
                  <svg height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8-1.41-1.42z" />
                  </svg>

                  <span>{t("betslip_panel.unable_place_bet")}</span>
                </div>
                <div className={classes["betslip-popup__text"]}>{submitError}</div>
                <div
                  className={classes["betslip-popup__buttons"]}
                  onClick={() => acknowledgeErrors(dispatch, location.pathname, true)}
                >
                  <div className={cx(classes["betslip-popup__button"], classes["betslip-popup-closer"])}>{t("ok")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BetslipSideWidget.propTypes = {
  widgetData: PropTypes.object.isRequired,
};

export default React.memo(BetslipSideWidget);
