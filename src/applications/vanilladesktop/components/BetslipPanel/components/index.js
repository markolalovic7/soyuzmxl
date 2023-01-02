import { faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import * as PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import {
  makeGetBetslipData,
  makeGetBetslipSubmitConfirmation,
  makeGetBetslipSubmitError,
  makeGetBetslipSubmitInProgress,
} from "../../../../../redux/reselect/betslip-selector";
import {
  getCmsConfigBettingMultipleStakeLimits,
  getCmsConfigBettingSingleStakeLimits,
  getCmsConfigBettingSpecialStakeLimits,
} from "../../../../../redux/reselect/cms-selector";
import { getActiveBetCount } from "../../../../../redux/slices/cashoutSlice";
import {
  acknowledgeErrors,
  acknowledgeSubmission,
  getGlobalTotalStake,
  onClearAllStakesHandler,
  onGlobalStakeChangeHandler,
  onRefreshBetslipHandler,
  onSpecificStakeChangeHandler,
} from "../../../../../utils/betslip-utils";
import { PANEL_TABS } from "../constants";

import BetslipErrorPopup from "./BetslipErrorPopup";
import BetslipMultiTab from "./BetslipMultiTab";
import BetslipSingleTab from "./BetslipSingleTab";
import BetslipSpecialTab from "./BetslipSpecialTab";
import BetslipSuccessPopup from "./BetslipSuccessPopup";
import MyBets from "./MyBets";

// Refactor betslip panel with cms integration:
// Move betslip cards to separate component
// Handle empty betslip panel and how it should work (now empty betslip heading is different from usual and it misses "My bets tab")

const BetslipPanel = ({ betslipWidget, displayHeader }) => {
  const [selectedPanel, setSelectedPanel] = useState(PANEL_TABS.BetslipPanel);
  const [isPanelOpened, setIsPanelOpened] = useState(true);
  const [minMaxLimitBreached, setMinMaxLimitBreached] = useState(false);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();

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

  const hasOutcomes = betslipData.model.outcomes.length > 0;
  const allOutcomesValid =
    betslipData.model.outcomes
      .filter((outcome) => outcome.outcomeDescription)
      .findIndex((outcome) => !outcome.valid) === -1;
  const [stakeChangeState, setStakeChangeState] = useState({}); // maintain a dirty state for stake changes (as opposed of sending it straight down to redux), else the betslip randomly refreshes

  const singleStakeLimits = useSelector(getCmsConfigBettingSingleStakeLimits);
  const multipleStakeLimits = useSelector(getCmsConfigBettingMultipleStakeLimits);
  const specialStakeLimits = useSelector(getCmsConfigBettingSpecialStakeLimits);

  const betslipModeStandard = betslipWidget?.betslipMode === "REGULAR";

  const [tabState, setTabState] = useState({
    multipleTabActive: false,
    showMultipleTab: false,
    showSingleTab: false,
    showSpecialsTab: false,
    singleTabActive: false,
    specialsTabActive: false,
  });

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

  const stakeChangeHandler = (e, typeId, index) => {
    e.preventDefault();

    if (Number.isNaN(e.target.value)) {
      return;
    }

    // Track changes, but only submit when the onblur condition is over
    setStakeChangeState({ index, typeId, value: e.target.value });
  };

  const stakeChangeConfirm = () => {
    if (Object.keys(stakeChangeState).length > 0) {
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
        onGlobalStakeChangeHandler(dispatch, location.pathname, betslipData, stakeChangeState.value);
      }

      if (betslipData.model.outcomes.length > 0) {
        onRefreshBetslipHandler(dispatch, location.pathname);
      }

      setStakeChangeState({}); // clear the dirty state for stake changes
    }
  };

  const stakeChangeConfirmedHandler = (e) => {
    e.preventDefault();

    stakeChangeConfirm();
  };

  // A bit after a change in stake happens, do apply the change (do not wait for a blur event on desktop)
  useEffect(() => {
    const timeOutId = setTimeout(() => stakeChangeConfirm(), 250);

    return () => clearTimeout(timeOutId);
  }, [stakeChangeState]);

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

  useEffect(() => {
    const modifiedTabState = { ...tabState };

    modifiedTabState.showSingleTab =
      (betslipModeStandard && betslipData.betData.singles.length > 0) ||
      (!betslipModeStandard && betslipData.model.outcomes.length === 1);

    modifiedTabState.showMultipleTab =
      betslipData.betData.multiples.findIndex((m) => m.numSubBets === 1) > -1 &&
      betslipData?.model?.outcomes?.length <= parseInt(betslipWidget?.maxSelections, 10);

    modifiedTabState.showSpecialsTab =
      betslipModeStandard &&
      betslipData.betData.multiples.findIndex((m) => m.numSubBets > 1) > -1 &&
      betslipData?.model?.outcomes?.length <= parseInt(betslipWidget?.maxSelections, 10);

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

  return (
    <div
      className={cx(classes["betting-tickets"], {
        [classes["betting-tickets_single"]]: false,
      })}
    >
      <div className={classes["betting-tickets__tabs"]} style={{ display: displayHeader ? "flex" : "none" }}>
        <div
          className={cx(classes["betting-tickets__tab"], classes["betting-tickets__betslip"], {
            [classes["active"]]: selectedPanel === PANEL_TABS.BetslipPanel,
          })}
          onClick={() => setSelectedPanel(PANEL_TABS.BetslipPanel)}
        >
          <div className={classes["betting-tickets__icon"]}>
            <i className={classes["qicon-money"]} />
            <span className={classes["betting-tickets__indicator"]}>{betslipData.model.outcomes.length}</span>
          </div>
          {selectedPanel === PANEL_TABS.BetslipPanel && (
            <>
              <h3 className={classes["betting-tickets__title"]}>{t("betslip")}</h3>
              <div
                className={cx(classes["betting-tickets__arrow"], classes["betting-tickets__arrow_betslip"], {
                  [classes["active"]]: isPanelOpened,
                })}
                onClick={() => setIsPanelOpened((isOpened) => !isOpened)}
              />
            </>
          )}
        </div>
        {loggedIn && betslipWidget?.myBets && (
          <div
            className={cx(classes["betting-tickets__tab"], classes["betting-tickets__mybets"], {
              [classes["active"]]: selectedPanel === PANEL_TABS.MyBetsPanel,
            })}
            onClick={() => setSelectedPanel(PANEL_TABS.MyBetsPanel)}
          >
            <div className={classes["betting-tickets__icon"]}>
              <FontAwesomeIcon icon={faList} />
              <span className={classes["betting-tickets__indicator"]}>{activeBetCount}</span>
            </div>
            {selectedPanel === PANEL_TABS.MyBetsPanel && (
              <>
                <h3 className={classes["betting-tickets__title"]}>{t("my_bets")}</h3>
                <div
                  className={cx(classes["betting-tickets__arrow"], classes["betting-tickets__arrow_betslip"], {
                    [classes["active"]]: isPanelOpened,
                  })}
                  onClick={() => setIsPanelOpened((isOpened) => !isOpened)}
                />
              </>
            )}
          </div>
        )}
      </div>
      <div className={cx(classes["betting-tickets__content"], { [classes["open"]]: isPanelOpened })}>
        {hasOutcomes || selectedPanel !== PANEL_TABS.BetslipPanel ? (
          <>
            <div
              className={cx(classes["betslip"], {
                [classes["active"]]: isPanelOpened && selectedPanel === PANEL_TABS.BetslipPanel,
              })}
            >
              {betslipModeStandard && (
                <nav className={classes["betslip__navigation"]}>
                  <ul className={classes["betslip__list"]}>
                    <li
                      className={cx(classes["betslip__li"], {
                        [classes["active"]]: tabState.singleTabActive,
                        [classes["disabled"]]: !tabState.showSingleTab,
                      })}
                      id="betslip-single"
                      onClick={onSingleTabClickHandler}
                    >
                      <span>{t("betslip_panel.single")}</span>
                    </li>
                    <li
                      className={cx(classes["betslip__li"], {
                        [classes["active"]]: tabState.multipleTabActive,
                        [classes["disabled"]]: !tabState.showMultipleTab,
                      })}
                      id="betslip-multi"
                      onClick={onMultipleTabClickHandler}
                    >
                      <span>{t("betslip_panel.multi")}</span>
                    </li>
                    <li
                      className={cx(classes["betslip__li"], {
                        [classes["active"]]: tabState.specialsTabActive,
                        [classes["disabled"]]: !tabState.showSpecialsTab,
                      })}
                      id="betslip-special"
                      onClick={onSpecialTabClickHandler}
                    >
                      <span>{t("betslip_panel.special")}</span>
                    </li>
                  </ul>
                </nav>
              )}
              <div className={classes["betslip__body"]}>
                <BetslipSingleTab
                  active={tabState.singleTabActive}
                  allOutcomesValid={allOutcomesValid}
                  betslipData={betslipData}
                  betslipWidget={betslipWidget}
                  hasOutcomes={hasOutcomes}
                  minMaxLimitBreached={minMaxLimitBreached}
                  moneyButtons={betslipWidget.moneyButtons}
                  stakeChangeState={stakeChangeState}
                  onAddFixedStakeAmount={onAddFixedAmountStakeHandler}
                  onStakeChange={stakeChangeHandler}
                  onStakeChangeConfirmation={stakeChangeConfirmedHandler}
                />

                <BetslipMultiTab
                  active={tabState.multipleTabActive}
                  allOutcomesValid={allOutcomesValid}
                  betslipData={betslipData}
                  betslipWidget={betslipWidget}
                  hasOutcomes={hasOutcomes}
                  minMaxLimitBreached={minMaxLimitBreached}
                  moneyButtons={betslipWidget.moneyButtons}
                  stakeChangeState={stakeChangeState}
                  onAddFixedStakeAmount={onAddFixedAmountStakeHandler}
                  onStakeChange={stakeChangeHandler}
                  onStakeChangeConfirmation={stakeChangeConfirmedHandler}
                />

                <BetslipSpecialTab
                  active={tabState.specialsTabActive}
                  allOutcomesValid={allOutcomesValid}
                  betslipData={betslipData}
                  betslipWidget={betslipWidget}
                  hasOutcomes={hasOutcomes}
                  minMaxLimitBreached={minMaxLimitBreached}
                  moneyButtons={betslipWidget.moneyButtons}
                  stakeChangeState={stakeChangeState}
                  onAddFixedStakeAmount={onAddFixedAmountStakeHandler}
                  onStakeChange={stakeChangeHandler}
                  onStakeChangeConfirmation={stakeChangeConfirmedHandler}
                />

                <BetslipSuccessPopup
                  isOpen={submitConfirmation}
                  onClearSelections={() => acknowledgeSubmission(dispatch, location.pathname, true)}
                  onSameSelections={() => acknowledgeSubmission(dispatch, location.pathname, false)}
                />
                <BetslipErrorPopup
                  isOpen={!!submitError}
                  submitError={submitError}
                  onClose={() => acknowledgeErrors(dispatch, location.pathname)}
                />
              </div>
            </div>
            {loggedIn && (
              <div
                className={cx(classes["mybets"], {
                  [classes["active"]]: isPanelOpened && selectedPanel === PANEL_TABS.MyBetsPanel,
                })}
              >
                <MyBets active={selectedPanel === PANEL_TABS.MyBetsPanel} betslipWidget={betslipWidget} />
              </div>
            )}
          </>
        ) : (
          <div className={classes["betting-tickets__empty"]}>
            <span className={classes["betting-tickets__empty-title"]}>{t("vanilladesktop.empty_betslip")}</span>
            <span className={classes["betting-tickets__empty-text"]}>{t("vanilladesktop.select_bets")}</span>
          </div>
        )}
      </div>
    </div>
  );
};

BetslipPanel.propTypes = {
  betslipWidget: PropTypes.object.isRequired,
  displayHeader: PropTypes.bool,
};
BetslipPanel.defaultProps = {
  displayHeader: true,
};

export default React.memo(BetslipPanel);
