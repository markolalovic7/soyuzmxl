import cx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { favouriteSelector } from "../../../../../../../../redux/reselect/live-selector";
import { toggleLiveFavourite } from "../../../../../../../../redux/slices/liveSlice";
import classes from "../../../../../../scss/citywebstyle.module.scss";

const MatchActionIconContentHolder = ({ count, displayedMarketCount, eventId, favouriteEnabled, live }) => {
  const dispatch = useDispatch();

  const history = useHistory();

  const liveFavourites = useSelector(favouriteSelector);

  const onClickEventDetail = (eventId, live) => {
    if (live) {
      history.push(`/events/live/${eventId}`); // navigate to the new route...
    } else {
      history.push(`/events/prematch/${eventId}`); // navigate to the new route...
    }
  };

  return (
    <div className={classes["sports-spoiler__details"]}>
      {favouriteEnabled ? (
        <div className={classes["sports-spoiler__icons"]}>
          <span
            className={cx(classes["sports-spoiler__details-star"], {
              [classes["sports-spoiler__details-star_special"]]: liveFavourites.includes(eventId),
            })}
            onClick={() => dispatch(toggleLiveFavourite({ eventId }))}
          >
            <svg fill="none" height="12" viewBox="0 0 16 14" width="12" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.01123 0L9.69509 5.18237H15.1442L10.7358 8.38525L12.4196 13.5676L8.01123 10.3647L3.60284 13.5676L5.2867 8.38525L0.878306 5.18237H6.32738L8.01123 0Z" />
            </svg>
          </span>
          <div className={classes["sports-spoiler__number-box"]} onClick={() => onClickEventDetail(eventId, live)}>
            <span className={classes["sports-spoiler__numbers"]}>{count > 0 ? count - displayedMarketCount : 0}</span>
            <div className={classes["sports-spoiler__arrow"]} />
          </div>
        </div>
      ) : (
        <div className={classes["sports-spoiler__details"]} onClick={() => onClickEventDetail(eventId, live)}>
          <span className={classes["sports-spoiler__numbers"]}>{count > 0 ? count - displayedMarketCount : 0}</span>
          <div className={classes["sports-spoiler__arrow"]} />
        </div>
      )}
    </div>
  );
};

const propTypes = {
  count: PropTypes.number.isRequired,
  displayedMarketCount: PropTypes.number.isRequired,
  eventId: PropTypes.number.isRequired,
  favouriteEnabled: PropTypes.bool,
  live: PropTypes.bool.isRequired,
};

const defaultProps = {
  favouriteEnabled: undefined,
};

MatchActionIconContentHolder.propTypes = propTypes;
MatchActionIconContentHolder.defaultProps = defaultProps;

export default React.memo(MatchActionIconContentHolder);
