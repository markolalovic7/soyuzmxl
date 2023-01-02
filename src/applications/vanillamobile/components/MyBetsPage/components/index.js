import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import classes from "../styles/index.module.scss";

import ItemBetslip from "./ItemBetslip";
import FontIcon from "applications/vanillamobile/common/components/FontIcon";
import HeaderTab from "applications/vanillamobile/common/components/HeaderTab";
import SectionNoData from "applications/vanillamobile/common/components/SectionNoData";
import { BET_TYPE_SETTLED, BET_TYPES } from "constants/bet-types";
import { getBetslipTransactionHistory } from "redux/actions/transaction-actions";
import { getAuthPriceFormat } from "redux/reselect/auth-selector";
import {
  getDatejsNowHours00Min00Sec00Timestamp,
  getDatejsObjectHours00Min00Sec00,
  getDatejsObjectHours23Min59Sec59,
  getDatejsObjectISO,
  getDatejsObjectTimestamp,
} from "utils/dayjs";
import { formatDateNext7Days } from "utils/ui-labels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

const propTypes = {};
const defaultProps = {};

const MyBetsPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [tabActive, setTabActive] = useState(BET_TYPE_SETTLED);
  const [dateStart, setDateStart] = useState(getDatejsObjectHours00Min00Sec00(dayjs()));
  const [betslips, setBetslips] = useState([]);
  const [betslipsIsLoading, setBetslipIsLoading] = useState(false);
  const authPriceFormat = useSelector(getAuthPriceFormat);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchBetslips = async () => {
      setBetslipIsLoading(true);
      const action = await dispatch(
        getBetslipTransactionHistory({
          cancelToken: source.token,
          dateFrom: getDatejsObjectISO(dateStart),
          dateTo: getDatejsObjectISO(getDatejsObjectHours23Min59Sec59(dateStart.add(7, "day"))),
          settled: tabActive === BET_TYPE_SETTLED,
        }),
      );
      if (getBetslipTransactionHistory.fulfilled.match(action)) {
        setBetslipIsLoading(false);
        setBetslips(action.payload.betslipTransactions);

        return;
      }
      setBetslipIsLoading(false);
      setBetslips([]);
    };

    fetchBetslips();

    return () => {
      source.cancel();
    };
  }, [authPriceFormat, dateStart, dispatch, tabActive]);

  const renderCalendar = () => {
    const isDateToday =
      getDatejsNowHours00Min00Sec00Timestamp() ===
      getDatejsObjectTimestamp(getDatejsObjectHours00Min00Sec00(dateStart));
    const onNextWeekClick = () => {
      setDateStart(getDatejsObjectHours00Min00Sec00(dateStart.add(7, "day")));
    };
    const onPrevWeekClick = () => {
      setDateStart(getDatejsObjectHours00Min00Sec00(dateStart.subtract(7, "day")));
    };

    return (
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
            isDateToday ? classes["my-bets-arrow-left-disabled"] : "none"
          }`}
          onClick={onNextWeekClick}
        />
      </div>
    );
  };

  const renderBetslips = () => {
    if (betslipsIsLoading) {
      return (
        <div className={classes["spinner-container"]}>
          <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
        </div>
      );
    }
    if (betslips.length === 0) {
      return <SectionNoData title={t("vanillamobile.pages.my_bets_page.my_bets_empty")} />;
    }

    return betslips.map((betslip) => (
      <ItemBetslip
        bets={betslip.bets}
        createdDate={betslip.createdDate}
        isSettled={betslip.settled}
        key={betslip.betSlipId}
        referenceId={betslip.betSlipReference}
        totalCredit={betslip.totalCredit}
        totalDebit={betslip.totalDebit}
      />
    ));
  };

  return (
    <div className={classes["edit-profile"]}>
      <HeaderTab active={tabActive} tabs={BET_TYPES} onTabClick={setTabActive} />
      <div className={`${classes["main"]} ${classes["main_special"]}`}>
        <div className={classes["main__container"]}>
          <div className={classes["settled"]}>
            {renderCalendar()}
            {renderBetslips()}
          </div>
        </div>
      </div>
    </div>
  );
};

MyBetsPage.propTypes = propTypes;
MyBetsPage.defaultProps = defaultProps;

export default MyBetsPage;
