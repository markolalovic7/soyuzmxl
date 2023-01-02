import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import cx from "classnames";
import dayjs from "dayjs";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import { useGetLiveCalendarDataInRange } from "../../../../../hooks/live-calendar-hooks";
import { getAuthDesktopView } from "../../../../../redux/reselect/auth-selector";
import { parseDate } from "../../../../../utils/date";
import {
  getDatejsNow,
  getDatejsObject,
  getDatejsObjectHours00Min00Sec00,
  getDatejsObjectHours23Min59Sec59,
  getDatejsObjectTimestamp,
} from "../../../../../utils/dayjs";
import { formatDateDayMonthShort, formatDateMonthLongDayHourMinutes } from "../../../../../utils/dayjs-format";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LiveCalendarPage = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const view = useSelector(getAuthDesktopView);

  const dateNow = useRef(getDatejsNow());

  const [liveCalendarDataInRange, liveCalendarDataIsLoading] = useGetLiveCalendarDataInRange({
    dateEnd: getDatejsObjectHours23Min59Sec59(dayjs().add(6, "day")).valueOf(),
    dateStart: dayjs().valueOf(),
  });

  const datesItems = useMemo(
    () => [
      {
        label: `${t("today")} (${formatDateDayMonthShort(getDatejsNow())})`,
        value: getDatejsObjectTimestamp(dateNow.current),
      },
      {
        label: formatDateDayMonthShort(getDatejsNow().add(1, "day")),
        value: getDatejsObjectTimestamp(getDatejsObjectHours00Min00Sec00(dateNow.current.add(1, "day"))),
      },
      {
        label: formatDateDayMonthShort(getDatejsNow().add(2, "day")),
        value: getDatejsObjectTimestamp(getDatejsObjectHours00Min00Sec00(dateNow.current.add(2, "day"))),
      },
      {
        label: formatDateDayMonthShort(getDatejsNow().add(3, "day")),
        value: getDatejsObjectTimestamp(getDatejsObjectHours00Min00Sec00(dateNow.current.add(3, "day"))),
      },
      {
        label: formatDateDayMonthShort(getDatejsNow().add(4, "day")),
        value: getDatejsObjectTimestamp(getDatejsObjectHours00Min00Sec00(dateNow.current.add(4, "day"))),
      },
      {
        label: formatDateDayMonthShort(getDatejsNow().add(5, "day")),
        value: getDatejsObjectTimestamp(getDatejsObjectHours00Min00Sec00(dateNow.current.add(5, "day"))),
      },
      {
        label: formatDateDayMonthShort(getDatejsNow().add(6, "day")),
        value: getDatejsObjectTimestamp(getDatejsObjectHours00Min00Sec00(dateNow.current.add(6, "day"))),
      },
    ],
    [t],
  );
  const [selectedDate, setSelectedDate] = useState(getDatejsObjectTimestamp(dateNow.current));

  const liveCalendarDataFiltered = useMemo(() => {
    if (!liveCalendarDataInRange) {
      return [];
    }
    const dateStart =
      selectedDate === dateNow.current
        ? selectedDate
        : getDatejsObjectTimestamp(getDatejsObjectHours00Min00Sec00(dayjs(selectedDate)));
    const dateEnd = getDatejsObjectTimestamp(getDatejsObjectHours23Min59Sec59(dayjs(selectedDate)));

    return liveCalendarDataInRange.filter(({ epoch }) => epoch >= dateStart && epoch <= dateEnd);
  }, [selectedDate, liveCalendarDataInRange]);

  const onSelectedDateCallback = useCallback((value) => {
    setSelectedDate(value);
  }, []);

  return (
    <main>
      <section className={classes["content"]}>
        <div className={cx(classes["content__main"], classes["content__main_special"])}>
          {liveCalendarDataIsLoading && (
            <div className={classes["spinner-container"]}>
              <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
            </div>
          )}

          {!liveCalendarDataIsLoading && (
            <div className={classes["results"]}>
              <div className={classes["date-tabs"]}>
                {datesItems.map((item) => (
                  <div
                    className={cx(classes["date-tabs__item"], { [classes["active"]]: selectedDate === item.value })}
                    key={item.label}
                    onClick={() => onSelectedDateCallback(item.value)}
                  >
                    <span className={classes["date-tabs__text"]} onChange={() => onSelectedDateCallback(item.value)}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className={classes["live-calendar"]}>
                <div className={classes["live-calendar__header"]}>
                  <div className={classes["live-calendar__labels"]}>
                    <span className={cx(classes["live-calendar__label"], classes["live-calendar__label_sports"])}>
                      {t("sports")}
                    </span>
                    <span className={cx(classes["live-calendar__label"], classes["live-calendar__label_date"])}>
                      {t("date")}
                    </span>
                    <span className={cx(classes["live-calendar__label"], classes["live-calendar__label_league"])}>
                      {t("league")}
                    </span>
                    <span className={cx(classes["live-calendar__label"], classes["live-calendar__label_match"])}>
                      {t("match")}
                    </span>
                  </div>
                </div>
                <div className={classes["live-calendar__body"]}>
                  {liveCalendarDataFiltered.map((match, index) => (
                    <div
                      className={classes["live-calendar__row"]}
                      key={match.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => history.push(`/prematch/eventpath/${match.tournamentId}/event/${match.id}`)}
                    >
                      <div className={classes["live-calendar__sports"]}>
                        <div className={classes["live-calendar__icon"]}>
                          <i
                            className={cx(classes["qicon-default"], classes[`qicon-${match.sportCode.toLowerCase()}`])}
                          />
                        </div>
                        <div className={classes["live-calendar__sport"]}>{match.sportDescription}</div>
                      </div>
                      <div className={classes["live-calendar__date"]}>
                        {formatDateMonthLongDayHourMinutes(getDatejsObject(parseDate(match.epoch)))}
                      </div>
                      <div className={classes["live-calendar__league"]}>{match.tournament}</div>
                      <div className={classes["live-calendar__match"]}>{match.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default LiveCalendarPage;
