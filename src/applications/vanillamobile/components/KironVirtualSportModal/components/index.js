import axios from "axios";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import classes from "../styles/index.module.scss";
import { formatSportResultTime, getFeedCodeWithAllOnlinePrefix } from "../utils";

import DatePicker from "./DatePicker";
import ItemSportResult from "./ItemSportResult";
import TimePicker from "./TimePicker";
import SectionNoData from "applications/vanillamobile/common/components/SectionNoData";
import { useOnClickOutside } from "hooks/utils-hooks";
import { getVirtualKironEvents } from "redux/actions/virtual-kiron-actions";
import { getHourTimestamp, HOUR_MSEC } from "utils/date";
import {
  getDatejsHour,
  getDatejsNow,
  getDatejsObject,
  getDatejsObjectHours00Min00Sec00,
  getDatejsObjectISO,
  getDatejsObjectTimestamp,
} from "utils/dayjs";
import { getKironFeedCodeTranslated } from "utils/kiron-virtual-sport";
import { getSportCode } from "utils/kiron-virtual-utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

const isToday = require("dayjs/plugin/isToday");

dayjs.extend(isToday);

const propTypes = {
  feedCode: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

const defaultProps = {};

const KironVirtualSportModal = ({ feedCode, onClose }) => {
  const { t } = useTranslation();
  const dateNow = getDatejsNow();

  const [date, setDate] = useState(dateNow);
  const [timestamp, setTimestamp] = useState(getHourTimestamp(getDatejsHour(dateNow)));
  const [eventsIsFetching, setEventsIsFetching] = useState(true);
  const [events, setEvents] = useState([]);
  const modalRef = useRef();
  useOnClickOutside(modalRef, () => onClose());

  const dispatch = useDispatch();

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

  const renderEvents = () => {
    if (eventsIsFetching) {
      return (
        <div className={classes["modal-kvirtual-body"]}>
          <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
        </div>
      );
    }
    if (events.length === 0) {
      return (
        <div className={classes["modal-kvirtual-body"]}>
          <SectionNoData title={t("vanillamobile.pages.kiron_virtual_sport.kiron_virtual_sport_empty")} />
        </div>
      );
    }

    return (
      <div className={classes["modal-kvirtual-body"]}>
        {events.map((event) => (
          <ItemSportResult
            date={formatSportResultTime(event.startTime)}
            eventId={event.id}
            key={event.id}
            title={event.description}
          />
        ))}
      </div>
    );
  };

  const onDateChange = (date) => {
    setDate(date);
    if (date.isToday()) {
      setTimestamp(getHourTimestamp(getDatejsHour(dayjs())));
    } else {
      setTimestamp(getHourTimestamp(23));
    }
  };

  return (
    <div className={classes["modal-kvirtual-wrapper"]} ref={modalRef}>
      <div className={classes["modal-kvirtual-navbar"]}>
        <div className={classes["modal-kvirtual-navbar-img"]} />
        <span className={classes["icon-close"]} onClick={onClose} />
        <h3>{getKironFeedCodeTranslated(feedCode, t)}</h3>
        <div className={classes["modal-kvirtual-navbar-buttons"]}>
          <DatePicker value={date} onChange={onDateChange} />
          <TimePicker date={date} value={timestamp} onChange={setTimestamp} />
        </div>
      </div>
      {renderEvents()}
    </div>
  );
};

KironVirtualSportModal.propTypes = propTypes;
KironVirtualSportModal.defaultProps = defaultProps;

export default KironVirtualSportModal;
