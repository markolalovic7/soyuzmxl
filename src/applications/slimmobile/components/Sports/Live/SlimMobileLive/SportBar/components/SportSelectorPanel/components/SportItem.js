import cx from "classnames";
import PropTypes from "prop-types";
import React from "react";

import classes from "../../../../../../../../scss/slimmobilestyle.module.scss";

const SportItem = ({ count, desc, iconSportCode, onLiveSportChange, sportCode }) => (
  <div
    className={`${classes["overlay-sports__item"]}`}
    id={`overlay-sports__item-${sportCode}`}
    key={`overlay-sports__item-${sportCode}`}
    onClick={() => onLiveSportChange(sportCode)}
  >
    <div
      className={cx(classes["overlay-sports__item_sport"], classes["qicon-default"], classes[`qicon-${iconSportCode}`])}
    />
    {desc}
    <span className={classes["overlay-sports__item__count"]}>{count}</span>
  </div>
);

const propTypes = {
  count: PropTypes.number.isRequired,
  desc: PropTypes.string.isRequired,
  iconSportCode: PropTypes.string.isRequired,
  onLiveSportChange: PropTypes.func.isRequired,
  sportCode: PropTypes.string.isRequired,
};

SportItem.propTypes = propTypes;

export default React.memo(SportItem);
