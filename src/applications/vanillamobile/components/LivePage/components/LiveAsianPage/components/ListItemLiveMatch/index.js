import cx from "classnames";
import PropTypes from "prop-types";
import { useState } from "react";
import { useHistory } from "react-router-dom";

import { isNotEmpty } from "../../../../../../../../utils/lodash";
import { getHrefLiveEventDetail } from "../../../../../../../../utils/route-href";
import AsianMatchContainer from "../../../../../../common/components/AsianMatchContainer";
import { getSortedLiveMatches } from "../../../../utils";
import classes from "../../styles/index.module.scss";

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
  const history = useHistory();
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
                <>
                  <div className={classes["bets__title"]}>{match.epDesc}</div>
                  <AsianMatchContainer
                    live
                    additionalMarketsExpanded={false}
                    event={match}
                    key={match.eventId}
                    markets={
                      isNotEmpty(match.marketViews) && match.marketViews["DEFAULT"] ? match.marketViews["DEFAULT"] : []
                    }
                    onToggleActiveEvent={() => history.push(getHrefLiveEventDetail(match.eventId))}
                  />
                </>
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
