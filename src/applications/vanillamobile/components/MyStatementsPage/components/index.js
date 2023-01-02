import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import classes from "../styles/index.module.scss";
import { getButtonStyles } from "../utils/styles";

import TransactionItem from "./TransactionItem";
import FontIcon from "applications/vanillamobile/common/components/FontIcon";
import HeaderTab from "applications/vanillamobile/common/components/HeaderTab";
import SectionNoData from "applications/vanillamobile/common/components/SectionNoData";
import {
  TRANSACTION_ITEM_TYPE_ADJUSTMENT,
  TRANSACTION_ITEM_TYPE_BONUS,
  TRANSACTION_ITEM_TYPE_CASINO,
  TRANSACTION_ITEM_TYPE_DEPOSIT,
  TRANSACTION_ITEM_TYPE_WITHDRAWAL,
  TRANSACTION_TYPE_BONUS,
  TRANSACTION_TYPE_OTHER,
  TRANSACTION_TYPE_PAYMENT,
  TRANSACTION_TYPE_PENDING,
  TRANSACTION_TYPE_SETTLED,
} from "constants/transaction-types";
import { getTransactionHistory } from "redux/actions/transaction-actions";
import { getAuthPriceFormat } from "redux/reselect/auth-selector";
import {
  getDatejsAdd,
  getDatejsNow,
  getDatejsNowHours00Min00Sec00Timestamp,
  getDatejsObjectHours00Min00Sec00,
  getDatejsObjectHours23Min59Sec59,
  getDatejsObjectISO,
  getDatejsObjectTimestamp,
  getDatejsSubtract,
} from "utils/dayjs";
import { formatDateNext7Days } from "utils/ui-labels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

const propTypes = {};
const defaultProps = {};

const TRANSACTION_TABS = [TRANSACTION_TYPE_SETTLED, TRANSACTION_TYPE_PENDING];
const TRANSACTION_SUB_TYPES = [TRANSACTION_TYPE_PAYMENT, TRANSACTION_TYPE_BONUS, TRANSACTION_TYPE_OTHER];

const MyStatementsPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const authPriceFormat = useSelector(getAuthPriceFormat);
  const [tabActive, setTabActive] = useState(TRANSACTION_TYPE_SETTLED);
  const [subTabActive, setSubTabActive] = useState(TRANSACTION_TYPE_PAYMENT);
  const [dateStart, setDateStart] = useState(getDatejsObjectHours00Min00Sec00(getDatejsNow()));
  const [transactions, setTransactions] = useState([]);
  const [transactionsIsFetching, setTransactionsIsFetching] = useState(false);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchTransactions = async () => {
      setTransactionsIsFetching(true);
      const action = await dispatch(
        getTransactionHistory({
          cancelToken: source.token,
          dateFrom: getDatejsObjectISO(dateStart),
          dateTo: getDatejsObjectISO(getDatejsObjectHours23Min59Sec59(getDatejsAdd(dateStart, 7, "day"))),
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
  }, [authPriceFormat, dateStart, dispatch, tabActive]);

  const renderNavigationBar = () => {
    const isDateToday =
      getDatejsNowHours00Min00Sec00Timestamp() ===
      getDatejsObjectTimestamp(getDatejsObjectHours00Min00Sec00(dateStart));
    const onNextWeekClick = () => {
      setDateStart(getDatejsObjectHours00Min00Sec00(getDatejsAdd(dateStart, 7, "day")));
    };
    const onPrevWeekClick = () => {
      setDateStart(getDatejsObjectHours00Min00Sec00(getDatejsSubtract(dateStart, 7, "day")));
    };

    return (
      <div className={classes["settled"]}>
        <div className={classes["mybets-calendar"]}>
          <span className={classes["mybets-calendar__arrow-left"]} onClick={onPrevWeekClick} />
          <div className={classes["mybets-calendar__body"]}>
            <span className={classes["mybets-calendar__icon"]}>
              <FontIcon icon={faCalendarAlt} />
            </span>
            <div className={classes["mybets-calendar__text"]}>{formatDateNext7Days(dateStart)}</div>
          </div>
          <span
            className={`${classes["mybets-calendar__arrow-right"]} ${
              isDateToday ? classes["my-statements-arrow-left-disabled"] : "none"
            }`}
            onClick={onNextWeekClick}
          />
        </div>
        <div className={classes["settled-navigation"]}>
          <ul className={classes["settled-navigation__list"]}>
            {TRANSACTION_SUB_TYPES.map((tab) => (
              <li className={getButtonStyles(tab === subTabActive)} key={tab}>
                <a onClick={() => setSubTabActive(tab)}>{tab}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderTransactionItems = () => {
    if (transactionsIsFetching) {
      return (
        <div className={classes["spinner-container"]}>
          <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
        </div>
      );
    }
    const transactionsFiltered = transactions.filter((transaction) => {
      if (subTabActive === TRANSACTION_TYPE_PAYMENT) {
        return [TRANSACTION_ITEM_TYPE_DEPOSIT, TRANSACTION_ITEM_TYPE_WITHDRAWAL].includes(transaction.transactionType);
      }
      if (subTabActive === TRANSACTION_TYPE_BONUS) {
        return transaction.transactionType === TRANSACTION_ITEM_TYPE_BONUS;
      }

      // Note: All other types are go to `OTHER` sub type.
      return [TRANSACTION_ITEM_TYPE_ADJUSTMENT, TRANSACTION_ITEM_TYPE_CASINO].includes(transaction.transactionType);
    });

    if (transactionsFiltered.length === 0) {
      return <SectionNoData title={t("vanillamobile.pages.my_statements_page.my_statements_empty")} />;
    }

    return transactionsFiltered.map((transaction) => (
      <TransactionItem key={transaction.transactionId} {...transaction} />
    ));
  };

  return (
    <div className={classes["navigation"]}>
      <HeaderTab active={tabActive} tabs={TRANSACTION_TABS} onTabClick={setTabActive} />
      <div className={`${classes["main"]} ${classes["main_special"]}`}>
        <div className={classes["main__container"]}>
          {renderNavigationBar()}
          {renderTransactionItems()}
        </div>
      </div>
    </div>
  );
};

MyStatementsPage.propTypes = propTypes;
MyStatementsPage.defaultProps = defaultProps;

export default MyStatementsPage;
