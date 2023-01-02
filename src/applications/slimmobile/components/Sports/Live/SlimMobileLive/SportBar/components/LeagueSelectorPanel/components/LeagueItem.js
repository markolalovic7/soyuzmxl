import cx from "classnames";
import PropTypes from "prop-types";
import React from "react";

import classes from "../../../../../../../../scss/slimmobilestyle.module.scss";

const LeagueItem = ({
  firstLeagueCount,
  firstLeagueDesc,
  firstLeagueId,
  firstLeagueSportCode,
  onLeagueChange,
  secondLeagueCount,
  secondLeagueDesc,
  secondLeagueId,
  secondLeagueSportCode,
}) => (
  <div className={classes["overlay-league__row"]}>
    <div className={`${classes["overlay-league__item"]}`} onClick={() => onLeagueChange(firstLeagueId)}>
      <span className={cx(classes["qicon-default"], classes[`qicon-${firstLeagueSportCode}`])} />
      {firstLeagueDesc}
      <span className={classes["overlay-league__item__count"]}>{firstLeagueCount}</span>
    </div>
    {secondLeagueId ? (
      <div className={`${classes["overlay-league__item"]}`} onClick={() => onLeagueChange(secondLeagueId)}>
        <span className={cx(classes["qicon-default"], classes[`qicon-${secondLeagueSportCode}`])} />
        {secondLeagueDesc.desc}
        <span className={classes["overlay-league__item__count"]}>{secondLeagueCount}</span>
      </div>
    ) : null}
  </div>
);

const propTypes = {
  firstLeagueCount: PropTypes.number.isRequired,
  firstLeagueDesc: PropTypes.string.isRequired,
  firstLeagueId: PropTypes.number.isRequired,
  firstLeagueSportCode: PropTypes.string.isRequired,
  onLeagueChange: PropTypes.func.isRequired,
  secondLeagueCount: PropTypes.number.isRequired,
  secondLeagueDesc: PropTypes.string.isRequired,
  secondLeagueId: PropTypes.number.isRequired,
  secondLeagueSportCode: PropTypes.string.isRequired,
};
LeagueItem.propTypes = propTypes;

export default React.memo(LeagueItem);
