import PropTypes from "prop-types";
import React from "react";
import { useHistory } from "react-router";

import classes from "../../../../../../../../scss/citymobile.module.scss";

const padToTwo = (number) => (number <= 9 ? `0${number}`.slice(-2) : number);

const BreadcrumbMatch = ({ a, aScore, activeMatchId, b, cPeriod, hScore, matchId, min, sec, sportCode }) => {
  const history = useHistory();

  return (
    <div
      className={`${classes["breadcrumbs__event"]} ${activeMatchId === matchId ? classes["selected"] : ""}`}
      onClick={() => history.push(`/events/live/${matchId}`)}
    >
      <div className={classes["breadcrumbs__match"]}>
        <div className={classes["breadcrumbs__team"]}>{a}</div>
        <div className={classes["breadcrumbs__score"]}>{hScore && aScore ? `${hScore} - ${aScore}` : ""}</div>
      </div>
      <div className={classes["breadcrumbs__match"]}>
        <div className={classes["breadcrumbs__team"]}>{b}</div>
        <div className={classes["breadcrumbs__half"]}>{`${cPeriod} ${padToTwo(min)}:${padToTwo(sec)}`}</div>
      </div>
    </div>
  );
};

const propTypes = {
  a: PropTypes.string.isRequired,
  aScore: PropTypes.string,
  activeMatchId: PropTypes.number.isRequired,
  b: PropTypes.string.isRequired,
  cPeriod: PropTypes.string.isRequired,
  hScore: PropTypes.string,
  matchId: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  sec: PropTypes.number.isRequired,
  sportCode: PropTypes.string.isRequired,
};

const defaultProps = {
  aScore: undefined,
  hScore: undefined,
};

BreadcrumbMatch.propTypes = propTypes;
BreadcrumbMatch.defaultProps = defaultProps;

export default React.memo(BreadcrumbMatch);
