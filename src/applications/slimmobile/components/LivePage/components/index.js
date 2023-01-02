import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import { useState } from "react";

import SportBar from "../../Sports/Live/SlimMobileLive/SportBar";

import LiveDashboard from "./LiveDashboard";

const propTypes = {};

const defaultProps = {};

const LivePage = () => {
  const [sportFilter, setSportFilter] = useState(null);
  const [eventPathListFilter, setEventPathListFilter] = useState(null);

  const liveSportSelectorHandler = (filter) => {
    if (filter === "ALL") {
      if (sportFilter !== null) window.scrollTo(0, 0);
      setSportFilter(null);
    } else {
      if (sportFilter !== filter) window.scrollTo(0, 0);
      setSportFilter(filter);
      setEventPathListFilter(null);
    }
  };

  const liveLeagueSelectorHandler = (eventPathId) => {
    if (eventPathId) {
      if (eventPathListFilter !== [eventPathId]) window.scrollTo(0, 0);
      setEventPathListFilter([eventPathId]);
      setSportFilter(null);
    } else {
      if (eventPathListFilter !== null) window.scrollTo(0, 0);
      setEventPathListFilter(null);
    }
  };

  return (
    <>
      <SportBar
        liveLeagueSelectorHandler={liveLeagueSelectorHandler}
        liveSportSelectorHandler={liveSportSelectorHandler}
      />
      <div className={classes["result"]}>
        <LiveDashboard eventPathListFilter={eventPathListFilter} sportFilter={sportFilter} />
      </div>
    </>
  );
};

LivePage.propTypes = propTypes;
LivePage.defaultProps = defaultProps;

export default LivePage;
