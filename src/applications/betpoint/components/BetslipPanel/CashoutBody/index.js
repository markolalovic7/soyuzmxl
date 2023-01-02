import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import groupBy from "lodash.groupby";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getAuthLanguage } from "../../../../../redux/reselect/auth-selector";
import { getSportsSelector } from "../../../../../redux/reselect/sport-selector";
import { cashout, getActiveBetDetail, getFreshQuotation } from "../../../../../redux/slices/cashoutSlice";
import classes from "../../../scss/betpoint.module.scss";
import CashoutPopUpSuccess from "../CashoutPopUpSuccess";

import CashoutExpansionCard from "./CashoutExpansionCard";

const CashoutBody = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const accountId = useSelector((state) => state.auth.accountId);
  const activeBets = useSelector((state) => state.cashout.activeBets);
  const myBetLoading = useSelector((state) => state.cashout.loading);
  const cashoutProcessing = useSelector((state) => state.cashout.cashoutProcessing);
  const cashoutConfirmed = useSelector((state) => state.cashout.cashoutConfirmed);
  const cashoutFailed = useSelector((state) => state.cashout.cashoutFailed);

  const sports = useSelector(getSportsSelector);
  const language = useSelector(getAuthLanguage);

  const [activeMyBet, setActiveMyBet] = useState(null);
  const [sliderValue, setSliderValue] = useState(100);

  // When loading the page for the first time, or logging in, find out the pending bets...
  useEffect(() => {
    if (loggedIn && accountId && !cashoutConfirmed) {
      // trigger always when the user first log in, and after the user OK's a cashout confirmation
      dispatch(getActiveBetDetail());
    }
  }, [loggedIn, accountId, cashoutConfirmed]);

  useEffect(() => {
    // When the tab is selected, load the bet history
    if (!cashoutProcessing && activeMyBet) {
      const intervalId = setInterval(() => {
        const bet = activeBets.find((bet) => bet.betBucketId === activeMyBet);
        const activeQuote = bet.cashoutQuotePercentageList.find((quote) => quote.percentage * 100 === sliderValue);
        if (activeQuote) dispatch(getFreshQuotation({ betBucketId: bet.betBucketId, quote: activeQuote.quote }));
      }, 3000);

      return () => clearInterval(intervalId);
    }

    return undefined;
  }, [activeMyBet, cashoutProcessing]);

  const [sportCount, setSportCount] = useState({});
  useEffect(() => {
    if (activeBets) {
      const sportCountHash = {};
      activeBets
        .filter((bet) => !bet.disabled)
        .forEach((bet) => {
          const groupedSelectionsBySport = groupBy(bet.cashoutBetDescriptions, (selection) => selection.sportCode);

          Object.keys(groupedSelectionsBySport).forEach((sportCode) => {
            if (!sportCountHash[sportCode]) {
              sportCountHash[sportCode] = 0;
            }
            sportCountHash[sportCode] = sportCountHash[sportCode] + 1;
          });
        });
      setSportCount(sportCountHash);
    }
  }, [activeBets]);

  const [activeSport, setActiveSport] = useState();

  useEffect(() => {
    if (!activeSport && Object.keys(sportCount).length > 0) {
      setActiveSport(Object.keys(sportCount)[0]);
    }
  }, [sportCount]);

  const onMyBetsExpandHandler = (id) => {
    if (activeMyBet === id) {
      setActiveMyBet(null);
    } else {
      setActiveMyBet(id);
    }
  };
  const onCashoutHandler = (betBucketId, stake, quote, percentage) => {
    dispatch(cashout({ betBucketId, percentage, quote, stake }));
  };

  return (
    <div className={cx(classes["cashout"], { [classes["active"]]: true })}>
      <div className={classes["cashout-tabs"]}>
        <div className={classes["cashout-tabs__tabs"]}>
          <div className={cx(classes["cashout-tabs__now"], { [classes["active"]]: true })}>Cash Out</div>
        </div>
        {myBetLoading && !(activeBets?.length > 0) && (
          <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} />
        )}

        {activeBets && (
          <div className={classes["cashout-tabs__body"]}>
            <div className={classes["cashout-tabs__sports"]}>
              {Object.entries(sportCount).map((entry) => {
                const sportCode = entry[0];
                const count = entry[1];

                return (
                  <div
                    className={cx(classes["cashout-tabs__sport"], { [classes["active"]]: activeSport === sportCode })}
                    key={sportCode}
                    onClick={() => setActiveSport(sportCode)}
                  >
                    <div className={classes["cashout-tabs__numbers"]}>{count}</div>
                    <div className={classes["cashout-tabs__icon"]}>
                      <i className={cx(classes["qicon-default"], classes[`qicon-${sportCode.toLowerCase()}`])} />
                    </div>
                    <div className={classes["cashout-tabs__name"]}>
                      {sports && sports[sportCode] ? sports[sportCode].description : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div className={classes["cashout__body"]}>
        {myBetLoading && !(activeBets?.length > 0) && (
          <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} />
        )}

        {activeBets.map((bet) => {
          const qualifies = !!bet.cashoutBetDescriptions.find((x) => x.sportCode === activeSport);
          if (!qualifies) return null;
          if (bet.disabled) return null;

          return (
            <div className={classes["cashout-card"]} key={bet.betBucketId}>
              <div className={classes["cashout-card__header"]}>
                <h3 className={classes["cashout-card__title"]}>{bet.betType}</h3>
              </div>
              <div className={classes["cashout-card__body"]}>
                {bet.cashoutBetDescriptions.map((selection, index) => (
                  <React.Fragment key={index}>
                    <span className={classes["cashout-card__country"]}>
                      {`${selection.outcomeDescription} @${selection.price}`}
                    </span>
                    <span className={classes["cashout-card__winner"]}>
                      {`${selection.marketDescription} - ${selection.periodDescription}`}
                    </span>
                    <span className={classes["cashout-card__outright"]}>{selection.eventDescription}</span>
                  </React.Fragment>
                ))}

                {activeMyBet !== bet.betBucketId && (
                  <div
                    className={classes["cashout-card__button"]}
                    style={{ pointerEvents: bet.disabled ? "none" : "auto" }}
                    onClick={() => setActiveMyBet(bet.betBucketId)}
                  >
                    Details
                  </div>
                )}
                {activeMyBet === bet.betBucketId && (
                  <CashoutExpansionCard
                    active={activeMyBet === bet.betBucketId}
                    betBucketId={bet.betBucketId}
                    disabled={bet.disabled}
                    quotes={bet.cashoutQuotePercentageList}
                    stake={bet.stake}
                    onCashoutHandler={onCashoutHandler}
                    onExpand={() => onMyBetsExpandHandler(bet.betBucketId)}
                    onSliderValueChange={setSliderValue}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {cashoutConfirmed && <CashoutPopUpSuccess />}
      {cashoutFailed && <CashoutPopUpSuccess />}
    </div>
  );
};

export default React.memo(CashoutBody);
