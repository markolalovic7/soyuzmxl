import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import isEmpty from "lodash.isempty";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { useGetMatchStatuses } from "../../../../../hooks/matchstatus-hooks";
import { makeGetLiveEuropeanDashboardData } from "../../../../../redux/reselect/live-selector";
import { groupMarketsAndPeriods } from "../../../../../utils/eventsHelpers";
import { isNotEmpty } from "../../../../../utils/lodash";
import { useLiveData } from "../../../../common/hooks/useLiveData";
import classes from "../../../scss/ezbet.module.scss";
import { decorateMarkets, decorateMatch, sortPeriodsWithinMarketGroups } from "../../../utils/live-utils";
import LiveMarketSection from "../../LiveEventDetailPage/components/LiveMarketSection/components";
import NoMarketsAvailable from "../../LiveEventDetailPage/components/NoMarketsAvailable";

import DesktopLiveBanner from "./DesktopLiveBanner";
import LiveBetEntertainmentSection from "./DesktopLiveBetEntertainmentSection";
import DesktopLiveHeader from "./DesktopLiveHeader";

const DesktopLiveEventDetailPage = () => {
  const { eventId: eventIdStr, eventPathId: eventPathIdStr, sportCode } = useParams();

  const eventPathId = eventPathIdStr && !Number.isNaN(eventPathIdStr) ? Number(eventPathIdStr) : null;
  const eventId = eventIdStr && !Number.isNaN(eventIdStr) ? Number(eventIdStr) : null;

  const [selectedButton, setSelectedButton] = useState(undefined); // MATCH_TRACKER, TV, undefined

  const [scrolling, setScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [bannerScrollEffectMinimise, setBannerScrollEffectMinimise] = useState(false);

  const [betEntertainmentScrollEffectActive, setBetEntertainmentScrollEffectActive] = useState(false);
  const [betEntertainmentScrollEffectFixed, setBetEntertainmentScrollEffectFixed] = useState(false); // step into fixed position to force an animation
  const [betEntertainmentScrollEffectMinimise, setBetEntertainmentScrollEffectMinimise] = useState(false);

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

  const { anyMarketOpen, hasMarkets, marketGroups, match, pathDescription } = useMemo(() => {
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

    return { anyMarketOpen, hasMarkets: isNotEmpty(marketGroups), marketGroups, match, pathDescription };
  }, [sportCode, eventLiveData, matchStatuses]);

  const onScrollHandler = useCallback(
    (e, scrollTop, scrollEffectMinimise, hasData) => {
      const onBannerScrollHandler = (e, scrollTop, scrollEffectMinimise) => {
        const newScrollTop = e.target.scrollTop;
        setScrollTop(newScrollTop);
        setScrolling(newScrollTop > scrollTop);

        if (newScrollTop > 65 && !scrollEffectMinimise) {
          setBannerScrollEffectMinimise(true);
        } else if (scrollEffectMinimise && newScrollTop < 110) {
          // remove active and scrolled...
          setBannerScrollEffectMinimise(false);
        }
      };

      const onBetEntertainmentScrollHandler = (e, scrollTop) => {
        const newScrollTop = e.target.scrollTop;

        setScrollTop(newScrollTop);
        setScrolling(newScrollTop > scrollTop);

        if (newScrollTop > 5) {
          // add active
          setBetEntertainmentScrollEffectActive(true);
          if (newScrollTop > scrollTop) {
            if (newScrollTop > (selectedButton === "TV" ? 220 : 380)) {
              // add scrolled
              setBetEntertainmentScrollEffectFixed(true);
              setTimeout(() => setBetEntertainmentScrollEffectMinimise(true), 100);
            }
          } else {
            // remove scrolled
            if (newScrollTop < (selectedButton === "TV" ? 220 : 380)) {
              setBetEntertainmentScrollEffectMinimise(false);
              setBetEntertainmentScrollEffectFixed(false);
              // setTimeout(() => setScrollEffectFixed(false), 300);
            }
          }
        } else {
          // remove active and scrolled...
          setBetEntertainmentScrollEffectActive(false);
          setBetEntertainmentScrollEffectMinimise(false);
          setBetEntertainmentScrollEffectFixed(false);
          // setTimeout(() => setScrollEffectFixed(false), 100);
        }
      };

      onBannerScrollHandler(e, scrollTop, scrollEffectMinimise);

      if (hasData) {
        // if there is no data to scroll enough, avoid jittery effects with limited scroll
        onBetEntertainmentScrollHandler(e, scrollTop);
      }
    },
    [selectedButton],
  );

  useEffect(() => {
    // make sure we do not end up with inconsistent data
    if (betEntertainmentScrollEffectMinimise) setBetEntertainmentScrollEffectFixed(true);
  }, [betEntertainmentScrollEffectMinimise]);

  useEffect(() => {
    // if we run out of markets, force remove any minimised effect
    if (!anyMarketOpen) {
      setScrollTop(0);
      setScrolling(false);
      setBannerScrollEffectMinimise(false);
      setBetEntertainmentScrollEffectActive(false);
      setBetEntertainmentScrollEffectMinimise(false);
      setBetEntertainmentScrollEffectFixed(false);
    }
  }, [anyMarketOpen]);

  if (isEmpty(match)) {
    return (
      <section className={classes["filter-wrapper"]}>
        <FontAwesomeIcon
          className="fa-spin"
          icon={faSpinner}
          size="3x"
          style={{
            "--fa-primary-color": "white",
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
      <DesktopLiveHeader
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
      <div
        className={classes["event-detail-wrapper"]}
        id="prematch-event-detail-wrapper"
        onScroll={(e) => onScrollHandler(e, scrollTop, bannerScrollEffectMinimise, anyMarketOpen)}
      >
        <DesktopLiveBanner
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
          scrollEffectMinimise={bannerScrollEffectMinimise}
          sportCode={match.code}
        />

        <LiveBetEntertainmentSection
          eventId={match.eventId}
          feedcode={match.brMatchId}
          hasAVLive={match.hasAV}
          hasMatchTracker={
            ["FOOT", "BASK", "BASE", "ICEH", "TENN", "TABL", "VOLL", "HAND", "AMFB", "BADM"].includes(match.code) &&
            match.hasMatchTracker
          }
          scrollEffectActive={betEntertainmentScrollEffectActive}
          scrollEffectFixed={betEntertainmentScrollEffectFixed}
          scrollEffectMinimise={betEntertainmentScrollEffectMinimise}
          selectedButton={selectedButton}
          setSelectedButton={setSelectedButton}
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
      </div>
    </>
  );
};

export default DesktopLiveEventDetailPage;
