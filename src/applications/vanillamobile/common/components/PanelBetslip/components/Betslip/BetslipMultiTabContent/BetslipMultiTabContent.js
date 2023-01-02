import { faCoins, faGift, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getSymbolFromCurrency from "currency-symbol-map";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { isNotEmpty } from "../../../../../../../../utils/lodash";
import BetslipPrice from "../BetslipPrice";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { makeGetBetslipData } from "redux/reselect/betslip-selector";
import { getCmsLayoutMobileVanillaBetslipWidget } from "redux/reselect/cms-layout-widgets";
import { getCmsConfigBettingMultipleStakeLimits } from "redux/reselect/cms-selector";
import {
  claimFreeBet,
  obtainSpecificMaxStake,
  onRefreshBetslipHandler,
  onRemoveSelectionHandler,
  unclaimFreeBet,
} from "utils/betslip-utils";

const BetslipMultiTabContent = ({ stakeChangeConfirmedHandler, stakeChangeHandler, stakeChangeState }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();

  const getBetslipData = useMemo(makeGetBetslipData, []);
  const betslipData = useSelector((state) => getBetslipData(state, location.pathname));

  // const dirtyPotentialWin = useSelector((state) => state.betslip.dirtyPotentialWin);
  const currencyCode = useSelector((state) => state.auth.currencyCode);
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const multipleStakeLimits = useSelector(getCmsConfigBettingMultipleStakeLimits);
  const betslipWidget = useSelector((state) => getCmsLayoutMobileVanillaBetslipWidget(state, location));

  return (
    <div className={classes["betslip__cards"]}>
      {betslipData.model.outcomes.map((outcome) => {
        if (outcome.outcomeDescription) {
          return (
            <div
              className={`${classes["betslip__card"]} ${!outcome.valid ? classes["betslip__card_disabled"] : ""}`}
              key={outcome.outcomeDescription}
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
                </div>
              </div>
            </div>
          );
        }

        return null; // skip if the data is pending API initialization!
      })}

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
            className={`${classes["betslip__card"]} ${!allOutcomesValid ? classes["betslip__card_disabled"] : ""}`}
            key={multiple.typeId}
          >
            <div className={classes["betslip__card-container"]}>
              <div className={classes["betslip__card-head"]}>
                <span className={classes["betslip__card-title"]}>{multiple.typeDescription}</span>
                <span className={classes["betslip__card-coeficient"]}>
                  <span>{multiple.formattedPrice}</span>
                </span>
              </div>
              <div className={classes["betslip__card-body"]}>
                <div className={classes["betslip__card-stake"]}>
                  <span>{t("betslip_panel.stake")}</span>
                  <span className={classes["betslip__card-input"]}>
                    {loggedIn && !(selectedFreeBetId > 0) && betslipWidget?.data?.maxStake ? (
                      <span onClick={() => obtainSpecificMaxStake(dispatch, betslipData, multiple.typeId, null, 1)}>
                        {t("betslip_panel.max")}
                      </span>
                    ) : null}
                    <input
                      disabled={!allOutcomesValid || selectedFreeBetId > 0}
                      min={0}
                      name="input-stake"
                      placeholder="0"
                      type="number"
                      value={stake > 0 ? stake : ""}
                      onBlur={stakeChangeConfirmedHandler}
                      onChange={(e) => stakeChangeHandler(e, multiple.typeId, index)}
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
          </div>
        );
      })}
    </div>
  );
};

BetslipMultiTabContent.propTypes = {
  stakeChangeConfirmedHandler: PropTypes.func.isRequired,
  stakeChangeHandler: PropTypes.func.isRequired,
  stakeChangeState: PropTypes.object.isRequired,
};

export default React.memo(BetslipMultiTabContent);
