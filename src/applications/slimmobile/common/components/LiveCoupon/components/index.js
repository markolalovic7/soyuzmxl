import SectionLoader from "applications/slimmobile/common/components/SectionLoader";
import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import cx from "classnames";
import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { getCmsLayoutMobileSlimLiveWidgetMatchTracker } from "redux/reselect/cms-layout-widgets";

import { getAuthLanguage } from "../../../../../../redux/reselect/auth-selector";
import CentralCarousel from "../../CentralCarousel";
import CentralIFrame from "../../CentralIFrame";

import LiveCouponMatch from "./LiveCouponMatch";

const propTypes = {
  activeMatchId: PropTypes.string.isRequired,
  europeanDashboardLiveData: PropTypes.object.isRequired,
  eventPathListFilter: PropTypes.array.isRequired,
  readyState: PropTypes.bool.isRequired,
  setActiveMatchId: PropTypes.func.isRequired,
  sportFilter: PropTypes.string.isRequired,
};
const defaultProps = {};

function descComparator(a, b) {
  const descA = a.opADesc;
  const descB = b.opADesc;

  if (descA < descB) {
    return -1;
  }
  if (descA > descB) {
    return 1;
  }

  return 0;
}

function leagueComparator(a, b) {
  const descA = a.epDesc;
  const descB = b.epDesc;

  if (descA < descB) {
    return -1;
  }
  if (descA > descB) {
    return 1;
  }

  return descComparator(a, b); // sort under the same league
}

const LiveCoupon = ({
  activeMatchId,
  europeanDashboardLiveData,
  eventPathListFilter,
  readyState,
  setActiveMatchId,
  sportFilter,
}) => {
  const language = useSelector(getAuthLanguage);

  const matchTrackerWidget = useSelector(getCmsLayoutMobileSlimLiveWidgetMatchTracker);

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

  const changeSelectedMatchHandler = useCallback(
    (eventId) => {
      setActiveMatchId(eventId); // register this one as active, so the markets expand
    },
    [setActiveMatchId],
  );

  // Keep a noderef for css transitions
  const nodeRef = React.useRef(null);

  //
  // const clockComparator = ( a, b ) => {
  //
  //     const diffMins = a.cMin - b.cMin;
  //
  //     if(diffMins !== 0) {
  //         return diffMins;
  //     }
  //
  //     const diffSecs = a.cSec - b.cSec;
  //
  //     if(diffSecs !== 0) {
  //         return diffSecs;
  //     }
  //
  //     return descComparator(a, b);//sort under the same league and time
  // }

  return (
    <>
      {!readyState && <SectionLoader />}
      <main className={classes["main"]}>
        {!eventPathListFilter && (
          <>
            <CentralCarousel />
            <CentralIFrame />
          </>
        )}

        {!isEmpty(europeanDashboardLiveData) &&
          Object.entries(europeanDashboardLiveData).map((sportEntry) => {
            const sport = sportEntry[0];
            const sportMatches = sportEntry[1];

            if (sportFilter && sport !== sportFilter) {
              return null; // skip if filtered out by the sports panel selections
            }

            let previousEventPathDescription = null;

            const sortedMatches = Object.values(sportMatches).sort(leagueComparator);
            const filteredSortedMatches = eventPathListFilter
              ? sortedMatches.filter((match) => eventPathListFilter.includes(match.leagueId))
              : sortedMatches;

            return filteredSortedMatches.map((match) => {
              const eventPathDescription = match.epDesc;
              const showEventPathHeader = previousEventPathDescription !== eventPathDescription;
              previousEventPathDescription = eventPathDescription; // reset

              return (
                <CSSTransition
                  appear
                  in
                  classNames={{
                    appear: classes["react-css-animation-appear"],
                    appearActive: classes["react-css-animation-appear-active"],
                    enter: classes["react-css-animation-enter"],
                    enterActive: classes["react-css-animation-enter-active"],
                    exit: classes["react-css-animation-exit"],
                    exitActive: classes["react-css-animation-exit-active"],
                  }}
                  key={`animation-${match.eventId}`}
                  nodeRef={nodeRef}
                  timeout={1000}
                >
                  <React.Fragment key={match.eventId}>
                    {showEventPathHeader && (
                      <div className={classes["main__title"]}>
                        <i className={cx(classes["qicon-default"], classes[`qicon-${match.sport.toLowerCase()}`])} />
                        <h1>{match.epDesc}</h1>
                      </div>
                    )}
                    <LiveCouponMatch
                      activeMatchId={activeMatchId}
                      key={match.eventId}
                      match={match}
                      setActiveMatchId={changeSelectedMatchHandler}
                    />
                  </React.Fragment>
                </CSSTransition>
              );
            });
          })}
      </main>
    </>
  );
};

LiveCoupon.propTypes = propTypes;
LiveCoupon.defaultProps = defaultProps;

export default LiveCoupon;
