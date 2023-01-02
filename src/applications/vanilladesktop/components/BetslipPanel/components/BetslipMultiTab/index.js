import { faCoins, faGift, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import getSymbolFromCurrency from "currency-symbol-map";
import * as PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import {
  getCmsConfigBettingMultipleStakeLimits,
  getCmsConfigBrandDetails,
} from "../../../../../../redux/reselect/cms-selector";
import {
  claimFreeBet,
  obtainSpecificMaxStake,
  onClearBetslipHandler,
  onClearStakesHandler,
  onRefreshBetslipHandler,
  onRemoveSelectionHandler,
  onSubmitBetslip,
  onSubmitSingleWalletBetslip,
  unclaimFreeBet,
} from "../../../../../../utils/betslip-utils";
import { isNotEmpty } from "../../../../../../utils/lodash";
import classes from "../../../../scss/vanilladesktop.module.scss";
import BetslipConfirm from "../BetslipConfirm";
import BetslipErrorNotification from "../BetslipErrorNotification";
import BetslipMoneyButtons from "../BetslipMoneyButtons";
import BetslipPrice from "../BetslipPrice";
import BetslipRemoveAll from "../BetslipRemoveAll";
import BetslipTotals from "../BetslipTotals";
import BetslipWarningNotification from "../BetslipWarningNotification";

const BetslipMultiTab = ({
  active,
  allOutcomesValid,
  betslipData,
  betslipWidget,
  hasOutcomes,
  minMaxLimitBreached,
  moneyButtons,
  onAddFixedStakeAmount,
  onStakeChange,
  onStakeChangeConfirmation,
  stakeChangeState,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();

  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const currencyCode = useSelector((state) => state.auth.currencyCode);
  const dirtyPotentialWin = useSelector((state) => state.betslip.dirtyPotentialWin);
  const multipleStakeLimits = useSelector(getCmsConfigBettingMultipleStakeLimits);
  const submitInProgress = useSelector((state) => state.betslip.submitInProgress);
  const cmsConfigBrandDetails = useSelector(getCmsConfigBrandDetails);

  const onAcceptBetSubmission = () => {
    if (cmsConfigBrandDetails.data?.singleWalletMode) {
      onSubmitSingleWalletBetslip(dispatch, location.pathname);
    } else {
      onSubmitBetslip(dispatch, location.pathname);
    }
  };

  return (
    <div
      className={cx(classes["betslip__multi"], {
        [classes["active"]]: active,
      })}
    >
      {!allOutcomesValid && (
        <BetslipErrorNotification
          s={t("betslip_panel.selection_unavailable")}
          s1={t("betslip_panel.please_remove_and_select")}
        />
      )}
      {betslipData?.model?.outcomes?.length > parseInt(betslipWidget?.maxSelections, 10) && (
        <BetslipErrorNotification
          s={t("betslip_panel.too_many_selections", { value: betslipWidget?.maxSelections })}
          s1={t("betslip_panel.please_remove_some")}
        />
      )}
      {betslipData.betData.multiples
        .filter((s) => s.numSubBets === 1 && s.stake > 0 && s.alerts.length > 0)
        .map((s, index) =>
          s.alerts.map((a, index2) => (
            <BetslipWarningNotification key={`${index}-${index2}`} text={a.description18n} />
          )),
        )}

      <div className={classes["betslip__cards"]}>
        {betslipData.model.outcomes.map((outcome) => {
          if (outcome.outcomeDescription) {
            return (
              <div
                className={cx(classes["betslip__card"], {
                  [classes["betslip__card_disabled"]]: !outcome.valid,
                })}
                key={outcome.outcomeId}
              >
                <div className={classes["betslip__card-container"]}>
                  <div className={classes["betslip__card-head"]}>
                    <span
                      className={classes["betslip__card-cross"]}
                      style={{ pointerEvents: submitInProgress ? "none" : "auto" }}
                      onClick={() => onRemoveSelectionHandler(dispatch, location.pathname, outcome.outcomeId, false)}
                    >
                      <FontAwesomeIcon icon={faTimesCircle} />
                    </span>
                    <span className={classes["betslip__card-title"]}>{outcome.outcomeDescription}</span>
                    <BetslipPrice dir={outcome.priceDir} formattedPrice={outcome.formattedPrice} />
                  </div>
                  <div className={classes["betslip__card-body"]}>
                    <div className={classes["betslip__card-commands"]}>
                      <span className={classes["betslip__card-command"]}>{outcome.eventDescription}</span>
                    </div>
                    <div className={classes["betslip__card-win"]}>
                      {`${outcome.marketDescription} - ${outcome.periodDescription}`}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      <div className={classes["betslip__bottom"]}>
        <BetslipRemoveAll onClick={() => onClearBetslipHandler(dispatch, location.pathname)} />

        <div className={classes["betslip__buttons"]}>
          {betslipData.betData.multiples.map((multiple, index) => {
            if (multiple.numSubBets > 1) return null;

            const allOutcomesValid = betslipData.model.outcomes.findIndex((outcome) => !outcome.valid) === -1;
            const stake =
              stakeChangeState.typeId && stakeChangeState.typeId === multiple.typeId
                ? stakeChangeState.value
                : multiple.unitStake;

            const freeBetOffers = multiple?.freeBetOffers || [];
            const selectedFreeBetId = multiple?.selectedFreeBetId || undefined;

            return (
              <div
                className={cx(classes["betslip__card"], {
                  [classes["betslip__card_disabled"]]: !allOutcomesValid,
                })}
                key={multiple.typeId}
              >
                <div className={classes["betslip__card-container"]}>
                  <div className={classes["betslip__card-head"]}>
                    <span className={classes["betslip__card-title"]}>{multiple.typeDescription}</span>
                    <span className={classes["betslip__card-coeficient"]}>
                      <span>{multiple.formattedPrice}</span>
                    </span>
                  </div>
                </div>
                <div className={classes["betslip__card-body"]}>
                  <div className={classes["betslip__card-stake"]}>
                    <span>{t("betslip_panel.stake")}</span>
                    <span
                      className={classes["betslip__card-input"]}
                      style={{ pointerEvents: submitInProgress ? "none" : "auto" }}
                    >
                      {loggedIn && !(selectedFreeBetId > 0) && betslipWidget?.maxStake ? (
                        <span onClick={() => obtainSpecificMaxStake(dispatch, betslipData, multiple.typeId, null, 1)}>
                          {t("betslip_panel.max")}
                        </span>
                      ) : null}
                      <input
                        disabled={!allOutcomesValid || submitInProgress || selectedFreeBetId > 0}
                        name="input-stake"
                        placeholder="0"
                        type="number"
                        value={stake > 0 ? stake : ""}
                        onBlur={onStakeChangeConfirmation}
                        onChange={(e) => onStakeChange(e, multiple.typeId, index)}
                      />

                      {selectedFreeBetId > 0 && (
                        <span
                          style={{ marginLeft: "8px", marginRight: "0px" }}
                          onClick={() => {
                            unclaimFreeBet(dispatch, location.pathname, multiple.typeId, null);
                            onRefreshBetslipHandler(dispatch, location.pathname);
                          }}
                        >
                          <FontAwesomeIcon icon={faCoins} />
                        </span>
                      )}
                      {!(selectedFreeBetId > 0) && isNotEmpty(freeBetOffers) && (
                        <span
                          style={{ marginLeft: "8px", marginRight: "0px" }}
                          onClick={() => {
                            claimFreeBet(dispatch, location.pathname, multiple.typeId, null, freeBetOffers[0].id);
                            onRefreshBetslipHandler(dispatch, location.pathname);
                          }}
                        >
                          <FontAwesomeIcon icon={faGift} />
                        </span>
                      )}
                    </span>
                  </div>
                  {stake > 0 && stake < multipleStakeLimits[currencyCode]?.min && (
                    <div className={classes["betslip__card-stake"]}>
                      <span />
                      <span style={{ color: "red" }}>
                        {t("betslip_panel.minimum_stake_is", {
                          value: `${getSymbolFromCurrency(currencyCode)} ${multipleStakeLimits[currencyCode].min}`,
                        })}
                      </span>
                    </div>
                  )}
                  {stake > multipleStakeLimits[currencyCode]?.max && (
                    <div className={classes["betslip__card-stake"]}>
                      <span />
                      <span style={{ color: "red" }}>
                        {t("betslip_panel.maximum_stake_is", {
                          value: `${getSymbolFromCurrency(currencyCode)} ${multipleStakeLimits[currencyCode].max}`,
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div
            className={classes["betslip__select"]}
            style={{ pointerEvents: submitInProgress ? "none" : "auto" }}
            onClick={() => onClearStakesHandler(dispatch, location.pathname, [betslipData.model.outcomes.length])}
          >
            <span>{`${t("betslip_panel.select_stake")}:`}</span>
            <span className={classes["betslip__clear"]}>{t("betslip_panel.clear")}</span>
          </div>
          <BetslipMoneyButtons
            currencyCode={currencyCode}
            moneyButtons={moneyButtons}
            onClick={onAddFixedStakeAmount}
          />
        </div>
        <div className={classes["betslip__summary"]}>
          <BetslipTotals betslipData={betslipData} currencyCode={currencyCode} dirtyPotentialWin={dirtyPotentialWin} />
          <BetslipConfirm
            allOutcomesValid={allOutcomesValid}
            betslipData={betslipData}
            data={betslipWidget}
            hasOutcomes={hasOutcomes}
            loggedIn={loggedIn}
            minMaxLimitBreached={minMaxLimitBreached}
            s={t("betslip_panel.place_bet")}
            s1={t("login")}
            submitInProgress={submitInProgress}
            onClick={onAcceptBetSubmission}
          />
        </div>
      </div>
    </div>
  );
};

BetslipMultiTab.propTypes = {
  active: PropTypes.bool.isRequired,
  allOutcomesValid: PropTypes.bool.isRequired,
  betslipData: PropTypes.object.isRequired,
  betslipWidget: PropTypes.object.isRequired,
  hasOutcomes: PropTypes.bool.isRequired,
  minMaxLimitBreached: PropTypes.bool.isRequired,
  moneyButtons: PropTypes.object.isRequired,
  onAddFixedStakeAmount: PropTypes.func.isRequired,
  onStakeChange: PropTypes.func.isRequired,
  onStakeChangeConfirmation: PropTypes.func.isRequired,
  stakeChangeState: PropTypes.object.isRequired,
};

export default BetslipMultiTab;
