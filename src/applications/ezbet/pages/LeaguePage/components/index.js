import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import dayjs from "dayjs";
import isEmpty from "lodash.isempty";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";

import { getEvents } from "../../../../../utils/prematch-data-utils";
import { recursivePathSearch } from "../../../../../utils/sdc-search-utils";
import OutcomePrice from "../../../components/OutcomePrice/OutcomePrice";
import SportIcon from "../../../components/SportIcon/SportIcon";
import { useActiveSportsTreeData } from "../../../hooks/active-sports-tree-data-hooks";
import { useActiveBreakPointEllipsisLengths } from "../../../hooks/breakpoint-hooks";
import { TEAM_DESC } from "../../../utils/breakpoint-constants";

import NoMatchesAvailable from "./NoMatchesAvailable";

import classes from "applications/ezbet/scss/ezbet.module.scss";

const isBetween = require("dayjs/plugin/isBetween");

dayjs.extend(isBetween);

const sortEventPaths = (a, b) => `${a.desc}`.localeCompare(b.desc);

const sortEvents = (a, b) => `${a.startSecs}`.localeCompare(b.startSecs);

const TODAY_KEY = "TODAY";
const TOMORROW_KEY = "TOMORROW";
const AFTER_TOMORROW_KEY = "AFTER_TOMORROW";

const today = dayjs().set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0);
const tomorrow = dayjs().add(1, "day").set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0);
const twoDaysFromNow = dayjs().add(2, "day").set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0);
const threeDaysFromNow = dayjs().add(3, "day").set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0);

const range1 = { from: today, key: TODAY_KEY, ordinal: 1, to: tomorrow };
const range2 = { from: tomorrow, key: TOMORROW_KEY, ordinal: 2, to: twoDaysFromNow };
const range3 = {
  from: twoDaysFromNow,
  key: AFTER_TOMORROW_KEY,
  ordinal: 3,
  to: threeDaysFromNow,
};

const allDateRanges = [range1, range2, range3];

const getMatchCount = (availableDateRanges, dateRangeKey) => {
  const dateRange = availableDateRanges.find((x) => x.key === dateRangeKey);

  if (!dateRange) return 0;

  return dateRange.count;
};

const LeaguePage = () => {
  const { eventPathId: eventPathIdStr, sportCode } = useParams();

  const eventPathId = eventPathIdStr && !Number.isNaN(eventPathIdStr) ? Number(eventPathIdStr) : null;
  const teamDescMaxLength = useActiveBreakPointEllipsisLengths(TEAM_DESC);

  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const [availableDateRanges, setAvailableDateRanges] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState(range1);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  const { activeSportsTreeData } = useActiveSportsTreeData(sportCode);

  // Subscribe to prematch data...
  const prematchCouponData = useSelector((state) => state.coupon.couponData[`p${eventPathId}`]);
  const prematchLoading = useSelector((state) => state.coupon.couponLoading[`p${eventPathId}`]);

  // TODO useEffect to compute available dates, and if different from the ones we have available, reset

  useEffect(() => {
    // dynamic logic to determine which dates are available - left in case we need to revert it all
    if (isEmpty(prematchCouponData)) {
      return;
    }
    const tempAvailableDates = [];

    const today = dayjs().set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0);
    const tomorrow = dayjs().add(1, "day").set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0);
    const twoDaysFromNow = dayjs().add(2, "day").set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0);
    const threeDaysFromNow = dayjs()
      .add(3, "day")
      .set("hour", 0)
      .set("minute", 0)
      .set("second", 0)
      .set("millisecond", 0);

    Object.values(prematchCouponData).forEach((sport) => {
      if (sport.children) {
        const categories = Object.values(sport.children).slice();

        categories.forEach((category) => {
          if (category.children) {
            const tournaments = Object.values(category.children).slice();

            tournaments.forEach((tournament) => {
              const events = getEvents(Object.values(tournament.children));

              events.forEach((match) => {
                if (dayjs.unix(match.epoch / 1000).isBetween(today, tomorrow, null, "[)")) {
                  const tempToday = tempAvailableDates.find((x) => x.key === TODAY_KEY);
                  if (!tempToday) {
                    // init
                    tempAvailableDates.push({ count: 1, from: today, key: TODAY_KEY, ordinal: 1, to: tomorrow });
                  } else {
                    tempToday.count += 1;
                  }
                } else if (dayjs.unix(match.epoch / 1000).isBetween(tomorrow, twoDaysFromNow, null, "[)")) {
                  const tempTomorrow = tempAvailableDates.find((x) => x.key === TOMORROW_KEY);
                  if (!tempTomorrow) {
                    tempAvailableDates.push({
                      count: 1,
                      from: tomorrow,
                      key: TOMORROW_KEY,
                      ordinal: 2,
                      to: twoDaysFromNow,
                    });
                  } else {
                    tempTomorrow.count += 1;
                  }
                } else if (dayjs.unix(match.epoch / 1000).isBetween(twoDaysFromNow, threeDaysFromNow, null, "[)")) {
                  const tempAfterTomorrow = tempAvailableDates.find((x) => x.key === AFTER_TOMORROW_KEY);
                  if (!tempAfterTomorrow) {
                    tempAvailableDates.push({
                      count: 1,
                      from: twoDaysFromNow,
                      key: AFTER_TOMORROW_KEY,
                      ordinal: 3,
                      to: threeDaysFromNow,
                    });
                  } else {
                    tempAfterTomorrow.count += 1;
                  }
                }
              });
            });
          }
        });
      }
    });

    tempAvailableDates.sort((a, b) => a.ordinal - b.ordinal);

    // if (isEmpty(selectedDateRange)) {
    //   if (tempAvailableDates.length > 0) {
    //     setSelectedDateRange(tempAvailableDates[0]);
    //   } else {
    //     setSelectedDateRange(allDateRanges[0]);
    //   }
    // }
    if (tempAvailableDates.length !== availableDateRanges.length) {
      setAvailableDateRanges(tempAvailableDates);
    }
  }, [prematchCouponData, eventPathId]);

  //

  // useEffect(() => { // dynamic logic to determine which dates are available - left in case we need to revert it all
  //   if (isEmpty(prematchCouponData)) {
  //     return;
  //   }
  //   const tempAvailableDates = [];
  //
  //   const today = dayjs().set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0);
  //   const tomorrow = dayjs().add(1, "day").set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0);
  //   const twoDaysFromNow = dayjs().add(2, "day").set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0);
  //   const threeDaysFromNow = dayjs()
  //     .add(3, "day")
  //     .set("hour", 0)
  //     .set("minute", 0)
  //     .set("second", 0)
  //     .set("millisecond", 0);
  //
  //   Object.values(prematchCouponData).forEach((sport) => {
  //     if (sport.children) {
  //       const categories = Object.values(sport.children).slice();
  //
  //       categories.forEach((category) => {
  //         if (category.children) {
  //           const tournaments = Object.values(category.children).slice();
  //
  //           tournaments.forEach((tournament) => {
  //             const events = getEvents(Object.values(tournament.children));
  //
  //             events.forEach((match) => {
  //               if (dayjs.unix(match.epoch / 1000).isBetween(today, tomorrow, null, "[)")) {
  //                 if (!tempAvailableDates.find((x) => x.key === TODAY_KEY)) {
  //                   tempAvailableDates.push({ from: today, key: TODAY_KEY, ordinal: 1, to: tomorrow });
  //                 }
  //               } else if (dayjs.unix(match.epoch / 1000).isBetween(tomorrow, twoDaysFromNow, null, "[)")) {
  //                 if (!tempAvailableDates.find((x) => x.key === TOMORROW_KEY)) {
  //                   tempAvailableDates.push({ from: tomorrow, key: TOMORROW_KEY, ordinal: 2, to: twoDaysFromNow });
  //                 }
  //               } else if (dayjs.unix(match.epoch / 1000).isBetween(twoDaysFromNow, threeDaysFromNow, null, "[)")) {
  //                 if (!tempAvailableDates.find((x) => x.key === AFTER_TOMORROW_KEY)) {
  //                   tempAvailableDates.push({
  //                     from: twoDaysFromNow,
  //                     key: AFTER_TOMORROW_KEY,
  //                     ordinal: 3,
  //                     to: threeDaysFromNow,
  //                   });
  //                 }
  //               }
  //             });
  //           });
  //         }
  //       });
  //     }
  //   });
  //
  //   tempAvailableDates.sort((a, b) => a.ordinal - b.ordinal);
  //
  //   if (isEmpty(selectedDateRange) && tempAvailableDates.length > 0) {
  //     setSelectedDateRange(tempAvailableDates[0]);
  //   }
  //   if (tempAvailableDates.length !== availableDateRanges.length) {
  //     setAvailableDateRanges(tempAvailableDates);
  //   }
  // }, [prematchCouponData, eventPathId]);
  //
  //

  //

  const handleDateChange = (value) => {
    allDateRanges.forEach((range) => {
      if (dayjs(value).isBetween(range.from, range.to, null, "[)")) {
        setSelectedDateRange(range);
      }
    });
  };

  function getDateName(t, selectedDateRange) {
    if (selectedDateRange.key === TODAY_KEY) {
      return <span>{t("city.live_schedule.today")}</span>;
    }
    if (selectedDateRange.key === TOMORROW_KEY) {
      return <span>{t("city.live_schedule.tomorrow")}</span>;
    }
    if (selectedDateRange.key === AFTER_TOMORROW_KEY) {
      return <span>{t("city.live_schedule.after_tomorrow")}</span>;
    }

    return (
      <>
        <span>{selectedDateRange.from.format("MM")}</span>-<span>{selectedDateRange.from.format("DD")}</span>
      </>
    );
  }

  if (isEmpty(prematchCouponData) || isEmpty(selectedDateRange)) {
    return (
      <div>
        <FontAwesomeIcon
          className="fa-spin"
          icon={faSpinner}
          size="3x"
          style={{
            "--fa-primary-color": "#00ACEE",
            "--fa-secondary-color": "#E6E6E6",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      </div>
    );
  }

  // const NoMatchesAvailable = () =>
  //   // const { t } = useTranslation();
  //   selectedDateRange.key === "TODAY" ? (
  //     <div className={classes["no-matches-available"]}>
  //       <h3>
  //         {t("ez.current_time")}
  //         <span>{dayjs(new Date()).format("MM-DD HH:mm")}</span>
  //       </h3>
  //       <p>{t("ez.no_matches_for_today")}</p>
  //       <button className={classes["primary"]} type="button" onClick={() => setSelectedDateRange(range2)}>
  //         {today.format("MM-DD")}
  //         <br />
  //         {t("ez.upcoming_games")}
  //       </button>
  //     </div>
  //   ) : selectedDateRange.key === "TOMORROW" ? (
  //     <div className={classes["no-matches-available"]}>
  //       <h3>
  //         {t("ez.current_time")}
  //         <span>{dayjs(new Date()).format("MM-DD HH:mm")}</span>
  //       </h3>
  //       <p>
  //         {tomorrow.format("MM-DD")}{' '}
  //         {t("ez.canceled_or_closed")}
  //         <br />
  //         {twoDaysFromNow.format("MM-DD")} {t("ez.when_you_go_to_the_link_below")}
  //         {t("ez.you_can_use_it_right_away")}
  //       </p>
  //       <button className={classes["primary"]} type="button" onClick={() => setSelectedDateRange(range3)}>
  //         {tomorrow.format("MM-DD")}
  //         <br />
  //         {t("ez.upcoming_games")}
  //       </button>
  //     </div>
  //   ) : selectedDateRange.key === "AFTER_TOMORROW" ? (
  //     <div className={classes["no-matches-available"]}>
  //       <h3>
  //         <span>{dayjs(new Date()).format("MM-DD HH:mm")}</span>
  //         {twoDaysFromNow.format("MM-DD hh:mm")}
  //       </h3>
  //       <p>
  //         {twoDaysFromNow.format("MM-DD")}{" "}
  //         {t("ez.canceled_or_closed")} {t("ez.three_match_schedule")}
  //       </p>
  //       <button className={classes["primary"]} type="button">
  //         {t("ez.upcoming_games")}
  //       </button>
  //     </div>
  //   ) : null;

  return Object.values(prematchCouponData).map((sport) => {
    if (sport.children) {
      const categories = Object.values(sport.children).slice().sort(sortEventPaths);

      return categories.map((category) => {
        // const categoryDescription = category.desc;
        if (category.children) {
          const tournaments = Object.values(category.children).slice().sort(sortEventPaths);

          return tournaments.map((tournament) => {
            // const pathDescription = `${categoryDescription} : ${tournament.desc}`;
            // const pathDescription =
            //   tournament.desc.length > 12 ? `${tournament.desc.slice(0, 12)}···` : tournament.desc;
            const events = getEvents(Object.values(tournament.children))
              .filter(
                (match) =>
                  dayjs.unix(match.epoch / 1000).isBetween(selectedDateRange.from, selectedDateRange.to, null, "[)") &&
                  Object.values(match.children).filter((market) => market.open).length > 0,
              )
              .slice()
              .sort(sortEvents);

            return (
              <React.Fragment key={sport.code}>
                <section className={classes["filter-wrapper"]}>
                  <div className={classes["left"]}>
                    <i
                      className={classes["icon-left-arrow"]}
                      onClick={() => history.push(`/prematch/sport/${sportCode}?expandedEventPathId=${category.id}`)}
                    />
                    <div className={cx(classes["sport-iconx-active"])}>
                      <SportIcon code={sport.code} />
                    </div>
                    <div className={cx(classes["flex-al-center"], classes["w-100"], classes["ov-hidden"])}>
                      <p>{tournament.desc}</p>
                      <span className={classes["league-name-count"]}>{`( ${events.length} )`}</span>
                    </div>
                  </div>
                  <div className={cx(classes["right"], classes["filter"])}>
                    <div
                      className={cx(classes["custom-date-filter"], classes["relative"])}
                      onClick={() => setIsDateDropdownOpen((prevState) => !prevState)}
                    >
                      <span className={classes["date-value"]} id="date-value">
                        {getDateName(t, selectedDateRange)}
                      </span>
                      <i className={cx(classes["absolute"], classes["icon-filter"])} />
                      <ul
                        className={cx(classes["absolute"], classes["date-options"], {
                          [classes["active-picker"]]: isDateDropdownOpen,
                        })}
                      >
                        {allDateRanges.map((dateRange, index) => {
                          let text = dayjs(dateRange.from).format("MM-DD-YYYY");
                          let matchCount = 0;

                          if (dateRange.key === TODAY_KEY) {
                            text = t("city.live_schedule.today");
                            matchCount = getMatchCount(availableDateRanges, TODAY_KEY);
                          } else if (dateRange.key === TOMORROW_KEY) {
                            text = t("city.live_schedule.tomorrow");
                            matchCount = getMatchCount(availableDateRanges, TOMORROW_KEY);
                          } else if (dateRange.key === AFTER_TOMORROW_KEY) {
                            text = t("city.live_schedule.after_tomorrow");
                            matchCount = getMatchCount(availableDateRanges, AFTER_TOMORROW_KEY);
                          }

                          return (
                            <li key={index} onClick={() => handleDateChange(dayjs(dateRange.from).toDate())}>
                              <p
                                className={cx(classes["flex-al-center"], {
                                  [classes["active"]]: dateRange.key === selectedDateRange.key,
                                })}
                              >
                                <span>
                                  <em style={{ fontStyle: "normal", marginRight: "7px" }}>{text}</em>
                                  {`${dayjs(dateRange.from).format("MM-DD-YYYY")}`}
                                </span>
                                <span style={{ marginLeft: "auto", marginRight: "0" }}>({matchCount})</span>
                              </p>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </section>
                {events.length > 0 ? (
                  <section className={classes["matches"]}>
                    {events?.map(
                      (match) =>
                        match.children &&
                        Object.values(match.children).map((market, index) => (
                          <div className={classes["match-wrapper"]} key={index}>
                            <div className={classes["match"]}>
                              <p>{match.a}</p>
                              <p>{match.b}</p>
                              <div className={cx(classes["date-time-market-type"], classes["relative"])}>
                                <div className={classes["left-live-info"]}>
                                  <span className={classes["date"]}>
                                    {dayjs.unix(match.epoch / 1000).format("MM-DD")}
                                  </span>
                                  <span className={classes["time"]} style={{ marginRight: "0px" }}>
                                    {dayjs.unix(match.epoch / 1000).format("HH:mm")}
                                  </span>
                                </div>
                                <div className={classes["right-side-regular"]}>
                                  <span
                                    className={classes["market-type"]}
                                    onClick={() =>
                                      history.push(
                                        `/prematch/sport/${sportCode}/eventpath/${eventPathId}/event/${match.id}`,
                                      )
                                    }
                                  >
                                    {`+${Math.max(match.count - 1, 0)}`}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className={classes["forecasts"]} id="forecasts">
                              {market.children &&
                                Object.values(market.children).map((outcome, index) => (
                                  <OutcomePrice
                                    desc={outcome.desc}
                                    dir={outcome.dir}
                                    eventId={match.id}
                                    hidden={outcome.hidden}
                                    isDraw={false}
                                    key={outcome.id}
                                    outcomeId={outcome.id}
                                    price={outcome.price}
                                  />
                                ))}
                            </div>
                          </div>
                        )),
                    )}
                  </section>
                ) : (
                  <section className={classes["matches"]}>
                    <NoMatchesAvailable
                      leagueCount={
                        activeSportsTreeData
                          ? Object.values(recursivePathSearch(activeSportsTreeData, category.id)?.path ?? {}).length
                          : 0
                      }
                      selectedDateRange={selectedDateRange}
                      setSelectedDateRange={setSelectedDateRange}
                      onGoBack={() => history.push(`/prematch/sport/${sportCode}?expandedEventPathId=${category.id}`)}
                    />
                  </section>
                )}
              </React.Fragment>
            );
          });
        }

        return null;
      });
    }

    return null;
  });
};

export default LeaguePage;
