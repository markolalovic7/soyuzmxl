import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import isEmpty from "lodash.isempty";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { useGetMatchStatuses } from "../../../../../hooks/matchstatus-hooks";
import { makeGetLiveEuropeanDashboardData } from "../../../../../redux/reselect/live-selector";
import { groupMarketsAndPeriods } from "../../../../../utils/eventsHelpers";
import { isNotEmpty } from "../../../../../utils/lodash";
import { useLiveData } from "../../../../common/hooks/useLiveData";
import { decorateMarkets, decorateMatch, sortPeriodsWithinMarketGroups } from "../../../utils/live-utils";

import LiveBanner from "./LiveBanner";
import LiveBetEntertainmentSection from "./LiveBetEntertainmentSection";
import LiveMarketSection from "./LiveMarketSection";
import NoMarketsAvailable from "./NoMarketsAvailable";

import classes from "applications/ezbet/scss/ezbet.module.scss";

const LiveEventDetailPage = () => {
  const { eventId: eventIdStr, eventPathId: eventPathIdStr, sportCode } = useParams();

  const eventPathId = eventPathIdStr && !Number.isNaN(eventPathIdStr) ? Number(eventPathIdStr) : null;
  const eventId = eventIdStr && !Number.isNaN(eventIdStr) ? Number(eventIdStr) : null;

  const dispatch = useDispatch();

  const matchStatuses = useGetMatchStatuses(dispatch);

  const code = `e${eventId}`;

  const eventLiveData = useSelector((state) => state.live.liveData[`event-${eventId}`]);

  useLiveData(dispatch, eventId ? `event-${eventId}` : null);

  const getLiveEuropeanDashboardData = useMemo(() => makeGetLiveEuropeanDashboardData(), []);

  const eventsInLeague = useSelector((state) => {
    const liveEuropeanData =
      getLiveEuropeanDashboardData(state, {
        eventPathIds: eventPathId ? [eventPathId] : [],
        sportCode,
      }) || {};

    const eventsInLeague = isNotEmpty(liveEuropeanData)
      ? Object.entries(liveEuropeanData)
          .map((x) => Object.values(x[1]).length)
          .reduce((a, x) => a + x, 0)
      : 0;

    return eventsInLeague;
  });

  const { anyMarketOpen, marketGroups, match, pathDescription } = useMemo(() => {
    const match = !isEmpty(eventLiveData) ? decorateMatch(eventLiveData, sportCode, matchStatuses) : undefined;
    const pathDescription = !isEmpty(eventLiveData) ? eventLiveData.leagueDesc : undefined;
    const marketGroups = !isEmpty(eventLiveData)
      ? sortPeriodsWithinMarketGroups(
          groupMarketsAndPeriods(decorateMarkets(eventLiveData)),
          matchStatuses,
          eventLiveData?.cPeriod,
        )
      : [];

    const anyMarketOpen = eventLiveData?.markets && Object.values(eventLiveData.markets).findIndex((x) => x.mOpen) > -1;

    return { anyMarketOpen, marketGroups, match, pathDescription };
  }, [sportCode, eventLiveData, matchStatuses]);

  if (isEmpty(match)) {
    return (
      <section className={classes["filter-wrapper"]}>
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
      </section>
    );
  }

  return (
    <>
      <LiveBanner
        cMin={match.min}
        cSec={match.sec}
        cStatus={match.cStatus}
        cType={match.cType}
        countryCodeA={match.ac}
        countryCodeB={match.bc}
        eventCount={eventsInLeague}
        eventPathDesc={pathDescription}
        eventPathId={eventPathId}
        oppA={match.a}
        oppB={match.b}
        period={match.period}
        scoreA={match.aScore}
        scoreB={match.bScore}
        sportCode={match.code}
      />
      <LiveBetEntertainmentSection
        eventId={match.eventId}
        feedcode={match.brMatchId}
        hasAVLive={match.hasAV}
        hasData={anyMarketOpen}
        hasMatchTracker={
          ["FOOT", "BASK", "BASE", "ICEH", "TENN", "TABL", "VOLL", "HAND", "AMFB", "BADM"].includes(match.code) &&
          match.hasMatchTracker
        }
      />
      {anyMarketOpen && (
        <LiveMarketSection
          eventId={match.eventId}
          feedcode={match.brMatchId}
          groupedMarkets={marketGroups}
          sportCode={match.code}
        />
      )}
      {!anyMarketOpen && <NoMarketsAvailable eventPathId={eventPathId} sportCode={sportCode} />}
    </>
  );
};

export default React.memo(LiveEventDetailPage);
