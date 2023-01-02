import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faExclamationCircle, faGift, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import getSymbolFromCurrency from "currency-symbol-map";
import PropTypes from "prop-types";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";

import { useOnClickOutside } from "../../../../../../../hooks/utils-hooks";
import {
  makeGetBetslipData,
  makeGetBetslipSubmitConfirmation,
  makeGetBetslipSubmitError,
  makeGetBetslipSubmitInProgress,
} from "../../../../../../../redux/reselect/betslip-selector";
import {
  getCmsConfigBettingMultipleStakeLimits,
  getCmsConfigBettingSingleStakeLimits,
  getCmsConfigBettingSpecialStakeLimits,
  getCmsConfigBrandDetails,
  getCmsConfigIframeMode,
} from "../../../../../../../redux/reselect/cms-selector";
import {
  acknowledgeErrors,
  acknowledgeSubmission,
  getGlobalPotentialWin,
  getGlobalTotalCashStake,
  getGlobalTotalFreeBetStake,
  getGlobalTotalPromoSnrStake,
  getGlobalTotalPromoStake,
  getGlobalTotalStake,
  onClearAllStakesHandler,
  onClearBetslipHandler,
  onGlobalStakeChangeHandler,
  onRefreshBetslipHandler,
  onSpecificStakeChangeHandler,
  onSubmitBetslip,
  onSubmitSingleWalletBetslip,
} from "../../../../../../../utils/betslip-utils";
import classes from "../../../../../scss/vanillamobilestyle.module.scss";
import SectionLoader from "../../../SectionLoader";

import BetslipMultiTabContent from "./BetslipMultiTabContent/BetslipMultiTabContent";
import BetslipConfirmationPopUp from "./BetslipPopUp/BetslipConfirmationPopUp/BetslipConfirmationPopUp";
import BetslipErrorPopUp from "./BetslipPopUp/BetslipErrorPopUp/BetslipErrorPopUp";
import BetslipSingleTabContent from "./BetslipSingleTabContent/BetslipSingleTabContent";
import BetslipSpecialTabContent from "./BetslipSpecialTabContent/BetslipSpecialTabContent";

import { getCmsLayoutMobileVanillaBetslipWidget } from "redux/reselect/cms-layout-widgets";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { getAuthIsIframe, getAuthLoginURL } from "../../../../../../../redux/reselect/auth-selector";

const propTypes = {
  setShowMyAccount: PropTypes.func.isRequired,
  showBetslipTab: PropTypes.bool.isRequired,
};

const Betslip = ({ setShowMyAccount, showBetslipTab }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();

  const isSlaveApplication = useSelector(getCmsConfigIframeMode); // whether the application is configured to be a slave application in the CMS (typically an iframe)
  const isInIframe = useSelector(getAuthIsIframe); // whether the application is actually in an iframe
  const authLoginURL = useSelector(getAuthLoginURL);

  const getBetslipData = useMemo(makeGetBetslipData, []);
  const betslipData = useSelector((state) => getBetslipData(state, location.pathname));

  const getSubmitInProgress = useMemo(makeGetBetslipSubmitInProgress, []);
  const submitInProgress = useSelector((state) => getSubmitInProgress(state, location.pathname));

  const getBetslipSubmitError = useMemo(makeGetBetslipSubmitError, []);
  const submitError = useSelector((state) => getBetslipSubmitError(state, location.pathname));

  const getBetslipSubmitConfirmation = useMemo(makeGetBetslipSubmitConfirmation, []);
  const submitConfirmation = useSelector((state) => getBetslipSubmitConfirmation(state, location.pathname));

  const dirtyPotentialWin = useSelector((state) => state.betslip.dirtyPotentialWin);
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const currencyCode = useSelector((state) => state.auth.currencyCode);

  const hasOutcomes = betslipData.model.outcomes.length > 0;
  const allOutcomesValid = betslipData.model.outcomes.findIndex((outcome) => !outcome.valid) === -1;
  const [stakeChangeState, setStakeChangeState] = useState({}); // maintain a dirty state for stake changes (as opposed of sending it straight down to redux), else the betslip randomly refreshes

  const singleStakeLimits = useSelector(getCmsConfigBettingSingleStakeLimits);
  const multipleStakeLimits = useSelector(getCmsConfigBettingMultipleStakeLimits);
  const specialStakeLimits = useSelector(getCmsConfigBettingSpecialStakeLimits);

  const betslipWidget = useSelector((state) => getCmsLayoutMobileVanillaBetslipWidget(state, location));
  const betslipModeStandard = betslipWidget?.data?.betslipMode === "REGULAR";

  const cmsConfigBrandDetails = useSelector(getCmsConfigBrandDetails);

  // Refresh betslips
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (betslipData.model.outcomes.length > 0 && !stakeChangeState.typeId) {
        // do not refresh while the user is tinkering with the stakes
        onRefreshBetslipHandler(dispatch, location.pathname);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, betslipData.model.outcomes.length, stakeChangeState.typeId, location.pathname]);

  const stakeChangeHandler = (e, typeId, index) => {
    e.preventDefault();

    if (Number.isNaN(e.target.value)) {
      return;
    }

    // Track changes, but only submit when the onblur condition is over
    setStakeChangeState({ index, typeId, value: Math.floor(e.target.value).toString() });
  };

  const stakeChangeConfirmedHandler = (e) => {
    e.preventDefault();

    if (betslipModeStandard) {
      onSpecificStakeChangeHandler(
        dispatch,
        location.pathname,
        betslipData,
        stakeChangeState.value,
        stakeChangeState.typeId,
        stakeChangeState.index,
      );
    } else {
      // even if we are on compact mode, if there are multiple singles, do allow individual stakes.
      if (tabState.singleTabActive && betslipData.model.outcomes.length > 1) {
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
    }

    if (betslipData.model.outcomes.length > 0) {
      onRefreshBetslipHandler(dispatch, location.pathname);
    }

    setStakeChangeState({}); // clear the dirty state for stake changes
  };

  const onAddFixedAmountStakeHandler = (value) => {
    if (betslipData.model.outcomes.length > 0) {
      if (betslipModeStandard) {
        if (tabState.singleTabActive) {
          // set the stake change in all buttons
          betslipData.betData.singles.forEach((s, index) => {
            onSpecificStakeChangeHandler(dispatch, location.pathname, betslipData, s.stake + value, 1, index);
          });
        } else if (tabState.multipleTabActive) {
          // set the stake change in all buttons
          betslipData.betData.multiples.forEach((m, index) => {
            if (m.typeId === betslipData.model.outcomes.length) {
              onSpecificStakeChangeHandler(
                dispatch,
                location.pathname,
                betslipData,
                m.unitStake + value,
                m.typeId,
                index,
              );
            }
          });
        } else if (tabState.specialsTabActive) {
          betslipData.betData.multiples.forEach((m, index) => {
            if (m.typeId !== betslipData.model.outcomes.length) {
              onSpecificStakeChangeHandler(
                dispatch,
                location.pathname,
                betslipData,
                m.unitStake + value,
                m.typeId,
                index,
              );
            }
          });
        }
        onSpecificStakeChangeHandler(
          dispatch,
          location.pathname,
          betslipData,
          stakeChangeState.value,
          stakeChangeState.typeId,
          stakeChangeState.index,
        );
      } else {
        onGlobalStakeChangeHandler(dispatch, location.pathname, betslipData, getGlobalTotalStake(betslipData) + value);
      }

      onRefreshBetslipHandler(dispatch, location.pathname);
    }
  };

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

  //
  // const stakeButtonHandler = (value) => {
  //     if(betslipData.model.outcomes.length > 0) {
  //         if (betslipData.model.outcomes.length === 1) {
  //             value = value + betslipData.betData.singles[0].stake;
  //         } else {
  //             const betTypeId = betslipData.model.outcomes.length;
  //             const multiple = betslipData.betData.multiples.find(bet => { //make sure to reset singles
  //                 return bet.typeId === betTypeId;
  //             })
  //             value = value + multiple.stake;
  //         }
  //
  //         onUpdateGlobalStakeHandler(value);
  //
  //         onRefreshBetslipHandler(dispatch, location.pathname);
  //     }
  // }
  //
  // const getGlobalStake = () => {//Use for Global stake CMS scenario only...
  //     let stake = 0;
  //     if(betslipData.model.outcomes.length === 1) {
  //         if(betslipData.betData.singles.length === 1) {
  //             stake = betslipData.betData.singles[0].stake;
  //         }
  //     } else {
  //         if(betslipData.betData.multiples.length > 0 ) {
  //             const typeId = betslipData.model.outcomes.length;
  //             const multiple = betslipData.betData.multiples.find(multiple => multiple.typeId === typeId);
  //             if(multiple)
  //                 stake = multiple.stake;
  //         }
  //     }
  //     return stake;
  // }

  const onClearStakes = () => {
    onClearAllStakesHandler(dispatch, location.pathname);
  };

  const [tabState, setTabState] = useState({
    multipleTabActive: false,
    showMultipleTab: false,
    showSingleTab: false,
    showSpecialsTab: false,
    singleTabActive: false,
    specialsTabActive: false,
  });

  useEffect(() => {
    const modifiedTabState = { ...tabState };

    modifiedTabState.showSingleTab =
      (betslipModeStandard && betslipData.betData.singles.length > 0) ||
      (!betslipModeStandard &&
        (betslipData.model.outcomes.length === 1 ||
          (betslipData.betData.singles.length > 1 &&
            betslipData.betData.multiples.findIndex((m) => m.numSubBets === 1) === -1)));

    modifiedTabState.showMultipleTab =
      betslipData.betData.multiples.findIndex((m) => m.numSubBets === 1) > -1 &&
      betslipData?.model?.outcomes?.length <= parseInt(betslipWidget?.data?.maxSelections, 10);

    modifiedTabState.showSpecialsTab =
      betslipModeStandard &&
      betslipData.betData.multiples.findIndex((m) => m.numSubBets > 1) > -1 &&
      betslipData?.model?.outcomes?.length <= parseInt(betslipWidget?.data?.maxSelections, 10);

    // user had selected a tab - but this is no longer available... push him back to the next best candidate...
    if (
      (!modifiedTabState.showSpecialsTab && modifiedTabState.specialsTabActive) ||
      (!modifiedTabState.showMultipleTab && modifiedTabState.multipleTabActive) ||
      (!modifiedTabState.showSingleTab && modifiedTabState.singleTabActive)
    ) {
      modifiedTabState.singleTabActive = false;
      modifiedTabState.multipleTabActive = false;
      modifiedTabState.specialsTabActive = false;

      if (modifiedTabState.showMultipleTab) {
        modifiedTabState.multipleTabActive = true;
      } else if (modifiedTabState.showSingleTab) {
        modifiedTabState.singleTabActive = true;
      }
    }

    // If nothing selected - offer the best candidate...
    if (
      !modifiedTabState.singleTabActive &&
      !modifiedTabState.multipleTabActive &&
      !modifiedTabState.specialsTabActive
    ) {
      if (modifiedTabState.showMultipleTab) {
        modifiedTabState.multipleTabActive = true;
      } else if (modifiedTabState.showSingleTab) {
        modifiedTabState.singleTabActive = true;
      }
    }

    setTabState(modifiedTabState);
  }, [betslipData.betData.singles.length, betslipData.betData.multiples.length]);

  const onSingleTabClickHandler = () => {
    if (tabState.showSingleTab && !tabState.singleTabActive) {
      // if enabled, and not already active...
      setTabState({ ...tabState, multipleTabActive: false, singleTabActive: true, specialsTabActive: false });
    }
  };
  const onMultipleTabClickHandler = () => {
    if (tabState.showMultipleTab && !tabState.multipleTabActive) {
      // if enabled, and not already active...
      setTabState({ ...tabState, multipleTabActive: true, singleTabActive: false, specialsTabActive: false });
    }
  };
  const onSpecialTabClickHandler = () => {
    if (tabState.showSpecialsTab && !tabState.specialsTabActive) {
      // if enabled, and not already active...
      setTabState({ ...tabState, multipleTabActive: false, singleTabActive: false, specialsTabActive: true });
    }
  };

  const onAcceptBetSubmission = () => {
    if (cmsConfigBrandDetails.data?.singleWalletMode) {
      onSubmitSingleWalletBetslip(dispatch, location.pathname);
    } else {
      onSubmitBetslip(dispatch, location.pathname);
    }
  };

  const [isBonusPanelOpen, setIsBonusPanelOpen] = useState(false);
  const bonusPanelRef = useRef();
  useOnClickOutside(bonusPanelRef, () => setIsBonusPanelOpen(false));

  const [isStakePanelOpen, setIsStakePanelOpen] = useState(false);
  const stakePanelRef = useRef();
  useOnClickOutside(stakePanelRef, () => setIsStakePanelOpen(false));

  const cashStake = getGlobalTotalCashStake(betslipData);
  const promoStake = getGlobalTotalPromoStake(betslipData);
  const promoSnrStake = getGlobalTotalPromoSnrStake(betslipData);
  const freeBetStake = getGlobalTotalFreeBetStake(betslipData);

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
      setShowMyAccount(true);
    }
  };

  return (
    <div className={`${classes["betslip"]} ${showBetslipTab ? classes["active"] : ""}`}>
      {betslipModeStandard ? (
        <nav className={classes["betslip__navigation"]}>
          <ul className={classes["betslip__list"]}>
            <li
              className={`${classes["betslip__li"]} ${tabState.singleTabActive ? classes["betslip__li_active"] : ""} ${
                !tabState.showSingleTab ? classes["betslip__li_disabled"] : ""
              }`}
              onClick={onSingleTabClickHandler}
            >
              <span>{t("betslip_panel.single")} </span>
            </li>
            <li
              className={`${classes["betslip__li"]} ${
                tabState.multipleTabActive ? classes["betslip__li_active"] : ""
              } ${!tabState.showMultipleTab ? classes["betslip__li_disabled"] : ""}`}
              onClick={onMultipleTabClickHandler}
            >
              <span>{t("betslip_panel.multi")}</span>
            </li>
            <li
              className={`${classes["betslip__li"]} ${
                tabState.specialsTabActive ? classes["betslip__li_active"] : ""
              } ${!tabState.showSpecialsTab ? classes["betslip__li_disabled"] : ""}`}
              onClick={onSpecialTabClickHandler}
            >
              <span>{t("betslip_panel.special")}</span>
            </li>
          </ul>
        </nav>
      ) : null}
      <div className={classes["betslip__body"]}>
        <div data-scroll-lock-scrollable className={classes["betslip__top"]}>
          {!allOutcomesValid && (
            <div className={classes["betslip__notification"]}>
              <div className={classes["betslip__notification-top"]}>
                <FontAwesomeIcon icon={faExclamationCircle} /> {t("betslip_panel.selection_unavailable")}
              </div>
              <div className={classes["betslip__notification-bottom"]}>
                {t("betslip_panel.please_remove_and_select")}
              </div>
            </div>
          )}

          {betslipData?.model?.outcomes?.length > parseInt(betslipWidget?.data?.maxSelections, 10) && (
            <div className={classes["betslip__notification"]}>
              <div className={classes["betslip__notification-top"]}>
                <FontAwesomeIcon icon={faExclamationCircle} />{" "}
                {t("betslip_panel.too_many_selections", { value: betslipWidget?.data?.maxSelections })}
              </div>
              <div className={classes["betslip__notification-bottom"]}>{t("betslip_panel.please_remove_some")}</div>
            </div>
          )}

          {submitInProgress && <SectionLoader overlay />}

          {tabState.singleTabActive ? (
            <BetslipSingleTabContent
              stakeChangeConfirmedHandler={stakeChangeConfirmedHandler}
              stakeChangeHandler={stakeChangeHandler}
              stakeChangeState={stakeChangeState}
            />
          ) : null}
          {tabState.multipleTabActive ? (
            <BetslipMultiTabContent
              stakeChangeConfirmedHandler={stakeChangeConfirmedHandler}
              stakeChangeHandler={stakeChangeHandler}
              stakeChangeState={stakeChangeState}
            />
          ) : null}
          {tabState.specialsTabActive ? (
            <BetslipSpecialTabContent
              stakeChangeConfirmedHandler={stakeChangeConfirmedHandler}
              stakeChangeHandler={stakeChangeHandler}
              stakeChangeState={stakeChangeState}
            />
          ) : null}
        </div>

        <div className={classes["betslip__bottom"]}>
          <span
            className={classes["betslip__remove"]}
            onClick={() => onClearBetslipHandler(dispatch, location.pathname)}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
            <span>{t("betslip_panel.remove_all")}</span>
          </span>
          <div className={classes["betslip__buttons"]}>
            <div className={classes["betslip__select"]}>
              <span>{t("betslip_panel.select_stake")}</span>
              <span className={classes["betslip__clear"]} onClick={onClearStakes}>
                {t("betslip_panel.clear")}
              </span>
            </div>
            <div className={classes["betslip__row"]}>
              {betslipWidget?.data?.moneyButtons &&
                betslipWidget.data.moneyButtons[currencyCode]?.map((amount) => (
                  <button
                    className={classes["betslip__button"]}
                    key={amount}
                    onClick={() => onAddFixedAmountStakeHandler(amount)}
                  >
                    {amount.toLocaleString()}
                  </button>
                ))}
            </div>
          </div>
          <div className={classes["betslip__summary"]}>
            <div className={classes["betslip__count"]}>
              {betslipData?.qualifyingRewards?.length > 0 && (
                <div className={classes["betslip__cashout"]}>
                  <div
                    className={cx(classes["betslip__cashout-button"], classes["dropdown"], {
                      [classes["active"]]: isBonusPanelOpen,
                    })}
                    onClick={() => setIsBonusPanelOpen((prevState) => !prevState)}
                  >
                    <span className={classes["betslip__cashout-icon"]}>
                      <FontAwesomeIcon icon={faGift} />
                    </span>
                    <div className={classes["betslip__cashout-text"]}>{t("eligible_for_promotions")}</div>
                  </div>
                  <ul
                    className={cx(classes["settings__sublist"], {
                      [classes["active"]]: isBonusPanelOpen,
                    })}
                  >
                    {betslipData?.qualifyingRewards?.map((reward, index) => (
                      <li className={classes["settings__subli"]} key={index}>
                        <div className={classes["settings__box"]}>
                          <div className={classes["settings__promo"]}>
                            {`${reward.description} - [${getSymbolFromCurrency(currencyCode)} ${reward.rewardAmount}]`}
                          </div>
                          <div className={classes["settings__money"]} style={{ whiteSpace: "pre-line" }}>
                            {reward.notes}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className={classes["betslip__box"]}>
                <div className={classes["betslip__money"]}>
                  <div className={classes["betslip__total"]}>
                    <span>{t("betslip_panel.total_stake")}</span>
                    <span>
                      {`${getSymbolFromCurrency(currencyCode)} ${getGlobalTotalStake(betslipData).toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        },
                      )}`}
                    </span>
                  </div>
                  <div className={classes["betslip__returns"]}>
                    <span>{t("betslip_panel.potential_returns")}</span>
                    <span>
                      {dirtyPotentialWin
                        ? ""
                        : `${getSymbolFromCurrency(currencyCode)} ${getGlobalPotentialWin(betslipData).toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            },
                          )}`}
                    </span>
                  </div>
                </div>
                {(promoStake > 0 || promoSnrStake > 0 || freeBetStake > 0) && (
                  <div className={classes["betslip__information"]} ref={stakePanelRef}>
                    <div
                      className={cx(classes["betslip__description"], classes["dropdown"], {
                        [classes["active"]]: isStakePanelOpen,
                      })}
                      onClick={() => setIsStakePanelOpen((prevState) => !prevState)}
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </div>
                    <ul
                      className={cx(classes["settings__sublist"], {
                        [classes["active"]]: isStakePanelOpen,
                      })}
                    >
                      <li className={classes["settings__subli"]}>
                        <div className={classes["settings__box"]}>
                          <div className={classes["settings__promo"]}>{t("balance.cash_balance")}</div>
                          <div className={classes["settings__money"]}>
                            {`${getSymbolFromCurrency(currencyCode)} ${cashStake.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            })}`}
                          </div>
                        </div>
                      </li>
                      {promoStake > 0 && (
                        <li className={classes["settings__subli"]}>
                          <div className={classes["settings__box"]}>
                            <div className={classes["settings__promo"]}>{t("balance.promo_balance")}</div>
                            <div className={classes["settings__money"]}>
                              {`${getSymbolFromCurrency(currencyCode)} ${promoStake.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })}`}
                            </div>
                          </div>
                        </li>
                      )}
                      {promoSnrStake > 0 && (
                        <li className={classes["settings__subli"]}>
                          <div className={classes["settings__box"]}>
                            <div className={classes["settings__promo"]}>{t("balance.promo_snr_balance")}</div>
                            <div className={classes["settings__money"]}>
                              {`${getSymbolFromCurrency(currencyCode)} ${promoSnrStake.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })}`}
                            </div>
                          </div>
                        </li>
                      )}
                      {freeBetStake > 0 && (
                        <li className={classes["settings__subli"]}>
                          <div className={classes["settings__box"]}>
                            <div className={classes["settings__promo"]}>{t("balance.free_bet_balance")}</div>
                            <div className={classes["settings__money"]}>
                              {`${getSymbolFromCurrency(currencyCode)} ${freeBetStake.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })}`}
                            </div>
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
              <div className={classes["betslip__confirm"]}>
                {loggedIn ? (
                  <button
                    disabled={
                      !allOutcomesValid ||
                      !hasOutcomes ||
                      getGlobalTotalStake(betslipData) <= 0 ||
                      minMaxLimitBreached ||
                      betslipData?.model?.outcomes?.length > parseInt(betslipWidget?.data?.maxSelections, 10) ||
                      submitInProgress
                    }
                    onClick={onAcceptBetSubmission}
                  >
                    {submitInProgress ? (
                      <div className={classes["spinner-container"]}>
                        <FontAwesomeIcon
                          className={cx("fa-spin", classes["spinner"])}
                          icon={faSpinner}
                          style={{ "--fa-secondary-color": "white" }}
                        />
                      </div>
                    ) : (
                      t("betslip_panel.place_bet")
                    )}
                  </button>
                ) : (
                  <button onClick={onLoginHandler}>{t("login")}</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BetslipConfirmationPopUp
        submitConfirmation={submitConfirmation}
        onClearSelections={() => acknowledgeSubmission(dispatch, location.pathname, true)}
        onSameSelections={() => acknowledgeSubmission(dispatch, location.pathname, false)}
      />

      <BetslipErrorPopUp submitError={submitError} onClick={() => acknowledgeErrors(dispatch, location.pathname)} />
    </div>
  );
};

Betslip.propTypes = propTypes;

export default Betslip;
