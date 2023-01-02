import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getAuthLanguage } from "redux/reselect/auth-selector";

import { useOnClickOutside } from "../../../../../../../../hooks/utils-hooks";
import { getMonths, getWeekdaysLong, getWeekdaysShort } from "../../../../../../../../utils/day-picker-utils";
import { formatDateDayMonthShort } from "../../../../../../../../utils/dayjs-format";

const dayOfYear = require("dayjs/plugin/dayOfYear");

dayjs.extend(dayOfYear);

const PrematchDateNavigationBar = ({ asianCriteria, selectedTopTab, setSelectedTopTab, sportCode }) => {
  const { t } = useTranslation();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const language = useSelector(getAuthLanguage);
  const dateTabs = Array(6).fill(null);

  const modalRef = useRef();

  useOnClickOutside(modalRef, () => setIsDatePickerOpen(false));

  const asianSportsTreeData = useSelector((state) => state.sportsTree.sportsTreeCache["EARLIER"]);

  const match = asianSportsTreeData?.find((sport) => sport.code === sportCode);

  const matchCriterias =
    match && match.marketGroupCriteria[asianCriteria] ? Object.keys(match.marketGroupCriteria[asianCriteria]) : [];
  const rawCriterias =
    match && match.rawMGC[asianCriteria] ? match.rawMGC[asianCriteria].split(",").map((num) => Number(num)) : [];

  useEffect(() => {
    if (matchCriterias?.length > 0) {
      if (!selectedTopTab) {
        const tab = matchCriterias[0].startsWith("d") ? matchCriterias[0].substr(1) : matchCriterias[0];
        setSelectedTopTab(tab);
      } else if (
        !matchCriterias.map((c) => (c.startsWith("d") ? c.substr(1) : c)).includes(selectedTopTab) &&
        !rawCriterias.includes(Number(selectedTopTab))
      ) {
        // Happens when navigating...
        const tab = matchCriterias[0].startsWith("d") ? matchCriterias[0].substr(1) : matchCriterias[0];
        setSelectedTopTab(tab);
      }
    }
  }, [selectedTopTab, matchCriterias]);

  useEffect(() => {
    setIsDatePickerOpen(false);
  }, [asianCriteria, sportCode]);

  const isCalendarValidDate = (current) => {
    const now = dayjs(new Date());

    const dateOffset = dayjs(current).dayOfYear() - now.dayOfYear();

    return !rawCriterias.includes(dateOffset);
  };

  const handleDatePickerChange = (date) => {
    const now = dayjs(new Date());
    const dateOffset = dayjs(date).dayOfYear() - now.dayOfYear();

    if (rawCriterias.includes(dateOffset)) {
      setSelectedTopTab(dateOffset.toString());
      setIsDatePickerOpen(false);
    }
  };

  return (
    <div className={classes["date-tabs"]}>
      <div
        className={cx(classes["date-tabs__item"], {
          [classes["active"]]: selectedTopTab === "0",
          [classes["disabled"]]: matchCriterias.findIndex((criteria) => criteria === "d0") === -1,
        })}
        onClick={() => setSelectedTopTab("0")}
      >
        <span className={classes["date-tabs__text"]}>{t("today")}</span>
      </div>
      {dateTabs.map((_, index) => (
        <div
          className={cx(classes["date-tabs__item"], {
            [classes["active"]]: selectedTopTab === (index + 1).toString(),
            [classes["disabled"]]: matchCriterias.findIndex((criteria) => criteria === `d${index + 1}`) === -1,
          })}
          key={index}
          onClick={() => setSelectedTopTab((index + 1).toString())}
        >
          <span className={classes["date-tabs__text"]}>{formatDateDayMonthShort(dayjs().add(index + 1, "day"))}</span>
        </div>
      ))}

      <div
        className={cx(classes["date-tabs__item"], {
          [classes["active"]]: selectedTopTab === "7+",
          [classes["disabled"]]: matchCriterias.findIndex((criteria) => criteria === "d7+") === -1,
        })}
        onClick={() => setSelectedTopTab("7+")}
      >
        <span className={classes["date-tabs__text"]}>{t("vanilladesktop.more")}</span>
      </div>
      <div
        className={cx(classes["date-tabs__item"], {
          [classes["active"]]: Number(selectedTopTab) > 6,
          [classes["disabled"]]: rawCriterias.findIndex((criteria) => Number(criteria) > 6) === -1,
        })}
      >
        <div className={classes["date-tabs__calendar"]} onClick={() => setIsDatePickerOpen((isOpen) => !isOpen)}>
          <span className={classes["date-tabs__icon"]}>
            <FontAwesomeIcon icon={faCalendarAlt} />
          </span>
        </div>
        {isDatePickerOpen && (
          <div className={classes["date-tabs__datepicker"]} ref={modalRef}>
            <DayPicker
              disabledDays={isCalendarValidDate}
              firstDayOfWeek={1}
              months={getMonths(language)}
              weekdaysLong={getWeekdaysLong(language)}
              weekdaysShort={getWeekdaysShort(language)}
              onDayClick={handleDatePickerChange}
            />
          </div>
        )}
      </div>
      <div
        className={cx(classes["date-tabs__item"], {
          [classes["active"]]: selectedTopTab === "oc",
          [classes["disabled"]]: matchCriterias.findIndex((criteria) => criteria === "oc") === -1,
        })}
        onClick={() => setSelectedTopTab("oc")}
      >
        <span className={classes["date-tabs__text"]}>{t("outright")}</span>
      </div>
      {/* <div className={cx(classes["date-tabs__item"], classes["date-tabs__item_refresh"])}> */}
      {/*  <span className={classes["date-tabs__icon"]}> */}
      {/*    <i className={classes["qicon-refresh"]} /> */}
      {/*  </span> */}
      {/*  /!* <span className={classes["date-tabs__text"]}>119</span> *!/ */}
      {/* </div > */}
    </div>
  );
};

const propTypes = {
  asianCriteria: PropTypes.string,
  selectedTopTab: PropTypes.string,
  setSelectedTopTab: PropTypes.func.isRequired,
  sportCode: PropTypes.string,
};

const defaultProps = {
  asianCriteria: undefined,
  selectedTopTab: undefined,
  sportCode: undefined,
};

PrematchDateNavigationBar.propTypes = propTypes;
PrematchDateNavigationBar.defaultProps = defaultProps;

export default React.memo(PrematchDateNavigationBar);
