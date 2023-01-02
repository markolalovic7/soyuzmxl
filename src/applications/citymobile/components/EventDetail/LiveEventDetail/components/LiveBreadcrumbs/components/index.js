import BreadcrumbWhiteSVG from "applications/citymobile/img/icons/breadcrumb-white.svg";
import classes from "applications/citymobile/scss/citymobile.module.scss";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import BreadcrumbMatch from "./BreadcrumbMatch/components/BreadcrumbMatch";

const LiveBreadcrumbs = ({ activeMatchId }) => {
  const matchesWrapperRef = useRef();
  const europeanDashboardLiveData = useSelector((state) => state.live.liveData["european-dashboard"]);

  const matches = europeanDashboardLiveData
    ? Object.entries(europeanDashboardLiveData)
        .map((sportEntry) => Object.values(sportEntry[1]))
        .flat()
    : [];

  matches.sort((a, b) => {
    if (a.eventId === activeMatchId) {
      return -1;
    }
    if (b.eventId === activeMatchId) {
      return 1;
    }

    return a.opADesc.localeCompare(b.opADesc);
  });

  useEffect(() => {
    matchesWrapperRef.current.scrollTo({
      behavior: "smooth",
      left: 0,
    });
  }, [activeMatchId]);

  const history = useHistory();

  return (
    // ${classes["breadcrumbs__no_bottom_margin"]}
    <div className={`${classes["breadcrumbs"]} ${classes["breadcrumbs_alternative"]} `} style={{ marginBottom: 0 }}>
      <div className={classes["breadcrumbs__return"]} onClick={() => history.goBack()}>
        <img alt="arrow" src={BreadcrumbWhiteSVG} />
      </div>
      <div className={classes["breadcrumbs__events"]} ref={matchesWrapperRef}>
        {matches.map((match) => (
          <BreadcrumbMatch
            a={match.opADesc}
            aScore={match.aScore}
            activeMatchId={activeMatchId}
            b={match.opBDesc}
            cPeriod={match.cPeriod}
            hScore={match.hScore}
            key={match.eventId}
            matchId={match.eventId}
            min={match.cMin}
            sec={match.cSec}
            sportCode={match.sport}
          />
        ))}
      </div>
    </div>
  );
};

const propTypes = {
  activeMatchId: PropTypes.number.isRequired,
};

const defaultProps = {};

LiveBreadcrumbs.propTypes = propTypes;
LiveBreadcrumbs.defaultProps = defaultProps;

export default LiveBreadcrumbs;
