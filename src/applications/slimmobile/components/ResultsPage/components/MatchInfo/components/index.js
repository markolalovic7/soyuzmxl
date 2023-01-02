import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { openLinkInNewWindow } from "utils/misc";

import MatchExpandedInfo from "./MatchExpandedInfo";

const propTypes = {
  betradarStatsURL: PropTypes.string.isRequired,
  expandedDetails: PropTypes.array,
  id: PropTypes.number.isRequired,
  isDetailedLoading: PropTypes.bool.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  language: PropTypes.string.isRequired,
  onExpand: PropTypes.func.isRequired,
  periods: PropTypes.array,
  players: PropTypes.string.isRequired,
  result: PropTypes.string.isRequired,
  sportCode: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
};

const defaultProps = {
  expandedDetails: null,
  periods: null,
};

const MatchInfo = ({
  betradarStatsURL,
  expandedDetails,
  id,
  isDetailedLoading,
  isExpanded,
  language,
  onExpand,
  periods,
  players,
  result,
  sportCode,
  time,
}) => {
  const openStats = () => openLinkInNewWindow(`${betradarStatsURL}/${language}/match/${id}`);
  const expandedEventId = expandedDetails && expandedDetails[0]?.categories[0]?.tournaments[0]?.events[0].id;

  return (
    <div className={classes["result"]}>
      <div className={classes["result__body"]}>
        <div className={isExpanded ? `${classes["result__item"]} ${classes["active"]}` : classes["result__item"]}>
          <div className={classes["result__sublabel"]}>
            <span>
              <i className={cx(classes["qicon-default"], classes[`qicon-${sportCode.toLowerCase()}`])} />
            </span>
            {players}
          </div>
          <div className={classes["result__item-header"]}>
            <div className={classes["result__date"]}>{time}</div>
            <div className={classes["result__icons"]}>
              <div className={`${classes["result__icon"]} ${classes["live98-link"]} ${classes["active"]}`}>
                {result}
              </div>
              {betradarStatsURL && (
                <div className={classes["result__icon"]} onClick={openStats}>
                  <span className={classes["qicon-stats"]} />
                </div>
              )}
              <div
                className={`${classes["result__icon"]} ${classes["plus-button"]} ${classes["live98-link"]} ${
                  isExpanded ? classes["active"] : "none"
                }`}
                onClick={onExpand(id)}
              >
                {!isExpanded ? "+" : "-"}
              </div>
            </div>
          </div>
          <div className={classes["result__cards"]}>
            {periods?.map((period) => (
              <div
                className={`${classes["result__card"]} ${period.result === "WIN" ? classes["selected"] : ""}`}
                key={period.id}
              >
                <span>{period.label}</span>
              </div>
            ))}
          </div>
          {isExpanded && (
            <div className={classes["flags"]}>
              {expandedDetails && expandedEventId === id && !isDetailedLoading && (
                <MatchExpandedInfo expandedDetails={expandedDetails} />
              )}
              {isDetailedLoading && <div className={`${classes.loader} ${classes["loader-xs"]}`} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

MatchInfo.propTypes = propTypes;
MatchInfo.defaultProps = defaultProps;

export default React.memo(
  MatchInfo,
  (prevProps, nextProps) =>
    !(
      prevProps.isExpanded !== nextProps.isExpanded ||
      (nextProps.isExpanded && prevProps.isDetailedLoading !== nextProps.isDetailedLoading)
    ),
);
