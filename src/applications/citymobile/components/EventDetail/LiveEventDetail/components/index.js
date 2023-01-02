import cloneDeep from "lodash.clonedeep";
import isEmpty from "lodash.isempty";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { useGAPageView } from "../../../../../../hooks/google-analytics-hooks";
import { isNotEmpty } from "../../../../../../utils/lodash";
import { getGroupedMarketsForActiveTab } from "../../../../../citydesktop/components/EventDetailPage/common/EventDetailUtils";
import { useLiveData } from "../../../../../common/hooks/useLiveData";
import classes from "../../../../scss/citymobile.module.scss";
import EventDetailMarkets from "../../EventDetailMarkets";
import EventMarketTypeSelector from "../../PrematchEventDetail/components/EventMarketTypeSelector";

import FloatingMatchTracker from "./FloatingMatchTracker";
import LiveBreadcrumbs from "./LiveBreadcrumbs";

import Spinner from "applications/common/components/Spinner";
import CustomBet from "../../../CustomBet/CustomBet";

const decorate = (eventLiveData) => {
  if (!eventLiveData) return null;

  const data = cloneDeep(eventLiveData);
  data.id = data.eventId;
  data.marketTypeGroup = data.group;

  data.children = [...Object.values(data.markets)];

  for (const market of data.children) {
    market.id = market.mId;
    market.desc = market.mDesc;
    market.period = market.pDesc;
    market.periodAbrv = market.pAbrv;
    market.marketTypeGroup = market.mGroup;
    market.open = market.mOpen;

    market.children = market.sels;
    market.sels = null;

    market.children.forEach((selection) => {
      selection.id = selection.oId;
      selection.desc = selection.oDesc;
      selection.price = selection.formattedPrice;
    });
  }
  data.children.sort((a, b) => a.ordinal - b.ordinal);
  data.markets = null;

  return data;
};

const LiveEventDetail = () => {
  // Receive params (eventId)
  const { eventId } = useParams();

  const matchId = eventId && !Number.isNaN(eventId) ? parseInt(eventId, 10) : null;

  const dispatch = useDispatch();

  useGAPageView("Live Event Detail");

  const [activeTab, setActiveTab] = useState("ALL");

  const [cmsFilterEnabled, setCmsFilterEnabled] = useState(true);
  const [cmsFilterOn, setCmsFilterOn] = useState(true);

  const [listOfFavouriteMarkets, setListOfFavouriteMarkets] = useState([]);
  useEffect(() => {
    if (localStorage.getItem("favouriteMarketGroups")) {
      setListOfFavouriteMarkets(localStorage.getItem("favouriteMarketGroups").split(","));
    }
  }, []);

  const eventLiveData = useSelector((state) => state.live.liveData[`event-${eventId}`]);
  const marketFilteredEventLiveData = useSelector((state) => state.live.liveData[`event-marketfilter-${eventId}`]);

  // Subscribe to the european dashboard live feed
  useLiveData(dispatch, "european-dashboard");

  // Subscribe to the the specific event live feed
  useLiveData(dispatch, eventId ? `event-${eventId}` : null);
  useLiveData(dispatch, eventId ? `event-marketfilter-${eventId}` : null);

  useEffect(() => {
    // Reset flags state when we change events
    setCmsFilterOn(true);
    setCmsFilterEnabled(true);
  }, [eventId]);

  useEffect(() => {
    // if we have no "filtered markets" - disable the flag right away...
    if (marketFilteredEventLiveData && isEmpty(marketFilteredEventLiveData?.markets)) {
      // bit tricky - make sure that we already have some data (not undefined), and that it happens to be empty
      setCmsFilterOn(false);
      setCmsFilterEnabled(false);
    }
    // in case of updates re-enabling
    if (marketFilteredEventLiveData && isNotEmpty(marketFilteredEventLiveData?.markets)) {
      setCmsFilterEnabled(true);
    }
  }, [marketFilteredEventLiveData]);

  const match = decorate(cmsFilterOn ? marketFilteredEventLiveData : eventLiveData);

  const groupedMarkets =
    match &&
    match.children &&
    ["ALL", "MATCH", "OVER_UNDER", "HANDICAP", "ODD_EVEN", "PERIOD", "RAPID", "OTHER"].includes(activeTab)
      ? getGroupedMarketsForActiveTab(activeTab, Object.values(match.children), listOfFavouriteMarkets)
      : [];

  const markets = match?.children ? Object.values(match?.children) : [];
  const allMarketCount = markets?.length;
  const matchMarketCount = markets?.filter(
    (market) => market.marketTypeGroup === "MONEY_LINE" && (market.periodAbrv === "M" || market.periodAbrv === "RT"),
  )?.length;
  const overUnderMarketCount = markets?.filter(
    (market) =>
      (market.marketTypeGroup === "FIXED_TOTAL" || market.marketTypeGroup === "THREE_WAY_FIXED_TOTAL") &&
      (market.periodAbrv === "M" || market.periodAbrv === "RT"),
  )?.length;
  const handicapMarketCount = markets?.filter(
    (market) =>
      (market.marketTypeGroup === "FIXED_SPREAD" || market.marketTypeGroup === "THREE_WAY_FIXED_SPREAD") &&
      (market.periodAbrv === "M" || market.periodAbrv === "RT"),
  )?.length;
  const oddEvenMarketCount = markets?.filter(
    (market) => market.marketTypeGroup === "ODD_EVEN" && (market.periodAbrv === "M" || market.periodAbrv === "RT"),
  )?.length;
  const periodMarketCount = markets?.filter(
    (market) => market.periodAbrv !== "M" && market.periodAbrv !== "RT",
  )?.length;
  const rapidMarketCount = markets?.filter((market) => market.rapid)?.length;
  const otherMarketCount =
    allMarketCount -
    matchMarketCount -
    overUnderMarketCount -
    handicapMarketCount -
    oddEvenMarketCount -
    periodMarketCount -
    rapidMarketCount;

  const sportCode = match?.sport;

  return (
    <>
      {false ? (
        <Spinner className={classes.loader} />
      ) : (
        <>
          <LiveBreadcrumbs activeMatchId={matchId} />

          {["FOOT", "BASK", "BASE", "ICEH", "VOLL"].includes(sportCode) ? (
            <FloatingMatchTracker
              feedcode={match?.feedCode?.substring(match?.feedCode?.lastIndexOf(":") + 1, match?.feedCode?.length)}
            />
          ) : null}

          <div className={classes["event-content"]}>
            <EventMarketTypeSelector
              activeTab={activeTab}
              allMarketCount={allMarketCount}
              cmsFilterEnabled={cmsFilterEnabled}
              cmsFilterOn={cmsFilterOn}
              handicapMarketCount={handicapMarketCount}
              matchMarketCount={matchMarketCount}
              oddEvenMarketCount={oddEvenMarketCount}
              otherMarketCount={otherMarketCount}
              overUnderMarketCount={overUnderMarketCount}
              periodMarketCount={periodMarketCount}
              rapidMarketCount={rapidMarketCount}
              setActiveTab={setActiveTab}
              setCmsFilterOn={setCmsFilterOn}
              sportCode={match?.sport}
            />

            {activeTab === "CUSTOM_BET" && match?.feedCode && (
              <div className={classes["event-content__card"]}>
                <CustomBet live feedcode={match.feedCode} sportCode={match.sport} />
              </div>
            )}

            {activeTab !== "CUSTOM_BET" && (
              <EventDetailMarkets
                // brMatchId={match?.brMatchId}
                groupedMarkets={groupedMarkets}
                listOfFavouriteMarkets={listOfFavouriteMarkets}
                matchId={matchId}
                setListOfFavouriteMarkets={setListOfFavouriteMarkets}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default LiveEventDetail;
