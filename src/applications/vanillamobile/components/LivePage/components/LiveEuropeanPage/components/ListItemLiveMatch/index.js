import cx from "classnames";
import PropTypes from "prop-types";
import { useState } from "react";

import { getSortedLiveMatches } from "../../../../utils";
import classes from "../../styles/index.module.scss";

import LiveEuropeanMatch from "applications/vanillamobile/common/components/LiveEuropeanMatch";

const propTypes = {
  isDefaultExpanded: PropTypes.bool.isRequired,
  matches: PropTypes.array.isRequired,
  sportCode: PropTypes.string.isRequired,
  sportsDescription: PropTypes.string,
};
const defaultProps = {
  sportsDescription: undefined,
};

const ListItemLiveMatch = ({ isDefaultExpanded, matches, sportCode, sportsDescription }) => {
  const [isExpanded, setIsExpanded] = useState(isDefaultExpanded);

  return (
    <>
      <div
        className={`${classes["sport-spoiler"]} ${classes["sport-spoiler_live"]} ${
          classes[`sport-spoiler_${sportCode}`]
        } ${classes["spoiler-list"]} ${isExpanded ? classes["active"] : ""}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className={classes["sport-spoiler__color"]} />
        <span className={classes["sport-spoiler__icon"]}>
          <i className={cx(classes["qicon-default"], classes[`qicon-${sportCode}`])} />
        </span>
        {sportsDescription && <div className={classes["sport-spoiler__text"]}>{sportsDescription}</div>}
        <span
          className={`${classes["sport-spoiler__arrow"]} ${classes["spoiler-arrow"]}
          ${isExpanded ? classes["active"] : ""}`}
        />
      </div>
      {isExpanded && (
        <div className={classes["expanded-wrapper"]}>
          <div className={classes["bets"]}>
            <div className={classes["bets__container"]}>
              {getSortedLiveMatches(matches).map((match) => (
                <LiveEuropeanMatch key={match.eventId} {...match} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ListItemLiveMatch.propTypes = propTypes;
ListItemLiveMatch.defaultProps = defaultProps;

export default ListItemLiveMatch;
