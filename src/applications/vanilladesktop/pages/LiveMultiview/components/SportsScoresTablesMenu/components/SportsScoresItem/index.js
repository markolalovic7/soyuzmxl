import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import React, { useState } from "react";

import SportsScoresTable from "../SportsScoresTable";

const propTypes = {
  autoExpanded: PropTypes.bool.isRequired,
  counter: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  matches: PropTypes.array.isRequired,
  onAddToMultiView: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
};

const SportsScoresItem = ({ autoExpanded, counter, icon, label, matches, onAddToMultiView, onDragStart }) => {
  const [isOpen, setIsOpen] = useState(autoExpanded);

  const groupHash = {};
  matches.forEach((m) => {
    groupHash[m.epDesc] = groupHash[m.epDesc] ? [...groupHash[m.epDesc], m] : [m];
  });

  return (
    <li className={classes["menu-sports__item"]}>
      <div
        className={cx(classes["menu-sports__item-content"], classes["accordion"], {
          [classes["active"]]: false,
        })}
        onClick={() => setIsOpen((isOpen) => !isOpen)}
      >
        <span className={classes["menu-sports__item-icon"]}>
          <span className={classes[`qicon-${icon}`]} />
        </span>

        <h4 className={classes["menu-sports__item-title"]}>{label}</h4>
        <span className={classes["menu-sports__item-numbers"]}>{counter}</span>
        <span
          className={cx(classes["menu-sports__item-arrow"], classes["accordion-arrow"], {
            [classes["active"]]: isOpen,
          })}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((isOpen) => !isOpen);
          }}
        />
      </div>

      <ul className={classes["menu-sports__sublist"]}>
        <li className={classes["menu-sports__subitem"]}>
          <div
            className={cx(classes["menu-sports__subitem-content"], classes["accordion"], {
              [classes["open"]]: isOpen,
            })}
          >
            {Object.entries(groupHash).map((entry) => {
              const label = entry[0];
              const matches = entry[1];

              return matches.map((match, index) => {
                const hScores = match.hScore
                  ? [...match.pScores.map((periodScore) => periodScore.hScore), match.hScore]
                  : ["0"];
                const aScores = match.aScore
                  ? [...match.pScores.map((periodScore) => periodScore.aScore), match.aScore]
                  : ["0"];

                const teams = [
                  { active: match.activeOp === "a", icon, label: match.opADesc, results: hScores },
                  { active: match.activeOp === "b", icon, label: match.opBDesc, results: aScores },
                ];

                return (
                  <SportsScoresTable
                    cMin={match.cMin}
                    cPeriod={match.cPeriod}
                    cSec={match.cSec}
                    cStatus={match.cStatus}
                    cType={match.cType}
                    eventId={match.eventId}
                    isPaused={match.cStatus !== "STARTED"}
                    key={match.eventId}
                    label={!index ? label : ""}
                    teams={teams}
                    onAddToMultiView={onAddToMultiView}
                    onDragStart={onDragStart}
                  />
                );
              });
            })}
          </div>
        </li>
      </ul>
    </li>
  );
};

SportsScoresItem.propTypes = propTypes;

export default React.memo(SportsScoresItem);
