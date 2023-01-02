import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { ReactComponent as FallbackWorldImage } from "../../../../../assets/img/icons/World_Flag.svg";
import { useOnClickOutside } from "../../../../../hooks/utils-hooks";
import { getAuthLanguage } from "../../../../../redux/reselect/auth-selector";
import { getCmsConfigSportsBook } from "../../../../../redux/reselect/cms-selector";
import { getStandardResultSlice } from "../../../../../redux/slices/resultSlice";
import { openLinkInNewWindow } from "../../../../../utils/misc";
import StatsButton from "../../../common/components/StatsButton";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

const sanitiseCountryCode = (code) => {
  if (true) {
    return code;
  }

  return "XX";
};

const hasScore = (scores, scoreTypes) => {
  let hasMatch = false;
  for (let i = 0; i < scoreTypes.length; i += 1) {
    if (scores.includes(scoreTypes[i])) {
      hasMatch = true;
      break;
    }
  }

  return hasMatch;
};

const getScore = (scores, scoreTypes) => {
  const scoreKeys = Object.keys(scores);
  for (let i = 0; i < scoreTypes.length; i += 1) {
    if (scoreKeys.includes(scoreTypes[i])) {
      return { oppAPeriod: scores[scoreTypes[i]].a, oppBPeriod: scores[scoreTypes[i]].b };
    }
  }

  return undefined;
};

const getLeagues = (sports, currentSportCode) => {
  const sport = sports.find((sport) => sport.sportCode === currentSportCode);
  if (!sport) return [];

  const categories = sport.categories;
  if (categories) {
    const leagues = [];
    categories.forEach((c) => {
      const categoryDescription = c.description;
      const categoryCountryCode = c.countryCode;
      if (c.tournaments) {
        c.tournaments.forEach((l) => {
          const leagueId = l.id;
          const leagueDescription = l.description;

          leagues.push({
            countryCode: categoryCountryCode,
            desc: `${categoryDescription} - ${leagueDescription}`,
            id: leagueId,
          });
        });
      }
    });
    leagues.sort((a, b) => a.desc.localeCompare(b.desc));

    return leagues;
  }

  return [];
};

const getMatches = (sports, currentLeagueId, currentSportCode) => {
  const matches = [];
  sports.forEach((sport) => {
    if (!currentSportCode || sport.sportCode === currentSportCode) {
      sport.categories.forEach((category) => {
        const categoryDescription = category.description;

        category.tournaments.forEach((tournament) => {
          if (!currentLeagueId || tournament.id === currentLeagueId) {
            const leagueDescription = tournament.description;

            tournament.events.forEach((match) => {
              matches.push({ ...match, leagueDescription: `${categoryDescription} - ${leagueDescription}` });
            });
          }
        });
      });
    }
  });

  return matches.sort((a, b) => a.epoch - b.epoch);
};

const ResultsPage = () => {
  const { t } = useTranslation();

  const [currentSportCode, setCurrentSportCode] = useState(null);
  const [currentLeagueId, setCurrentLeagueId] = useState(null);
  const [dateOffset, setDateOffset] = useState(0);
  const [sportDropdownOpen, setSportDropdownOpen] = useState(false);
  const [leagueDropdownOpen, setLeagueDropdownOpen] = useState(false);

  const sports = useSelector((state) => state.sport.sports);
  const results = useSelector((state) => state.result.standardResults);
  const loading = useSelector((state) => state.result.loading);
  const cmsConfigSportsBook = useSelector(getCmsConfigSportsBook)?.data || {};
  const { betradarStatsOn, betradarStatsURL } = cmsConfigSportsBook;
  const language = useSelector(getAuthLanguage);

  const dispatch = useDispatch();
  useEffect(() => {
    const dateFrom = `${dayjs()
      .subtract(dateOffset, "day")
      .set("hour", 0)
      .set("minute", 0)
      .set("second", 0)
      .set("millisecond", 0)
      .toDate()
      .toISOString()
      .slice(0, -1)}+00:00`;
    const dateTo = `${dayjs()
      .subtract(dateOffset, "day")
      .set("hour", 23)
      .set("minute", 59)
      .set("second", 59)
      .set("millisecond", 999)
      .toDate()
      .toISOString()
      .slice(0, -1)}+00:00`;

    dispatch(getStandardResultSlice({ dateFrom, dateTo }));

    setCurrentLeagueId(null);
  }, [dispatch, dateOffset]);

  const toggleSportDropwdown = (e) => {
    e.preventDefault();
    // if (e.target === e.currentTarget) {
    // handle
    setLeagueDropdownOpen(false);
    setSportDropdownOpen(!sportDropdownOpen);
    // }
  };
  const toggleLeagueDropwdown = (e) => {
    e.preventDefault();
    // if (e.target === e.currentTarget) {
    // handle
    setLeagueDropdownOpen(!leagueDropdownOpen);
    setSportDropdownOpen(false);
    // }
  };
  const refSportsDropdown = useRef();
  const refLeagueDropdown = useRef();

  useOnClickOutside(refSportsDropdown, () => setSportDropdownOpen(false));
  useOnClickOutside(refLeagueDropdown, () => setLeagueDropdownOpen(false));

  const [collapsedSections, setCollapsedSections] = useState([]);

  const sectionToggleCollapsibleHandler = (id) => {
    if (collapsedSections.includes(id)) {
      setCollapsedSections(collapsedSections.filter((sectionId) => id !== sectionId));
    } else {
      setCollapsedSections([...collapsedSections, id]);
    }
  };

  const availableSports = useMemo(
    () => (results?.sports ? results.sports.map((sport) => sport.sportCode) : []),
    [results],
  );

  const leagues = useMemo(
    () => (results?.sports && currentSportCode ? getLeagues(results.sports, currentSportCode) : []),
    [results, currentSportCode],
  );

  const leagueCountryCode = useMemo(
    () =>
      leagues && currentLeagueId ? leagues.find((league) => league.id === currentLeagueId)?.countryCode : undefined,
    [leagues, currentLeagueId],
  );

  const matches = useMemo(
    () => (results?.sports ? getMatches(results.sports, currentLeagueId, currentSportCode) : []),
    [results, currentLeagueId, currentSportCode],
  );

  if (loading) {
    return (
      <div className={classes["spinner-container"]}>
        <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
      </div>
    );
  }

  return (
    <main className={classes["main"]}>
      <div className={classes["results"]}>
        <h1 className={classes["main__title"]}>{t("results")}</h1>
        <div className={classes["date-tabs"]}>
          <div
            className={cx(classes["date-tab"], { [classes["active"]]: dateOffset === 0 })}
            onClick={() => setDateOffset(0)}
          >
            {t("today")}
          </div>
          <div
            className={cx(classes["date-tab"], { [classes["active"]]: dateOffset === 1 })}
            onClick={() => setDateOffset(1)}
          >
            {dayjs().subtract(1, "day").format("DD MMM")}
          </div>
          <div
            className={cx(classes["date-tab"], { [classes["active"]]: dateOffset === 2 })}
            onClick={() => setDateOffset(2)}
          >
            {dayjs().subtract(2, "day").format("DD MMM")}
          </div>
          <div
            className={cx(classes["date-tab"], { [classes["active"]]: dateOffset === 3 })}
            onClick={() => setDateOffset(3)}
          >
            {dayjs().subtract(3, "day").format("DD MMM")}
          </div>
          <div
            className={cx(classes["date-tab"], { [classes["active"]]: dateOffset === 4 })}
            onClick={() => setDateOffset(4)}
          >
            {dayjs().subtract(4, "day").format("DD MMM")}
          </div>
          <div
            className={cx(classes["date-tab"], { [classes["active"]]: dateOffset === 5 })}
            onClick={() => setDateOffset(5)}
          >
            {dayjs().subtract(5, "day").format("DD MMM")}
          </div>
        </div>
        <div className={cx(classes["main__container"], classes["main__container_small"])}>
          <div className={classes["live-calendar"]}>
            <ul className={classes["live-calendar__buttons"]}>
              <ul className={classes["live-calendar__list"]}>
                <li
                  className={classes["live-calendar-select"]}
                  id="calendar-sports"
                  ref={refSportsDropdown}
                  onClick={toggleSportDropwdown}
                >
                  <div className={classes["live-calendar-select__body"]}>
                    <span className={classes["live-calendar-select__icon"]}>
                      <i
                        className={cx(
                          classes["qicon-default"],
                          classes[`qicon-${currentSportCode ? currentSportCode.toLowerCase() : "foot"}`],
                        )}
                      />
                    </span>
                    <span className={classes["live-calendar-select__text"]}>
                      {currentSportCode ? (sports ? sports[currentSportCode].description : "") : t("all_sports")}
                    </span>
                    <span className={classes["live-calendar-select__arrow"]}>
                      <span />
                    </span>
                  </div>
                  <ul
                    className={cx(classes["live-calendar-select__sublist"], classes["calendar-item1"], {
                      [classes["active"]]: sportDropdownOpen,
                    })}
                  >
                    <li
                      className={cx(classes["live-calendar-select__subli"], {
                        [classes["live-calendar-select__subli_active"]]: !currentSportCode,
                      })}
                      onClick={() => {
                        setCurrentLeagueId(null);
                        setCurrentSportCode(null);
                      }}
                    >
                      <span className={classes["live-calendar-select__subli-icon"]}>
                        <i className={classes["qicon-foot"]} />
                      </span>
                      <span className={classes["live-calendar-select__subli-text"]}>{t("all_sports")}</span>
                      <FontAwesomeIcon className={classes["live-calendar-select__subli-check"]} icon={faCheck} />
                    </li>

                    {availableSports &&
                      availableSports.map((sportCode) => (
                        <li
                          className={cx(classes["live-calendar-select__subli"], {
                            [classes["live-calendar-select__subli_active"]]: currentSportCode === sportCode,
                          })}
                          key={sportCode}
                          onClick={() => {
                            setCurrentSportCode(sportCode);
                            setCurrentLeagueId(null);
                          }}
                        >
                          <span className={classes["live-calendar-select__subli-icon"]}>
                            <i className={cx(classes["qicon-default"], classes[`qicon-${sportCode.toLowerCase()}`])} />
                          </span>
                          <span className={classes["live-calendar-select__subli-text"]}>
                            {sports ? sports[sportCode].description : ""}
                          </span>
                          <FontAwesomeIcon className={classes["live-calendar-select__subli-check"]} icon={faCheck} />
                        </li>
                      ))}
                  </ul>
                </li>

                <li
                  className={classes["live-calendar-select"]}
                  id="calendar-btn"
                  ref={refLeagueDropdown}
                  onClick={toggleLeagueDropwdown}
                >
                  <div
                    className={classes["live-calendar-select__body"]}
                    style={{ opacity: currentSportCode ? 1 : 0.5 }}
                  >
                    <span className={classes["live-calendar-select__icon"]}>
                      {currentLeagueId && leagueCountryCode ? (
                        <ReactCountryFlag
                          svg
                          className={classes["sports-spoiler__item-icon"]}
                          countryCode={sanitiseCountryCode(leagueCountryCode)}
                        />
                      ) : (
                        <FallbackWorldImage
                          className={classes["sports-spoiler__item-icon"]}
                          style={{ height: "1em", width: "1em" }}
                        />
                      )}
                    </span>
                    <span className={classes["live-calendar-select__text"]}>
                      {currentLeagueId && currentSportCode
                        ? leagues.find((l) => l.id === currentLeagueId).desc
                        : t("city.pages.result.select_league")}
                    </span>
                    <span className={classes["live-calendar-select__arrow"]}>
                      <span />
                    </span>
                  </div>
                  {leagues.length > 0 && (
                    <ul
                      className={cx(classes["live-calendar-select__sublist"], classes["calendar-item2"], {
                        [classes["active"]]: leagueDropdownOpen,
                      })}
                    >
                      {leagues.map((league) => (
                        <li
                          className={cx(classes["live-calendar-select__subli"], {
                            [classes["live-calendar-select__subli_active"]]: league.id === currentLeagueId,
                          })}
                          key={league.id}
                          onClick={() => setCurrentLeagueId(league.id)}
                        >
                          <span className={classes["live-calendar-select__subli-icon"]}>
                            {league.countryCode ? (
                              <ReactCountryFlag
                                svg
                                className={classes["sports-spoiler__item-icon"]}
                                countryCode={sanitiseCountryCode(league.countryCode)}
                              />
                            ) : (
                              <FallbackWorldImage
                                className={classes["sports-spoiler__item-icon"]}
                                style={{ height: "1em", width: "1em" }}
                              />
                            )}
                          </span>
                          <span className={classes["live-calendar-select__subli-text"]}>{league.desc}</span>
                          <FontAwesomeIcon className={classes["live-calendar-select__subli-check"]} icon={faCheck} />
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              </ul>
            </ul>
          </div>
        </div>

        {!loading &&
          matches.map((match) => {
            const hasPeriod1 = hasScore(Object.keys(match.scores), [
              "INNING_1",
              "QUARTER_1",
              "MAP_1",
              "SET_1",
              "HALF_1",
            ]);
            const hasPeriod2 = hasScore(Object.keys(match.scores), [
              "INNING_2",
              "QUARTER_2",
              "MAP_2",
              "SET_2",
              "HALF_2",
            ]);
            const hasPeriod3 = hasScore(Object.keys(match.scores), ["INNING_3", "QUARTER_3", "MAP_3", "SET_3"]);
            const hasPeriod4 = hasScore(Object.keys(match.scores), ["INNING_4", "QUARTER_4", "MAP_4", "SET_4"]);
            const hasPeriod5 = hasScore(Object.keys(match.scores), ["INNING_5", "MAP_5", "SET_5"]);
            const hasPeriod6 = hasScore(Object.keys(match.scores), ["INNING_6", "MAP_6", "SET_6"]);
            const hasPeriod7 = hasScore(Object.keys(match.scores), ["INNING_7", "MAP_7", "SET_7"]);
            const hasPeriod8 = hasScore(Object.keys(match.scores), ["INNING_8"]);
            const hasPeriod9 = hasScore(Object.keys(match.scores), ["INNING_9"]);
            const hasPeriod10 = hasScore(Object.keys(match.scores), ["INNING_10"]);
            const hasPeriod11 = hasScore(Object.keys(match.scores), ["INNING_11"]);
            const hasPeriod12 = hasScore(Object.keys(match.scores), ["INNING_12"]);
            const hasPeriod13 = hasScore(Object.keys(match.scores), ["INNING_13"]);
            const hasPeriod14 = hasScore(Object.keys(match.scores), ["INNING_14"]);
            const hasPeriod15 = hasScore(Object.keys(match.scores), ["INNING_15"]);
            const hasPeriod16 = hasScore(Object.keys(match.scores), ["INNING_16"]);
            const hasPeriod17 = hasScore(Object.keys(match.scores), ["INNING_17"]);
            const hasPeriod18 = hasScore(Object.keys(match.scores), ["INNING_18"]);
            const hasPeriod19 = hasScore(Object.keys(match.scores), ["INNING_19"]);
            const hasPeriod20 = hasScore(Object.keys(match.scores), ["INNING_20"]);
            const hasPeriodOT = hasScore(Object.keys(match.scores), ["OVERTIME"]);

            const { oppAPeriod: oppAPeriod1, oppBPeriod: oppBPeriod1 } = hasPeriod1
              ? getScore(match.scores, ["INNING_1", "QUARTER_1", "MAP_1", "SET_1", "HALF_1"])
              : { oppAPeriod: undefined, oppBPeriod: undefined };
            const { oppAPeriod: oppAPeriod2, oppBPeriod: oppBPeriod2 } = hasPeriod2
              ? getScore(match.scores, ["INNING_2", "QUARTER_2", "MAP_2", "SET_2", "HALF_2"])
              : { oppAPeriod: undefined, oppBPeriod: undefined };
            const { oppAPeriod: oppAPeriod3, oppBPeriod: oppBPeriod3 } = hasPeriod3
              ? getScore(match.scores, ["INNING_3", "QUARTER_3", "MAP_3", "SET_3"])
              : { oppAPeriod: undefined, oppBPeriod: undefined };
            const { oppAPeriod: oppAPeriod4, oppBPeriod: oppBPeriod4 } = hasPeriod4
              ? getScore(match.scores, ["INNING_4", "QUARTER_4", "MAP_4", "SET_4"])
              : { oppAPeriod: undefined, oppBPeriod: undefined };
            const { oppAPeriod: oppAPeriod5, oppBPeriod: oppBPeriod5 } = hasPeriod5
              ? getScore(match.scores, ["INNING_5", "MAP_5", "SET_5"])
              : { oppAPeriod: undefined, oppBPeriod: undefined };
            const { oppAPeriod: oppAPeriod6, oppBPeriod: oppBPeriod6 } = hasPeriod6
              ? getScore(match.scores, ["INNING_6", "MAP_6", "SET_6"])
              : { oppAPeriod: undefined, oppBPeriod: undefined };
            const { oppAPeriod: oppAPeriod7, oppBPeriod: oppBPeriod7 } = hasPeriod7
              ? getScore(match.scores, ["INNING_7", "MAP_7", "SET_7"])
              : { oppAPeriod: undefined, oppBPeriod: undefined };
            const { oppAPeriod: oppAPeriod8, oppBPeriod: oppBPeriod8 } = hasPeriod8
              ? getScore(match.scores, ["INNING_8"])
              : { oppAPeriod: undefined, oppBPeriod: undefined };
            const { oppAPeriod: oppAPeriod9, oppBPeriod: oppBPeriod9 } = hasPeriod9
              ? getScore(match.scores, ["INNING_9"])
              : { oppAPeriod: undefined, oppBPeriod: undefined };
            const { oppAPeriod: oppAPeriod10, oppBPeriod: oppBPeriod10 } = hasPeriod10
              ? getScore(match.scores, ["INNING_10"])
              : { oppAPeriod: undefined, oppBPeriod: undefined };
            const { oppAPeriod: oppAPeriod11, oppBPeriod: oppBPeriod11 } = hasPeriod11
              ? getScore(match.scores, ["INNING_11"])
              : { oppAPeriod: undefined, oppBPeriod: undefined };
            const { oppAPeriod: oppAPeriod12, oppBPeriod: oppBPeriod12 } = hasPeriod12
              ? getScore(match.scores, ["INNING_12"])
              : { oppAPeriod: undefined, oppBPeriod: undefined };
            const { oppAPeriod: oppAPeriod13, oppBPeriod: oppBPeriod13 } = hasPeriod13
              ? getScore(match.scores, ["INNING_13"])
              : { oppAPeriod: undefined, oppBPeriod: undefined };
            const { oppAPeriod: oppAPeriod14, oppBPeriod: oppBPeriod14 } = hasPeriod14
              ? getScore(match.scores, ["INNING_14"])
              : { oppAPeriod: undefined, oppBPeriod: undefined };
            const { oppAPeriod: oppAPeriod15, oppBPeriod: oppBPeriod15 } = hasPeriod15
              ? getScore(match.scores, ["INNING_15"])
              : { oppAPeriod: undefined, oppBPeriod: undefined };
            const { oppAPeriod: oppAPeriod16, oppBPeriod: oppBPeriod16 } = hasPeriod16
              ? getScore(match.scores, ["INNING_16"])
              : { oppAPeriod: undefined, oppBPeriod: undefined };
            const { oppAPeriod: oppAPeriod17, oppBPeriod: oppBPeriod17 } = hasPeriod17
              ? getScore(match.scores, ["INNING_17"])
              : { oppAPeriod: undefined, oppBPeriod: undefined };
            const { oppAPeriod: oppAPeriod18, oppBPeriod: oppBPeriod18 } = hasPeriod18
              ? getScore(match.scores, ["INNING_18"])
              : { oppAPeriod: undefined, oppBPeriod: undefined };
            const { oppAPeriod: oppAPeriod19, oppBPeriod: oppBPeriod19 } = hasPeriod19
              ? getScore(match.scores, ["INNING_19"])
              : { oppAPeriod: undefined, oppBPeriod: undefined };
            const { oppAPeriod: oppAPeriod20, oppBPeriod: oppBPeriod20 } = hasPeriod20
              ? getScore(match.scores, ["INNING_20"])
              : { oppAPeriod: undefined, oppBPeriod: undefined };
            const { oppAPeriod: oppAPeriodOT, oppBPeriod: oppBPeriodOT } = hasPeriodOT
              ? getScore(match.scores, ["OVERTIME"])
              : { oppAPeriod: undefined, oppBPeriod: undefined };

            return (
              <div
                className={cx(classes["results__item"], classes["bet"])}
                key={match.id}
                onClick={() => sectionToggleCollapsibleHandler(match.id)}
              >
                <div
                  className={cx(classes["bet__header"], classes["spoiler-list"], {
                    [classes["active"]]: collapsedSections.includes(match.id),
                  })}
                >
                  <div className={classes["bet__numbers"]}>
                    <div className={classes["bet__id"]}>{`ID ${match.id}`}</div>
                    <div className={classes["bet__time"]}>{dayjs.unix(match.epoch / 1000).format("hh:mm A")}</div>
                  </div>
                  <div className={classes["bet__header-container"]}>
                    <div className={classes["bet__team"]}>
                      <span>{match.description}</span>
                      <span>{match.leagueDescription}</span>
                    </div>
                    <div className={classes["results__scores"]}>
                      {match?.scores?.MATCH && <div className={classes["results__score"]}>{match.scores.MATCH.a}</div>}
                      {match?.scores?.MATCH && <div className={classes["results__score"]}>{match.scores.MATCH.b}</div>}
                    </div>
                    {match.feedCode && betradarStatsOn && betradarStatsURL && (
                      <StatsButton
                        feedCode={match.feedCode.substr(match.feedCode.lastIndexOf(":") + 1)}
                        onClick={() => openLinkInNewWindow(`${betradarStatsURL}/${language}/match/${match.feedCode}`)}
                      />
                    )}
                  </div>
                  <div
                    className={cx(classes["spoiler-arrow"], classes["matches__arrow"], {
                      [classes["active"]]: collapsedSections.includes(match.id),
                    })}
                  />
                </div>
                <div
                  className={cx(classes["results__content"], {
                    [classes["open"]]: collapsedSections.includes(match.id),
                  })}
                >
                  <div className={classes["results__table"]}>
                    <div className={classes["results__labels"]}>
                      {hasPeriod1 && <div className={classes["results__label"]}>1</div>}
                      {hasPeriod2 && <div className={classes["results__label"]}>2</div>}
                      {hasPeriod3 && <div className={classes["results__label"]}>3</div>}
                      {hasPeriod4 && <div className={classes["results__label"]}>4</div>}
                      {hasPeriod5 && <div className={classes["results__label"]}>5</div>}
                      {hasPeriod6 && <div className={classes["results__label"]}>6</div>}
                      {hasPeriod7 && <div className={classes["results__label"]}>7</div>}
                      {hasPeriod8 && <div className={classes["results__label"]}>8</div>}
                      {hasPeriod9 && <div className={classes["results__label"]}>9</div>}
                      {/* {hasPeriod10 && <div className={classes["results__label"]}>11</div>} */}
                      {/* {hasPeriod11 && <div className={classes["results__label"]}>12</div>} */}
                      {/* {hasPeriod12 && <div className={classes["results__label"]}>13</div>} */}
                      {/* {hasPeriod13 && <div className={classes["results__label"]}>14</div>} */}
                      {/* {hasPeriod14 && <div className={classes["results__label"]}>15</div>} */}
                      {/* {hasPeriod15 && <div className={classes["results__label"]}>16</div>} */}
                      {/* {hasPeriod16 && <div className={classes["results__label"]}>17</div>} */}
                      {/* {hasPeriod17 && <div className={classes["results__label"]}>18</div>} */}
                      {/* {hasPeriod18 && <div className={classes["results__label"]}>19</div>} */}
                      {/* {hasPeriod19 && <div className={classes["results__label"]}>19</div>} */}
                      {/* {hasPeriod20 && <div className={classes["results__label"]}>20</div>} */}
                      {hasPeriodOT && <div className={classes["results__label"]}>OT</div>}
                      <div className={cx(classes["results__label"], classes["results__label_bold"])}>FT</div>
                    </div>
                    <div className={classes["results__td"]}>
                      <div className={classes["results__row"]}>
                        <div className={classes["results__team"]}>{match.oppA}</div>
                        <div className={classes["results__counts"]}>
                          {hasPeriod1 && (
                            <div
                              className={cx(classes["results__count"], {
                                [classes["results__count_highlighted"]]: oppAPeriod1 > oppBPeriod1,
                              })}
                            >
                              {oppAPeriod1}
                            </div>
                          )}
                          {hasPeriod2 && (
                            <div
                              className={cx(classes["results__count"], {
                                [classes["results__count_highlighted"]]: oppAPeriod2 > oppBPeriod2,
                              })}
                            >
                              {oppAPeriod2}
                            </div>
                          )}

                          {hasPeriod3 && (
                            <div
                              className={cx(classes["results__count"], {
                                [classes["results__count_highlighted"]]: oppAPeriod3 > oppBPeriod3,
                              })}
                            >
                              {oppAPeriod3}
                            </div>
                          )}
                          {hasPeriod4 && (
                            <div
                              className={cx(classes["results__count"], {
                                [classes["results__count_highlighted"]]: oppAPeriod4 > oppBPeriod4,
                              })}
                            >
                              {oppAPeriod4}
                            </div>
                          )}
                          {hasPeriod5 && (
                            <div
                              className={cx(classes["results__count"], {
                                [classes["results__count_highlighted"]]: oppAPeriod5 > oppBPeriod5,
                              })}
                            >
                              {oppAPeriod5}
                            </div>
                          )}
                          {hasPeriod6 && (
                            <div
                              className={cx(classes["results__count"], {
                                [classes["results__count_highlighted"]]: oppAPeriod6 > oppBPeriod6,
                              })}
                            >
                              {oppAPeriod6}
                            </div>
                          )}
                          {hasPeriod7 && (
                            <div
                              className={cx(classes["results__count"], {
                                [classes["results__count_highlighted"]]: oppAPeriod7 > oppBPeriod7,
                              })}
                            >
                              {oppAPeriod7}
                            </div>
                          )}
                          {hasPeriod8 && (
                            <div
                              className={cx(classes["results__count"], {
                                [classes["results__count_highlighted"]]: oppAPeriod8 > oppBPeriod8,
                              })}
                            >
                              {oppAPeriod8}
                            </div>
                          )}
                          {hasPeriod9 && (
                            <div
                              className={cx(classes["results__count"], {
                                [classes["results__count_highlighted"]]: oppAPeriod9 > oppBPeriod9,
                              })}
                            >
                              {oppAPeriod9}
                            </div>
                          )}

                          {/* {hasPeriod10 && ( */}
                          {/*  <div */}
                          {/*    className={cx(classes["results__count"], { */}
                          {/*      [classes["results__count_highlighted"]]: oppAPeriod10 > oppBPeriod10, */}
                          {/*    })} */}
                          {/*  > */}
                          {/*    {oppAPeriod10} */}
                          {/*  </div> */}
                          {/* )} */}

                          {/* {hasPeriod11 && ( */}
                          {/*  <div */}
                          {/*    className={cx(classes["results__count"], { */}
                          {/*      [classes["results__count_highlighted"]]: oppAPeriod11 > oppBPeriod11, */}
                          {/*    })} */}
                          {/*  > */}
                          {/*    {oppAPeriod11} */}
                          {/*  </div> */}
                          {/* )} */}

                          {/* {hasPeriod12 && ( */}
                          {/*  <div */}
                          {/*    className={cx(classes["results__count"], { */}
                          {/*      [classes["results__count_highlighted"]]: oppAPeriod12 > oppBPeriod12, */}
                          {/*    })} */}
                          {/*  > */}
                          {/*    {oppAPeriod12} */}
                          {/*  </div> */}
                          {/* )} */}

                          {/* {hasPeriod13 && ( */}
                          {/*  <div */}
                          {/*    className={cx(classes["results__count"], { */}
                          {/*      [classes["results__count_highlighted"]]: oppAPeriod13 > oppBPeriod13, */}
                          {/*    })} */}
                          {/*  > */}
                          {/*    {oppAPeriod13} */}
                          {/*  </div> */}
                          {/* )} */}

                          {/* {hasPeriod14 && ( */}
                          {/*  <div */}
                          {/*    className={cx(classes["results__count"], { */}
                          {/*      [classes["results__count_highlighted"]]: oppAPeriod14 > oppBPeriod14, */}
                          {/*    })} */}
                          {/*  > */}
                          {/*    {oppAPeriod14} */}
                          {/*  </div> */}
                          {/* )} */}

                          {/* {hasPeriod15 && ( */}
                          {/*  <div */}
                          {/*    className={cx(classes["results__count"], { */}
                          {/*      [classes["results__count_highlighted"]]: oppAPeriod15 > oppBPeriod15, */}
                          {/*    })} */}
                          {/*  > */}
                          {/*    {oppAPeriod15} */}
                          {/*  </div> */}
                          {/* )} */}

                          {/* {hasPeriod16 && ( */}
                          {/*  <div */}
                          {/*    className={cx(classes["results__count"], { */}
                          {/*      [classes["results__count_highlighted"]]: oppAPeriod16 > oppBPeriod16, */}
                          {/*    })} */}
                          {/*  > */}
                          {/*    {oppAPeriod16} */}
                          {/*  </div> */}
                          {/* )} */}

                          {/* {hasPeriod17 && ( */}
                          {/*  <div */}
                          {/*    className={cx(classes["results__count"], { */}
                          {/*      [classes["results__count_highlighted"]]: oppAPeriod17 > oppBPeriod17, */}
                          {/*    })} */}
                          {/*  > */}
                          {/*    {oppAPeriod17} */}
                          {/*  </div> */}
                          {/* )} */}

                          {/* {hasPeriod18 && ( */}
                          {/*  <div */}
                          {/*    className={cx(classes["results__count"], { */}
                          {/*      [classes["results__count_highlighted"]]: oppAPeriod18 > oppBPeriod18, */}
                          {/*    })} */}
                          {/*  > */}
                          {/*    {oppAPeriod18} */}
                          {/*  </div> */}
                          {/* )} */}

                          {/* {hasPeriod19 && ( */}
                          {/*  <div */}
                          {/*    className={cx(classes["results__count"], { */}
                          {/*      [classes["results__count_highlighted"]]: oppAPeriod19 > oppBPeriod19, */}
                          {/*    })} */}
                          {/*  > */}
                          {/*    {oppAPeriod19} */}
                          {/*  </div> */}
                          {/* )} */}

                          {/* {hasPeriod20 && ( */}
                          {/*  <div */}
                          {/*    className={cx(classes["results__count"], { */}
                          {/*      [classes["results__count_highlighted"]]: oppAPeriod20 > oppBPeriod20, */}
                          {/*    })} */}
                          {/*  > */}
                          {/*    {oppAPeriod20} */}
                          {/*  </div> */}
                          {/* )} */}

                          {hasPeriodOT && (
                            <div
                              className={cx(classes["results__count"], {
                                [classes["results__count_highlighted"]]: oppAPeriodOT > oppBPeriodOT,
                              })}
                            >
                              {oppAPeriodOT}
                            </div>
                          )}
                          <div className={cx(classes["results__count"], classes["results__count_bold"])}>
                            {match.scores.MATCH.a}
                          </div>
                        </div>
                      </div>
                      <div className={classes["results__row"]}>
                        <div className={classes["results__team"]}>{match.oppB}</div>
                        <div className={classes["results__counts"]}>
                          {hasPeriod1 && (
                            <div
                              className={cx(classes["results__count"], {
                                [classes["results__count_highlighted"]]: oppAPeriod1 < oppBPeriod1,
                              })}
                            >
                              {oppBPeriod1}
                            </div>
                          )}
                          {hasPeriod2 && (
                            <div
                              className={cx(classes["results__count"], {
                                [classes["results__count_highlighted"]]: oppAPeriod2 < oppBPeriod2,
                              })}
                            >
                              {oppBPeriod2}
                            </div>
                          )}

                          {hasPeriod3 && (
                            <div
                              className={cx(classes["results__count"], {
                                [classes["results__count_highlighted"]]: oppAPeriod3 < oppBPeriod3,
                              })}
                            >
                              {oppBPeriod3}
                            </div>
                          )}
                          {hasPeriod4 && (
                            <div
                              className={cx(classes["results__count"], {
                                [classes["results__count_highlighted"]]: oppAPeriod4 < oppBPeriod4,
                              })}
                            >
                              {oppBPeriod4}
                            </div>
                          )}
                          {hasPeriod5 && (
                            <div
                              className={cx(classes["results__count"], {
                                [classes["results__count_highlighted"]]: oppAPeriod5 < oppBPeriod5,
                              })}
                            >
                              {oppBPeriod5}
                            </div>
                          )}
                          {hasPeriod6 && (
                            <div
                              className={cx(classes["results__count"], {
                                [classes["results__count_highlighted"]]: oppAPeriod6 < oppBPeriod6,
                              })}
                            >
                              {oppBPeriod6}
                            </div>
                          )}
                          {hasPeriod7 && (
                            <div
                              className={cx(classes["results__count"], {
                                [classes["results__count_highlighted"]]: oppAPeriod7 < oppBPeriod7,
                              })}
                            >
                              {oppBPeriod7}
                            </div>
                          )}
                          {hasPeriod8 && (
                            <div
                              className={cx(classes["results__count"], {
                                [classes["results__count_highlighted"]]: oppAPeriod8 < oppBPeriod8,
                              })}
                            >
                              {oppBPeriod8}
                            </div>
                          )}
                          {hasPeriod9 && (
                            <div
                              className={cx(classes["results__count"], {
                                [classes["results__count_highlighted"]]: oppAPeriod9 < oppBPeriod9,
                              })}
                            >
                              {oppBPeriod9}
                            </div>
                          )}

                          {/* {hasPeriod10 && ( */}
                          {/*  <div */}
                          {/*    className={cx(classes["results__count"], { */}
                          {/*      [classes["results__count_highlighted"]]: oppAPeriod10 < oppBPeriod10, */}
                          {/*    })} */}
                          {/*  > */}
                          {/*    {oppBPeriod10} */}
                          {/*  </div> */}
                          {/* )} */}

                          {/* {hasPeriod11 && ( */}
                          {/*  <div */}
                          {/*    className={cx(classes["results__count"], { */}
                          {/*      [classes["results__count_highlighted"]]: oppAPeriod11 < oppBPeriod11, */}
                          {/*    })} */}
                          {/*  > */}
                          {/*    {oppBPeriod11} */}
                          {/*  </div> */}
                          {/* )} */}

                          {/* {hasPeriod12 && ( */}
                          {/*  <div */}
                          {/*    className={cx(classes["results__count"], { */}
                          {/*      [classes["results__count_highlighted"]]: oppAPeriod12 < oppBPeriod12, */}
                          {/*    })} */}
                          {/*  > */}
                          {/*    {oppBPeriod12} */}
                          {/*  </div> */}
                          {/* )} */}

                          {/* {hasPeriod13 && ( */}
                          {/*  <div */}
                          {/*    className={cx(classes["results__count"], { */}
                          {/*      [classes["results__count_highlighted"]]: oppAPeriod13 < oppBPeriod13, */}
                          {/*    })} */}
                          {/*  > */}
                          {/*    {oppBPeriod13} */}
                          {/*  </div> */}
                          {/* )} */}

                          {/* {hasPeriod14 && ( */}
                          {/*  <div */}
                          {/*    className={cx(classes["results__count"], { */}
                          {/*      [classes["results__count_highlighted"]]: oppAPeriod14 < oppBPeriod14, */}
                          {/*    })} */}
                          {/*  > */}
                          {/*    {oppBPeriod14} */}
                          {/*  </div> */}
                          {/* )} */}

                          {/* {hasPeriod15 && ( */}
                          {/*  <div */}
                          {/*    className={cx(classes["results__count"], { */}
                          {/*      [classes["results__count_highlighted"]]: oppAPeriod15 < oppBPeriod15, */}
                          {/*    })} */}
                          {/*  > */}
                          {/*    {oppBPeriod15} */}
                          {/*  </div> */}
                          {/* )} */}

                          {/* {hasPeriod16 && ( */}
                          {/*  <div */}
                          {/*    className={cx(classes["results__count"], { */}
                          {/*      [classes["results__count_highlighted"]]: oppAPeriod16 < oppBPeriod16, */}
                          {/*    })} */}
                          {/*  > */}
                          {/*    {oppBPeriod16} */}
                          {/*  </div> */}
                          {/* )} */}

                          {/* {hasPeriod17 && ( */}
                          {/*  <div */}
                          {/*    className={cx(classes["results__count"], { */}
                          {/*      [classes["results__count_highlighted"]]: oppAPeriod17 < oppBPeriod17, */}
                          {/*    })} */}
                          {/*  > */}
                          {/*    {oppBPeriod17} */}
                          {/*  </div> */}
                          {/* )} */}

                          {/* {hasPeriod18 && ( */}
                          {/*  <div */}
                          {/*    className={cx(classes["results__count"], { */}
                          {/*      [classes["results__count_highlighted"]]: oppAPeriod18 < oppBPeriod18, */}
                          {/*    })} */}
                          {/*  > */}
                          {/*    {oppBPeriod18} */}
                          {/*  </div> */}
                          {/* )} */}

                          {/* {hasPeriod19 && ( */}
                          {/*  <div */}
                          {/*    className={cx(classes["results__count"], { */}
                          {/*      [classes["results__count_highlighted"]]: oppAPeriod19 < oppBPeriod19, */}
                          {/*    })} */}
                          {/*  > */}
                          {/*    {oppBPeriod19} */}
                          {/*  </div> */}
                          {/* )} */}

                          {/* {hasPeriod20 && ( */}
                          {/*  <div */}
                          {/*    className={cx(classes["results__count"], { */}
                          {/*      [classes["results__count_highlighted"]]: oppAPeriod20 < oppBPeriod20, */}
                          {/*    })} */}
                          {/*  > */}
                          {/*    {oppBPeriod20} */}
                          {/*  </div> */}
                          {/* )} */}

                          {hasPeriodOT && (
                            <div
                              className={cx(classes["results__count"], {
                                [classes["results__count_highlighted"]]: oppAPeriodOT < oppBPeriodOT,
                              })}
                            >
                              {oppBPeriodOT}
                            </div>
                          )}

                          <div className={cx(classes["results__count"], classes["results__count_bold"])}>
                            {match.scores.MATCH.b}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </main>
  );
};

export default ResultsPage;
