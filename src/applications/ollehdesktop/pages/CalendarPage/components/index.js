import { faAngleDoubleLeft, faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BetSlipColumn from "applications/ollehdesktop/components/BetSlipColumn";
import SidebarModeSelector from "applications/ollehdesktop/components/SidebarModeSelector";
import classes from "applications/ollehdesktop/scss/ollehdesktop.module.scss";
import cx from "classnames";
import dayjs from "dayjs";
import React, { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { ReactComponent as FallbackWorldImage } from "../../../../../assets/img/icons/World_Flag.svg";
import { useGetLiveCalendarDataInRange } from "../../../../../hooks/live-calendar-hooks";
import { getSportsSelector } from "../../../../../redux/reselect/sport-selector";
import { parseDate } from "../../../../../utils/date";
import {
  getDatejsNow,
  getDatejsObject,
  getDatejsObjectHours00Min00Sec00,
  getDatejsObjectHours23Min59Sec59,
} from "../../../../../utils/dayjs";
import {
  formatDateDayMonthShort,
  formatDateHoursMinutes,
  getDatejsObjectFormatted,
} from "../../../../../utils/dayjs-format";
import {
  getPatternBetradarVirtual,
  getPatternLive,
  getPatternLiveCalendar,
  getPatternPrematch,
} from "../../../../../utils/route-patterns";
import LeaguesSideBar from "../../../components/LeaguesSideBar";
import { useHistory } from "react-router";

const CalendarPage = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  const sports = useSelector(getSportsSelector);

  const [liveCalendarDataInRange, liveCalendarDataIsLoading] = useGetLiveCalendarDataInRange({
    dateEnd: getDatejsObjectHours23Min59Sec59(dayjs().add(selectedDateIndex, "day")).valueOf(),
    dateStart:
      selectedDateIndex === 0
        ? dayjs().valueOf()
        : getDatejsObjectHours00Min00Sec00(dayjs().add(selectedDateIndex, "day")),
  });

  return (
    <main className={classes["main"]}>
      <div className={classes["left__column"]}>
        <SidebarModeSelector />
        <LeaguesSideBar />
      </div>
      <div className={classes["main__column"]}>
        <div className={classes["main__column-top"]}>
          <div className={classes["top__nav"]}>
            <div className={classes["top__nav-icon"]}>
              <FontAwesomeIcon icon={faAngleDoubleLeft} />
            </div>
            <ul className={classes["top__nav-left"]}>
              <li>
                <Link to={getPatternPrematch()}>{t("sports")}</Link>
              </li>
              <li>
                <Link to={getPatternLive()}>{t("in_play_page")}</Link>
              </li>
            </ul>
          </div>
          <div className={classes["top__nav"]}>
            <ul className={classes["top__nav-right"]}>
              <li>
                <Link to={getPatternBetradarVirtual()}>{t("virtual_sports")}</Link>
              </li>
              <li>
                <Link className={classes["active"]} to={getPatternLiveCalendar()}>
                  {t("live_calendar")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={classes["calendar__wrapper"]}>
          <ul className={classes["calendar__wrapper-buttons"]}>
            <li
              className={`${classes["tab-button"]} ${selectedDateIndex === 0 ? classes["active"] : ""}`}
              onClick={() => setSelectedDateIndex(0)}
            >
              <span className={classes["date"]}>{`${t("today")} - ${formatDateDayMonthShort(getDatejsNow())}`}</span>
              <span className={classes["day"]}>{`${getDatejsObjectFormatted(getDatejsNow(), "dddd")}`}</span>
            </li>
            <li
              className={`${classes["tab-button"]} ${selectedDateIndex === 1 ? classes["active"] : ""}`}
              onClick={() => setSelectedDateIndex(1)}
            >
              <span className={classes["date"]}>{`${formatDateDayMonthShort(getDatejsNow().add(1, "day"))}`}</span>
              <span className={classes["day"]}>
                {`${getDatejsObjectFormatted(getDatejsNow().add(1, "day"), "dddd")}`}
              </span>
            </li>
            <li
              className={`${classes["tab-button"]} ${selectedDateIndex === 2 ? classes["active"] : ""}`}
              onClick={() => setSelectedDateIndex(2)}
            >
              <span className={classes["date"]}>{`${formatDateDayMonthShort(getDatejsNow().add(2, "day"))}`}</span>
              <span className={classes["day"]}>
                {`${getDatejsObjectFormatted(getDatejsNow().add(2, "day"), "dddd")}`}
              </span>
            </li>
            <li
              className={`${classes["tab-button"]} ${selectedDateIndex === 3 ? classes["active"] : ""}`}
              onClick={() => setSelectedDateIndex(3)}
            >
              <span className={classes["date"]}>{`${formatDateDayMonthShort(getDatejsNow().add(3, "day"))}`}</span>
              <span className={classes["day"]}>
                {`${getDatejsObjectFormatted(getDatejsNow().add(3, "day"), "dddd")}`}
              </span>
            </li>
          </ul>
          <section className={classes["calendar__wrapper-content"]}>
            <div className={classes["calendar__table"]}>
              <table>
                <thead>
                  <tr>
                    <th>
                      <div className={classes["calendar__table--arrow"]}>
                        <span>{t("sports")}</span>
                        {/* <FontAwesomeIcon icon={faChevronDown} /> */}
                      </div>
                    </th>
                    <th>
                      <div className={classes["calendar__table--arrow"]}>
                        <span>{t("live_calendar_head_labels.region")}</span>
                        {/* <FontAwesomeIcon icon={faChevronDown} /> */}
                      </div>
                    </th>
                    <th>{t("time")}</th>
                    <th>{t("live_calendar_head_labels.event")}</th>
                  </tr>
                </thead>
                <tbody>
                  {liveCalendarDataInRange.map((match) => (
                    <tr key={match.id}>
                      <td>
                        <div className={classes["middle"]}>
                          <span
                            className={cx(
                              classes["qicon-default"],
                              classes[`qicon-${match.sportCode.toLowerCase()}`],
                              classes["icon"],
                            )}
                          />
                          <span className={classes["text-shadow"]}>
                            {sports ? sports[match.sportCode].description : ""}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className={classes["middle"]}>
                          {/* <img alt="" src={ChampIcon} /> */}
                          {match.countryCode ? (
                            <ReactCountryFlag
                              svg
                              countryCode={match.countryCode}
                              style={{
                                fontSize: "1.5em",
                                lineHeight: "1.5em",
                                margin: "0 6.25px 0px 2px",
                                verticalAlign: "baseline",
                              }}
                            />
                          ) : (
                            <FallbackWorldImage
                              style={{
                                fontSize: "1.5em",
                                height: "1em",
                                lineHeight: "1.5em",
                                // margin: "0 0px 0px 8.25px",
                                verticalAlign: "baseline",
                                width: "1.5em",
                              }}
                            />
                          )}
                          <span className={classes["text-shadow"]}>{match.category}</span>
                        </div>
                      </td>
                      <td className={classes["match-time"]}>
                        <span>{formatDateHoursMinutes(getDatejsObject(parseDate(match.epoch)))}</span>
                      </td>
                      <td>
                        <div className={classes["calendar__table--arrow"]}>
                          <p>
                            {match.description}
                            <span>{`${match.category}, ${match.tournament}`}</span>
                          </p>
                          <div
                            className={classes["arrow-right"]}
                            onClick={() => history.push(`/prematch/eventpath/${match.tournamentId}/event/${match.id}`)}
                          >
                            <FontAwesomeIcon icon={faAngleDoubleRight} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
      <BetSlipColumn />
    </main>
  );
};

export default React.memo(CalendarPage);
