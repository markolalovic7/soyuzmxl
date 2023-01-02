import * as PropTypes from "prop-types";
import React, { useState } from "react";

import classes from "../../../../../../../scss/citymobile.module.scss";

import LeagueCouponContainer from "./LeagueCouponContainer";
import SportCouponHeader from "./SportCouponHeader";

const getEventCount = (combinedContent) => {
  let eventCount = 0;
  combinedContent.forEach((container) => {
    eventCount += container.events.length;
  });

  return eventCount;
};

const SportCouponContainer = ({
  combinedContent,
  groupModePreference,
  maxMatchesPerLeague,
  modeSwitchAllowed,
  onPreferenceModeSwitch,
  sportCode,
}) => {
  const [collapsedSections, setCollapsedSections] = useState([]);

  const sectionToggleCollapsibleHandler = (id) => {
    if (collapsedSections.includes(id)) {
      setCollapsedSections(collapsedSections.filter((sectionId) => id !== sectionId));
    } else {
      setCollapsedSections([...collapsedSections, id]);
    }
  };

  const eventCount = getEventCount(combinedContent);

  let liveOnly = true;
  combinedContent.forEach((l) => {
    l.events.forEach((e) => {
      if (!e.live) liveOnly = false;
    });
  });

  return (
    <div className={`${classes["spoilers-item"]} ${classes["active"]}`}>
      <SportCouponHeader
        eventCount={eventCount}
        modeSwitchAllowed={modeSwitchAllowed}
        sportCode={sportCode}
        onPreferenceModeSwitch={onPreferenceModeSwitch}
      />

      <div className={classes["sports-spoilers"]}>
        {combinedContent.map((league) => (
          <LeagueCouponContainer
            container={league}
            enabled={!collapsedSections.includes(league.time ? league.time : league.tournamentId)}
            groupModePreference={groupModePreference}
            key={league.time ? league.time : `${league.categoryDescription} - ${league.tournamentDescription}`}
            maxMatchesPerLeague={maxMatchesPerLeague}
            sportCode={sportCode}
            strictLive={liveOnly}
            onToggleSection={() => sectionToggleCollapsibleHandler(league.time ? league.time : league.tournamentId)}
          />
        ))}
      </div>
    </div>
  );
};

const propTypes = {
  combinedContent: PropTypes.array.isRequired,
  maxMatchesPerLeague: PropTypes.number,
  modeSwitchAllowed: PropTypes.bool.isRequired,
  onPreferenceModeSwitch: PropTypes.func.isRequired,
  sportCode: PropTypes.string,
};

const defaultProps = {
  maxMatchesPerLeague: undefined,
  sportCode: undefined,
};

SportCouponContainer.propTypes = propTypes;
SportCouponContainer.defaultProps = defaultProps;

export default React.memo(SportCouponContainer);
