import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import getSymbolFromCurrency from "currency-symbol-map";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { getCmsConfigBettingMultipleStakeLimits } from "../../../../../../../../../redux/reselect/cms-selector";
import {
  obtainSpecificMaxStake,
  onClearBetslipHandler,
  onRefreshBetslipHandler,
  onRemoveSelectionHandler,
  onSpecificStakeChangeHandler,
  onSubmitBetslip,
} from "../../../../../../../../../utils/betslip-utils";
import ExclamationMarkIcon from "../../../../../../../img/icons/exclamation.svg";
import WarningIcon from "../../../../../../../img/icons/warning.svg";
import classes from "../../../../../../../scss/ollehdesktop.module.scss";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

const propTypes = {
  active: PropTypes.bool.isRequired,
  alerts: PropTypes.array.isRequired,
  betslipData: PropTypes.object.isRequired,
  betslipWidget: PropTypes.object.isRequired,
  clearAlerts: PropTypes.func.isRequired,
  initialOdds: PropTypes.object.isRequired,
  minMaxLimitBreached: PropTypes.bool.isRequired,
};

const BetslipMultiTab = ({
  active,
  alerts,
  betslipData,
  betslipWidget,
  clearAlerts,
  initialOdds,
  minMaxLimitBreached,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();

  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const currencyCode = useSelector((state) => state.auth.currencyCode);
  const dirtyPotentialWin = useSelector((state) => state.betslip.dirtyPotentialWin);
  const submitInProgress = useSelector((state) => state.betslip.submitInProgress);
  const multipleStakeLimits = useSelector(getCmsConfigBettingMultipleStakeLimits);

  const [stakeChangeState, setStakeChangeState] = useState({}); // maintain a dirty state for stake changes (as opposed of sending it straight down to redux), else the betslip randomly refreshes

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
      // Olleh format is neither standard or compact, but it's closer to standard (feature match for singles and multiples, but not for specials)
      onSpecificStakeChangeHandler(
        dispatch,
        location.pathname,
        betslipData,
        stakeChangeState.value,
        stakeChangeState.typeId,
        stakeChangeState.index,
      );

      // Make sure to clear singles in any case
      betslipData.model.outcomes.forEach((single, index) => {
        onSpecificStakeChangeHandler(dispatch, location.pathname, betslipData, 0, 1, index);
      });

      // Make sure to clear other multiples in any case
      betslipData.betData.multiples.forEach((multiple) => {
        if (multiple.typeId !== betslipData.model.outcomes.length) {
          onSpecificStakeChangeHandler(dispatch, location.pathname, betslipData, 0, multiple.typeId, 0);
        }
      });

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

  const allOutcomesValid = betslipData.model.outcomes.findIndex((outcome) => !outcome.valid) === -1;
  const hasOutcomes = betslipData.model.outcomes.length > 0;

  const multiple = betslipData.betData.multiples.find((m) => m.numSubBets === 1);

  const stake =
    stakeChangeState.typeId && stakeChangeState.typeId === multiple?.typeId
      ? stakeChangeState.value
      : multiple?.unitStake;

  const betPlacementDisabled =
    !loggedIn ||
    !allOutcomesValid ||
    !hasOutcomes ||
    stake <= 0 ||
    minMaxLimitBreached ||
    betslipData?.model?.outcomes?.length > parseInt(betslipWidget?.data?.maxSelections, 10) ||
    submitInProgress ||
    Object.keys(alerts).length > 0;

  return (
    <div
      className={cx(classes["right__column-tabs-item"], {
        [classes["active"]]: active,
      })}
    >
      <div className={classes["right__column-tabs-title"]}>
        <span>{t("selection")}</span>
        <span>{t("odds")}</span>
      </div>
      {betslipData.model.outcomes.map((outcome) => {
        if (outcome.outcomeDescription) {
          return (
            <div className={classes["right__column-tabs-box"]}>
              <button
                aria-label="close-button"
                className={classes["btn-close"]}
                type="button"
                onClick={() => onRemoveSelectionHandler(dispatch, location.pathname, outcome.outcomeId, true)}
              />
              <h4>{outcome.eventDescription}</h4>
              <p className={classes["total"]}>{`${outcome.marketDescription} - ${outcome.periodDescription}`}</p>
              <p className={classes["over"]}>{outcome.outcomeDescription}</p>
              {/* bet-label-disabled */}
              {!outcome.valid && (
                <span className={classes["lock-icon"]}>
                  <FontAwesomeIcon icon={faLock} />
                </span>
              )}
              <div
                className={
                  alerts[outcome.outcomeId]?.priceChange ? classes["bet-label"] : classes["bet-label-disabled"]
                }
              >
                {outcome.formattedPrice}
              </div>
              {!outcome.valid ? (
                <button className={classes["removed"]} type="button">
                  Blocked
                </button>
              ) : (
                alerts[outcome.outcomeId]?.priceChange && (
                  <button type="button">
                    {`Odds changed from ${initialOdds[outcome.outcomeId]} to ${outcome.formattedPrice}`}
                  </button>
                )
              )}
            </div>
          );
        }

        return null; // skip if the data is pending API initialization!
      })}
      <div className={classes["right__column-result"]}>
        {multiple && (
          <div className={classes["right__column-result-total"]} key={multiple.typeId}>
            <div className={classes["right__column-result-row"]}>
              <div className={classes["row-name"]}>{t("betslip_panel.total_stake")}</div>
              <div className={classes["row-total"]}>
                {`${currencyCode} ${multiple.unitStake?.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}`}
              </div>
            </div>
            <div className={classes["right__column-result-row"]}>
              <div className={classes["row-name"]}>{t("betslip_panel.stake")}</div>
              <div className={classes["row-total"]}>
                <input
                  disabled={!allOutcomesValid}
                  name="input-stake"
                  placeholder="0"
                  type="number"
                  value={stake > 0 ? stake : ""}
                  onBlur={stakeChangeConfirmedHandler}
                  onChange={(e) => stakeChangeHandler(e, multiple.typeId, 0)}
                />
                {loggedIn && betslipWidget?.data?.maxStake ? (
                  <button
                    type="button"
                    onClick={() => obtainSpecificMaxStake(dispatch, betslipData, multiple.typeId, null, 1)}
                  >
                    {t("betslip_panel.max")}
                  </button>
                ) : null}
              </div>
            </div>
            {stake > 0 && stake < multipleStakeLimits[currencyCode]?.min && (
              <div
                className={classes["right__column-result-row"]}
                style={{ color: "red", fontSize: "11px", paddingLeft: "5px" }}
              >
                {t("betslip_panel.minimum_stake_is", {
                  value: `${getSymbolFromCurrency(currencyCode)} ${multipleStakeLimits[currencyCode].min}`,
                })}
              </div>
            )}
            {stake > multipleStakeLimits[currencyCode]?.max && (
              <div
                className={classes["right__column-result-row"]}
                style={{ color: "red", fontSize: "11px", paddingLeft: "5px" }}
              >
                {t("betslip_panel.maximum_stake_is", {
                  value: `${getSymbolFromCurrency(currencyCode)} ${multipleStakeLimits[currencyCode].max}`,
                })}
              </div>
            )}
            <div className={classes["right__column-result-row"]}>
              <div className={classes["row-name"]}>{t("betslip_panel.potential_returns")}</div>
              <div className={classes["row-total"]}>
                {dirtyPotentialWin
                  ? ""
                  : `${currencyCode} ${multiple.potentialWin?.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}`}
              </div>
            </div>
          </div>
        )}
        {Object.keys(alerts).length > 0 ? (
          <div className={classes["right__column-result-warning"]}>
            <img alt="Your selection was changed, blocked or removed!" src={WarningIcon} />
            <span>Your selection was changed, blocked or removed!</span>
            <div className={classes["icon-circle"]}>
              <img alt="" src={ExclamationMarkIcon} />
            </div>
          </div>
        ) : (
          !loggedIn && (
            <div className={classes["right__column-result-warning"]}>
              <img alt={t("login_into_account")} src={WarningIcon} />
              <span>{t("login_into_account")}</span>
              <div className={classes["icon-circle"]}>
                <img alt="" src={ExclamationMarkIcon} />
              </div>
            </div>
          )
        )}
        <div className={classes["right__column-result-remove"]}>
          <p style={{ cursor: "pointer" }} onClick={() => onClearBetslipHandler(dispatch, location.pathname)}>
            {t("betslip_panel.remove_all")}
          </p>
          <div className={classes["remove-btns"]}>
            {Object.keys(alerts).length > 0 && (
              <>
                <button type="button" onClick={clearAlerts}>
                  {t("accept")}
                </button>
                &nbsp;
              </>
            )}
            <button
              className={betPlacementDisabled ? classes["disabled"] : ""}
              type="button"
              onClick={() => onSubmitBetslip(dispatch, location.pathname)}
            >
              {submitInProgress ? (
                <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} />
              ) : (
                t("betslip_panel.place_bet")
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

BetslipMultiTab.propTypes = propTypes;

export default React.memo(BetslipMultiTab);
