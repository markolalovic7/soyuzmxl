import cx from "classnames";
import * as PropTypes from "prop-types";

import classes from "../../../scss/ezbet.module.scss";
import SportIcon from "../../SportIcon/SportIcon";

export default function CarouselSportCard({ onClick, sport, sportCode, sportCount }) {
  return (
    <div
      className={cx(classes["relative"], classes["sport-card"], {
        [classes["sport-card-active"]]: sportCode === sport.code,
      })}
      onClick={onClick}
    >
      <small className={classes["absolute"]}>{sportCount}</small>
      <div className={classes["sport"]}>
        <SportIcon code={sport.code} />
        <small>{sport.desc}</small>
      </div>
    </div>
  );
}

CarouselSportCard.propTypes = {
  onClick: PropTypes.func.isRequired,
  sport: PropTypes.object.isRequired,
  sportCode: PropTypes.string,
  sportCount: PropTypes.number.isRequired,
};

CarouselSportCard.defaultProps = { sportCode: undefined };
