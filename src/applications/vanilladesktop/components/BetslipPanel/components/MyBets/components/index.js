import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import * as PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getAuthLanguage } from "../../../../../../../redux/reselect/auth-selector";
import {
  cashout,
  clearCashoutState,
  getActiveBetDetail,
  getFreshQuotation,
} from "../../../../../../../redux/slices/cashoutSlice";
import classes from "../../../../../scss/vanilladesktop.module.scss";
import CashoutErrorPopup from "../../CashoutErrorPopup";
import CashoutSuccessPopup from "../../CashoutSuccessPopup";
import MyBetStackExpansionPanel from "../../MyBetStackExpansionPanel";

const MyBets = ({ active, betslipWidget }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const accountId = useSelector((state) => state.auth.accountId);
  const activeBets = useSelector((state) => state.cashout.activeBets);
  const myBetLoading = useSelector((state) => state.cashout.loading);
  const cashoutProcessing = useSelector((state) => state.cashout.cashoutProcessing);
  const cashoutConfirmed = useSelector((state) => state.cashout.cashoutConfirmed);
  const cashoutFailed = useSelector((state) => state.cashout.cashoutFailed);

  const language = useSelector(getAuthLanguage);

  const [activeMyBet, setActiveMyBet] = useState(null);
  const [sliderValue, setSliderValue] = useState(100);

  // When loading the page for the first time, or logging in, find out the pending bets...
  useEffect(() => {
    if (loggedIn && active && accountId && !cashoutConfirmed) {
      // trigger always when the user first log in, and after the user OK's a cashout confirmation
      dispatch(getActiveBetDetail());
    }
  }, [loggedIn, accountId, active, cashoutConfirmed]);

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
    <div className={classes["mybets__container"]}>
      {!myBetLoading && !(activeBets?.length > 0) && (
        <div className={classes["betting-tickets__empty"]} style={{ minHeight: "200px" }}>
          <span className={classes["betting-tickets__empty-title"]}>
            {t("slimmobile.pages.my_bets_page.my_bets_empty")}
          </span>
        </div>
      )}
      {myBetLoading && !(activeBets?.length > 0) && (
        <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} />
      )}

      {activeBets && (
        <div style={{ minHeight: cashoutConfirmed || cashoutFailed ? "200px" : "100px" }}>
          {activeBets.map((bet) => (
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
                        className={cx(classes["qicon-default"], classes[`qicon-${selection.sportCode.toLowerCase()}`])}
                      />
                      {`${selection.outcomeDescription} @${selection.price}`}
                    </span>
                    <span className={classes["mybets__card-winner"]}>{selection.eventDescription}</span>
                    <span className={classes["mybets__card-outright"]}>
                      {`${selection.marketDescription} - ${selection.periodDescription}`}
                    </span>
                  </React.Fragment>
                ))}
                <MyBetStackExpansionPanel
                  active={activeMyBet === bet.betBucketId}
                  betBucketId={bet.betBucketId}
                  betslipWidget={betslipWidget}
                  disabled={bet.disabled}
                  quotes={bet.cashoutQuotePercentageList}
                  stake={bet.stake}
                  onCashoutHandler={onCashoutHandler}
                  onExpand={() => onMyBetsExpandHandler(bet.betBucketId)}
                  onSliderValueChange={setSliderValue}
                />
              </div>
              <CashoutSuccessPopup
                isOpen={activeMyBet === bet.betBucketId && cashoutConfirmed}
                onClose={() => dispatch(clearCashoutState())}
              />
              <CashoutErrorPopup
                isOpen={activeMyBet === bet.betBucketId && cashoutFailed}
                onClose={() => dispatch(clearCashoutState())}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

MyBets.propTypes = {
  active: PropTypes.bool.isRequired,
  betslipWidget: PropTypes.object.isRequired,
};

export default React.memo(MyBets);
