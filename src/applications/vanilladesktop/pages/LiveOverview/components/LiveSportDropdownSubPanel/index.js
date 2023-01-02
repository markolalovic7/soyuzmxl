import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import React, { useState } from "react";

import MatchRow from "../MatchRow";

const LiveSportDropdownSubPanel = ({ label, matches }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={classes["live-overview-item"]}>
      <div
        className={cx(classes["live-overview-item__content"], classes["spoiler"])}
        onClick={() => setIsOpen((isOpen) => !isOpen)}
      >
        <h4 className={classes["live-overview-item__title"]}>{label}</h4>
        <span
          className={cx(classes["live-overview-item__arrow"], classes["spoiler-arrow"], {
            [classes["active"]]: isOpen,
          })}
        />
      </div>
      <div
        className={cx(classes["live-overview-item__body"], classes["spoiler"], {
          [classes["open"]]: isOpen,
        })}
      >
        {matches.map((match) => (
          <MatchRow key={match.eventId} match={match} />
        ))}
      </div>
    </div>
  );
};

LiveSportDropdownSubPanel.propTypes = {
  label: PropTypes.string.isRequired,
  matches: PropTypes.array.isRequired,
};
LiveSportDropdownSubPanel.defaultProps = {};

export default React.memo(LiveSportDropdownSubPanel);
