import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
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

const CalendarRow = ({ date, description, eventCode, eventDescription, eventId, tournament, tournamentId }) => (
  <Link className={classes["calendar__elements"]} to={getHrefPrematchEvent(`p${tournamentId}`, eventId)}>
    <li className={classes["calendar__element"]}>
      <span className={classes[eventCode]} />
      <span className={classes["calendar__element_span"]}>{eventDescription}</span>
    </li>
    <li className={classes["calendar__element"]}>{tournament}</li>
    <li className={`${classes["calendar__element"]} ${classes["calendar__element_date"]}`}>{date}</li>
    <li className={classes["calendar__element"]}>{description}</li>
  </Link>
);

CalendarRow.propTypes = propTypes;
CalendarRow.defaultProps = defaultProps;

export default CalendarRow;
