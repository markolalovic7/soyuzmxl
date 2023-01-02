import TablePagination from "applications/vanilladesktop/pages/MyBetsPage/components/MyBetsTable/components/TablePagination";
import TableRow from "applications/vanilladesktop/pages/MyBetsPage/components/MyBetsTable/components/TableRow";
import TableToolbar from "applications/vanilladesktop/pages/MyBetsPage/components/MyBetsTable/components/TableToolbar";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { BET_TYPE_PENDING, BET_TYPE_SETTLED } from "../../../../../../../constants/bet-types";
import { getBetslipTransactionHistory } from "../../../../../../../redux/actions/transaction-actions";
import {
  getDatejsObjectHours00Min00Sec00,
  getDatejsObjectHours23Min59Sec59,
  getDatejsObjectISO,
} from "../../../../../../../utils/dayjs";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MyBetsTable = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [betslips, setBetslips] = useState([]);
  const [betslipsIsLoading, setBetslipIsLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState(0);
  // const [dateStart, setDateStart] = useState(getDatejsObjectHours00Min00Sec00(dayjs().subtract(7, "day")));
  // const [dateEnd, setDateEnd] = useState(getDatejsObjectHours23Min59Sec59(dayjs()));
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [refreshToken, setRefreshToken] = useState(0); // Token to force API fetch refresh
  const [tabActive, setTabActive] = useState(BET_TYPE_PENDING); //

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchBetslips = async () => {
      setBetslipIsLoading(true);
      const action = await dispatch(
        getBetslipTransactionHistory({
          cancelToken: source.token,
          dateFrom: getDatejsObjectISO(getDatejsObjectHours00Min00Sec00(dayjs(dateStart))),
          dateTo: getDatejsObjectISO(getDatejsObjectHours23Min59Sec59(dayjs(dateEnd))),
          settled: tabActive === BET_TYPE_SETTLED,
        }),
      );
      if (getBetslipTransactionHistory.fulfilled.match(action)) {
        setBetslipIsLoading(false);
        setBetslips(action.payload.betslipTransactions);
        setSelectedPage(0); // always reset to the first page after a data fetch

        return;
      }
      setBetslipIsLoading(false);
      setBetslips([]);
    };

    fetchBetslips();

    return () => {
      source.cancel();
    };
  }, [dateStart, dateEnd, dispatch, refreshToken, tabActive]);

  const onToggleRefresh = () => {
    setRefreshToken(Math.random());
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

        return (
          <TableRow
            betDataCount={betDataCount}
            bets={data.bets}
            createDate={data.createdDate}
            credit={data.totalCredit}
            debit={data.totalDebit}
            key={data.betSlipId}
            reference={data.betSlipReference}
            transactionCount={transactionCount}
          />
        );
      }),
    [betslips, selectedPage],
  );

  return (
    <>
      <TableToolbar
        dateEnd={dateEnd}
        dateStart={dateStart}
        setDateEnd={setDateEnd}
        setDateStart={setDateStart}
        setTabActive={setTabActive}
        tabActive={tabActive}
        toggleRefresh={onToggleRefresh}
      />
      <div className={classes["registration__content"]}>
        {betslipsIsLoading ? (
          <div className={classes["spinner-container"]}>
            <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
          </div>
        ) : (
          <>
            <div className={classes["registration__table"]}>
              <table cellSpacing="0" className={classes["table"]}>
                <thead>
                  <tr>
                    <td>{t("vanilladesktop.financial_table.reference")}</td>
                    <td>{t("vanilladesktop.financial_table.created_date")}</td>
                    <td>{t("vanilladesktop.financial_table.debit")}</td>
                    <td>{t("vanilladesktop.financial_table.credit")}</td>
                    <td>{t("vanilladesktop.financial_table.bet_type")}</td>
                    <td>{t("vanilladesktop.financial_table.transaction_id")}</td>
                    <td>{t("vanilladesktop.financial_table.result")}</td>
                    <td>{t("vanilladesktop.financial_table.details")}</td>
                  </tr>
                </thead>
                <tbody>{TableContent}</tbody>
              </table>
            </div>
            <TablePagination
              pageCount={Math.ceil(betslips.length / 10)}
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
          </>
        )}
      </div>
    </>
  );
};

export default React.memo(MyBetsTable);
