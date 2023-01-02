import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getAuthLanguage } from "../../../../../redux/reselect/auth-selector";
import { getCmsConfigIframeMode, getCmsConfigSportsBook } from "../../../../../redux/reselect/cms-selector";
import { getStandardResultSlice } from "../../../../../redux/slices/resultSlice";
import { formatDateDayMonthShort } from "../../../../../utils/dayjs-format";
import { openLinkInNewWindow } from "../../../../../utils/misc";
import NewsBanner from "../../../components/NewsBanner";

import ResultsLeftColumn from "./ResultsLeftColumn";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const getMatches = (sports, activePath) => {
  if (!activePath) return [];

  const matches = [];
  sports.forEach((sport) => {
    if (sport.sportCode === activePath.sportCode) {
      sport.categories.forEach((category) => {
        if (!activePath.categoryId || activePath.categoryId === category.id) {
          const categoryDescription = category.description;

          category.tournaments.forEach((tournament) => {
            if (!activePath.tournamentId || activePath.tournamentId === tournament.id) {
              const leagueDescription = tournament.description;

              tournament.events.forEach((match) => {
                matches.push({ ...match, leagueDescription: `${categoryDescription} - ${leagueDescription}` });
              });
            }
          });
        }
      });
    }
  });

  return matches.sort((a, b) => a.epoch - b.epoch);
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

const getPeriods = (matches) => {
  const periods = {};

  matches.forEach((match) => {
    const hasPeriod1 = hasScore(Object.keys(match.scores), ["INNING_1", "QUARTER_1", "MAP_1", "SET_1", "HALF_1"]);
    const hasPeriod2 = hasScore(Object.keys(match.scores), ["INNING_2", "QUARTER_2", "MAP_2", "SET_2", "HALF_2"]);
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
    const hasOT = hasScore(Object.keys(match.scores), ["OVERTIME"]);

    periods["1"] = periods["1"] || hasPeriod1;
    periods["2"] = periods["2"] || hasPeriod2;
    periods["3"] = periods["3"] || hasPeriod3;
    periods["4"] = periods["4"] || hasPeriod4;
    periods["5"] = periods["5"] || hasPeriod5;
    periods["6"] = periods["6"] || hasPeriod6;
    periods["7"] = periods["7"] || hasPeriod7;
    periods["8"] = periods["8"] || hasPeriod8;
    periods["9"] = periods["9"] || hasPeriod9;
    periods["10"] = periods["10"] || hasPeriod10;
    periods["11"] = periods["11"] || hasPeriod11;
    periods["12"] = periods["12"] || hasPeriod12;
    periods["13"] = periods["13"] || hasPeriod13;
    periods["14"] = periods["14"] || hasPeriod14;
    periods["15"] = periods["15"] || hasPeriod15;
    periods["16"] = periods["16"] || hasPeriod16;
    periods["17"] = periods["17"] || hasPeriod17;
    periods["18"] = periods["18"] || hasPeriod18;
    periods["19"] = periods["19"] || hasPeriod19;
    periods["20"] = periods["20"] || hasPeriod20;
    periods["OT"] = periods["OT"] || hasOT;
  });

  return periods;
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

const ResultsPage = () => {
  const { t } = useTranslation();
  const language = useSelector(getAuthLanguage);
  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  const [activePath, setActivePath] = useState(null);
  const [dateOffset, setDateOffset] = useState(0);
  const [sportDropdownOpen, setSportDropdownOpen] = useState(false);
  const [leagueDropdownOpen, setLeagueDropdownOpen] = useState(false);

  const results = useSelector((state) => state.result.standardResults);
  const loading = useSelector((state) => state.result.loading);
  const cmsConfigSportsBook = useSelector(getCmsConfigSportsBook)?.data || {};
  const { betradarStatsOn, betradarStatsURL } = cmsConfigSportsBook;

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

    // setCurrentLeagueId(null);
  }, [dispatch, dateOffset]);

  useEffect(() => {
    if (!activePath && results?.sports?.length > 0) {
      setActivePath({
        activePathId: results.sports[0].id,
        sportCode: results.sports[0].sportCode,
        sportId: results.sports[0].id,
      });
    }
  }, [activePath, results]);

  const sportCode = activePath?.sportCode;

  const matches = useMemo(() => (results?.sports ? getMatches(results.sports, activePath) : []), [results, activePath]);

  const sportPeriods = useMemo(() => getPeriods(matches), [matches]);

  return (
    <main className={classes["main"]}>
      <NewsBanner />

      <div className={classes["main__container"]}>
        <div className={classes["main__sports"]}>
          <ResultsLeftColumn activePath={activePath} setActivePath={setActivePath} />

          {sportPeriods && (
            <div className={cx(classes["central-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
              <div className={classes["central-section__content"]}>
                <div className={classes["results"]}>
                  <div className={classes["date-tabs"]} style={{ minHeight: "46px" }}>
                    <div
                      className={cx(classes["date-tabs__item"], { [classes["active"]]: dateOffset === 0 })}
                      onClick={() => setDateOffset(0)}
                    >
                      <span className={classes["date-tabs__text"]}>{t("today")}</span>
                    </div>
                    <div
                      className={cx(classes["date-tabs__item"], { [classes["active"]]: dateOffset === 1 })}
                      onClick={() => setDateOffset(1)}
                    >
                      <span className={classes["date-tabs__text"]}>
                        {formatDateDayMonthShort(dayjs().subtract(1, "day"))}
                      </span>
                    </div>
                    <div
                      className={cx(classes["date-tabs__item"], { [classes["active"]]: dateOffset === 2 })}
                      onClick={() => setDateOffset(2)}
                    >
                      <span className={classes["date-tabs__text"]}>
                        {formatDateDayMonthShort(dayjs().subtract(2, "day"))}
                      </span>
                    </div>
                    <div
                      className={cx(classes["date-tabs__item"], { [classes["active"]]: dateOffset === 3 })}
                      onClick={() => setDateOffset(3)}
                    >
                      <span className={classes["date-tabs__text"]}>
                        {formatDateDayMonthShort(dayjs().subtract(3, "day"))}
                      </span>
                    </div>
                    <div
                      className={cx(classes["date-tabs__item"], { [classes["active"]]: dateOffset === 4 })}
                      onClick={() => setDateOffset(4)}
                    >
                      <span className={classes["date-tabs__text"]}>
                        {formatDateDayMonthShort(dayjs().subtract(4, "day"))}
                      </span>
                    </div>
                    <div
                      className={cx(classes["date-tabs__item"], { [classes["active"]]: dateOffset === 5 })}
                      onClick={() => setDateOffset(5)}
                    >
                      <span className={classes["date-tabs__text"]}>
                        {formatDateDayMonthShort(dayjs().subtract(5, "day"))}
                      </span>
                    </div>
                    <div
                      className={cx(classes["date-tabs__item"], { [classes["active"]]: dateOffset === 6 })}
                      onClick={() => setDateOffset(6)}
                    >
                      <span className={classes["date-tabs__text"]}>
                        {formatDateDayMonthShort(dayjs().subtract(6, "day"))}
                      </span>
                    </div>
                  </div>
                  {loading && (
                    <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
                  )}
                  {!loading && (
                    <div className={classes["results-table"]}>
                      <table>
                        <thead>
                          <tr className={classes["results-table__labels"]}>
                            <td align="center">{t("city.pages.result.kick_off")}</td>
                            <td align="center" colSpan="3">
                              {t("match")}
                            </td>
                            {sportPeriods["1"] && <td align="center">1</td>}
                            {sportPeriods["2"] && <td align="center">2</td>}
                            {sportPeriods["3"] && <td align="center">3</td>}
                            {sportPeriods["4"] && <td align="center">4</td>}
                            {sportPeriods["5"] && <td align="center">5</td>}
                            {sportPeriods["6"] && <td align="center">6</td>}
                            {sportPeriods["7"] && <td align="center">7</td>}
                            {sportPeriods["8"] && <td align="center">8</td>}
                            {sportPeriods["9"] && <td align="center">9</td>}
                            {sportPeriods["10"] && <td align="center">10</td>}
                            {sportPeriods["11"] && <td align="center">11</td>}
                            {sportPeriods["12"] && <td align="center">12</td>}
                            {sportPeriods["13"] && <td align="center">13</td>}
                            {sportPeriods["14"] && <td align="center">14</td>}
                            {sportPeriods["15"] && <td align="center">15</td>}
                            {sportPeriods["16"] && <td align="center">16</td>}
                            {sportPeriods["17"] && <td align="center">17</td>}
                            {sportPeriods["18"] && <td align="center">18</td>}
                            {sportPeriods["19"] && <td align="center">19</td>}
                            {sportPeriods["20"] && <td align="center">20</td>}
                            {sportPeriods["OT"] && <td align="center">{t("period_shortcodes.OT")}</td>}
                            <td align="center">{t("period_shortcodes.FT")}</td>
                            <td />
                          </tr>
                        </thead>
                        <tbody>
                          {matches.map((match, index) => {
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
                            const hasPeriod3 = hasScore(Object.keys(match.scores), [
                              "INNING_3",
                              "QUARTER_3",
                              "MAP_3",
                              "SET_3",
                            ]);
                            const hasPeriod4 = hasScore(Object.keys(match.scores), [
                              "INNING_4",
                              "QUARTER_4",
                              "MAP_4",
                              "SET_4",
                            ]);
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
                              <>
                                <tr
                                  className={cx(classes["results-table__row"], classes["results-table__row_first"], {
                                    [classes["results-table__row_special"]]: index % 2 === 0,
                                  })}
                                >
                                  <td className={classes["results-table__day"]} rowSpan="2">
                                    <div className={classes["results-table__time"]}>
                                      <span>
                                        {dateOffset === 0 ? t("today") : dayjs.unix(match.epoch / 1000).format("dddd")}
                                      </span>
                                      <span>{dayjs.unix(match.epoch / 1000).format("hh:mm A")}</span>
                                    </div>
                                  </td>
                                  <td className={classes["results-table__team"]} colSpan="3">
                                    <div className={classes["results-table__name"]}>
                                      <span>{match.oppA}</span>
                                    </div>
                                  </td>
                                  {sportPeriods["1"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod1 > oppBPeriod1,
                                        })}
                                      >
                                        {hasPeriod1 ? oppAPeriod1 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["2"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod2 > oppBPeriod2,
                                        })}
                                      >
                                        {hasPeriod2 ? oppAPeriod2 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["3"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod3 > oppBPeriod3,
                                        })}
                                      >
                                        {hasPeriod3 ? oppAPeriod3 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["4"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod4 > oppBPeriod4,
                                        })}
                                      >
                                        {hasPeriod4 ? oppAPeriod4 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["5"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod5 > oppBPeriod5,
                                        })}
                                      >
                                        {hasPeriod5 ? oppAPeriod5 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["6"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod6 > oppBPeriod6,
                                        })}
                                      >
                                        {hasPeriod6 ? oppAPeriod6 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["7"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod7 > oppBPeriod7,
                                        })}
                                      >
                                        {hasPeriod7 ? oppAPeriod7 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["8"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod8 > oppBPeriod8,
                                        })}
                                      >
                                        {hasPeriod8 ? oppAPeriod8 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["9"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod9 > oppBPeriod9,
                                        })}
                                      >
                                        {hasPeriod9 ? oppAPeriod9 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["10"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod10 > oppBPeriod10,
                                        })}
                                      >
                                        {hasPeriod10 ? oppAPeriod10 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["11"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod11 > oppBPeriod11,
                                        })}
                                      >
                                        {hasPeriod11 ? oppAPeriod11 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["12"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod12 > oppBPeriod12,
                                        })}
                                      >
                                        {hasPeriod12 ? oppAPeriod12 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["13"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod13 > oppBPeriod13,
                                        })}
                                      >
                                        {hasPeriod13 ? oppAPeriod13 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["14"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod14 > oppBPeriod14,
                                        })}
                                      >
                                        {hasPeriod14 ? oppAPeriod14 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["15"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod15 > oppBPeriod15,
                                        })}
                                      >
                                        {hasPeriod15 ? oppAPeriod15 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["16"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod16 > oppBPeriod16,
                                        })}
                                      >
                                        {hasPeriod16 ? oppAPeriod16 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["17"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod17 > oppBPeriod17,
                                        })}
                                      >
                                        {hasPeriod17 ? oppAPeriod17 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["18"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod18 > oppBPeriod18,
                                        })}
                                      >
                                        {hasPeriod18 ? oppAPeriod18 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["19"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod19 > oppBPeriod19,
                                        })}
                                      >
                                        {hasPeriod19 ? oppAPeriod19 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["20"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod20 > oppBPeriod20,
                                        })}
                                      >
                                        {hasPeriod20 ? oppAPeriod20 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["OT"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriodOT > oppBPeriodOT,
                                        })}
                                      >
                                        {hasPeriodOT ? oppAPeriodOT : ""}
                                      </span>
                                    </td>
                                  )}

                                  <td align="center" className={classes["results-table__score"]}>
                                    <span
                                      className={cx(
                                        {
                                          [classes["results-table__highlighted"]]:
                                            match.scores.MATCH.a > match.scores.MATCH.b,
                                        },
                                        classes["results-table__bold"],
                                      )}
                                    >
                                      {match.scores.MATCH.a}
                                    </span>
                                  </td>
                                  <td align="center" rowSpan="2">
                                    {match.feedCode && betradarStatsOn && betradarStatsURL && (
                                      <div className={classes["results-table__icon"]}>
                                        <div
                                          className={classes["main-icon"]}
                                          onClick={() =>
                                            openLinkInNewWindow(
                                              `${betradarStatsURL}/${language}/match/${match.feedCode.substr(
                                                match.feedCode.lastIndexOf(":") + 1,
                                              )}`,
                                            )
                                          }
                                        >
                                          <i className={classes["qicon-stats"]} />
                                        </div>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                                <tr
                                  className={cx(classes["results-table__row"], {
                                    [classes["results-table__row_special"]]: index % 2 === 0,
                                  })}
                                >
                                  <td className={classes["results-table__team"]} colSpan="3">
                                    <div className={classes["results-table__name"]}>
                                      <span>{match.oppB}</span>
                                    </div>
                                  </td>
                                  {sportPeriods["1"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod1 < oppBPeriod1,
                                        })}
                                      >
                                        {hasPeriod1 ? oppBPeriod1 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["2"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod2 < oppBPeriod2,
                                        })}
                                      >
                                        {hasPeriod2 ? oppBPeriod2 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["3"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod3 < oppBPeriod3,
                                        })}
                                      >
                                        {hasPeriod3 ? oppBPeriod3 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["4"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod4 < oppBPeriod4,
                                        })}
                                      >
                                        {hasPeriod4 ? oppBPeriod4 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["5"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod5 < oppBPeriod5,
                                        })}
                                      >
                                        {hasPeriod5 ? oppBPeriod5 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["6"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod6 < oppBPeriod6,
                                        })}
                                      >
                                        {hasPeriod6 ? oppBPeriod6 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["7"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod7 < oppBPeriod7,
                                        })}
                                      >
                                        {hasPeriod7 ? oppBPeriod7 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["8"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod8 < oppBPeriod8,
                                        })}
                                      >
                                        {hasPeriod8 ? oppBPeriod8 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["9"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod9 < oppBPeriod9,
                                        })}
                                      >
                                        {hasPeriod9 ? oppBPeriod9 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["10"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod10 < oppBPeriod10,
                                        })}
                                      >
                                        {hasPeriod10 ? oppBPeriod10 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["11"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod11 < oppBPeriod11,
                                        })}
                                      >
                                        {hasPeriod11 ? oppBPeriod11 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["12"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod12 < oppBPeriod12,
                                        })}
                                      >
                                        {hasPeriod12 ? oppBPeriod12 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["13"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod13 < oppBPeriod13,
                                        })}
                                      >
                                        {hasPeriod13 ? oppBPeriod13 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["14"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod14 < oppBPeriod14,
                                        })}
                                      >
                                        {hasPeriod14 ? oppBPeriod14 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["15"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod15 < oppBPeriod15,
                                        })}
                                      >
                                        {hasPeriod15 ? oppBPeriod15 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["16"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod16 < oppBPeriod16,
                                        })}
                                      >
                                        {hasPeriod16 ? oppBPeriod16 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["17"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod17 < oppBPeriod17,
                                        })}
                                      >
                                        {hasPeriod17 ? oppBPeriod17 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["18"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod18 < oppBPeriod18,
                                        })}
                                      >
                                        {hasPeriod18 ? oppBPeriod18 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["19"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod19 < oppBPeriod19,
                                        })}
                                      >
                                        {hasPeriod19 ? oppBPeriod19 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["20"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriod20 < oppBPeriod20,
                                        })}
                                      >
                                        {hasPeriod20 ? oppBPeriod20 : ""}
                                      </span>
                                    </td>
                                  )}
                                  {sportPeriods["OT"] && (
                                    <td align="center" className={classes["results-table__score"]}>
                                      <span
                                        className={cx({
                                          [classes["results-table__highlighted"]]: oppAPeriodOT < oppBPeriodOT,
                                        })}
                                      >
                                        {hasPeriodOT ? oppBPeriodOT : ""}
                                      </span>
                                    </td>
                                  )}
                                  <td align="center" className={classes["results-table__score"]}>
                                    <span
                                      className={cx(
                                        {
                                          [classes["results-table__highlighted"]]:
                                            match.scores.MATCH.a < match.scores.MATCH.b,
                                        },
                                        classes["results-table__bold"],
                                      )}
                                    >
                                      {match.scores.MATCH.b}
                                    </span>
                                  </td>
                                </tr>
                              </>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ResultsPage;
