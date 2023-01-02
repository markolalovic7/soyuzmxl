import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import FontIcon from "applications/slimmobile/common/components/FontIcon";
import SportBar from "applications/slimmobile/common/components/SportBar";
import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import dayjs from "dayjs";
import { useGetLiveCalendarDataInRange } from "hooks/live-calendar-hooks";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { parseDate } from "utils/date";
import { getDatejsObject, getDatejsObjectHours00Min00Sec00, getDatejsObjectHours23Min59Sec59 } from "utils/dayjs";
import { formatDateMonthLongDayHourMinutes, getDatejsObjectFormatted } from "utils/dayjs-format";

import { CALENDAR_HEADER_LABELS } from "../constants";

import LiveCalendarMatch from "./LiveCalendarMatch";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const propTypes = {};
const defaultProps = {};

const LiveCalendarPage = () => {
  const { t } = useTranslation();
  const now = dayjs();
  const history = useHistory();

  const [tabActive, setTabActive] = useState(0);
  const { dateEnd, dateStart } = useMemo(() => {
    const now = dayjs();

    return {
      dateEnd: getDatejsObjectHours23Min59Sec59(now.add(tabActive, "day")).valueOf(),
      dateStart:
        tabActive === 0 ? now.valueOf() : getDatejsObjectHours00Min00Sec00(now.add(tabActive, "day")).valueOf(),
    };
  }, [tabActive]);

  const [liveCalendarDataInRange, liveCalendarDataIsLoading] = useGetLiveCalendarDataInRange({ dateEnd, dateStart });

  const onLivePageClick = () => {
    history.push("/live");
  };

  return (
    <>
      <SportBar hideSearchBar />
      <div className={classes["calendar"]}>
        <button className={classes["calendar__button"]} type="button" onClick={onLivePageClick}>
          <FontIcon icon={faCalendarAlt} />
          {t("live_game")}
        </button>
        <div className={classes["calendar__content"]}>
          {liveCalendarDataIsLoading ? (
            <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
          ) : (
            <>
              <ul className={classes["calendar__headings"]}>
                {[
                  t("today"),
                  getDatejsObjectFormatted(now.add(1, "day"), "DD-MM (ddd)"),
                  getDatejsObjectFormatted(now.add(2, "day"), "DD-MM (ddd)"),
                  getDatejsObjectFormatted(now.add(3, "day"), "DD-MM (ddd)"),
                ].map((date, index) => (
                  <li
                    className={`${classes["calendar__heading"]} ${
                      tabActive === index ? classes["calendar__heading_special"] : "none"
                    }`}
                    key={date}
                    onClick={() => setTabActive(index)}
                  >
                    {date}
                  </li>
                ))}
              </ul>
              <ul className={classes["calendar__labels"]}>
                {CALENDAR_HEADER_LABELS.map((header) => (
                  <li className={classes["calendar__label"]} key={header}>
                    {t(`live_calendar_head_labels.${header}`)}
                  </li>
                ))}
              </ul>
              <div className={classes["calendar__list"]}>
                {liveCalendarDataInRange.map((data) => (
                  <LiveCalendarMatch
                    date={formatDateMonthLongDayHourMinutes(getDatejsObject(parseDate(data.epoch)))}
                    eventCode={`qicon-${data.sportCode.toLowerCase()}`}
                    eventDescription={data.sportDescription}
                    eventId={data.id}
                    key={data.id}
                    tournamentId={data.tournamentId}
                    {...data}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

LiveCalendarPage.propTypes = propTypes;
LiveCalendarPage.defaultProps = defaultProps;

export default LiveCalendarPage;
