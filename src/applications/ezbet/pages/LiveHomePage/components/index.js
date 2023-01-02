import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router";

import {
  getLiveEuropeanDashboardData,
  makeGetLiveEuropeanDashboardData,
} from "../../../../../redux/reselect/live-selector";
import { getSportsSelector } from "../../../../../redux/reselect/sport-selector";
import { isNotEmpty } from "../../../../../utils/lodash";
import { getHrefLiveSportLeague } from "../../../../../utils/route-href";
import SportIcon from "../../../components/SportIcon/SportIcon";
import { useActiveBreakPointEllipsisLengths } from "../../../hooks/breakpoint-hooks";
import { LIVE_LEAGUE_HEADER } from "../../../utils/breakpoint-constants";

import NoLeaguesAvailable from "./NoLeaguesAvailable";

import classes from "applications/ezbet/scss/ezbet.module.scss";
import { ALL_KEY } from "applications/ezbet/utils/constants";

const propTypes = {};

const defaultProps = {};

const LiveHomePage = () => {
  const { sportCode } = useParams();
  const { search } = useLocation();

  const liveLeagueHeaderLength = useActiveBreakPointEllipsisLengths(LIVE_LEAGUE_HEADER);

  const query = new URLSearchParams(search);
  const expandedEventPathId = query.get("expandedEventPathId") ? Number(query.get("expandedEventPathId")) : undefined;

  const dispatch = useDispatch();
  const history = useHistory();

  // eslint-disable-next-line new-cap
  const [dateState, setDateState] = useState(new dayjs());
  useEffect(() => {
    // eslint-disable-next-line new-cap
    setInterval(() => setDateState(new dayjs()), 1000);
  }, []);

  const sports = useSelector(getSportsSelector);

  const getEuropeanDashboardLiveDataBySportCode = useMemo(() => makeGetLiveEuropeanDashboardData(), []);
  const liveEuropeanData = useSelector(
    (state) =>
      getEuropeanDashboardLiveDataBySportCode(state, {
        sportCode,
      }) || {},
  );

  const hasEuropeanData = useSelector((state) => !!getLiveEuropeanDashboardData(state));

  // const [sportTreeItemBeingToggled, setSportTreeItemBeingToggled] = useState(
  //   expandedEventPathId ? { [`category-${expandedEventPathId}`]: true } : {},
  // );
  const [collapsedSports, setCollapsedSports] = useState([]); // we will use this only in the "featured" tab

  // const onToggleSportsTreeItem = useCallback((id) => {
  //   setSportTreeItemBeingToggled((prevActiveIndexes) => ({
  //     ...prevActiveIndexes,
  //     [id]: !prevActiveIndexes[id],
  //   }));
  // }, []);

  const onCollapseSportHandler = (sportsKey) => {
    if (collapsedSports.includes(sportsKey)) {
      setCollapsedSports(collapsedSports.filter((x) => x !== sportsKey));
    } else {
      setCollapsedSports([...collapsedSports, sportsKey]);
    }
  };

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
              category.tournaments[match.leagueId] = { count: 0, desc: match.leagueDesc, id: match.leagueId };
            }

            const tournament = category.tournaments[match.leagueId];

            sportObj.categories[match.countryId] = {
              ...category,
              count: category.count + 1,
            };

            category.tournaments[match.leagueId] = {
              ...tournament,
              count: tournament.count + 1,
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
  }, [liveEuropeanData, sports]);

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

  if (sportCode && isEmpty(activeSportsTreeData)) {
    return (
      <>
        <section className={cx(classes["live-banner"], classes["compact"])}>
          <div className={cx(classes["left"], classes["sport-iconx-active"])}>
            <SportIcon code={sportCode} />
            <p>{(sports && sports[sportCode]?.description) ?? ""}</p>
            {/* <p>이전 페이지</p> */}
          </div>
          <div className={cx(classes["right"], classes["filter"], classes["filter-live"])}>
            <div>
              <p>{dateState.format("MM-DD")}</p>
              <p>{dateState.format("HH:mm")}</p>
            </div>
            <span className={classes["icon-live-icon-disabled"]}>
              <span className={classes["path1"]} />
              <span className={classes["path2"]} />
              <span className={classes["path3"]} />
              <span className={classes["path4"]} />
              <span className={classes["path5"]} />
              <span className={classes["path6"]} />
              <span className={classes["path7"]} />
            </span>
          </div>
        </section>
        <div className={classes["matches"]}>
          <NoLeaguesAvailable sportCode={sportCode} />
        </div>
      </>
    );
  }

  return activeSportsTreeData?.map((item) => {
    const sportsKey = `sports-${item.code}`;

    if (sportCode !== ALL_KEY && sportCode !== item.code) return null;

    return (
      <React.Fragment key={sportsKey}>
        <section className={cx(classes["live-banner"], classes["compact"])}>
          <div className={cx(classes["left"], classes["sport-iconx-active"])}>
            <SportIcon code={item.code} />
            <p>{item.desc}</p>
          </div>
          <div className={cx(classes["right"], classes["filter"], classes["filter-live"])}>
            <div>
              <p>{dateState.format("MM-DD")}</p>
              <p>{dateState.format("HH:mm")}</p>
            </div>
            <span className={classes["icon-live-icon"]}>
              <span className={classes["path1"]} />
              <span className={classes["path2"]} />
              <span className={classes["path3"]} />
              <span className={classes["path4"]} />
              <span className={classes["path5"]} />
              <span className={classes["path6"]} />
              <span className={classes["path7"]} />
            </span>
          </div>
        </section>
        {!collapsedSports.includes(sportsKey) && (
          <section className={classes["countries"]}>
            <div className={cx(classes["accordion-wrapper"], classes["accordion-wrapper-live"])}>
              {item.categories.map((category) => {
                // const isCategoryToggled = sportTreeItemBeingToggled[categoryKey];

                const countryEventCount = category.count;

                if (countryEventCount === 0) return null;

                if (isEmpty(category.tournaments)) return null;

                return category.tournaments.map((tournament) => {
                  const tournamentKey = `tournament-${tournament.id}`;

                  const tournamentEventCount = tournament.count;

                  if (tournamentEventCount === 0) return null;

                  return (
                    <div className={classes["country"]} key={tournamentKey}>
                      <button
                        className={cx(
                          classes["accordion"],
                          // , { [classes["active"]]: isCategoryToggled }
                        )}
                        type="button"
                        onClick={() => history.push(getHrefLiveSportLeague(sportCode, tournament.id))}
                      >
                        <div className={classes["according-title"]}>
                          <div className={classes["live-home-sport-icon"]}>
                            <SportIcon code={item.code} />
                          </div>
                          <p>
                            {category.desc}, {tournament.desc}
                          </p>
                        </div>
                        <div className={classes["down-wrapper"]}>
                          {/* {!isCategoryToggled && ( */}
                          <span
                            className={classes["country-event-count"]}
                            style={{ marginTop: "0px" }}
                          >{`( ${tournamentEventCount} )`}</span>
                          {/* )} */}
                          <i
                            className={cx(classes["icon-angle-up-light"], classes["icon-angle-up-dark"])}
                            style={{ fontSize: "12px", marginLeft: "18px" }}
                          />
                        </div>
                      </button>
                    </div>
                  );
                });
              })}
            </div>
          </section>
        )}
      </React.Fragment>
    );
  });
};

LiveHomePage.propTypes = propTypes;
LiveHomePage.defaultProps = defaultProps;

export default React.memo(LiveHomePage);
