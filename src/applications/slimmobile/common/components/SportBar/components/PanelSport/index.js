import cx from "classnames";
import PropTypes from "prop-types";
import { memo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getSportsTreeSelector } from "redux/reselect/sport-tree-selector";
import { getHrefPrematch } from "utils/route-href";

import classes from "../../styles/index.module.scss";

const propTypes = {
  backdropClick: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

const defaultProps = {
  open: false,
};

const PanelSport = ({ backdropClick, open }) => {
  const sportsTreeData = useSelector(getSportsTreeSelector);

  return (
    <div className={`${classes["overlay-sports"]} ${open ? classes["active"] : ""}`}>
      <div className={`${classes["overlay-sports__container"]} ${open ? classes["active"] : ""}`}>
        <div className={classes["panel-sport-sports-wrapper"]}>
          {sportsTreeData.map((sport) => (
            <Link
              className={classes["panel-sport-sports-item"]}
              key={sport.id}
              to={getHrefPrematch(`s${sport.code}`)}
              onClick={backdropClick}
            >
              <div
                className={cx(
                  classes["panel-sport-sports-item-sport"],
                  classes["qicon-default"],
                  classes[`qicon-${sport.code.toLowerCase()}`],
                )}
              />
              {sport.desc}
              <span className={classes["panel-sport-sports-item-count"]}>{sport.eventCount2}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

PanelSport.propTypes = propTypes;
PanelSport.defaultProps = defaultProps;

export default memo(PanelSport);
