import dayjs from "dayjs";
import { useLiveCalendarData } from "hooks/live-calendar-hooks";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import { useGAPageView } from "../../../../hooks/google-analytics-hooks";
import { getCitySportIcon } from "../../../../utils/city/sporticon-utils";
import classes from "../../scss/citywebstyle.module.scss";
import PagePath from "../Navigation/PagePath/PagePath";

const LiveSchedule = () => {
  const { t } = useTranslation();

  const sports = useSelector((state) => state.sport.sports);

  const liveCalendarData = useLiveCalendarData();

  const [currentSportSelection, setCurrentSportSelection] = useState("ALL");

  const [currentDateOffset, setCurrentDateOffset] = useState(0);

  const [sportCountMap, setSportCountMap] = useState({});

  useEffect(() => {
    if (liveCalendarData) {
      const now = dayjs(new Date());

      const tempSportCountMap = { ALL: 0 };

      liveCalendarData.forEach((item) => {
        const startDate = dayjs.unix(item.epoch / 1000);
        const dateOffset = dayjs(startDate).dayOfYear() - now.dayOfYear();

        if (dateOffset === currentDateOffset) {
          if (!tempSportCountMap[item.sportCode]) {
            tempSportCountMap[item.sportCode] = 1;
          } else {
            tempSportCountMap[item.sportCode] += 1;
          }
          tempSportCountMap["ALL"] += 1;
        }
      });
      setSportCountMap(tempSportCountMap);

      // if the selected sport is not available in the new date, reset
      if (!Object.keys(tempSportCountMap)?.includes(currentSportSelection)) {
        setCurrentSportSelection("ALL");
      }
    }
  }, [liveCalendarData, currentDateOffset]);

  useGAPageView("Live Schedule");

  const [sportDropdownOpen, setSportDropdownOpen] = useState(false);

  const toggleSportsDropwdown = (e) => {
    e.preventDefault();
    if (e.target === e.currentTarget) {
      // handle
      setSportDropdownOpen(!sportDropdownOpen);
    }
  };

  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  const toggleDateDropwdown = (e) => {
    e.preventDefault();
    if (e.target === e.currentTarget) {
      // handle
      setDateDropdownOpen(!dateDropdownOpen);
    }
  };

  // Track "click outside component"
  const refSportsDropdown = useRef(null);
  const refDateDropdown = useRef(null);

  const closeAllDropdowns = (e) => {
    if (refSportsDropdown?.current?.contains(e.target) || refDateDropdown?.current?.contains(e.target)) {
      // inside click
      return;
    }
    setSportDropdownOpen(false);
    setDateDropdownOpen(false);
  };

  useEffect(() => {
    // add when mounted
    document.addEventListener("mousedown", closeAllDropdowns);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener("mousedown", closeAllDropdowns);
    };
  }, []);
  // End "Track..."

  const onSelectDateOffsetChangeHandler = (offset) => {
    if (offset !== currentDateOffset) {
      setCurrentDateOffset(offset);
    }
    setDateDropdownOpen(false);
  };

  const getDateDescription = (offset) => {
    switch (offset) {
      case 0:
        return `${t("city.live_schedule.today")} (${dayjs().add(offset, "day").format("MMM DD")})`;
      case 1:
        return `${t("city.live_schedule.tomorrow")} (${dayjs().add(offset, "day").format("MMM DD")})`;
      default:
        return `${dayjs().add(offset, "day").format("dddd")} (${dayjs().add(offset, "day").format("MMM DD")})`;
    }
  };

  const onSelectSportChangeHandler = (sport) => {
    if (sport !== currentSportSelection) {
      setCurrentSportSelection(sport);
      setSportDropdownOpen(false);
    }
  };

  const history = useHistory();
  const onSelectEventHandler = (eventId) => {
    history.push(`/events/prematch/${eventId}`); // navigate to the new route...
  };

  const now = dayjs(new Date());

  return (
    <section className={classes["content"]}>
      <PagePath
        paths={[
          {
            description: t("home_page"),
            target: "/",
          },
          { description: t("live_schedule") },
        ]}
        qualifierClassName="breadcrumbs_event"
      />

      <div className={classes["content__container"]}>
        {Object.keys(sportCountMap).length > 0 ? (
          <>
            <div className={classes["content-dropdowns"]}>
              <div
                className={`${classes["content-dropdown"]} ${classes["drop-down"]}`}
                ref={refSportsDropdown}
                onClick={toggleSportsDropwdown}
              >
                <span className={classes["content-dropdown__title"]} onClick={toggleSportsDropwdown}>
                  {currentSportSelection === "ALL" ? t("all_sports") : sports[currentSportSelection].description} (
                  {sportCountMap[currentSportSelection]})
                </span>
                <span
                  className={`${classes["content-dropdown__arrow"]} ${classes["accordion-arrow"]}`}
                  onClick={toggleSportsDropwdown}
                />
                <ul
                  className={`${classes["content-dropdown__list"]} ${classes["drop-down__list"]} ${
                    sportDropdownOpen ? classes["open"] : ""
                  }`}
                >
                  {Object.keys(sportCountMap).map((sport) => (
                    <li
                      className={`${classes["content-dropdown__list-li"]} ${
                        currentSportSelection === sport ? classes["content-dropdown__list-li_active"] : ""
                      }`}
                      key={sport}
                      onClick={() => onSelectSportChangeHandler(sport)}
                    >
                      <span>
                        {sport === "ALL" ? t("all_sports") : sports[sport].description} ({sportCountMap[sport]})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className={`${classes["content-dropdown"]} ${classes["drop-down"]}`}
                ref={refDateDropdown}
                onClick={toggleDateDropwdown}
              >
                <span className={classes["content-dropdown__title"]} onClick={toggleDateDropwdown}>
                  {getDateDescription(currentDateOffset)}
                </span>
                <span
                  className={`${classes["content-dropdown__arrow"]} ${classes["accordion-arrow"]}`}
                  onClick={toggleDateDropwdown}
                />
                <ul
                  className={`${classes["content-dropdown__list"]} ${classes["drop-down__list"]} ${
                    dateDropdownOpen ? classes["open"] : ""
                  }`}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((offset) => (
                    <li
                      className={`${classes["content-dropdown__list-li"]} ${
                        currentDateOffset === offset ? classes["content-dropdown__list-li_active"] : ""
                      }`}
                      key={offset}
                      value={offset}
                      onClick={() => onSelectDateOffsetChangeHandler(offset)}
                    >
                      <span>{getDateDescription(offset)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <h3 className={classes["sports-title"]}>
              {currentSportSelection === "ALL" ? t("all_sports") : sports[currentSportSelection]?.description} (
              {sportCountMap[currentSportSelection]})
            </h3>
            {liveCalendarData.map((match) => {
              const image = getCitySportIcon(match.sportCode);

              const startDate = dayjs.unix(match.epoch / 1000);

              const dateOffset = dayjs(startDate).dayOfYear() - now.dayOfYear();

              if (dateOffset !== currentDateOffset) {
                // Skip events for a different date to the one currently selected
                return null;
              }

              if (currentSportSelection !== "ALL" && currentSportSelection !== match.sportCode) {
                // If a specific sport was selected by the user, skip if this event does not belong to that sport
                return null;
              }

              return (
                <div className={classes["ticket"]} key={match.id} onClick={() => onSelectEventHandler(match.id)}>
                  <div className={classes["ticket__content"]}>
                    <div className={classes["ticket__icon"]}>
                      <img alt="icon" src={image} />
                    </div>
                    <div className={classes["ticket__text"]}>
                      <div className={classes["ticket__sport"]}>
                        <span>{sports ? sports[match.sportCode]?.description : ""}</span>
                        <span>{match.tournament}</span>
                      </div>
                      <div className={classes["ticket__team"]}>
                        <span>{match.description.split(" vs ")[0]}</span>
                        <span>{match.description.split(" vs ")[1]}</span>
                      </div>
                    </div>
                  </div>
                  <span className={classes["ticket__status"]}>
                    {`${t("city.live_schedule.starts_at")} ${startDate.format("HH:mm")}`}
                  </span>
                </div>
              );
            })}
          </>
        ) : null}
      </div>
    </section>
  );
};

export default LiveSchedule;
