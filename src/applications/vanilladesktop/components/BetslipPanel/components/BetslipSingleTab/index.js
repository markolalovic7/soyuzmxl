import { faCoins, faGift, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import getSymbolFromCurrency from "currency-symbol-map";
import * as PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import {
  getCmsConfigBettingSingleStakeLimits,
  getCmsConfigBrandDetails,
} from "../../../../../../redux/reselect/cms-selector";
import {
  claimFreeBet,
  getSingleBetPotentialWin,
  getSingleStake,
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

const BetslipSingleTab = ({
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
  const singleStakeLimits = useSelector(getCmsConfigBettingSingleStakeLimits);
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
      className={cx(classes["betslip__single"], {
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
      {betslipData.betData.singles
        .filter((s) => s.stake > 0 && s.alerts.length > 0)
        .map((s, index) =>
          s.alerts.map((a, index2) => (
            <BetslipWarningNotification key={`${index}-${index2}`} text={a.description18n} />
          )),
        )}

      <div className={classes["betslip__cards"]}>
        {betslipData.model.outcomes.map((outcome, index) => {
          if (outcome.outcomeDescription) {
            const currentStake =
              stakeChangeState.typeId && stakeChangeState.typeId === 1 && stakeChangeState.index === index
                ? stakeChangeState.value
                : getSingleStake(betslipData, outcome.outcomeId);

            const singleBetData = betslipData.betData.singles.find((single) => single.outcomeId === outcome.outcomeId);
            const freeBetOffers = singleBetData?.freeBetOffers || [];
            const selectedFreeBetId = singleBetData?.selectedFreeBetId || undefined;

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
                    <div className={classes["betslip__card-stake"]}>
                      <span>{t("betslip_panel.stake")}</span>
                      <span
                        className={classes["betslip__card-input"]}
                        style={{ pointerEvents: submitInProgress ? "none" : "auto" }}
                      >
                        {loggedIn && !(selectedFreeBetId > 0) && betslipWidget?.maxStake ? (
                          <span onClick={() => obtainSpecificMaxStake(dispatch, betslipData, 1, outcome.outcomeId, 1)}>
                            {t("betslip_panel.max")}
                          </span>
                        ) : null}
                        <input
                          disabled={!outcome.valid || submitInProgress || selectedFreeBetId > 0}
                          name="input-stake"
                          placeholder="0"
                          type="number"
                          value={currentStake > 0 ? currentStake : ""}
                          onBlur={onStakeChangeConfirmation}
                          onChange={(e) => onStakeChange(e, 1, index)}
                        />
                        {selectedFreeBetId > 0 && (
                          <span
                            style={{ marginLeft: "8px", marginRight: "0px" }}
                            onClick={() => {
                              unclaimFreeBet(dispatch, location.pathname, 1, outcome.outcomeId);
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
                              claimFreeBet(dispatch, location.pathname, 1, outcome.outcomeId, freeBetOffers[0].id);
                              onRefreshBetslipHandler(dispatch, location.pathname);
                            }}
                          >
                            <FontAwesomeIcon icon={faGift} />
                          </span>
                        )}
                      </span>
                    </div>
                    {currentStake > 0 && currentStake < singleStakeLimits[currencyCode]?.min && (
                      <div className={classes["betslip__card-stake"]}>
                        <span />
                        <span style={{ color: "red" }}>
                          {t("betslip_panel.minimum_stake_is", {
                            value: `${getSymbolFromCurrency(currencyCode)} ${singleStakeLimits[currencyCode].min}`,
                          })}
                        </span>
                      </div>
                    )}
                    {currentStake > singleStakeLimits[currencyCode]?.max && (
                      <div className={classes["betslip__card-stake"]}>
                        <span />
                        <span style={{ color: "red" }}>
                          {t("betslip_panel.maximum_stake_is", {
                            value: `${getSymbolFromCurrency(currencyCode)} ${singleStakeLimits[currencyCode].max}`,
                          })}
                        </span>
                      </div>
                    )}
                    <div className={classes["betslip__card-returns"]}>
                      <span>{t("betslip_panel.potential_returns")}</span>
                      <span>
                        {dirtyPotentialWin
                          ? ""
                          : `${getSymbolFromCurrency(currencyCode)} ${getSingleBetPotentialWin(
                              betslipData,
                              outcome.outcomeId,
                            ).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            })}`}
                      </span>
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
          <div
            className={classes["betslip__select"]}
            style={{ pointerEvents: submitInProgress ? "none" : "auto" }}
            onClick={() => onClearStakesHandler(dispatch, location.pathname, [1])}
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

BetslipSingleTab.propTypes = {
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

export default BetslipSingleTab;
