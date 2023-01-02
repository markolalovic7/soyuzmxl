import PropTypes from "prop-types";
import { useState } from "react";

import ItemSportResultExpanded from "../../ItemSportResultExpanded";
import classes from "../styles/index.module.scss";

const defaultProps = {};

const propTypes = {
  date: PropTypes.string.isRequired,
  eventId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

const ItemSportResult = ({ date, eventId, title }) => {
  const [isExpanded, setExpanded] = useState(false);

  return (
    <>
      <div className={classes["item-sport-result-wrapper"]} type="button" onClick={() => setExpanded(!isExpanded)}>
        <span className={`${classes["icon-arrow"]} ${isExpanded ? classes["active"] : ""}`} />
        <div className={classes["item-sport-result-container"]}>
          <div className={classes["item-sport-result-title"]}>{title}</div>
          <div className={classes["item-sport-result-date"]}>{date}</div>
        </div>
      </div>
      {isExpanded && <ItemSportResultExpanded eventId={eventId} />}
    </>
  );
};

ItemSportResult.defaultProps = defaultProps;
ItemSportResult.propTypes = propTypes;

export default ItemSportResult;
