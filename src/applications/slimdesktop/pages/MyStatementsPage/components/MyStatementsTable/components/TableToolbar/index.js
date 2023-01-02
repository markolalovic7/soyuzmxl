import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { useTranslation } from "react-i18next";
import "react-day-picker/lib/style.css";

import { useSelector } from "react-redux";

import {
  TRANSACTION_TYPE_BONUS,
  TRANSACTION_TYPE_OTHER,
  TRANSACTION_TYPE_PAYMENT,
  TRANSACTION_TYPE_PENDING,
  TRANSACTION_TYPE_SETTLED,
} from "../../../../../../../../constants/transaction-types";
import { getAuthLanguage } from "../../../../../../../../redux/reselect/auth-selector";
import { getMonths, getWeekdaysLong, getWeekdaysShort } from "../../../../../../../../utils/day-picker-utils";
import ToolbarDropdown from "../ToolbarDropdown";

const DATE_FORMAT = "DD-MMM-YY";

const TableToolbar = ({
  dateEnd,
  dateStart,
  setDateEnd,
  setDateStart,
  setSubTabActive,
  setTabActive,
  subTabActive,
  tabActive,
  toggleRefresh,
}) => {
  const { t } = useTranslation();
  const language = useSelector(getAuthLanguage);

  const formatDate = (date) => dayjs(date).format(DATE_FORMAT);

  const parseDate = (str) => {
    const parsed = dayjs(str, DATE_FORMAT);
    if (!parsed.isValid()) {
      return new Date();
    }

    return parsed.toDate();
  };

  const fromDateChangeHandler = (date) => {
    setDateStart(date);
  };

  const endDateChangeHandler = (date) => {
    setDateEnd(date);
  };

  return (
    <h3 className={classes["registration__label"]}>
      {t("my_statements")}
      <div className={classes["filters"]}>
        <div className={classes["filter"]}>
          <ToolbarDropdown
            setTabActive={setTabActive}
            tabActive={tabActive}
            tabs={[
              { label: t("vanilladesktop.financial_table.pending"), value: TRANSACTION_TYPE_PENDING },
              { label: t("vanilladesktop.financial_table.settled"), value: TRANSACTION_TYPE_SETTLED },
            ]}
          />
        </div>
        <div className={classes["filter"]}>
          <ToolbarDropdown
            setTabActive={setSubTabActive}
            tabActive={subTabActive}
            tabs={[
              { label: t("vanilladesktop.financial_table.payments"), value: TRANSACTION_TYPE_PAYMENT },
              { label: t("vanilladesktop.financial_table.bonuses"), value: TRANSACTION_TYPE_BONUS },
              { label: t("vanilladesktop.financial_table.others"), value: TRANSACTION_TYPE_OTHER },
            ]}
          />
        </div>
        <span className={classes["filters__indication"]}>{t("vanilladesktop.financial_table.from")}</span>
        <div className={classes["filter"]}>
          <div className={classes["filter__input"]}>
            <DayPickerInput
              dayPickerProps={{
                disabledDays: {
                  after: dateEnd,
                },
                firstDayOfWeek: 1,
                months: getMonths(language),
                weekdaysLong: getWeekdaysLong(language),
                weekdaysShort: getWeekdaysShort(language),
              }}
              formatDate={formatDate}
              parseDate={parseDate}
              value={dateStart}
              onDayChange={fromDateChangeHandler}
            />
            <span className={classes["filter__calendar"]}>
              <svg height="16" viewBox="0 0 14 16" width="14" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <g>
                    <path d="M11.667 0v1.6h.777C13.3 1.6 14 2.312 14 3.2v11.2c0 .884-.696 1.6-1.556 1.6H1.556C.696 16 0 15.284 0 14.4V3.2c0-.888.692-1.6 1.556-1.6h.777V0H3.89v1.6h6.222V0zm.767 5.6H1.556v8.8h10.878z" />
                  </g>
                </g>
              </svg>
            </span>
          </div>
        </div>
        <span className={classes["filters__indication"]}>{t("vanilladesktop.financial_table.to")}</span>
        <div className={classes["filter"]}>
          <div className={classes["filter__input"]}>
            <DayPickerInput
              dayPickerProps={{
                disabledDays: {
                  after: new Date(),
                  before: dateStart,
                },
                firstDayOfWeek: 1,
                months: getMonths(language),
                weekdaysLong: getWeekdaysLong(language),
                weekdaysShort: getWeekdaysShort(language),
              }}
              formatDate={formatDate}
              parseDate={parseDate}
              value={dateEnd}
              onDayChange={endDateChangeHandler}
            />
            <span className={classes["filter__calendar"]}>
              <svg height="16" viewBox="0 0 14 16" width="14" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <g>
                    <path d="M11.667 0v1.6h.777C13.3 1.6 14 2.312 14 3.2v11.2c0 .884-.696 1.6-1.556 1.6H1.556C.696 16 0 15.284 0 14.4V3.2c0-.888.692-1.6 1.556-1.6h.777V0H3.89v1.6h6.222V0zm.767 5.6H1.556v8.8h10.878z" />
                  </g>
                </g>
              </svg>
            </span>
          </div>
        </div>
        <div className={classes["filter"]} onClick={() => toggleRefresh()}>
          <div className={classes["filter__content"]}>
            <span className={classes["filter__icon"]}>
              <i className={classes["qicon-refresh"]} />
            </span>
            <span className={classes["filter__text"]}>{t("update")}</span>
          </div>
        </div>
      </div>
    </h3>
  );
};

TableToolbar.propTypes = {
  dateEnd: PropTypes.object.isRequired,
  dateStart: PropTypes.object.isRequired,
  setDateEnd: PropTypes.func.isRequired,
  setDateStart: PropTypes.func.isRequired,
  setSubTabActive: PropTypes.func.isRequired,
  setTabActive: PropTypes.func.isRequired,
  subTabActive: PropTypes.string.isRequired,
  tabActive: PropTypes.string.isRequired,
  toggleRefresh: PropTypes.func.isRequired,
};

export default React.memo(TableToolbar);
