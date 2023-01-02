import { getGroupedMarketsForActiveTab } from "applications/citydesktop/components/EventDetailPage/common/EventDetailUtils";
import PagePath from "applications/citymobile/components/Navigation/PagePath/components";
import classes from "applications/citymobile/scss/citymobile.module.scss";
import Spinner from "applications/common/components/Spinner";
import { useCouponData } from "applications/common/hooks/useCouponData";
import isEmpty from "lodash.isempty";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { useGAPageView } from "../../../../../../hooks/google-analytics-hooks";
import { getEvent } from "../../../../../../utils/eventsHelpers";
import { isNotEmpty } from "../../../../../../utils/lodash";
import EventDetailMarkets from "../../EventDetailMarkets";

import EventMarketTypeSelector from "./EventMarketTypeSelector";
import PrematchEventHeader from "./PrematchEventHeader";
import CustomBet from "../../../CustomBet/CustomBet";

const PrematchEventDetail = () => {
  // Receive params (eventId)
  const { eventId } = useParams();

  const matchId = eventId && !Number.isNaN(eventId) ? parseInt(eventId, 10) : null;

  const { t } = useTranslation();

  useGAPageView("Prematch Event Detail");

  const [activeTab, setActiveTab] = useState("ALL");
  const [cmsFilterOn, setCmsFilterOn] = useState(true);
  const [cmsFilterEnabled, setCmsFilterEnabled] = useState(true);

  const [listOfFavouriteMarkets, setListOfFavouriteMarkets] = useState([]);
  useEffect(() => {
    if (localStorage.getItem("favouriteMarketGroups")) {
      setListOfFavouriteMarkets(localStorage.getItem("favouriteMarketGroups").split(","));
    }
  }, []);

  const eventCouponData = useSelector((state) => state.coupon.couponData[`e${eventId}`]);
  const eventLoading = useSelector((state) => state.coupon.couponLoading[`e${eventId}`]);
  const cmsMarketFilterEventCouponData = useSelector((state) => state.coupon.couponData[`cms-e${eventId}`]);
  const cmsMarketFilterEventLoading = useSelector((state) => state.coupon.couponLoading[`cms-e${eventId}`]);
  const sports = useSelector((state) => state.sport.sports);

  const dispatch = useDispatch();

  const code = `e${eventId}`;
  useCouponData(dispatch, code, "ALL", true, null, false, false, false, false, null, true, null, null, false);
  useCouponData(dispatch, code, "ALL", true, null, false, false, false, false, null, true, null, null, true);

  useEffect(() => {
    // if we have no "filtered markets" - disable the flag right away...
    if (!cmsMarketFilterEventLoading && cmsMarketFilterEventCouponData && isEmpty(cmsMarketFilterEventCouponData)) {
      // bit tricky - make sure it's not loading, that we already have some data (not undefined), and that it happens to be empty
      setCmsFilterOn(false);
      setCmsFilterEnabled(false);
    }

    // in case of updates re-enabling or suspending
    if (!cmsMarketFilterEventLoading && cmsMarketFilterEventCouponData && isNotEmpty(cmsMarketFilterEventCouponData)) {
      // just to protect against updates where everything is suspended... check any valid market exists...
      const event = getEvent(cmsMarketFilterEventCouponData);
      const valid = event && event?.children && Object.values(event?.children).findIndex((x) => x.open) > -1;
      if (valid) {
        // if this is valid data - go ahead
        setCmsFilterEnabled(true);
      } else if (!valid) {
        // else, if just closed / suspended markets - hide!
        setCmsFilterOn(false);
        setCmsFilterEnabled(false);
      }
    }
  }, [cmsMarketFilterEventLoading, cmsMarketFilterEventCouponData]);

  const match = getEvent(cmsFilterOn ? cmsMarketFilterEventCouponData : eventCouponData);
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
  const otherMarketCount =
    allMarketCount -
    matchMarketCount -
    overUnderMarketCount -
    handicapMarketCount -
    oddEvenMarketCount -
    periodMarketCount;

  const sportCode = match?.code;

  return (
    <>
      {!match && ((!cmsFilterOn && eventLoading) || (cmsFilterOn && cmsMarketFilterEventLoading)) ? (
        <Spinner className={classes.loader} />
      ) : (
        <>
          <PagePath
            noBottomMargin
            paths={[
              {
                description: t("home_page"),
                target: "/",
              },
              {
                description: sports && sportCode ? sports[sportCode].description : "",
                target: `/sports/${sportCode}`,
              },
              {
                description: match?.path["League"],
                target:
                  sports && sportCode ? `/leagues/${sportCode}/${match.parent.substring(1, match.parent.length)}` : "",
              },
              {
                description: match?.desc,
              },
            ]}
          />

          <PrematchEventHeader
            a={match?.a}
            b={match?.b}
            code={match?.code}
            epoch={match?.epoch}
            league={match?.path["League"]}
          />

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
              setActiveTab={setActiveTab}
              setCmsFilterOn={setCmsFilterOn}
              sportCode={match?.code}
            />

            {activeTab === "CUSTOM_BET" && (
              <div className={classes["event-content__card"]}>
                <CustomBet feedcode={match.brMatchId} sportCode={match.code} />
              </div>
            )}

            {activeTab !== "CUSTOM_BET" && (
              <EventDetailMarkets
                brMatchId={match?.brMatchId}
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

export default PrematchEventDetail;
