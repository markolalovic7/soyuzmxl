import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import getSymbolFromCurrency from "currency-symbol-map";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import {
  getCmsConfigBettingSingleStakeLimits,
  getCmsConfigBrandDetails,
} from "../../../../../../../../../redux/reselect/cms-selector";
import {
  getGlobalSinglePotentialWin,
  getGlobalSingleTotalStake,
  getSingleBetPotentialWin,
  getSingleStake,
  obtainSpecificMaxStake,
  onClearBetslipHandler,
  onRefreshBetslipHandler,
  onRemoveSelectionHandler,
  onSpecificStakeChangeHandler,
  onSubmitBetslip,
  onSubmitSingleWalletBetslip,
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

const BetslipSingleTab = ({
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
  const singleStakeLimits = useSelector(getCmsConfigBettingSingleStakeLimits);
  const cmsConfigBrandDetails = useSelector(getCmsConfigBrandDetails);

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

      // Make sure to clear multiples in any case
      betslipData.betData.multiples.forEach((multiple) => {
        onSpecificStakeChangeHandler(dispatch, location.pathname, betslipData, 0, multiple.typeId, 0);
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

  const hasOutcomes = betslipData.model.outcomes.length > 0;
  const allOutcomesValid = betslipData.model.outcomes.findIndex((outcome) => !outcome.valid) === -1;

  const onAcceptBetSubmission = () => {
    if (cmsConfigBrandDetails.data?.singleWalletMode) {
      onSubmitSingleWalletBetslip(dispatch, location.pathname);
    } else {
      onSubmitBetslip(dispatch, location.pathname);
    }
  };

  const betPlacementDisabled =
    !loggedIn ||
    !allOutcomesValid ||
    !hasOutcomes ||
    getGlobalSingleTotalStake(betslipData) <= 0 ||
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
      {betslipData.model.outcomes.map((outcome, index) => {
        if (outcome.outcomeDescription) {
          const currentStake =
            stakeChangeState.typeId && stakeChangeState.typeId === 1 && stakeChangeState.index === index
              ? stakeChangeState.value
              : getSingleStake(betslipData, outcome.outcomeId);

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
              <p className={classes["stake"]}>
                <span>{t("betslip_panel.stake")}</span>
                <input
                  disabled={!outcome.valid}
                  min={0}
                  name="input-stake"
                  placeholder="0"
                  type="number"
                  value={currentStake > 0 ? currentStake : ""}
                  onBlur={stakeChangeConfirmedHandler}
                  onChange={(e) => stakeChangeHandler(e, 1, index)}
                />
                {loggedIn && betslipWidget?.data?.maxStake ? (
                  <button
                    type="button"
                    onClick={() => obtainSpecificMaxStake(dispatch, betslipData, 1, outcome.outcomeId, 1)}
                  >
                    {t("betslip_panel.max")}
                  </button>
                ) : null}
              </p>
              {currentStake > 0 && currentStake < singleStakeLimits[currencyCode]?.min && (
                <p className={classes["towin"]}>
                  <span style={{ color: "red" }}>
                    {t("betslip_panel.minimum_stake_is", {
                      value: `${getSymbolFromCurrency(currencyCode)} ${singleStakeLimits[currencyCode].min}`,
                    })}
                  </span>
                </p>
              )}
              {currentStake > singleStakeLimits[currencyCode]?.max && (
                <p className={classes["towin"]}>
                  <span style={{ color: "red" }}>
                    {t("betslip_panel.maximum_stake_is", {
                      value: `${getSymbolFromCurrency(currencyCode)} ${singleStakeLimits[currencyCode].max}`,
                    })}
                  </span>
                </p>
              )}
              <p className={classes["towin"]}>
                {`${t("betslip_panel.potential_returns")} `}
                <span>
                  {dirtyPotentialWin
                    ? ""
                    : `${currencyCode} ${getSingleBetPotentialWin(betslipData, outcome.outcomeId).toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        },
                      )}`}
                </span>
              </p>
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
        <div className={classes["right__column-result-total"]}>
          <div className={classes["right__column-result-row"]}>
            <div className={classes["row-name"]}>{t("betslip_panel.total_stake")}</div>
            <span className={classes["row-total"]}>
              {" "}
              {`${currencyCode} ${getGlobalSingleTotalStake(betslipData).toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}`}
            </span>
          </div>
          <div className={classes["right__column-result-row"]}>
            <div className={classes["row-name"]}>{t("betslip_panel.potential_returns")}</div>
            <span className={classes["row-total"]}>
              {dirtyPotentialWin
                ? ""
                : `${currencyCode} ${getGlobalSinglePotentialWin(betslipData).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}`}
            </span>
          </div>
        </div>
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
              onClick={onAcceptBetSubmission}
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

BetslipSingleTab.propTypes = propTypes;

export default React.memo(BetslipSingleTab);
