import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/betpoint/scss/betpoint.module.scss";
import axios from "axios";
import cx from "classnames";
import getSymbolFromCurrency from "currency-symbol-map";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { BET_TYPE_PENDING, BET_TYPE_SETTLED } from "../../../../../constants/bet-types";
import { getBetslipTransactionHistory } from "../../../../../redux/actions/transaction-actions";
import { getBalance } from "../../../../../redux/reselect/balance-selector";
import {
  getDatejsObjectHours00Min00Sec00,
  getDatejsObjectHours23Min59Sec59,
  getDatejsObjectISO,
} from "../../../../../utils/dayjs";
import Header from "../../../components/Header";

const BetHistoryPage = () => {
  const balance = useSelector(getBalance);
  const currencyCode = useSelector((state) => state.auth?.currencyCode);
  const dispatch = useDispatch();
  const history = useHistory();

  const [betslips, setBetslips] = useState([]);
  const [betslipsIsLoading, setBetslipIsLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState(0);
  const [visiblePages, setVisiblePages] = useState([]);

  const [refreshToken, setRefreshToken] = useState(0); // Token to force API fetch refresh
  const [tabActive, setTabActive] = useState(BET_TYPE_PENDING); //

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchBetslips = async () => {
      setBetslipIsLoading(true);
      const action = await dispatch(
        getBetslipTransactionHistory({
          cancelToken: source.token,
          dateFrom: getDatejsObjectISO(getDatejsObjectHours00Min00Sec00(dayjs().add(-365, "day"))), // TODO
          dateTo: getDatejsObjectISO(getDatejsObjectHours23Min59Sec59(dayjs())),
          settled: tabActive === BET_TYPE_SETTLED,
        }),
      );
      if (getBetslipTransactionHistory.fulfilled.match(action)) {
        setBetslipIsLoading(false);
        setBetslips(action.payload.betslipTransactions);
        setSelectedPage(0); // always reset to the first page after a data fetch
        setVisiblePages(
          new Array(Math.ceil(action.payload.betslipTransactions.length / 10))
            .fill(0)
            .slice(0, 5)
            .map((x, index) => index),
        );

        return;
      }
      setBetslipIsLoading(false);
      setBetslips([]);
    };

    fetchBetslips();

    return () => {
      source.cancel();
    };
  }, [dispatch, refreshToken, tabActive]);

  const onToggleRefresh = () => {
    setRefreshToken(Math.random());
  };

  const previousPagination5Pages = () => {
    if (visiblePages.length > 0 && visiblePages[0] >= 5) {
      const updatedPages = [
        visiblePages[0] - 5,
        visiblePages[0] - 4,
        visiblePages[0] - 3,
        visiblePages[0] - 2,
        visiblePages[0] - 1,
      ];
      setVisiblePages(updatedPages);
    }
  };

  const nextPagination5Pages = () => {
    const numberOfPages = Math.ceil(betslips.length / 10);
    if (visiblePages.length === 5 && visiblePages[4] < numberOfPages - 1) {
      const newSequenceLength = betslips.slice(visiblePages[4], numberOfPages).slice(0, 5);
      const updatedPagesAux = newSequenceLength.map((x, index) => index + 1);
      const updatedPages = [];

      updatedPagesAux.forEach((x) => {
        updatedPages.push(visiblePages[4] + x);
      });

      setVisiblePages(updatedPages);
    }
  };

  const TableContent = useMemo(
    () =>
      betslips?.slice(selectedPage * 10, (selectedPage + 1) * 10)?.map((data) => {
        let transactionCount = 0;
        let betDataCount = 0;
        data.bets.forEach((bet) => {
          transactionCount += bet.transactions.length;
          bet.transactions.forEach((transaction) => {
            betDataCount += transaction.betData.length;
          });
        });

        return data.bets.map((bet) => {
          // Obtain unique outcomes
          const outcomes = new Set();
          const outcomeResults = {};
          bet.transactions.forEach((transaction) => {
            transaction.betData.forEach((betData) => {
              const dataDescription = `${betData.outcomeDescription} @${betData.price} - [${betData.eventDescription} - ${betData.marketDescription} - ${betData.periodDescription}]`;
              outcomes.add(dataDescription);
              outcomeResults[dataDescription] = betData.result;
            });
          });

          return (
            <tr className={classes["bet-history-table__activity"]} key={bet.betId}>
              <td className={classes["bet-history-table__transaction-id"]}>
                <span>{data.betSlipReference}</span>
              </td>
              <td className={classes["bet-history-table__created-date"]}>
                {dayjs(data.createdDate).format("DD-MMM-YYYY HH:mm")}
              </td>
              <td className={classes["bet-history-table__type-subtype"]}>{bet.betTypeDescription}</td>
              <td className={classes["bet-history-table__debit"]}>{bet.debit.toLocaleString()}</td>
              <td className={classes["bet-history-table__credit"]}>{bet.credit.toLocaleString()}</td>
              <td className={classes["bet-history-table__description"]}>
                <div className={classes["bet-history-table__box"]}>
                  <div className={classes["bet-history-table__number"]}>
                    <span>{bet.betId}</span>
                  </div>

                  <div className={classes["bet-history-table__items"]}>
                    {[...outcomes].map((outcome, index) => (
                      <div className={classes["bet-history-table__item"]} key={index}>
                        <div className={classes["bet-history-table__status"]}>
                          {outcomeResults[outcome] === "NO_RESULT" ? "PENDING" : "SETTLED"}
                        </div>
                        <div className={classes["bet-history-table__details"]}>
                          {index === 0 && <span>{outcome}</span>}
                          {index > 0 && (
                            <div className={classes["bet-history-table__text"]}>
                              <span>{outcome}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </td>
            </tr>
          );
        });
      }),
    [betslips, selectedPage],
  );

  return (
    <div className={classes["wrapper"]}>
      <Header />
      <div className={classes["main"]}>
        <div className={classes["bet-history"]}>
          <div className={classes["bet-history-balance"]}>
            <div className={classes["bet-history-balance__row"]}>
              <div className={classes["bet-history-balance__name"]}>Available For Withdrawal</div>
              <div className={classes["bet-history-balance__data"]}>
                {balance
                  ? `${getSymbolFromCurrency(currencyCode)} ${balance.cashBalance.toLocaleString()}`
                  : "Loading..."}
              </div>
            </div>
            <div className={classes["bet-history-balance__row"]}>
              <div className={classes["bet-history-balance__name"]}>Promo Money</div>
              <div className={classes["bet-history-balance__data"]}>
                {balance
                  ? `${getSymbolFromCurrency(currencyCode)} ${(
                      balance.promoBalance + balance.promoSnrBalance
                    ).toLocaleString()}`
                  : "Loading..."}
              </div>
            </div>
          </div>
          <div className={classes["bet-history__header"]}>
            <div className={classes["bet-history__title"]}>My Transaction History</div>
            <div className={classes["bet-history__bets"]}>
              <select
                className={classes["bet-history__select"]}
                value={tabActive}
                onChange={(e) => setTabActive(e.target.value)}
              >
                <option value={BET_TYPE_PENDING}>Pending Bets</option>
                <option value={BET_TYPE_SETTLED}>Settled Bets</option>
              </select>
              <div className={classes["bet-history__arrow"]}>
                <FontAwesomeIcon icon={faChevronDown} />
              </div>
            </div>
          </div>
          <div className={classes["bet-history-table"]}>
            <table>
              <thead className={classes["bet-history-table__head"]}>
                <tr className={classes["bet-history-table__activity"]}>
                  <td className={classes["bet-history-table__transaction-id"]}>Reference</td>
                  <td className={classes["bet-history-table__created-date"]}>Created Date</td>
                  <td className={classes["bet-history-table__type-subtype"]}>Bet Type</td>
                  <td className={classes["bet-history-table__debit"]}>Debit</td>
                  <td className={classes["bet-history-table__credit"]}>Credit</td>
                  <td className={classes["bet-history-table__description"]}>Details</td>
                </tr>
              </thead>
              <tbody className={classes["bet-history-table__body"]}>{TableContent}</tbody>
            </table>
          </div>
          <div className={classes["bet-history__footer"]}>
            <div className={classes["bet-history__buttons"]}>
              <div className={classes["bet-history__button"]} onClick={() => history.goBack()}>
                Back
              </div>
            </div>
            <div className={classes["bet-history-pager"]}>
              <div
                className={cx(
                  classes["bet-history-pager__item"],
                  { [classes["disabled"]]: false },
                  { [classes["active"]]: false },
                )}
              >
                {`Page ${selectedPage + 1} of ${Math.ceil(betslips.length / 10)}`}
              </div>
              <div
                className={cx(
                  classes["bet-history-pager__item"],
                  { [classes["disabled"]]: betslips.length === 0 || selectedPage === 0 },
                  { [classes["active"]]: false },
                )}
                onClick={() => setSelectedPage(0)}
              >
                First
              </div>
              <div
                className={cx(
                  classes["bet-history-pager__item"],
                  { [classes["disabled"]]: betslips.length === 0 || selectedPage < 5 },
                  { [classes["active"]]: visiblePages.length > 0 && visiblePages[0] >= 5 },
                )}
                onClick={previousPagination5Pages}
              >
                «
              </div>

              {visiblePages.map((x) => (
                <div
                  className={cx(
                    classes["bet-history-pager__item"],
                    { [classes["disabled"]]: selectedPage === x },
                    { [classes["active"]]: selectedPage === x },
                  )}
                  key={x}
                  onClick={() => setSelectedPage(x)}
                >
                  {x + 1}
                </div>
              ))}
              <div
                className={cx(
                  classes["bet-history-pager__item"],
                  {
                    [classes["disabled"]]:
                      betslips.length === 0 ||
                      visiblePages.length < 5 ||
                      visiblePages[4] === Math.ceil(betslips.length / 10) - 1,
                  },
                  {
                    [classes["active"]]:
                      visiblePages.length === 5 && visiblePages[4] < Math.ceil(betslips.length / 10) - 1,
                  },
                )}
                onClick={nextPagination5Pages}
              >
                »
              </div>
              <div
                className={cx(
                  classes["bet-history-pager__item"],
                  {
                    [classes["disabled"]]:
                      betslips.length === 0 || selectedPage === Math.ceil(betslips.length / 10) - 1,
                  },
                  { [classes["active"]]: false },
                )}
                onClick={() => setSelectedPage(Math.max(Math.ceil(betslips.length / 10) - 1, 0))}
              >
                Last
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BetHistoryPage);
