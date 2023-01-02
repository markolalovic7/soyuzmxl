import cx from "classnames";
import groupBy from "lodash.groupby";
import isEmpty from "lodash.isempty";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router";

import { getAuthIsSplitModePreferred, getAuthLanguage } from "../../../../../../redux/reselect/auth-selector";
import { getCmsLayoutDesktopLiveWidgetScoreboardMatchTracker } from "../../../../../../redux/reselect/cms-layout-widgets";
import { getLiveEuropeanDashboardData } from "../../../../../../redux/reselect/live-selector";
import { getSportsSelector } from "../../../../../../redux/reselect/sport-selector";
import { useLiveData } from "../../../../../common/hooks/useLiveData";
import { getSortedLiveMatches } from "../../../../../vanillamobile/components/LivePage/utils";
import SportNavigationHeader from "../../../../components/SportNavigationHeader";
import classes from "../../../../scss/slimdesktop.module.scss";

import CompactLiveBody from "./components/CompactLiveBody";
import RegularLiveBody from "./components/RegularLiveBody";

const getFilteredMatches = (eventPathIds, data, sports) => {
  const filteredMatches = [];

  const sportFilters = sports
    ? Object.values(sports)
        ?.filter((s) => eventPathIds.includes(s.id))
        .map((x) => x.code)
    : undefined;

  Object.values(data).forEach((matches) => {
    Object.values(matches).forEach((m) => {
      if (sportFilters.includes(m.sport) || eventPathIds.includes(m.countryId) || eventPathIds.includes(m.leagueId)) {
        filteredMatches.push(m);
      }
    });
  });

  return filteredMatches;
};

const CentralColumn = () => {
  const isSplitModePreferred = useSelector(getAuthIsSplitModePreferred);

  const location = useLocation();
  const history = useHistory();

  const { eventId: eventIdStr, eventPathId: eventPathIdStr } = useParams();

  const eventId = eventIdStr ? Number(eventIdStr) : undefined;
  const eventPathIds = eventPathIdStr ? eventPathIdStr.split(",").map((x) => Number(x)) : undefined;

  const language = useSelector(getAuthLanguage);

  const matchTrackerWidget = useSelector((state) =>
    getCmsLayoutDesktopLiveWidgetScoreboardMatchTracker(state, location),
  );

  // Subscribe to the european dashboard live feed
  const dispatch = useDispatch();
  useLiveData(dispatch, "european-dashboard");

  // Subscribe to the the specific event live feed
  useLiveData(dispatch, eventId ? `event-${eventId}` : null);

  const liveDataEuropeanDashboard = useSelector(getLiveEuropeanDashboardData);

  const sports = useSelector(getSportsSelector);

  const onSelectMatchHandler = (eventPathId, eventId) => {
    if (eventId) {
      history.push(`/live/eventpath/${eventPathId}/event/${eventId}`);
    } else {
      history.push(`/live/eventpath/${eventPathId}`);
    }
  };

  const { matches, sportData } = useMemo(() => {
    if (!isEmpty(eventPathIds) && liveDataEuropeanDashboard) {
      const liveSports = Object.keys(liveDataEuropeanDashboard).filter(
        (sport) => !isEmpty(liveDataEuropeanDashboard[sport]),
      );
      if (liveSports.length > 0) {
        const matches = getSortedLiveMatches(getFilteredMatches(eventPathIds, liveDataEuropeanDashboard, sports));

        const sportDataGroup = groupBy(matches, (match) => match.sport);

        const sportData = {};
        Object.entries(sportDataGroup).forEach((entry) => {
          const matchesPerLeague = groupBy(entry[1], (match) => match.epDesc);
          sportData[entry[0]] = matchesPerLeague;
        });

        return { matches, sportData };
      }
    }

    return { matches: [], sportData: {} };
  }, [eventPathIds, liveDataEuropeanDashboard, sports]);

  useEffect(() => {
    if (isSplitModePreferred && !eventId && matches?.length > 0) {
      onSelectMatchHandler(Object.values(sports).find((s) => s.code === matches[0].sport).id, matches[0].eventId);
    }

    if (!isSplitModePreferred && !eventPathIds && matches?.length > 0) {
      onSelectMatchHandler(Object.values(sports).find((s) => s.code === matches[0].sport).id, undefined);
    }
  }, [eventId, matches, sports]);

  // Reference:  https://widgets.sir.sportradar.com/docs/Widgets.match.LMT.html.
  useEffect(() => {
    if (matchTrackerWidget?.data?.mode === "BETRADAR") {
      const clientId = matchTrackerWidget.data.betradarClientId;
      const script = document.createElement("script");
      script.innerHTML = `(function(a,b,c,d,e,f,g,h,i){a[e]||(i=a[e]=function(){(a[e].q=a[e].q||[]).push(arguments)},i.l=1*new Date,i.o=f,g=b.createElement(c),h=b.getElementsByTagName(c)[0],g.async=1,g.src=d,g.setAttribute("n",e),h.parentNode.insertBefore(g,h))})(window,document,"script", "https://widgets.sir.sportradar.com/${clientId}/widgetloader", "SIR", {
                              theme: false, // using custom theme
                              language: "${language}"
                          });`;
      // script.type = "application/javascript";
      // script.async = true;

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
        window.SIR = null; // for good measure
      };
    }

    return undefined;
  }, [matchTrackerWidget, language]);

  return (
    <div className={cx(classes["content__main"], { [classes["content__main_no-scroll"]]: isSplitModePreferred })}>
      <SportNavigationHeader />
      {isSplitModePreferred ? (
        <CompactLiveBody sportData={sportData} sports={sports} />
      ) : (
        <RegularLiveBody sportData={sportData} sports={sports} />
      )}
    </div>
  );
};

export default CentralColumn;
