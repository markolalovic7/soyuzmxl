import Spinner from "applications/common/components/Spinner";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getAuthTimezoneOffset } from "redux/reselect/auth-selector";

import { favouriteSelector } from "../../../../../../redux/reselect/live-selector";
import { getHighlightCode } from "../../../../../../utils/highlight-utils";
import { isNotEmpty } from "../../../../../../utils/lodash";
import { useCouponData } from "../../../../../common/hooks/useCouponData";
import { useLiveData } from "../../../../../common/hooks/useLiveData";
import classes from "../../../../scss/citywebstyle.module.scss";
import complexCouponSportCodes from "../../../Common/utils/complexCouponSportCodes";
import { addLiveContentBySport, addPrematchContentByLeague } from "../../../Common/utils/dataAggregatorUtils";

import HomepageSportsContentHolder from "./HomepageSportsContentHolder/HomepageSportsContentHolder";

const sortMixedPrematchAndLiveEventPaths = (a, b) => {
  if (Boolean(a.hasLive) !== Boolean(b.hasLive)) {
    return Boolean(b.hasLive) - Boolean(a.hasLive);
  }
  if (a.categoryPos !== b.categoryPos) {
    return a.pos - b.pos;
  }
  if (a.leaguePos !== b.leaguePos) {
    return a.pos - b.pos;
  }

  return `${a.categoryDescription} - ${a.tournamentDescription}`.localeCompare(
    `${b.categoryDescription} - ${b.tournamentDescription}`,
  );
};

const combineContent = (sport, activeCentralContentTab, prematchData, liveData) => {
  // Always add prematch first, and live on top

  const content = [];
  if (activeCentralContentTab === "TODAY") {
    addLiveContentBySport(content, liveData, sport);
    addPrematchContentByLeague(content, prematchData, sport);
  } else if (activeCentralContentTab === "UPCOMING" || activeCentralContentTab === "HIGHLIGHTS") {
    addPrematchContentByLeague(content, prematchData, sport);
  } else if (activeCentralContentTab === "INPLAY") {
    addLiveContentBySport(content, liveData, sport);
  }

  content.sort(sortMixedPrematchAndLiveEventPaths);

  return content;
};

const isCouponReadyToShow = (activeCentralContentTab, subscribed, prematchLoading, prematchCouponData) => {
  if (activeCentralContentTab === "TODAY") {
    if (subscribed && prematchCouponData) {
      return true;
    }
  } else if (activeCentralContentTab === "UPCOMING" || activeCentralContentTab === "HIGHLIGHTS") {
    if (prematchCouponData) {
      return true;
    }
  } else if (activeCentralContentTab === "INPLAY") {
    if (subscribed) {
      return true;
    }
  }

  return false;
};

const getFavouriteContent = (liveFavourites, combinedContent, favouriteFilter) => {
  if (!favouriteFilter && liveFavourites.length === 0) return combinedContent;
  if (favouriteFilter && liveFavourites.length === 0) return [];

  if (favouriteFilter) {
    const retainedContent = [];
    combinedContent.forEach((league) => {
      const qualifyingEvents = league.events.filter((m) => liveFavourites.includes(m.eventId));
      if (qualifyingEvents.length > 0) {
        retainedContent.push({ ...league, events: qualifyingEvents });
      }
    });

    return retainedContent;
  }
  const retainedContent = [];
  combinedContent.forEach((league) => {
    const qualifyingEvents = league.events.filter((m) => !liveFavourites.includes(m.eventId));
    if (qualifyingEvents.length > 0) {
      retainedContent.push({ ...league, events: qualifyingEvents });
    }
  });

  return retainedContent;
};

const HomepageSportsContent = ({
  activeCarouselSport,
  activeCentralContentTab,
  favouriteEnabled,
  overviewPageMode,
}) => {
  const { t } = useTranslation();
  const sports = useSelector((state) => state.sport.sports);
  const liveFavourites = useSelector(favouriteSelector);

  // Subscribe to live data...
  const dispatch = useDispatch();
  const europeanDashboardLiveData = useSelector((state) => state.live.liveData["european-dashboard"]);
  const timezoneOffset = useSelector(getAuthTimezoneOffset);

  // Subscribe to the european dashboard live feed
  useLiveData(dispatch, "european-dashboard");

  // Subscribe to prematch data...
  const cmsConfig = useSelector((state) => state.cms.config);
  const sportSearchCode = activeCarouselSport ? `s${activeCarouselSport.code}` : null;
  const highlightSearchCode = getHighlightCode(cmsConfig);

  // For highlights - use the CMS code, if any, or fallback to the whole sport (not to show an empty page). For other searches, we perform a wide out sport search.
  const code = activeCentralContentTab === "HIGHLIGHTS" ? highlightSearchCode || sportSearchCode : sportSearchCode;

  const prematchCouponData = useSelector((state) => state.coupon.couponData[code]);
  const prematchLoading = useSelector((state) => state.coupon.couponLoading[code]);

  // Load prematch data... if relevant...
  const prematchSearchCode = React.useMemo(() => {
    if (
      activeCarouselSport &&
      (activeCentralContentTab === "TODAY" ||
        activeCentralContentTab === "UPCOMING" ||
        activeCentralContentTab === "HIGHLIGHTS")
    ) {
      return code;
    }

    return null;
  }, [activeCarouselSport, activeCentralContentTab]);

  const endDate = React.useMemo(() => {
    if (activeCarouselSport && (activeCentralContentTab === "TODAY" || activeCentralContentTab === "UPCOMING")) {
      const offsetHours = timezoneOffset || (new Date().getTimezoneOffset() * -1) / 60;
      if (activeCentralContentTab === "TODAY") {
        return `${dayjs()
          .utcOffset(parseFloat(offsetHours))
          .set("hour", 23)
          .set("minute", 59)
          .set("second", 59)
          .set("millisecond", 999)
          .toDate()
          .toISOString()
          .slice(0, -1)}+00:00`;
      }
      if (activeCentralContentTab === "UPCOMING") {
        return `${dayjs()
          .utcOffset(parseFloat(offsetHours))
          .add(6, "hour")
          .set("minute", 59)
          .set("second", 59)
          .set("millisecond", 999)
          .toDate()
          .toISOString()
          .slice(0, -1)}+00:00`;
      }
    }

    return null;
  }, [activeCarouselSport, activeCentralContentTab]);

  useCouponData(
    dispatch,
    prematchSearchCode,
    "GAME",
    false,
    complexCouponSportCodes.includes(activeCarouselSport?.code)
      ? ["THREE_WAYS_MONEY_LINE", "TWO_WAYS_MONEY_LINE", "TWO_WAYS_TOTAL", "TWO_WAYS_SPREAD"]
      : null,
    false,
    false,
    true,
    false,
    null,
    true,
    null,
    endDate,
  );

  const combinedContent = useMemo(() => {
    const combinedContent = combineContent(
      activeCarouselSport?.code,
      activeCentralContentTab,
      prematchCouponData,
      europeanDashboardLiveData,
    );

    // VT - 18-Feb-2022 - Respect sorting in the CMS, where applicable
    if (activeCentralContentTab === "HIGHLIGHTS" && highlightSearchCode?.split(",")?.length > 1) {
      // Re-sort it all as per the CMS expectation...

      const intPrematchCodes = highlightSearchCode.split(",").map((x) => Number(x.trim().substr(1, x.length)));
      combinedContent.sort(
        (a, b) => intPrematchCodes.indexOf(a.tournamentId) - intPrematchCodes.indexOf(b.tournamentId),
      );
    }

    return combinedContent;
  }, [
    activeCarouselSport,
    activeCentralContentTab,
    highlightSearchCode,
    prematchCouponData,
    europeanDashboardLiveData,
  ]);

  const favouriteCombinedContent = favouriteEnabled ? getFavouriteContent(liveFavourites, combinedContent, true) : [];

  // From Jul 4 2021, do no filter favourites from the main table...
  // const regularCombinedContent = favouriteEnabled
  //   ? getFavouriteContent(liveFavourites, combinedContent, false)
  //   : combinedContent;

  const regularCombinedContent = combinedContent;

  const isReady = isCouponReadyToShow(
    activeCentralContentTab,
    europeanDashboardLiveData,
    prematchLoading,
    prematchCouponData,
  );

  return isReady ? (
    isNotEmpty(regularCombinedContent) ? (
      <>
        {favouriteEnabled && favouriteCombinedContent.length > 0 ? (
          <>
            <h3 className={classes["sports-title"]}>{t("favourites")}</h3>
            <HomepageSportsContentHolder
              favouriteEnabled={favouriteEnabled}
              leagues={favouriteCombinedContent}
              overviewPageMode={overviewPageMode}
            />
          </>
        ) : null}
        <h3 className={classes["sports-title"]}>
          {activeCarouselSport && sports
            ? `${sports[activeCarouselSport.code].description} (${activeCarouselSport.eventCount})`
            : ""}
        </h3>
        <HomepageSportsContentHolder
          favouriteEnabled={favouriteEnabled}
          leagues={regularCombinedContent}
          overviewPageMode={overviewPageMode}
        />
      </>
    ) : (
      <div style={{ textAlign: "center" }}>{t("no_events_found")}</div>
    )
  ) : (
    <div className={classes["homepage-spinner"]}>
      <Spinner className={classes.loader} />
    </div>
  );
};

const propTypes = {
  activeCarouselSport: PropTypes.object,
  activeCentralContentTab: PropTypes.string.isRequired,
  favouriteEnabled: PropTypes.bool,
  overviewPageMode: PropTypes.bool,
};
HomepageSportsContent.propTypes = propTypes;
HomepageSportsContent.defaultProps = { activeCarouselSport: null, favouriteEnabled: false, overviewPageMode: false };

export default React.memo(HomepageSportsContent);
