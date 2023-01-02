import ArrowDownSVG from "applications/citymobile/img/icons/arrow-down.svg";
import Spinner from "applications/common/components/Spinner";
import cx from "classnames";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getLocaleDateDayNumberMonthTimeFormatKOSpecific } from "utils/date-format";

import { useGAPageView } from "../../../../../hooks/google-analytics-hooks";
import { getAuthLanguage, getAuthTimezoneOffset } from "../../../../../redux/reselect/auth-selector";
import { getStandardResultSlice } from "../../../../../redux/slices/resultSlice";
import classes from "../../../scss/citymobile.module.scss";
import PagePath from "../../Navigation/PagePath/components";

const getLeagues = (sports, currentSportCode) => {
  const categories = sports.find((sport) => sport.sportCode === currentSportCode).categories;
  if (categories) {
    const leagues = [];
    categories.forEach((c) => {
      const categoryDescription = c.description;
      if (c.tournaments) {
        c.tournaments.forEach((l) => {
          const leagueId = l.id;
          const leagueDescription = l.description;

          leagues.push({ desc: `${categoryDescription} - ${leagueDescription}`, id: leagueId });
        });
      }
    });
    leagues.sort((a, b) => a.desc.localeCompare(b.desc));

    return leagues;
  }

  return [];
};

const ResultPage = () => {
  const locale = useSelector(getAuthLanguage);
  const dateFormat = getLocaleDateDayNumberMonthTimeFormatKOSpecific(locale);
  const { t } = useTranslation();

  const timezoneOffset = useSelector(getAuthTimezoneOffset);

  const sports = useSelector((state) => state.sport.sports);
  const results = useSelector((state) => state.result.standardResults);
  const loading = useSelector((state) => state.result.loading);

  useGAPageView("Results");

  const [collapsedSections, setCollapsedSections] = useState([]);

  const sectionToggleCollapsibleHandler = (id) => {
    if (collapsedSections.includes(id)) {
      setCollapsedSections(collapsedSections.filter((sectionId) => id !== sectionId));
    } else {
      setCollapsedSections([...collapsedSections, id]);
    }
  };

  const [currentDateOffset, setCurrentDateOffset] = useState(-24);
  const [currentSportCode, setCurrentSportCode] = useState(null);
  const [currentLeagueId, setCurrentLeagueId] = useState(null);

  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [sportDropdownOpen, setSportDropdownOpen] = useState(false);
  const [leagueDropdownOpen, setLeagueDropdownOpen] = useState(false);

  const toggleDateDropwdown = (e) => {
    e.preventDefault();
    if (e.target === e.currentTarget) {
      // handle
      setSportDropdownOpen(false);
      setLeagueDropdownOpen(false);
      setDateDropdownOpen(!dateDropdownOpen);
    }
  };

  const toggleSportDropwdown = (e) => {
    e.preventDefault();
    if (e.target === e.currentTarget) {
      // handle
      setDateDropdownOpen(false);
      setLeagueDropdownOpen(false);
      setSportDropdownOpen(!sportDropdownOpen);
    }
  };

  const toggleLeagueDropwdown = (e) => {
    e.preventDefault();
    if (e.target === e.currentTarget) {
      // handle
      setSportDropdownOpen(false);
      setDateDropdownOpen(false);
      setLeagueDropdownOpen(!leagueDropdownOpen);
    }
  };

  // Track"click outside component"
  const refSportsDropdown = useRef();
  const refDateDropdown = useRef();
  const refLeagueDropdown = useRef();

  const closeAllDropdowns = (e) => {
    if (
      refSportsDropdown.current.contains(e.target) ||
      refDateDropdown.current.contains(e.target) ||
      refLeagueDropdown.current.contains(e.target)
    ) {
      // inside click
      return;
    }
    setSportDropdownOpen(false);
    setDateDropdownOpen(false);
    setLeagueDropdownOpen(false);
  };

  useEffect(() => {
    // add when mounted
    document.addEventListener("mousedown", closeAllDropdowns);
    // return function to be called when unmounted

    return () => {
      document.removeEventListener("mousedown", closeAllDropdowns);
    };
  }, []);
  // End"Track..."

  const onSelectDateOffsetChangeHandler = (offset) => {
    if (offset !== currentDateOffset) {
      setCurrentDateOffset(offset);
      setCurrentLeagueId(null);
      // setCurrentSportSelection('ALL');
    }
    setDateDropdownOpen(false);
  };

  const getDateDescription = (offset) => {
    switch (offset) {
      case -24:
        return t("city.pages.result.last_hours", { number: 24 });
      case -48:
        return t("city.pages.result.last_hours", { number: 48 });
      case -96:
        return t("city.pages.result.last_days", { number: 4 });
      case -168:
        return t("city.pages.result.last_days", { number: 7 });
      default:
        return "";
    }
  };

  const onSelectSportChangeHandler = (sport) => {
    if (sport !== currentSportCode) {
      setCurrentSportCode(sport);
      setCurrentLeagueId(null);
      // setCurrentSportSelection('ALL');
    }
    setSportDropdownOpen(false);
  };

  const onSelectLeagueChangeHandler = (leagueId) => {
    if (leagueId !== currentLeagueId) {
      setCurrentLeagueId(leagueId);
      // setCurrentSportSelection('ALL');
    }
    setLeagueDropdownOpen(false);
  };

  const dispatch = useDispatch();
  const language = useSelector(getAuthLanguage);

  useEffect(() => {
    const dateFrom = `${dayjs()
      .add(currentDateOffset, "hour")
      .set("hour", 0)
      .set("minute", 0)
      .set("second", 0)
      .set("millisecond", 0)
      .toDate()
      .toISOString()
      .slice(0, -1)}+00:00`;
    const dateTo = `${dayjs()
      .set("hour", 23)
      .set("minute", 59)
      .set("second", 59)
      .set("millisecond", 999)
      .toDate()
      .toISOString()
      .slice(0, -1)}+00:00`;

    dispatch(getStandardResultSlice({ dateFrom, dateTo }));
  }, [dispatch, currentDateOffset, language]);

  // When the results are reloaded, reset to the"best" sport available
  useEffect(() => {
    if (results?.sports && results?.sports.length > 0) {
      // Does the currentSportCode exist in the new batch? Else reset to the first known sport
      if (results.sports.findIndex((s) => s.sportCode === currentSportCode) === -1) {
        const sportCode = results.sports[0].sportCode;
        setCurrentSportCode(sportCode);
      }
    }
  }, [currentSportCode, results]);

  const leagues = results?.sports && currentSportCode ? getLeagues(results.sports, currentSportCode) : [];

  return (
    <>
      <PagePath
        paths={[
          {
            description: t("home_page"),
            target: "/",
          },
          { description: t("results") },
        ]}
      />

      <div className={classes["sport"]}>
        <h3 className={`${classes["sports-title"]} ${classes["sports-title_alternative"]}`}>
          {t("city.pages.result.league_table")}
        </h3>
        <div className={classes["dropdowns"]}>
          <div className={classes["dropdowns__row"]}>
            <div className={classes["dropdown"]} ref={refDateDropdown} onClick={toggleDateDropwdown}>
              <span className={classes["dropdown__title"]} onClick={toggleDateDropwdown}>
                {getDateDescription(currentDateOffset)}
              </span>
              <div className={classes["dropdown__arrow"]} onClick={toggleDateDropwdown}>
                <img alt="" src={ArrowDownSVG} />
              </div>
              <ul className={`${classes["dropdown__list"]} ${dateDropdownOpen ? classes["open"] : ""}`}>
                {[-24, -48, -96, -168].map((offset) => (
                  <li
                    className={`${classes["dropdown__list-li"]} ${
                      currentDateOffset === offset ? classes["dropdown__list-li_active"] : ""
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
            <div className={classes["dropdown"]} ref={refSportsDropdown} onClick={toggleSportDropwdown}>
              <span className={classes["dropdown__title"]} onClick={toggleSportDropwdown}>
                {currentSportCode && sports ? sports[currentSportCode].description : `${t("loading")}...`}
              </span>
              <div className={classes["dropdown__arrow"]} onClick={toggleSportDropwdown}>
                <img alt="" src={ArrowDownSVG} />
              </div>
              <ul className={`${classes["dropdown__list"]} ${sportDropdownOpen ? classes["open"] : ""}`}>
                {results && sports
                  ? results.sports.map((sport) => (
                      <li
                        className={`${classes["dropdown__list-li"]} ${
                          currentSportCode === sport.sportCode ? classes["dropdown__list-li_active"] : ""
                        }`}
                        key={sport.sportCode}
                        onClick={() => onSelectSportChangeHandler(sport.sportCode)}
                      >
                        <span>{sports[sport.sportCode].description}</span>
                      </li>
                    ))
                  : null}
              </ul>
            </div>
          </div>
          <div className={classes["dropdown"]} ref={refLeagueDropdown} onClick={toggleLeagueDropwdown}>
            <span className={classes["dropdown__title"]} onClick={toggleLeagueDropwdown}>
              {currentLeagueId
                ? leagues.find((l) => l.id === currentLeagueId).desc
                : t("city.pages.result.select_league")}
            </span>
            <div className={classes["dropdown__arrow"]} onClick={toggleLeagueDropwdown}>
              <img alt="" src={ArrowDownSVG} />
            </div>
            <ul className={`${classes["dropdown__list"]} ${leagueDropdownOpen ? classes["open"] : ""}`}>
              <li
                className={`${classes["dropdown__list-li"]} ${
                  !currentLeagueId ? classes["dropdown__list-li_active"] : ""
                }`}
                onClick={() => onSelectLeagueChangeHandler(null)}
              >
                <span>{t("vanilladesktop.select_all")}</span>
              </li>
              {leagues.map((league) => (
                <li
                  className={`${classes["dropdown__list-li"]} ${
                    league.id === currentLeagueId ? classes["dropdown__list-li_active"] : ""
                  }`}
                  key={league.id}
                  onClick={() => onSelectLeagueChangeHandler(league.id)}
                >
                  <span>{league.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={classes["results"]}>
          <div className={classes["results__labels"]}>
            <div className={classes["results__labels-left"]}>
              <span className={cx(classes["results__label"], classes["results__label_date"])}>
                {t("city.pages.result.kick_off")}
              </span>
              <span className={classes["results__label"]}>{t("city.pages.result.match")}</span>
            </div>
            <div className={classes["results__labels-right"]}>
              <span className={classes["results__label"]}>{t("city.pages.result.ht")}</span>

              <span className={classes["results__label"]}>{t("city.pages.result.full_time")}</span>
            </div>
          </div>
          <div className={classes["results-spoilers"]}>
            {!loading && results?.sports && currentSportCode ? (
              [...results.sports.find((s) => s.sportCode === currentSportCode).categories]
                .sort((a, b) => a.description.localeCompare(b.description))
                .map((c) =>
                  [...c.tournaments]
                    .sort((a, b) => a.description.localeCompare(b.description))
                    .map((l) => {
                      if (currentLeagueId && l.id !== currentLeagueId) return null;

                      return (
                        <>
                          <div className={classes["results-spoiler"]}>
                            <h3
                              className={classes["sports-title"]}
                              onClick={() => sectionToggleCollapsibleHandler(`${c.description} - ${l.description}`)}
                            >
                              {`${c.description} - ${l.description}`}
                            </h3>
                          </div>
                          {!collapsedSections.includes(`${c.description} - ${l.description}`) &&
                            l.events.map((m) => (
                              <div className={classes["results__card"]} key={m.description}>
                                <div className={classes["results__titles"]}>
                                  <span className={classes["results__date"]}>
                                    {dayjs
                                      .unix(m.epoch / 1000)
                                      .utcOffset(timezoneOffset)
                                      .format(dateFormat)}
                                  </span>
                                  <span className={classes["results__title"]}>{m.description}</span>
                                </div>
                                <div className={classes["results__times"]}>
                                  <span className={classes["results__time"]}>
                                    {m?.scores?.HALF_1 ? `${m?.scores?.HALF_1.a}:${m?.scores?.HALF_1.b}` : "- : -"}
                                  </span>
                                  <span className={classes["results__time"]}>
                                    {m?.scores?.MATCH ? `${m?.scores?.MATCH.a}:${m?.scores?.MATCH.b}` : "- : -"}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </>
                      );
                    }),
                )
            ) : (
              <Spinner className={classes.loader} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultPage;
