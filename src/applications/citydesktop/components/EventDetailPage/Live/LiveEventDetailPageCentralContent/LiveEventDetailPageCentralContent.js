import cloneDeep from "lodash.clonedeep";
import isEmpty from "lodash.isempty";
import * as PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { isNotEmpty } from "../../../../../../utils/lodash";
import { useLiveData } from "../../../../../common/hooks/useLiveData";
import classes from "../../../../scss/citywebstyle.module.scss";
import CustomBet from "../../../CustomBet/CustomBet";
import PagePath from "../../../Navigation/PagePath/PagePath";
import EventDetailPageLinks from "../../common/EventDetailPageLinks";
import { getGroupedMarketsForActiveTab } from "../../common/EventDetailUtils";
import MarketColumn from "../../common/MarketColumn";

import LiveEventDetailPageHeader from "./LiveEventDetailPageHeader/LiveEventDetailPageHeader";
import LiveMatchTracker from "./LiveMatchTracker";

import Spinner from "applications/common/components/Spinner";

const LiveEventDetailPageCentralContent = ({ eventId }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [cmsFilterEnabled, setCmsFilterEnabled] = useState(true);
  const [cmsFilterOn, setCmsFilterOn] = useState(true);

  const europeanDashboardLiveData = useSelector((state) => state.live.liveData["european-dashboard"]);
  const eventLiveData = useSelector((state) => state.live.liveData[`event-${eventId}`]);
  const marketFilteredEventLiveData = useSelector((state) => state.live.liveData[`event-marketfilter-${eventId}`]);

  // Subscribe to the european dashboard live feed
  // useLiveData(dispatch, 'european-dashboard'); //This is initialised in the left navigation panel, avoid causing confusion by double subscription

  // Subscribe to the the specific event live feed
  useLiveData(dispatch, eventId ? `event-${eventId}` : null);
  useLiveData(dispatch, eventId ? `event-marketfilter-${eventId}` : null);

  const [activeTab, setActiveTab] = useState("ALL");

  const [listOfFavouriteMarkets, setListOfFavouriteMarkets] = useState([]);
  useEffect(() => {
    if (localStorage.getItem("favouriteMarketGroups")) {
      setListOfFavouriteMarkets(localStorage.getItem("favouriteMarketGroups").split(","));
    }
  }, []);

  // If no event defined, redirect the user to the first relevant one...
  const history = useHistory();
  useEffect(() => {
    if (!eventId && europeanDashboardLiveData) {
      const sportMatches = Object.values(europeanDashboardLiveData);
      if (sportMatches.length > 0 && Object.values(sportMatches[0]).length > 0) {
        const firstMatch = Object.values(sportMatches[0])[0];
        history.push(`/events/live/${firstMatch.eventId}`);
      }
    }
  }, [eventId, europeanDashboardLiveData]);

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

  const compare = (a, b) => a.ordinal - b.ordinal;

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
    data.children.sort(compare);
    data.markets = null;

    return data;
  };

  const match = decorate(cmsFilterOn ? marketFilteredEventLiveData : eventLiveData);

  const groupedMarkets =
    match &&
    match.children &&
    ["ALL", "MATCH", "OVER_UNDER", "HANDICAP", "ODD_EVEN", "PERIOD", "RAPID", "OTHER"].includes(activeTab)
      ? getGroupedMarketsForActiveTab(activeTab, Object.values(match.children), listOfFavouriteMarkets)
      : [];

  return (
    <section className={classes["content"]}>
      <PagePath
        paths={[
          {
            description: t("home_page"),
            target: "/",
          },
          { description: match ? `${match.opADesc} vs ${match.opBDesc}` : "" },
        ]}
        qualifierClassName="breadcrumbs_event"
      />

      <div className={classes["content__container"]}>
        {isEmpty(match) ? (
          eventId ? (
            <div className={classes["homepage-spinner"]}>
              <Spinner className={classes.loader} />
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>{t("no_events_found")}</div>
          )
        ) : match ? (
          <>
            <LiveEventDetailPageHeader match={match} />

            {["FOOT", "BASK", "BASE", "ICEH", "VOLL"].includes(match.sport) ? (
              <div className={classes["event-schema"]}>
                <LiveMatchTracker
                  feedcode={match.feedCode.substring(match.feedCode.lastIndexOf(":") + 1, match.feedCode.length)}
                />
              </div>
            ) : null}

            <div style={{ paddingBottom: "10px" }} />

            <EventDetailPageLinks
              activeTab={activeTab}
              cmsFilterEnabled={cmsFilterEnabled}
              cmsFilterOn={cmsFilterOn}
              markets={Object.values(match.children)}
              setActiveTab={setActiveTab}
              setCmsFilterOn={setCmsFilterOn}
              sportCode={match.sport}
            />

            {activeTab === "CUSTOM_BET" && (
              <div
                className={classes["event-content"]}
                style={{ alignItems: "center", display: "flex", justifyContent: "center" }}
              >
                <CustomBet live feedcode={match.feedCode} sportCode={match.sport} />
              </div>
            )}

            {activeTab !== "CUSTOM_BET" && (
              <div className={classes["event-content"]}>
                <MarketColumn
                  brMatchId={match.feedCode}
                  eventId={eventId}
                  index={0}
                  listOfFavouriteMarkets={listOfFavouriteMarkets}
                  marketGroups={groupedMarkets}
                  setListOfFavouriteMarkets={setListOfFavouriteMarkets}
                />
                <MarketColumn
                  brMatchId={match.feedCode}
                  eventId={eventId}
                  index={1}
                  listOfFavouriteMarkets={listOfFavouriteMarkets}
                  marketGroups={groupedMarkets}
                  setListOfFavouriteMarkets={setListOfFavouriteMarkets}
                />
              </div>
            )}
          </>
        ) : null}
      </div>
    </section>
  );
};

const propTypes = {
  eventId: PropTypes.string.isRequired,
};

const defaultProps = {};

LiveEventDetailPageCentralContent.propTypes = propTypes;
LiveEventDetailPageCentralContent.defaultProps = defaultProps;

export default React.memo(LiveEventDetailPageCentralContent);
