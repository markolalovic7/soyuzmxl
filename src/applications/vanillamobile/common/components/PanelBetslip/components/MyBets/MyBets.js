import cx from "classnames";
import getSymbolFromCurrency from "currency-symbol-map";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import SectionLoader from "../../../SectionLoader";

import CashoutConfirmationPopUp from "./CashoutPopUp/CashoutConfirmationPopUp/CashoutConfirmationPopUp";
import CashoutErrorPopUp from "./CashoutPopUp/CashoutErrorPopUp/CashoutErrorPopUp";
import CashoutRange from "./CashoutRange";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getAuthLanguage } from "redux/reselect/auth-selector";
import { getCmsLayoutMobileVanillaBetslipWidget } from "redux/reselect/cms-layout-widgets";
import {
  cashout,
  clearCashoutState,
  getActiveBetCount,
  getActiveBetDetail,
  getFreshQuotation,
} from "redux/slices/cashoutSlice";

const propTypes = {
  activeMyBet: PropTypes.number,
  onExpandBet: PropTypes.func.isRequired,
  showMyBetsTab: PropTypes.bool.isRequired,
};

const defaultProps = {
  activeMyBet: undefined,
};

// Todo: refactor in future.
const MyBets = ({ activeMyBet, onExpandBet, showMyBetsTab }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();

  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const accountId = useSelector((state) => state.auth.accountId);
  const activeBets = useSelector((state) => state.cashout.activeBets);
  const myBetLoading = useSelector((state) => state.cashout.loading);
  const cashoutProcessing = useSelector((state) => state.cashout.cashoutProcessing);
  const cashoutConfirmed = useSelector((state) => state.cashout.cashoutConfirmed);
  const cashoutFailed = useSelector((state) => state.cashout.cashoutFailed);
  const currencyCode = useSelector((state) => state.auth.currencyCode);

  const language = useSelector(getAuthLanguage);
  const betslipWidget = useSelector((state) => getCmsLayoutMobileVanillaBetslipWidget(state, location));

  // When loading the page for the first time, or logging in, find out the pending bets...
  useEffect(() => {
    if (loggedIn && accountId) {
      dispatch(getActiveBetCount());
    }
  }, [loggedIn, accountId]);

  useEffect(() => {
    // When the tab is selected, load the bet history (First time and successive times when the "confirm" pop up is cleared)
    if (showMyBetsTab && !cashoutConfirmed) {
      dispatch(getActiveBetDetail());
    }
  }, [showMyBetsTab, cashoutConfirmed, language]);

  const [rangeValue, setRangeValue] = useState([100]);

  useEffect(() => {
    // When the tab is selected, load the bet history
    if (activeMyBet && !cashoutProcessing) {
      const intervalId = setInterval(() => {
        // if an active bet has been selected for possible cashout, pro-actively refresh often
        const bet = activeBets.find((bet) => bet.betBucketId === activeMyBet);
        const activeQuote = bet.cashoutQuotePercentageList.find((quote) => quote.percentage * 100 === rangeValue[0]);
        dispatch(getFreshQuotation({ betBucketId: bet.betBucketId, quote: activeQuote.quote }));
      }, 3000);

      return () => clearInterval(intervalId);
    }

    return undefined;
  }, [activeMyBet, cashoutProcessing]);

  useEffect(() => {
    if (cashoutConfirmed) {
      setRangeValue([100]);
    }
  }, [cashoutConfirmed]);

  const onCashoutHandler = (betBucketId, stake, quote, percentage) => {
    dispatch(cashout({ betBucketId, percentage, quote, stake }));
  };

  return (
    <div className={`${classes["mybets"]} ${showMyBetsTab ? classes["active"] : ""}`}>
      <div className={classes["mybets__container"]}>
        {(myBetLoading || cashoutProcessing) && <SectionLoader overlay />}
        {/* { */}
        {/*    "betBucketId" : 388717, */}
        {/*    "betType" : "Single", */}
        {/*    "quote" : 0.0, */}
        {/*    "stake" : 100.0, */}
        {/*    "percentage" : 1.0, */}
        {/*    "cashoutQuotePercentageList" : [ ], */}
        {/*    "cashoutBetDescriptions" : [ { */}
        {/*    "eventDescription" : "Brighton & Hove Albion FC vs Arsenal FC", */}
        {/*    "marketDescription" : "1x2", */}
        {/*    "outcomeDescription" : "Draw", */}
        {/*    "periodDescription" : "Regulation Time", */}
        {/*    "sportCode" : "FOOT", */}
        {/*    "price" : "2.90" */}
        {/* } ], */}
        {/*    "status" : "SUSPENDED", */}
        {/*    "disabled" : true */}
        {/* }, */}

        {activeBets &&
          activeBets.map((bet) => {
            const activeQuote = bet.cashoutQuotePercentageList.find(
              (quote) => quote.percentage * 100 === rangeValue[0],
            );
            const validRangeSteps = [];
            bet.cashoutQuotePercentageList.forEach((quote) => {
              if (quote.stake > 0.99) {
                validRangeSteps.push(quote.percentage * 100);
              }
            });

            return (
              <div className={classes["mybets__card"]} key={bet.betBucketId}>
                <div className={classes["mybets__card-header"]}>
                  <h3 className={classes["mybets__card-title"]}>{bet.betType}</h3>
                </div>
                <div className={classes["mybets__card-body"]}>
                  {bet.cashoutBetDescriptions.map((selection, index) => (
                    <React.Fragment key={index}>
                      <span className={classes["mybets__card-country"]}>
                        {" "}
                        <i
                          className={cx(
                            classes["qicon-default"],
                            classes[`qicon-${selection.sportCode.toLowerCase()}`],
                          )}
                        />
                        {selection.outcomeDescription} @{selection.price}
                      </span>
                      <span className={classes["mybets__card-winner"]}>{selection.eventDescription}</span>
                      <span className={classes["mybets__card-outright"]}>
                        {`${selection.marketDescription} - ${selection.periodDescription}`}
                      </span>
                    </React.Fragment>
                  ))}

                  <div className={classes["mybets__card-stake"]}>
                    <span>
                      {t("betslip_panel.bet_stake")}
                      {bet.stake}
                    </span>
                    {!bet.disabled && betslipWidget?.data?.cashout ? (
                      <span
                        className={`${classes["mybets__arrow"]} ${
                          activeMyBet === bet.betBucketId ? classes["active"] : ""
                        }`}
                        onClick={() => onExpandBet(bet.betBucketId)}
                      />
                    ) : null}
                  </div>
                  <div
                    className={`${classes["mybets__cash"]} ${activeMyBet === bet.betBucketId ? classes["active"] : ""}`}
                    id="bets-cash-2"
                  >
                    {validRangeSteps.length > 1 && (
                      <CashoutRange
                        rangeValue={rangeValue}
                        setRangeValue={setRangeValue}
                        validRangeSteps={validRangeSteps}
                      />
                    )}

                    {activeMyBet === bet.betBucketId ? (
                      <>
                        <div className={classes["mybets__cash-top"]}>
                          <div className={classes["mybets__cash-stake"]}>
                            {t("betslip_panel.cash_out_stake")}
                            {activeQuote.stake}
                          </div>
                          <div className={classes["mybets__cash-profit"]}>
                            <span>{t("betslip_panel.profit")}</span>
                            <span>{(activeQuote.quote - activeQuote.stake).toLocaleString()}</span>
                          </div>
                        </div>
                        <button
                          className={classes["mybets__cash-button"]}
                          disabled={cashoutProcessing}
                          type="button"
                          onClick={() =>
                            onCashoutHandler(bet.betBucketId, activeQuote.stake, activeQuote.quote, rangeValue[0] / 100)
                          }
                        >
                          {t("betslip_panel.cash_out", {
                            value: `${getSymbolFromCurrency(currencyCode)} ${activeQuote.quote.toLocaleString()}`,
                          })}
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <CashoutConfirmationPopUp cashoutConfirmed={cashoutConfirmed} onClick={() => dispatch(clearCashoutState())} />

      <CashoutErrorPopUp cashoutError={cashoutFailed} onClick={() => dispatch(clearCashoutState())} />
    </div>
  );
};

MyBets.propTypes = propTypes;
MyBets.defaultProps = defaultProps;

export default MyBets;
