import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { getAuthLoggedIn } from "../../../../../../../../redux/reselect/auth-selector";
import { getFavouriteData } from "../../../../../../../../redux/reselect/favourite-selector";
import { getSportsSelector } from "../../../../../../../../redux/reselect/sport-selector";
import { addFavourite, deleteFavourite } from "../../../../../../../../redux/slices/favouriteSlice";
import { setActiveMatchTracker } from "../../../../../../../../redux/slices/liveSlice";
import {
  addAsianLiveContentBySport,
  addPrematchContentByLeague,
} from "../../../../../../../citydesktop/components/Common/utils/dataAggregatorUtils";
import { useAsianCouponData } from "../../../../../../../common/hooks/useAsianCouponData";
import { useLiveData } from "../../../../../../../common/hooks/useLiveData";
import classes from "../../../../../../scss/vanilladesktop.module.scss";
import {
  ASIAN_MARKET_TYPE_1x2,
  ASIAN_MARKET_TYPE_FG,
  ASIAN_MARKET_TYPE_FH_FG,
  ASIAN_MARKET_TYPE_FH_LG,
  ASIAN_MARKET_TYPE_LG,
  DOUBLE_VIEW_ASIAN_SPORT_MARKET_MAPPING,
  SINGLE_VIEW_ASIAN_SPORT_MARKET_MAPPING,
} from "../../../../../../../../utils/asian-view/asianViewSportMarkets";
import { ASIAN_EARLIER_TAB, ASIAN_LIVE_TAB, ASIAN_TODAY_TAB } from "../../../constants";

import AsianCouponHeader from "./components/AsianCouponHeader";
import AsianMatch from "./components/AsianMatch";
import AsianOutright from "./components/AsianOutright";
import LeaguePopup from "./components/LeaguePopup";
import { ASIAN_VIEW_TYPE_DOUBLE, ASIAN_VIEW_TYPE_SINGLE } from "./constants";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

// Sort `liveMatches` by `epDesc` and `opADesc`
function compareLiveMatches(liveMatchLeft, liveMatchRight) {
  if (liveMatchLeft.epDesc > liveMatchRight.epDesc) {
    return 1;
  }
  if (liveMatchLeft.epDesc < liveMatchRight.epDesc) {
    return -1;
  }
  if (liveMatchLeft.opADesc > liveMatchRight.opADesc) {
    return 1;
  }
  if (liveMatchLeft.opADesc < liveMatchRight.opADesc) {
    return -1;
  }

  return 0;
}

const AsiansSportsTableTitleRow = ({ label }) => <div className={classes["asian-outright-table__title"]}>{label}</div>;
AsiansSportsTableTitleRow.propTypes = {
  label: PropTypes.string.isRequired,
};

const AsianCoupon = ({ eventType, fromDate, toDate }) => {
  const { criteria, dateTab, eventId, eventPathId, sportCode } = useParams();

  const favouriteEventId = eventId ? Number(eventId) : undefined;
  const favouriteEventPathId = eventPathId ? Number(eventPathId) : undefined;

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isLoggedIn = useSelector(getAuthLoggedIn);

  const [sortType, setSortType] = useState("LEAGUE"); // LEAGUE vs TIME
  const [viewType, setViewType] = useState("DOUBLE"); // DOUBLE vs SIMPLE
  const [isLeaguePopupOpened, setIsLeaguePopupOpened] = useState(false);
  const [excludedTournaments, setExcludedTournaments] = useState([]);

  const favouriteData = useSelector(getFavouriteData);
  const sports = useSelector(getSportsSelector);
  const pathCouponData = useSelector((state) => state.coupon.asianCouponData[`s${sportCode}/${criteria}`]);
  const pathLoading = useSelector((state) => state.coupon.asianCouponLoading[`s${sportCode}/${criteria}`]);
  const asianDashboardLiveData = useSelector((state) =>
    state.live.liveData["asian-dashboard"] && state.live.liveData["asian-dashboard"][sportCode]
      ? Object.keys(state.live.liveData["asian-dashboard"])
          .filter((key) => key === sportCode)
          .reduce((obj, key) => {
            obj[key] = state.live.liveData["asian-dashboard"][key];

            return obj;
          }, {})
      : undefined,
  );

  useAsianCouponData(
    dispatch,
    [ASIAN_TODAY_TAB, ASIAN_EARLIER_TAB].includes(dateTab) ? `s${sportCode}` : undefined,
    sportCode,
    fromDate,
    toDate,
    criteria,
  );

  // Subscribe to the asian dashboard live feed
  useLiveData(dispatch, dateTab !== ASIAN_EARLIER_TAB ? "asian-dashboard" : undefined);

  const activeMatchTracker = useSelector((state) => state.live.activeMatchTracker);

  // Mark the first available event for match tracker display
  useEffect(() => {
    if (!activeMatchTracker && asianDashboardLiveData && Object.keys(asianDashboardLiveData).length > 0) {
      const sportsEntries = Object.entries(asianDashboardLiveData);
      for (let i = 0; i < sportsEntries.length; i += 1) {
        const sport = sportsEntries[i][0];
        const matches = Object.values(sportsEntries[i][1])
          .filter((x) => x.hasMatchTracker)
          .sort(compareLiveMatches);
        if (matches.length > 0) {
          dispatch(setActiveMatchTracker({ feedCode: matches[0].feedCode, sportCode: sport }));
          break;
        }
      }
    }
  }, [activeMatchTracker, asianDashboardLiveData, setActiveMatchTracker]);

  const isOutright = criteria.endsWith("OUTRIGHT");

  const prematchContent = useMemo(() => {
    const prematchContent = [];
    addPrematchContentByLeague(prematchContent, pathCouponData, sportCode);

    if (sortType === "LEAGUE") return prematchContent;
    if (sortType === "TIME") {
      // denormalize each match by time and league.
      let tournamentIndex = 0;
      const aux = [];
      prematchContent.forEach((league) => {
        league.events.forEach((match) => {
          aux.push({
            description: match.eventDescription,
            epoch: match.epoch,
            league: { ...league, events: undefined },
            match,
            tournamentIndex,
          });
        });

        tournamentIndex += 1;
      });

      // sort all by time (and league)
      aux.sort((a, b) => {
        const epochComp = a.epoch - b.epoch;
        if (epochComp !== 0) return epochComp;

        const tournamentComp = a.tournamentIndex - b.tournamentIndex;
        if (tournamentComp !== 0) return tournamentComp;

        return a.match.description - b.match.description;
      });

      // re-build the body (group by leagues...)
      const sortedPrematchContent = [];
      aux.forEach((matchObj) => {
        if (
          sortedPrematchContent.length > 0 &&
          sortedPrematchContent[sortedPrematchContent.length - 1].tournamentId === matchObj.league.tournamentId
        ) {
          sortedPrematchContent[sortedPrematchContent.length - 1].events.push(matchObj.match);
        } else {
          sortedPrematchContent.push({ ...matchObj.league, events: [matchObj.match] });
        }
      });

      return sortedPrematchContent;
    }

    return undefined;
  }, [pathCouponData, sortType, sportCode]);

  const liveContent = useMemo(() => {
    const liveContent = [];
    addAsianLiveContentBySport(liveContent, asianDashboardLiveData, sportCode, criteria);

    return liveContent;
  }, [asianDashboardLiveData, sportCode, criteria]);

  const hasViewChoices = useMemo(() => {
    // Based on the user preference (viewType), find out if we have a view to offer. Otherwise resort to alternative available views (including a default fallback)
    const singleView = SINGLE_VIEW_ASIAN_SPORT_MARKET_MAPPING[sportCode]?.find((data) => data.criteria === criteria);
    const alternativeView = DOUBLE_VIEW_ASIAN_SPORT_MARKET_MAPPING[sportCode]?.find(
      (data) => data.criteria === criteria,
    );

    return singleView && alternativeView;
  }, [sportCode, criteria]);

  const { currentViewType, marketTypes } = useMemo(() => {
    // Based on the user preference (viewType), find out if we have a view to offer. Otherwise resort to alternative available views (including a default fallback)
    const desiredView =
      viewType === ASIAN_VIEW_TYPE_SINGLE
        ? SINGLE_VIEW_ASIAN_SPORT_MARKET_MAPPING[sportCode]?.find((data) => data.criteria === criteria)
        : DOUBLE_VIEW_ASIAN_SPORT_MARKET_MAPPING[sportCode]?.find((data) => data.criteria === criteria);
    const alternativeView =
      viewType === ASIAN_VIEW_TYPE_DOUBLE
        ? SINGLE_VIEW_ASIAN_SPORT_MARKET_MAPPING[sportCode]?.find((data) => data.criteria === criteria)
        : DOUBLE_VIEW_ASIAN_SPORT_MARKET_MAPPING[sportCode]?.find((data) => data.criteria === criteria);

    const fallbackMarketTypes = DOUBLE_VIEW_ASIAN_SPORT_MARKET_MAPPING["DEFAULT"].find(
      (data) => data.criteria === "DEFAULT-DEFAULT",
    ).marketTypes;

    if (desiredView) {
      return { currentViewType: viewType, marketTypes: desiredView.marketTypes };
    }
    if (alternativeView) {
      return {
        currentViewType: viewType === ASIAN_VIEW_TYPE_SINGLE ? ASIAN_VIEW_TYPE_DOUBLE : ASIAN_VIEW_TYPE_SINGLE,
        marketTypes: alternativeView.marketTypes,
      };
    }

    // if nothing else, go to the default...
    return { currentViewType: ASIAN_VIEW_TYPE_DOUBLE, marketTypes: fallbackMarketTypes };
  }, [sportCode, criteria, viewType]);

  const hasDraw = useMemo(
    () => marketTypes.findIndex((marketType) => marketType.marketGroup.includes(ASIAN_MARKET_TYPE_1x2)) > -1,
    [marketTypes, viewType],
  );

  const hasNone = useMemo(
    () =>
      marketTypes.findIndex(
        (marketType) =>
          marketType.marketGroup.includes(ASIAN_MARKET_TYPE_FG) ||
          marketType.marketGroup.includes(ASIAN_MARKET_TYPE_LG) ||
          marketType.marketGroup.includes(ASIAN_MARKET_TYPE_FH_FG) ||
          marketType.marketGroup.includes(ASIAN_MARKET_TYPE_FH_LG),
      ) > -1,
    [marketTypes, viewType],
  );

  const combinedAvailableTournaments = useMemo(() => {
    const liveTournaments = liveContent
      ? liveContent.map((league) => ({
          tournamentDescription: league.tournamentDescription,
          tournamentId: league.tournamentId,
        }))
      : [];
    const prematchTournaments = prematchContent
      ? prematchContent.map((league) => ({
          categoryDescription: league.categoryDescription,
          tournamentDescription: league.tournamentDescription,
          tournamentId: league.tournamentId,
        }))
      : [];

    const mergedArray = [...liveTournaments, ...prematchTournaments];
    const uniqueArray = mergedArray
      .filter((object, index) => index === mergedArray.findIndex((obj) => obj.tournamentId === object.tournamentId))
      .sort((a, b) =>
        `${a.categoryDescription}:${a.tournamentDescription}`.localeCompare(
          `${b.categoryDescription}:${b.tournamentDescription}`,
        ),
      );

    return uniqueArray;
  }, [prematchContent, liveContent]);

  const onToggleFavourite = (favouriteId, eventPathId) => {
    if (favouriteId) {
      dispatch(deleteFavourite({ id: favouriteId }));
    }

    dispatch(addFavourite({ eventPathId }));
  };

  const isReady = !(!pathCouponData && dateTab !== ASIAN_LIVE_TAB);

  return (
    <div className={classes["central-section__content"]}>
      <h3 className={classes["main-title"]}>
        <div className={classes["main-title__sport"]}>
          <i className={cx(classes["qicon-default"], classes[`qicon-${sportCode?.toLowerCase()}`])} />
        </div>
        <p className={classes["main-title__text"]}>
          {sportCode && sports && sports[sportCode] ? sports[sportCode].description : ""}
        </p>
        <div className={classes["main-title__dropdowns"]}>
          <div className={classes["main-title__dropdown"]}>
            <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
              <option value="LEAGUE">{t("city.pages.sport.sort_by_league")}</option>
              <option value="TIME">{t("city.pages.sport.sort_by_time")}</option>
            </select>
            <span className={classes["main-title__dropdown-arrow"]}>
              <span />
            </span>
          </div>
          {hasViewChoices && ( // only show the selector when it makes sense (i.e. when a choice exists)
            <div className={classes["main-title__dropdown"]}>
              <select value={viewType} onChange={(e) => setViewType(e.target.value)}>
                <option value={ASIAN_VIEW_TYPE_DOUBLE}>{t("vanilladesktop.double_view")}</option>
                <option value={ASIAN_VIEW_TYPE_SINGLE}>{t("vanilladesktop.simple_view")}</option>
              </select>
              <span className={classes["main-title__dropdown-arrow"]}>
                <span />
              </span>
            </div>
          )}
        </div>
        <div
          className={cx(classes["main-title__league"], classes["popup-link"])}
          onClick={() => setIsLeaguePopupOpened(true)}
        >
          <FontAwesomeIcon icon={faPencilAlt} />

          <span>{t("vanilladesktop.select_league")}</span>
        </div>
      </h3>
      <LeaguePopup
        excludedTournaments={excludedTournaments}
        isOpen={isLeaguePopupOpened}
        setExcludedTournaments={setExcludedTournaments}
        tournaments={combinedAvailableTournaments}
        onClose={() => setIsLeaguePopupOpened(false)}
      />
      {isOutright ? (
        <div className={classes["asian-outright-table"]}>
          <div className={classes["asian-outright-table__header"]}>
            <span>Outcome</span>
            <span>Price</span>
          </div>
          {!pathCouponData && dateTab !== ASIAN_LIVE_TAB && (
            <div className={classes["spinner-container"]}>
              <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
            </div>
          )}
          {prematchContent &&
            prematchContent.map((leagueContent) => {
              if (excludedTournaments.includes(leagueContent.tournamentId)) return null;

              return (
                <>
                  <AsiansSportsTableTitleRow
                    key={leagueContent.tournamentId}
                    label={`${leagueContent.categoryDescription} : ${leagueContent.tournamentDescription}`}
                  />
                  {leagueContent.events.map((match) => (
                    <AsianOutright
                      eventId={match.eventId}
                      key={match.eventId}
                      markets={match.markets}
                      startTime={dayjs.unix(match.epoch / 1000)}
                    />
                  ))}
                </>
              );
            })}
        </div>
      ) : (
        <div
          className={cx(classes["asian-sports-table"], {
            [classes["asian-sports-table_single"]]: viewType === ASIAN_VIEW_TYPE_SINGLE,
          })}
        >
          {!isReady && (
            <div className={classes["spinner-container"]}>
              <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
            </div>
          )}
          {isReady && (
            <table>
              <AsianCouponHeader marketTypes={marketTypes} viewType={currentViewType} />

              <tbody>
                {liveContent &&
                  prematchContent &&
                  [liveContent, prematchContent].map((leagues, contentIndex) =>
                    leagues.map((leagueContent, leagueIndex) => {
                      if (excludedTournaments.includes(leagueContent.tournamentId)) return null;
                      if (favouriteEventPathId && favouriteEventPathId !== leagueContent.tournamentId) return null; // This rule is here for favourite direct link

                      const favourite = favouriteData?.find(
                        (favourite) => favourite.code === `p${leagueContent.tournamentId}`,
                      );

                      return (
                        <React.Fragment key={`${leagueContent.tournamentId}-${contentIndex}-${leagueIndex}`}>
                          <tr>
                            <td className={classes["asian-sports-table__title"]} colSpan="200">
                              {isLoggedIn && (
                                <i
                                  className={favourite ? classes["qicon-star-full"] : classes["qicon-star-empty"]}
                                  onClick={() => onToggleFavourite(favourite?.id, leagueContent.tournamentId)}
                                />
                              )}
                              <span>{`${leagueContent.categoryDescription} : ${leagueContent.tournamentDescription}`}</span>
                            </td>
                          </tr>

                          {leagueContent.events.map((match) => {
                            if (favouriteEventId && favouriteEventId !== match.eventId) return null;

                            return (
                              <AsianMatch
                                a={match.a}
                                aScore={match.aScore}
                                b={match.b}
                                cMin={match.cMin}
                                cPeriod={match.cPeriod}
                                cSec={match.cSec}
                                cStatus={match.cStatus}
                                cType={match.cType}
                                eventId={match.eventId}
                                feedCode={match.brMatchId}
                                hScore={match.hScore}
                                hasDraw={hasDraw}
                                hasMatchTracker={match.hasMatchTracker}
                                hasNone={hasNone}
                                key={match.eventId}
                                live={match.live}
                                marketCount={match.count}
                                marketTypes={marketTypes}
                                markets={match.markets}
                                sportCode={sportCode}
                                startTime={dayjs.unix(match.epoch / 1000)}
                                viewType={currentViewType}
                              />
                            );
                          })}
                        </React.Fragment>
                      );
                    }),
                  )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

const propTypes = {
  eventType: PropTypes.string.isRequired,
  fromDate: PropTypes.string,
  toDate: PropTypes.string,
};

const defaultProps = {
  fromDate: undefined,
  toDate: undefined,
};

AsianCoupon.propTypes = propTypes;
AsianCoupon.defaultProps = defaultProps;

export default React.memo(AsianCoupon);
