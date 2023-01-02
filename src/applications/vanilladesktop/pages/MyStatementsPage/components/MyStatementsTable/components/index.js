import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import {
  TRANSACTION_ITEM_TYPE_ADJUSTMENT,
  TRANSACTION_ITEM_TYPE_BONUS,
  TRANSACTION_ITEM_TYPE_CASINO,
  TRANSACTION_ITEM_TYPE_DEPOSIT,
  TRANSACTION_ITEM_TYPE_WITHDRAWAL,
  TRANSACTION_TYPE_BONUS,
  TRANSACTION_TYPE_PAYMENT,
  TRANSACTION_TYPE_SETTLED,
} from "../../../../../../../constants/transaction-types";
import { getTransactionHistory } from "../../../../../../../redux/actions/transaction-actions";
import {
  getDatejsObjectHours00Min00Sec00,
  getDatejsObjectHours23Min59Sec59,
  getDatejsObjectISO,
} from "../../../../../../../utils/dayjs";

import TablePagination from "./TablePagination";
import TableRow from "./TableRow";
import TableToolbar from "./TableToolbar";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MyStatementsTable = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [transactions, setTransactions] = useState([]);
  const [transactionsIsFetching, setTransactionsIsFetching] = useState(false);
  const [selectedPage, setSelectedPage] = useState(0);
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [refreshToken, setRefreshToken] = useState(0); // Token to force API fetch refresh
  const [tabActive, setTabActive] = useState(TRANSACTION_TYPE_SETTLED); //
  const [subTabActive, setSubTabActive] = useState(TRANSACTION_TYPE_PAYMENT);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchTransactions = async () => {
      setTransactionsIsFetching(true);
      const action = await dispatch(
        getTransactionHistory({
          cancelToken: source.token,
          dateFrom: getDatejsObjectISO(getDatejsObjectHours00Min00Sec00(dayjs(dateStart))),
          dateTo: getDatejsObjectISO(getDatejsObjectHours23Min59Sec59(dayjs(dateEnd))),
          settled: tabActive === TRANSACTION_TYPE_SETTLED,
        }),
      );
      if (getTransactionHistory.fulfilled.match(action)) {
        setTransactionsIsFetching(false);
        setTransactions(action.payload.transactions);

        return;
      }
      setTransactionsIsFetching(false);
      setTransactions([]);
    };

    fetchTransactions();

    return () => {
      source.cancel();
    };
  }, [dateStart, dateEnd, dispatch, refreshToken, tabActive]);

  const onToggleRefresh = () => {
    setRefreshToken(Math.random());
  };

  const filteredTransactions = useMemo(
    () =>
      transactions?.filter((transaction) => {
        if (subTabActive === TRANSACTION_TYPE_PAYMENT) {
          return [TRANSACTION_ITEM_TYPE_DEPOSIT, TRANSACTION_ITEM_TYPE_WITHDRAWAL].includes(
            transaction.transactionType,
          );
        }
        if (subTabActive === TRANSACTION_TYPE_BONUS) {
          return transaction.transactionType === TRANSACTION_ITEM_TYPE_BONUS;
        }

        // Note: All other types are go to `OTHER` sub type.
        return [TRANSACTION_ITEM_TYPE_ADJUSTMENT, TRANSACTION_ITEM_TYPE_CASINO].includes(transaction.transactionType);
      }),
    [transactions, subTabActive],
  );

  const TableContent = useMemo(
    () =>
      filteredTransactions
        ?.slice(selectedPage * 10, (selectedPage + 1) * 10)
        ?.map((transaction) => <TableRow key={transaction.transactionId} transaction={transaction} />),
    [filteredTransactions, selectedPage],
  );

  return (
    <>
      <TableToolbar
        dateEnd={dateEnd}
        dateStart={dateStart}
        setDateEnd={setDateEnd}
        setDateStart={setDateStart}
        setSubTabActive={setSubTabActive}
        setTabActive={setTabActive}
        subTabActive={subTabActive}
        tabActive={tabActive}
        toggleRefresh={onToggleRefresh}
      />
      <div className={classes["registration__content"]}>
        {transactionsIsFetching ? (
          <div className={classes["spinner-container"]}>
            <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
          </div>
        ) : (
          <>
            <div className={classes["registration__table"]}>
              <table cellSpacing="0" className={classes["table"]}>
                <thead>
                  <tr>
                    <td>{t("vanilladesktop.financial_table.transaction_id")}</td>
                    <td>{t("vanilladesktop.financial_table.created_date")}</td>
                    <td>{t("vanilladesktop.financial_table.debit")}</td>
                    <td>{t("vanilladesktop.financial_table.credit")}</td>
                    <td>{t("vanilladesktop.financial_table.type")}</td>
                    <td>{t("vanilladesktop.financial_table.subtype")}</td>
                    <td>{t("vanilladesktop.financial_table.status")}</td>
                    <td>{t("vanilladesktop.financial_table.description")}</td>
                  </tr>
                </thead>
                <tbody>{TableContent}</tbody>
              </table>
            </div>
            <TablePagination
              pageCount={Math.ceil(filteredTransactions.length / 10)}
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
          </>
        )}
      </div>
    </>
  );
};

export default React.memo(MyStatementsTable);
