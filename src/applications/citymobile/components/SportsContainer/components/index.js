import Spinner from "applications/common/components/Spinner";
import dayjs from "dayjs";
import * as PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { getAuthTimezoneOffset } from "../../../../../redux/reselect/auth-selector";
import { makeGetLiveEuropeanDashboardData } from "../../../../../redux/reselect/live-selector";
import { gaEvent } from "../../../../../utils/google-analytics-utils";
import { getHighlightCode } from "../../../../../utils/highlight-utils";
import complexCouponSportCodes from "../../../../citydesktop/components/Common/utils/complexCouponSportCodes";
import {
  addLiveContentByEventPath,
  addLiveContentBySport,
  addPrematchContentByHour,
  addPrematchContentByLeague,
} from "../../../../citydesktop/components/Common/utils/dataAggregatorUtils";
import { useCouponData } from "../../../../common/hooks/useCouponData";
import { useLiveData } from "../../../../common/hooks/useLiveData";
import classes from "../../../scss/citymobile.module.scss";

import CouponContainer from "./CouponContainer";
import DateSelector from "./DateSelector";
import SportSelector from "./SportSelector";

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

const getDateFrom = (dateIndex, offsetHours) => {
  // date index => 0 for today, 1 for tomorrow, etc.
  if (dateIndex !== null && dateIndex !== undefined && offsetHours !== undefined) {
    if (dateIndex > 0 && dateIndex < 1) {
      // Hour fraction. Upcoming scenario, where we send 0.25 days (6 hours)
      return `${dayjs()
        .utcOffset(parseFloat(offsetHours))
        .add(0, "day")
        .set("hour", 0)
        .set("minute", 0)
        .set("second", 0)
        .set("millisecond", 0)
        .toDate()
        .toISOString()
        .slice(0, -1)}+00:00`;
    }
    // Whole number scenario (0,1,2...)
    return `${dayjs()
      .utcOffset(parseFloat(offsetHours))
      .add(dateIndex, "day")
      .set("hour", 0)
      .set("minute", 0)
      .set("second", 0)
      .set("millisecond", 0)
      .toDate()
      .toISOString()
      .slice(0, -1)}+00:00`;
  }

  return null;
};

const getDateTo = (highlightsOn, topLeagueOn, dateIndex, offsetHours) => {
  // date index => 0 for today, 1 for tomorrow, etc.
  if (!highlightsOn && !topLeagueOn && dateIndex !== null && dateIndex !== undefined && offsetHours !== undefined) {
    if (dateIndex < 1 && dateIndex > 0) {
      // Hour fraction. Upcoming scenario, where we send 0.25 days (6 hours)
      return `${dayjs()
        .utcOffset(parseFloat(offsetHours))
        .add(24 * dateIndex, "hour")
        .set("minute", 59)
        .set("second", 59)
        .set("millisecond", 999)
        .toDate()
        .toISOString()
        .slice(0, -1)}+00:00`;
    }
    // Whole number scenario (0,1,2...)
    return `${dayjs()
      .utcOffset(parseFloat(offsetHours))
      .add(dateIndex, "day")
      .set("hour", 23)
      .set("minute", 59)
      .set("second", 59)
      .set("millisecond", 999)
      .toDate()
      .toISOString()
      .slice(0, -1)}+00:00`;
  }

  return null;
};

const combineContent = (
  timezoneOffset,
  sport,
  eventPathId,
  prematchOn,
  liveOn,
  dateModeOn,
  groupModePreference,
  prematchData,
  liveData,
) => {
  // Always add live first, and prematch on top

  const content = [];

  if (liveOn) {
    if (eventPathId) {
      addLiveContentByEventPath(content, liveData, eventPathId);
    } else if (sport) {
      addLiveContentBySport(content, liveData, sport);
    }
  }

  if (prematchOn) {
    if (dateModeOn && groupModePreference === "TIME") {
      addPrematchContentByHour(content, prematchData, timezoneOffset);
      content.forEach((c, index) => {
        content[index] = { ...c, events: c.events.sort((a, b) => a.epoch - b.epoch) };
      });
    } else {
      addPrematchContentByLeague(content, prematchData, sport);
    }
  }

  content.sort(sortMixedPrematchAndLiveEventPaths);

  return content;
};

const getTopLeagueEventPathIds = (cmsConfig, sportsTreeData, sportCode) => {
  const viewLayouts = cmsConfig.layouts.DESKTOP_CITY_VIEW;
  if (viewLayouts && sportsTreeData) {
    const eventPathId = Object.values(sportsTreeData.ept).find((sport) => sport.code === sportCode).id;

    // find the top level prematch config.
    const targetLayout = viewLayouts.find(
      (layout) => layout.route === "PREMATCH_SPECIFIC_EVENT_PATH" && layout.eventPathIds.includes(eventPathId),
    );
    if (targetLayout) {
      const widget = targetLayout.widgets.find(
        (w) => w.section === "CENTER_NAVIGATION_COLUMN" && w.cmsWidgetType === "FEATURED_LEAGUES" && w.enabled === true,
      );

      if (widget) {
        return widget.data.featuredLeagues.filter((l) => l.sportCode === sportCode).map((l) => `p${l.eventPathId}`);
      }
    }
  }

  return null;
};

const getPrematchSdcCode = (cmsConfig, sportsTreeData, highlightsOn, topLeagueOn, sportCode, eventPathId) => {
  if (highlightsOn) {
    const highlightSearchCode = getHighlightCode(cmsConfig);

    return highlightSearchCode;
  }
  if (topLeagueOn) {
    const cmsLeagueIds = getTopLeagueEventPathIds(cmsConfig, sportsTreeData, sportCode);
    const topLeaguesCode = cmsLeagueIds ? cmsLeagueIds.join(",") : `s${sportCode}`;

    return topLeaguesCode;
  }
  if (eventPathId) {
    return `p${eventPathId}`;
  }
  if (sportCode) {
    return `s${sportCode}`;
  }

  return null;
};

/**
 *
 * @param prematchModeOn - whether we will load prematch data
 * @param liveModeOn - whether we will load live data
 * @param sportSelectorModeOn - whether we will show the sports selector (bar)
 * @param dateSelectorModeOn - whether we will show the date selector (bar)
 * @param sportFilter - whether we will filter the data for a specific sport code
 * @param eventPathFilter - whether we will filter the data for a specific event path (country and / or league)
 * @param prematchDateFrom - whether we will filter prematch data within a date range (FROM)
 * @param prematchDateTo - whether we will filter prematch data within a date range (TO)
 * @returns {JSX.Element}
 * @constructor
 */
const SportsContainer = ({
  dateSelectorModeOn,
  eventPathFilter,
  highlightsOn,
  liveModeOn,
  maxMatchesPerLeague,
  prematchDateFromIndex,
  prematchDateToIndex,
  prematchModeOn,
  sportFilter,
  sportSelectorModeOn,
  topLeagueOn,
}) => {
  // Find out if we have any timezone defined for this operation, otherwise use the browser timezone offset
  const timezoneOffset = useSelector(getAuthTimezoneOffset);
  const offsetHours = timezoneOffset || (new Date().getTimezoneOffset() * -1) / 60;

  const { sportCode: querySportCode } = useParams(); // undefined, in general
  const [selectedSport, setSelectedSport] = useState(null); // State for the sport selector, if enabled
  const [activeDateIndex, setActiveDateIndex] = useState(null); // State for the date selector if enabled
  const [groupModePreference, setGroupModePreference] = useState("TIME"); // DATE, TOURNAMENT - only used if date selector is enabled and there is a choice to make

  const dispatch = useDispatch();

  useEffect(() => {
    if (querySportCode) {
      setSelectedSport(querySportCode);
    }
  }, [querySportCode]);

  const onSelectSportHandler = (newActiveSport) => {
    setSelectedSport(newActiveSport);
    gaEvent("Sport Change", "sport_change", newActiveSport, undefined, true); // Home or live page change active sport
  };

  // Obtain prematch and live data...

  // ********** LIVE DATA ********** //
  // Memoize selector to get correct data.
  const getLiveEuropeanDashboardData = useMemo(() => makeGetLiveEuropeanDashboardData(), []);
  const liveEuropeanData = useSelector((state) =>
    getLiveEuropeanDashboardData(state, {
      eventPathIds: eventPathFilter ? [eventPathFilter] : [],
      sportCode: sportFilter || selectedSport,
    }),
  );

  // Subscribe to the european dashboard live feed
  useLiveData(dispatch, liveModeOn ? "european-dashboard" : undefined);

  // ************ END LIVE DATA ************** //

  // ************ PREMATCH DATA ************** //
  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData);

  const cmsConfig = useSelector((state) => state.cms.config);
  const prematchSdcCode =
    prematchModeOn && (!dateSelectorModeOn || (activeDateIndex != null && activeDateIndex !== undefined))
      ? getPrematchSdcCode(
          cmsConfig,
          sportsTreeData,
          highlightsOn,
          topLeagueOn,
          sportFilter || selectedSport,
          eventPathFilter,
        )
      : null;

  const prematchCouponData = useSelector((state) => state.coupon.couponData[prematchSdcCode]);

  // ************ END PREMATCH DATA ************** //

  useCouponData(
    dispatch,
    prematchSdcCode,
    topLeagueOn && false ? "ALL" : "GAME", // we used to show ALL for top league - changed for SUP-2563, and leaving historical code behind for traceability
    false,
    complexCouponSportCodes.includes(sportFilter || selectedSport)
      ? ["THREE_WAYS_MONEY_LINE", "TWO_WAYS_MONEY_LINE", "TWO_WAYS_TOTAL", "TWO_WAYS_SPREAD"]
      : null,
    false,
    false,
    true,
    false,
    null,
    true,
    getDateFrom(activeDateIndex, offsetHours),
    getDateTo(
      highlightsOn,
      topLeagueOn,
      prematchDateToIndex !== null && prematchDateToIndex !== undefined ? prematchDateToIndex : activeDateIndex,
      offsetHours,
    ),
  );

  const combinedContent = useMemo(() => {
    const combinedContent = combineContent(
      timezoneOffset,
      sportFilter || selectedSport,
      eventPathFilter,
      prematchModeOn,
      liveModeOn,
      dateSelectorModeOn,
      groupModePreference,
      prematchCouponData,
      liveEuropeanData,
    );

    // VT - 18-Feb-2022 - Respect sorting in the CMS, where applicable
    if ((highlightsOn || topLeagueOn) && prematchSdcCode?.split(",")?.length > 1) {
      // Re-sort it all as per the CMS expectation...

      const intPrematchCodes = prematchSdcCode.split(",").map((x) => Number(x.trim().substr(1, x.length)));
      combinedContent.sort(
        (a, b) => intPrematchCodes.indexOf(a.tournamentId) - intPrematchCodes.indexOf(b.tournamentId),
      );
      console.log(combinedContent);
    }

    return combinedContent;
  }, [
    timezoneOffset,
    sportFilter,
    selectedSport,
    eventPathFilter,
    highlightsOn,
    topLeagueOn,
    prematchModeOn,
    prematchSdcCode,
    liveModeOn,
    dateSelectorModeOn,
    groupModePreference,
    prematchCouponData,
    liveEuropeanData,
  ]);

  const isReady = useMemo(
    () =>
      (!prematchModeOn || (prematchModeOn && prematchCouponData)) && (!liveModeOn || (liveModeOn && liveEuropeanData)),
    [prematchModeOn, prematchCouponData, liveModeOn, liveEuropeanData],
  );

  const onPreferenceModeSwitch = () => {
    if (groupModePreference === "TIME") {
      setGroupModePreference("TOURNAMENT");
    } else {
      setGroupModePreference("TIME");
    }
  };

  return (
    <div className={`${classes["sports-container"]} ${classes["is-active"]}`}>
      {sportSelectorModeOn ? (
        <SportSelector
          activeSport={selectedSport}
          dateToIndex={prematchDateToIndex}
          highlightsOn={highlightsOn}
          liveOn={liveModeOn}
          prematchOn={prematchModeOn}
          setActiveSport={onSelectSportHandler}
        />
      ) : null}

      {dateSelectorModeOn ? (
        <DateSelector
          activeDateIndex={activeDateIndex}
          setActiveDateIndex={setActiveDateIndex}
          sportCode={sportFilter || selectedSport}
        />
      ) : null}

      {!isReady ? (
        <Spinner className={classes.loader} />
      ) : (
        <CouponContainer
          combinedContent={combinedContent}
          groupModePreference={dateSelectorModeOn && groupModePreference}
          maxMatchesPerLeague={maxMatchesPerLeague}
          modeSwitchAllowed={dateSelectorModeOn}
          sportCode={sportFilter || selectedSport}
          onPreferenceModeSwitch={onPreferenceModeSwitch}
        />
      )}
    </div>
  );
};

const propTypes = {
  dateSelectorModeOn: PropTypes.bool,
  eventPathFilter: PropTypes.number,
  highlightsOn: PropTypes.bool,
  liveModeOn: PropTypes.bool.isRequired,
  maxMatchesPerLeague: PropTypes.number,
  prematchDateFromIndex: PropTypes.number,
  prematchDateToIndex: PropTypes.number,
  prematchModeOn: PropTypes.bool.isRequired,
  sportFilter: PropTypes.string,
  sportSelectorModeOn: PropTypes.bool,
  topLeagueOn: PropTypes.bool,
};

const defaultProps = {
  dateSelectorModeOn: false,
  eventPathFilter: undefined,
  highlightsOn: false,
  maxMatchesPerLeague: undefined,
  prematchDateFromIndex: undefined,
  prematchDateToIndex: undefined,
  sportFilter: undefined,
  sportSelectorModeOn: false,
  topLeagueOn: undefined,
};

SportsContainer.propTypes = propTypes;
SportsContainer.defaultProps = defaultProps;

export default SportsContainer;
