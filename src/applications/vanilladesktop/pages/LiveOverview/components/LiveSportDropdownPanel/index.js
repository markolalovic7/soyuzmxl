import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import LiveSportDropdownSubPanel from "../LiveSportDropdownSubPanel";

const propTypes = {
  autoExpanded: PropTypes.bool.isRequired,
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  matches: PropTypes.array.isRequired,
};
const defaultProps = {};

const LiveSportDropdownPanel = ({ autoExpanded, icon, label, matches, setActiveFeedCode }) => {
  const [isOpen, setIsOpen] = useState(autoExpanded);

  useEffect(() => {
    setIsOpen(autoExpanded);
  }, [autoExpanded]);

  const groupHash = {};
  matches.forEach((m) => {
    groupHash[m.epDesc] = groupHash[m.epDesc] ? [...groupHash[m.epDesc], m] : [m];
  });

  return (
    <div
      className={cx(
        classes["live-overview-spoiler"],
        classes["live-overview-spoiler_cric"],
        classes[`live-overview-spoiler_${icon}`],
      )}
    >
      <div
        className={cx(classes["live-overview-spoiler__content"], classes["spoiler"], { [classes["active"]]: isOpen })}
        onClick={() => setIsOpen((isOpen) => !isOpen)}
      >
        <span className={classes["live-overview-spoiler__icon"]}>
          <i className={cx(classes["qicon-default"], classes[`qicon-${icon}`])} />
        </span>
        <h3 className={classes["live-overview-spoiler__title"]}>{label}</h3>
        <span
          className={cx(classes["live-overview-spoiler__arrow"], classes["spoiler-arrow"], {
            [classes["active"]]: isOpen,
          })}
        />
      </div>
      <div
        className={cx(classes["live-overview-spoiler__body"], classes["spoiler"], {
          [classes["open"]]: isOpen,
        })}
      >
        {Object.entries(groupHash).map((entry) => {
          const label = entry[0];
          const matches = entry[1];

          return <LiveSportDropdownSubPanel key={label} label={label} matches={matches} />;
        })}
      </div>
    </div>
  );
};

LiveSportDropdownPanel.propTypes = propTypes;
LiveSportDropdownPanel.defaultProps = defaultProps;

export default React.memo(LiveSportDropdownPanel);
