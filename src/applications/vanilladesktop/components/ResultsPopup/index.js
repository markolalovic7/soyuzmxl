import { faCalendarAlt, faClock } from "@fortawesome/free-solid-svg-icons";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import axios from "axios";
import cx from "classnames";
import dayjs from "dayjs";
import { useOnClickOutside } from "hooks/utils-hooks";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";

import "react-day-picker/lib/style.css";
import "./DayPickerInputOverride.css"; // This one should be loaded AFTER "react-day-picker/lib/style.css"
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getVirtualKironEvents } from "../../../../redux/actions/virtual-kiron-actions";
import { getAuthLanguage } from "../../../../redux/reselect/auth-selector";
import { DAY_MSEC, getHourTimestamp, HOUR_MSEC } from "../../../../utils/date";
import { getMonths, getWeekdaysLong, getWeekdaysShort } from "../../../../utils/day-picker-utils";
import {
  getDatejsHour,
  getDatejsObject,
  getDatejsObjectHours00Min00Sec00,
  getDatejsObjectISO,
  getDatejsObjectTimestamp,
} from "../../../../utils/dayjs";
import { formatDateMonthLongDayHourMinutes } from "../../../../utils/dayjs-format";
import { getKironFeedCodeTranslated } from "../../../../utils/kiron-virtual-sport";
import { getSportCode } from "../../../../utils/kiron-virtual-utils";
import FontIcon from "../../../slimmobile/common/components/FontIcon";
import {
  formatToHoursAndMinutes,
  getListOfTimePoints,
} from "../../../vanillamobile/components/KironVirtualSportModal/components/TimePicker/utils";
import { getFeedCodeWithAllOnlinePrefix } from "../../../vanillamobile/components/KironVirtualSportModal/utils";
import ResultsPopupSpoiler from "../ResultsPopupSpoiler";

const isToday = require("dayjs/plugin/isToday");

dayjs.extend(isToday);

const DATE_FORMAT = "DD-MMM-YY";

const formatDate = (date) => dayjs(date).format(DATE_FORMAT);

const parseDate = (str) => {
  const parsed = dayjs(str, DATE_FORMAT);
  if (!parsed.isValid()) {
    return new Date();
  }

  return parsed.toDate();
};

const propTypes = {
  feedCode: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

const ResultsPopup = ({ feedCode, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const ref = useRef();
  const { t } = useTranslation();

  useOnClickOutside(ref, onClose);

  const [date, setDate] = useState(dayjs());
  const [timestamp, setTimestamp] = useState(getHourTimestamp(getDatejsHour(dayjs())));
  const [eventsIsFetching, setEventsIsFetching] = useState(true);
  const [events, setEvents] = useState([]);
  const [isTimeActive, setIsTimeActive] = useState(false);

  const menuRef = useRef();
  useOnClickOutside(menuRef, () => setIsTimeActive(false));

  const listOfTimePoints = getListOfTimePoints({
    timestampMax: date.isToday() ? getHourTimestamp(getDatejsHour(dayjs())) + 1 : DAY_MSEC,
    timestampMin: 0,
    timestampSelected: timestamp,
  }).map((option) => ({
    key: option,
    label: formatToHoursAndMinutes(option),
    value: option,
  }));

  const itemTimestampSelected = listOfTimePoints.find((item) => item.value === timestamp);

  const language = useSelector(getAuthLanguage);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const datejsObjectHours00Min00Sec00 = getDatejsObjectHours00Min00Sec00(date);
    const datejsObjectHours00Min00Sec00Timestamp = getDatejsObjectTimestamp(datejsObjectHours00Min00Sec00);

    const dateFromTimestamp = datejsObjectHours00Min00Sec00Timestamp + timestamp;
    const dateToTimestamp = dateFromTimestamp + HOUR_MSEC;

    const fetchGetVirtualKironEvents = async () => {
      setEventsIsFetching(true);
      const action = await dispatch(
        getVirtualKironEvents({
          dateFrom: getDatejsObjectISO(getDatejsObject(dateFromTimestamp)),
          dateTo: getDatejsObjectISO(getDatejsObject(dateToTimestamp)),
          feedCode: getFeedCodeWithAllOnlinePrefix(feedCode),
          sportCode: getSportCode(feedCode),
        }),
      );

      if (getVirtualKironEvents.fulfilled.match(action)) {
        setEventsIsFetching(false);
        setEvents(action.payload.events);

        return;
      }
      setEventsIsFetching(false);
      setEvents([]);
    };

    fetchGetVirtualKironEvents();

    return () => {
      source.cancel();
    };
  }, [date, dispatch, feedCode, timestamp]);

  const onDateChange = (date) => {
    setDate(date);
    if (date.isToday()) {
      setTimestamp(getHourTimestamp(getDatejsHour(dayjs())));
    } else {
      setTimestamp(getHourTimestamp(23));
    }
  };

  return (
    <div
      className={cx(classes["vs-popup"], classes["popup"], {
        [classes["open"]]: isOpen,
      })}
      id="vs-popup"
    >
      <div className={cx(classes["vs-popup__body"], classes["popup__body"])}>
        <div className={cx(classes["vs-popup__content"], classes["popup__content"])} ref={ref}>
          <div className={classes["vs-popup__top"]}>
            <span className={cx(classes["vs-popup__close"], classes["close-popup"])} onClick={onClose} />
            <h3 className={classes["vs-popup__title"]}>{getKironFeedCodeTranslated(feedCode, t)}</h3>
            <div className={classes["vs-popup__date"]}>
              <div className={classes["vs-popup__input"]}>
                <span className={classes["vs-popup__select-date"]}>{t("vanilladesktop.select_date")}</span>
                <div className={classes["vs-popup__day"]}>
                  <span className={classes["vs-popup__calendar"]}>
                    <FontIcon icon={faCalendarAlt} />
                  </span>
                  <div className={classes["vs-popup__year-month-day"]}>
                    <DayPickerInput
                      dayPickerProps={{
                        disabledDays: {
                          after: new Date(),
                        },
                        firstDayOfWeek: 1,
                        months: getMonths(language),
                        weekdaysLong: getWeekdaysLong(language),
                        weekdaysShort: getWeekdaysShort(language),
                      }}
                      formatDate={formatDate}
                      parseDate={parseDate}
                      value={formatDate(date)}
                      onDayChange={(day) => onDateChange(dayjs(day))}
                    />
                  </div>
                </div>
              </div>
              <div className={classes["vs-popup__input"]}>
                <span className={classes["vs-popup__select-date"]}>{t("vanilladesktop.select_time")}</span>
                <div className={classes["vs-popup__select"]}>
                  <select
                    onChange={(e) => {
                      setTimestamp(e.target.value);
                      setIsTimeActive(false);
                    }}
                  >
                    {listOfTimePoints.map((item) => (
                      <option key={item.value} selected={item.value === timestamp} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <span className={classes["vs-popup__clock"]}>
                    <FontIcon icon={faClock} />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={classes["vs-popup__results"]}>
            {events?.map((event) => (
              <ResultsPopupSpoiler
                eventId={event.id}
                key={event.id}
                label={event.description}
                startTime={formatDateMonthLongDayHourMinutes(dayjs(event.startTime))}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

ResultsPopup.propTypes = propTypes;

export default ResultsPopup;
