import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getHrefPrematchEvent } from "utils/route-href";

const propTypes = {
  date: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  eventCode: PropTypes.string.isRequired,
  eventDescription: PropTypes.string.isRequired,
  eventId: PropTypes.string.isRequired,
  tournament: PropTypes.string.isRequired,
  tournamentId: PropTypes.number.isRequired,
};

const defaultProps = {};

const LiveCalendarMatch = ({ date, description, eventCode, eventDescription, eventId, tournament, tournamentId }) => (
  <Link className={classes["live-calendar-sport"]} to={getHrefPrematchEvent(tournamentId, eventId)}>
    <div className={classes["live-calendar-sport__top"]}>
      <span className={classes["live-calendar-sport__icon"]}>
        <i className={classes[eventCode]} />
      </span>
      <span className={classes["live-calendar-sport__name"]}>{eventDescription}</span>
      <span className={classes["live-calendar-sport__liga"]}>{tournament}</span>
    </div>
    <div className={classes["live-calendar-sport__body"]}>
      <span className={classes["live-calendar-sport__team"]}>{description}</span>
      <span className={classes["live-calendar-sport__date"]}>{date}</span>
    </div>
  </Link>
);

LiveCalendarMatch.propTypes = propTypes;
LiveCalendarMatch.defaultProps = defaultProps;

export default LiveCalendarMatch;
