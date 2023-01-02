import { useLiveData } from "applications/common/hooks/useLiveData";
import LiveCoupon from "applications/slimmobile/common/components/LiveCoupon";
import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const propTypes = {
  eventPathListFilter: PropTypes.array,
  sportFilter: PropTypes.string,
};

const defaultProps = {
  eventPathListFilter: null,
  sportFilter: null,
};

const LiveDashboard = ({ eventPathListFilter, sportFilter }) => {
  const dispatch = useDispatch();
  const europeanDashboardLiveData = useSelector((state) => state.live.liveData["european-dashboard"]);

  const [activeMatchId, setActiveMatchId] = useState(null); // expanded event, if any

  // Subscribe to the european dashboard live feed
  useLiveData(dispatch, "european-dashboard");

  // Subscribe to the the specific event live feed
  useLiveData(dispatch, activeMatchId ? `event-${activeMatchId}` : activeMatchId);

  const toggleSelectedMatchHandler = (matchId) => {
    const prevActiveMatchId = activeMatchId;

    if (prevActiveMatchId && prevActiveMatchId === matchId) {
      setActiveMatchId(null); // disable...
    } else {
      // enable new eventId
      // mark the event as active
      setActiveMatchId(matchId); // register this one as active, so the markets expand
    }
  };

  return (
    <LiveCoupon
      activeMatchId={activeMatchId}
      europeanDashboardLiveData={europeanDashboardLiveData}
      eventPathListFilter={eventPathListFilter}
      readyState={!!europeanDashboardLiveData}
      setActiveMatchId={toggleSelectedMatchHandler}
      sportFilter={sportFilter}
    />
  );
};

LiveDashboard.propTypes = propTypes;
LiveDashboard.defaultProps = defaultProps;

export default LiveDashboard;
