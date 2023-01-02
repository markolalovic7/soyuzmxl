import { faCoins, faGift, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getSymbolFromCurrency from "currency-symbol-map";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { makeGetBetslipData } from "../../../../../../../../redux/reselect/betslip-selector";
import {
  claimFreeBet,
  getSingleBetPotentialWin,
  getSingleStake,
  obtainSpecificMaxStake,
  onRefreshBetslipHandler,
  onRemoveSelectionHandler,
  unclaimFreeBet,
} from "../../../../../../../../utils/betslip-utils";
import { isNotEmpty } from "../../../../../../../../utils/lodash";
import classes from "../../../../../../scss/vanillamobilestyle.module.scss";
import BetslipPrice from "../BetslipPrice";

import { getCmsLayoutMobileVanillaBetslipWidget } from "redux/reselect/cms-layout-widgets";
import { getCmsConfigBettingSingleStakeLimits } from "redux/reselect/cms-selector";

const BetslipSingleTabContent = ({ stakeChangeConfirmedHandler, stakeChangeHandler, stakeChangeState }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();

  const getBetslipData = useMemo(makeGetBetslipData, []);
  const betslipData = useSelector((state) => getBetslipData(state, location.pathname));

  const dirtyPotentialWin = useSelector((state) => state.betslip.dirtyPotentialWin);
  const currencyCode = useSelector((state) => state.auth.currencyCode);
  const loggedIn = useSelector((state) => state.auth.loggedIn);

  const singleStakeLimits = useSelector(getCmsConfigBettingSingleStakeLimits);
  const betslipWidget = useSelector((state) => getCmsLayoutMobileVanillaBetslipWidget(state, location));

  return (
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
              className={`${classes["betslip__card"]} ${!outcome.valid ? classes["betslip__card_disabled"] : ""}`}
              key={outcome.outcomeId}
            >
              <div className={classes["betslip__card-container"]}>
                <div className={classes["betslip__card-head"]}>
                  <span
                    className={classes["betslip__card-cross"]}
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
                    <span className={classes["betslip__card-input"]}>
                      {loggedIn && !(selectedFreeBetId > 0) && betslipWidget?.data?.maxStake ? (
                        <span onClick={() => obtainSpecificMaxStake(dispatch, betslipData, 1, outcome.outcomeId, 1)}>
                          {t("betslip_panel.max")}
                        </span>
                      ) : null}
                      <input
                        disabled={!outcome.valid || selectedFreeBetId > 0}
                        min={0}
                        name="input-stake"
                        placeholder="0"
                        type="number"
                        value={currentStake > 0 ? currentStake : ""}
                        onBlur={stakeChangeConfirmedHandler}
                        onChange={(e) => stakeChangeHandler(e, 1, index)}
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

        return null; // skip if the data is pending API initialization!
      })}
    </div>
  );
};

BetslipSingleTabContent.propTypes = {
  stakeChangeConfirmedHandler: PropTypes.func.isRequired,
  stakeChangeHandler: PropTypes.func.isRequired,
  stakeChangeState: PropTypes.object.isRequired,
};

export default React.memo(BetslipSingleTabContent);
