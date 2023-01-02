import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import uniqBy from "lodash.uniqby";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { ALL_SPORT } from "../constants";

import LiveCalendarHeaderDropdown from "./LiveCalendarHeaderDropdown";
import LiveCalendarMatch from "./LiveCalendarMatch";
import FontIcon from "applications/vanillamobile/common/components/FontIcon";
import SectionNoData from "applications/vanillamobile/common/components/SectionNoData";
import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { useGetLiveCalendarDataInRange } from "hooks/live-calendar-hooks";
import { parseDate } from "utils/date";
import {
  getDatejsNow,
  getDatejsObject,
  getDatejsObjectHours00Min00Sec00,
  getDatejsObjectHours23Min59Sec59,
  getDatejsObjectTimestamp,
} from "utils/dayjs";
import { formatDateDayMonthShort, formatDateMonthLongDayHourMinutes } from "utils/dayjs-format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

const LiveCalendar = () => {
  const { t } = useTranslation();
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

  const [selectedSport, setSelectedSport] = useState(ALL_SPORT);

  const liveCalendarDataFiltered = useMemo(() => {
    if (!liveCalendarDataInRange) {
      return [];
    }
    const dateStart =
      selectedDate === dateNow.current
        ? selectedDate
        : getDatejsObjectTimestamp(getDatejsObjectHours00Min00Sec00(dayjs(selectedDate)));
    const dateEnd = getDatejsObjectTimestamp(getDatejsObjectHours23Min59Sec59(dayjs(selectedDate)));

    return liveCalendarDataInRange
      .filter(({ epoch }) => epoch >= dateStart && epoch <= dateEnd)
      .filter(({ sportCode }) => {
        if (selectedSport === ALL_SPORT) {
          return true;
        }

        return sportCode === selectedSport;
      });
  }, [selectedDate, selectedSport, liveCalendarDataInRange]);

  const sportItems = useMemo(
    () => [
      {
        icon: "qicon-default",
        label: t("all_sports"),
        value: ALL_SPORT,
      },
      ...(liveCalendarDataInRange
        ? uniqBy(liveCalendarDataInRange, ({ sportCode }) => sportCode).map((match) => ({
            icon: `qicon-${match.sportCode.toLowerCase()}`,
            label: match.sportDescription,
            value: match.sportCode,
          }))
        : []),
    ],
    [liveCalendarDataInRange, t],
  );

  const onSelectedSportCallback = useCallback((value) => {
    setSelectedSport(value);
  }, []);

  const onSelectedDateCallback = useCallback((value) => {
    setSelectedDate(value);
  }, []);

  const renderItemIcon = useCallback(({ icon }) => <i className={classes[icon]} />, []);

  return (
    <main className={classes["main"]}>
      <h1 className={classes["main__title"]}>{t("live_calendar")}</h1>
      <div className={`${classes["main__container"]} ${classes["main__container_small"]}`}>
        <div className={classes["live-calendar"]}>
          {liveCalendarDataIsLoading ? (
            <div className={classes["spinner-container"]}>
              <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
            </div>
          ) : (
            <>
              <ul className={classes["live-calendar__buttons"]}>
                <ul className={classes["live-calendar__list"]}>
                  <LiveCalendarHeaderDropdown
                    bodyClassId="calendar-sports"
                    isDisabled={liveCalendarDataIsLoading}
                    items={sportItems}
                    renderItemIcon={renderItemIcon}
                    selected={selectedSport}
                    onChange={onSelectedSportCallback}
                  />
                  <LiveCalendarHeaderDropdown
                    bodyClassId="calendar-btn"
                    isDisabled={liveCalendarDataIsLoading}
                    items={datesItems}
                    renderDropdownIcon={() => <FontIcon icon={faCalendarAlt} />}
                    selected={selectedDate}
                    onChange={onSelectedDateCallback}
                  />
                </ul>
              </ul>
              {liveCalendarDataFiltered.length === 0 ? (
                // Todo: translations.
                <SectionNoData title="No matches" />
              ) : (
                <div className={classes["live-calendar-sports"]}>
                  {liveCalendarDataFiltered.map((match) => (
                    <LiveCalendarMatch
                      date={formatDateMonthLongDayHourMinutes(getDatejsObject(parseDate(match.epoch)))}
                      eventCode={`qicon-${match.sportCode.toLowerCase()}`}
                      eventDescription={match.sportDescription}
                      eventId={match.id}
                      key={`${match.description}_${match.epoch}`}
                      tournamentId={match.tournamentId}
                      {...match}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default LiveCalendar;
