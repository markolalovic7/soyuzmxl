import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import dayjs from "dayjs";
import isEmpty from "lodash.isempty";
import * as PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";

import { useGetMatchStatuses } from "../../../../../hooks/matchstatus-hooks";
import {
  getLiveEuropeanDashboardData,
  makeGetLiveEuropeanDashboardData,
} from "../../../../../redux/reselect/live-selector";
import { getSportsSelector } from "../../../../../redux/reselect/sport-selector";
import { isNotEmpty } from "../../../../../utils/lodash";
import OutcomePrice from "../../../components/OutcomePrice/OutcomePrice";
import SportIcon from "../../../components/SportIcon/SportIcon";
import { useActiveBreakPointEllipsisLengths } from "../../../hooks/breakpoint-hooks";
import { LIVE_LEAGUE_PERIOD_DESC, TEAM_DESC } from "../../../utils/breakpoint-constants";

import NoMatchesAvailable from "./NoMatchesAvailable";

import classes from "applications/ezbet/scss/ezbet.module.scss";

const isBetween = require("dayjs/plugin/isBetween");

dayjs.extend(isBetween);

const sortEventPaths = (a, b) => `${a.desc}`.localeCompare(b.desc);

const sortEvents = (a, b) => `${a.startSecs}`.localeCompare(b.startSecs);

function convertLiveDir(dir) {
  if (dir === "=") {
    return undefined;
  }

  if (dir === "<") {
    return "d";
  }

  if (dir === ">") {
    return "u";
  }

  return undefined;
}

const LiveLeagueHeader = ({ enabled, eventCount, onClick, pathDescription, sportCode }) => {
  // const liveLeagueHeaderLength = useActiveBreakPointEllipsisLengths(LIVE_LEAGUE_HEADER);

  // eslint-disable-next-line new-cap
  const [dateState, setDateState] = useState(new dayjs());
  useEffect(() => {
    // eslint-disable-next-line new-cap
    setInterval(() => setDateState(new dayjs()), 1000);
  }, []);

  return (
    <section className={cx(classes["filter-wrapper"], classes["live"])}>
      <div className={classes["left"]}>
        <i className={classes["icon-left-arrow"]} onClick={onClick} />
        <div className={cx(classes["sport-iconx-active"])}>
          <SportIcon code={sportCode} />
        </div>
        <div className={cx(classes["flex-al-center"], classes["w-100"], classes["ov-hidden"])}>
          <p>{pathDescription}</p>
          <span className={classes["league-name-count"]}>{`( ${eventCount} )`}</span>
        </div>
      </div>
      <div className={cx(classes["right"], classes["filter"])} style={{ minWidth: "150px" }}>
        <p style={{ fontWeight: "500", minWidth: "40px", textAlign: "right" }}>
          {dateState.format("MM-DD")}
        </p>
        <p style={{ fontWeight: "500", marginLeft: "7px", marginRight: "16px" }}>
          {dateState.format("HH:mm")}
        </p>
        {enabled ? (
          <span className={classes["icon-live-icon"]} style={{ marginTop: "-1px" }}>
            <span className={classes["path1"]} />
            <span className={classes["path2"]} />
            <span className={classes["path3"]} />
            <span className={classes["path4"]} />
            <span className={classes["path5"]} />
            <span className={classes["path6"]} />
            <span className={classes["path7"]} />
          </span>
        ) : (
          <span className={classes["icon-live-icon-disabled"]} style={{ marginTop: "-1px" }}>
            <span className={classes["path1"]} />
            <span className={classes["path2"]} />
            <span className={classes["path3"]} />
            <span className={classes["path4"]} />
            <span className={classes["path5"]} />
            <span className={classes["path6"]} />
            <span className={classes["path7"]} />
          </span>
        )}
      </div>
    </section>
  );
};

LiveLeagueHeader.propTypes = {
  enabled: PropTypes.bool.isRequired,
  eventCount: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  pathDescription: PropTypes.string.isRequired,
  sportCode: PropTypes.string.isRequired,
};

const PLACEHOLDER_TWO_OUTCOMES = [
  { desc: "1", dir: undefined, formattedPrice: "-.-", hidden: true, id: -1, price: -1, priceId: -1 },
  { desc: "2", dir: undefined, formattedPrice: "-.-", hidden: true, id: -2, price: -1, priceId: -2 },
];
const PLACEHOLDER_THREE_OUTCOMES = [
  { desc: "1", dir: undefined, formattedPrice: "-.-", hidden: true, id: -1, price: -1, priceId: -1 },
  { desc: "3", dir: undefined, formattedPrice: "-.-", hidden: true, id: -3, price: -1, priceId: -3 },
  { desc: "2", dir: undefined, formattedPrice: "-.-", hidden: true, id: -2, price: -1, priceId: -2 },
];
const THREE_OUTCOME_SPORTS = ["FOOT", "FUTS", "HAND", "ICEH", "RUGB"];

function placeholderOutcomes(sportCode) {
  return {
    id: undefined,
    open: false,
    selections: THREE_OUTCOME_SPORTS.includes(sportCode) ? PLACEHOLDER_THREE_OUTCOMES : PLACEHOLDER_TWO_OUTCOMES,
  };
}

const LiveLeaguePage = () => {
  const { eventPathId: eventPathIdStr, sportCode } = useParams();

  const eventPathId = eventPathIdStr && !Number.isNaN(eventPathIdStr) ? Number(eventPathIdStr) : null;

  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const periodDescMaxLength = useActiveBreakPointEllipsisLengths(LIVE_LEAGUE_PERIOD_DESC);
  const teamDescMaxLength = useActiveBreakPointEllipsisLengths(TEAM_DESC);

  const sports = useSelector(getSportsSelector);
  const matchStatuses = useGetMatchStatuses(dispatch);

  const getLiveFilteredEuropeanDashboardData = useMemo(() => makeGetLiveEuropeanDashboardData(), []);
  const liveEuropeanData = useSelector(
    (state) =>
      getLiveFilteredEuropeanDashboardData(state, {
        eventPathIds: eventPathId ? [eventPathId] : [],
        sportCode,
      }) || {},
  );

  const hasEuropeanData = useSelector((state) => !!getLiveEuropeanDashboardData(state));

  const activeSportsTreeData = useMemo(() => {
    const sportHash = {};

    if (isNotEmpty(sports)) {
      Object.entries(liveEuropeanData)
        .filter((x) => isNotEmpty(x[1]))
        .forEach((sport) => {
          const sportCode = sport[0];
          const matches = Object.values(sport[1]);

          if (!sportHash[sportCode]) {
            sportHash[sportCode] = { categories: {}, code: sportCode, desc: sports[sportCode].description };
          }

          const sportObj = sportHash[sportCode];

          matches.forEach((match) => {
            if (!sportObj.categories[match.countryId]) {
              sportObj.categories[match.countryId] = {
                count: 0,
                countryCode: match.country,
                desc: match.countryDesc,
                id: match.countryId,
                tournaments: {},
              };
            }
            const category = sportObj.categories[match.countryId];

            if (!category.tournaments[match.leagueId]) {
              category.tournaments[match.leagueId] = {
                count: 0,
                desc: match.leagueDesc,
                events: [],
                id: match.leagueId,
              };
            }

            const tournament = category.tournaments[match.leagueId];

            sportObj.categories[match.countryId] = {
              ...category,
              count: category.count + 1,
            };

            category.tournaments[match.leagueId] = {
              ...tournament,
              count: tournament.count + 1,
              events: [
                ...tournament.events,
                {
                  aDesc: match.opBDesc,
                  aScore: match.aScore,
                  cStatus: match.cStatus,
                  count: match.mCount,
                  hDesc: match.opADesc,
                  hScore: match.hScore,
                  hasVideo: match.hasAV,
                  id: match.eventId,
                  market: isNotEmpty(match.markets)
                    ? Object.values(match.markets).map((m) => ({
                      id: m.mId,
                      open: m.mOpen,
                      selections: m.sels.map((s) => ({
                        desc: s.oDesc,
                        dir: convertLiveDir(s.dir),
                        formattedPrice: s.formattedPrice,
                        hidden: s.hidden,
                        id: s.oId,
                        price: s.price,
                        priceId: s.pId,
                      })),
                    }))[0]
                    : placeholderOutcomes(sportCode),
                  period: matchStatuses
                    ? matchStatuses.find((period) => period.abbreviation === match.cPeriod)?.description
                    : "",
                },
              ],
            };
          });
        });
    }

    return Object.values(sportHash).map((x) => ({
      categories: Object.values(x.categories).map((y) => ({
        count: y.count,
        countryCode: y.countryCode,
        desc: y.desc,
        id: y.id,
        tournaments: Object.values(y.tournaments),
      })),
      code: x.code,
      desc: x.desc,
    }));
  }, [liveEuropeanData, matchStatuses, sports]);

  if (!hasEuropeanData) {
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

  if (isEmpty(liveEuropeanData)) {
    return (
      <>
        <LiveLeagueHeader
          enabled
          eventCount={0}
          pathDescription={isNotEmpty(sports) ? sports[sportCode]?.description ?? "" : ""}
          sportCode={sportCode}
          onClick={() => history.push(`/live/sport/${sportCode}`)}
        />
        <div className={classes["matches"]}>
          <NoMatchesAvailable onClick={() => history.push(`/live/sport/${sportCode}`)} />
        </div>
      </>
    );
  }

  return activeSportsTreeData.map((sport) => {
    if (isNotEmpty(sport.categories)) {
      const categories = sport.categories.slice().sort(sortEventPaths);

      return categories.map((category) => {
        // const categoryDescription = category.desc;
        if (isNotEmpty(category.tournaments)) {
          const tournaments = category.tournaments.slice().sort(sortEventPaths);

          return tournaments.map((tournament) => {
            // const pathDescription = `${categoryDescription} : ${tournament.desc}`;
            // const pathDescription =
            //   tournament.desc.length > 12 ? `${tournament.desc.slice(0, 12)}···` : tournament.desc;
            const events = tournament.events.slice().sort(sortEvents);

            return (
              <React.Fragment key={sport.code}>
                <LiveLeagueHeader
                  enabled
                  eventCount={events.length}
                  pathDescription={tournament.desc}
                  sportCode={sport.code}
                  onClick={() => history.push(`/live/sport/${sportCode}?expandedEventPathId=${category.id}`)}
                />
                {events.length > 0 ? (
                  <section className={classes["matches"]}>
                    {events?.map((match) => (
                      <div className={classes["match-wrapper"]} key={match.id}>
                        <div className={cx(classes["match"], classes["live"])}>
                          <p>{match.hDesc}</p>
                          <p>{match.aDesc}</p>
                          <div className={cx(classes["date-time-market-type"], classes["relative"])}>
                            <div className={classes["left-live-info"]}>
                              <span className={classes["date"]} style={{ marginRight: "5px" }} title={match.period}>
                                {match.period}
                              </span>
                              {match.cStatus === "STARTED" && <i className={classes["icon-history-regular"]} />}
                            </div>
                            <div className={classes["right-side-live"]}>
                              {match.hasVideo && <i className={classes["icon-tv-retro-light"]} />}
                              <span
                                className={classes["market-type"]}
                                style={{ marginLeft: "8px", marginRight: "2px" }}
                                onClick={() =>
                                  history.push(`/live/sport/${sportCode}/eventpath/${eventPathId}/event/${match.id}`)
                                }
                              >
                                {`+${match.count > 0 ? Math.max(match.count - 1, 0) : ""}`}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className={classes["forecasts"]} id="forecasts">
                          <div className={classes["match-scores"]}>
                            <p>{match.hScore}</p>
                            <p>{match.aScore}</p>
                          </div>
                          <div className={cx(classes["relative"], classes["flex"])}>
                            {(!match.market || !match.market?.open) && (
                              <div className={classes["forecast-suspended"]}>
                                <span className={classes["icon-lock"]} />
                              </div>
                            )}
                            {match.market &&
                              match.market.selections.map((outcome, index) => (
                                <OutcomePrice
                                  desc={outcome.desc}
                                  dir={outcome.dir}
                                  eventId={match.id}
                                  hidden={!!match.market?.open && outcome.hidden}
                                  isDraw={false}
                                  key={outcome.id}
                                  outcomeId={outcome.id}
                                  price={outcome.formattedPrice}
                                />
                              ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </section>
                ) : (
                  <section className={classes["matches"]}>No matches available...</section>
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

export default LiveLeaguePage;
