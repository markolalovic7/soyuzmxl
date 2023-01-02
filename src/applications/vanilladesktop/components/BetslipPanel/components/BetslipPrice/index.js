import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import PropTypes from "prop-types";
import { AnimateKeyframes } from "react-simple-animate";

const propTypes = {
  dir: PropTypes.string,
  formattedPrice: PropTypes.string.isRequired,
};

const defaultProps = {
  dir: undefined,
};

const BetslipPrice = ({ dir, formattedPrice }) =>
  dir ? (
    <AnimateKeyframes play duration="0.5" iterationCount="4" keyframes={["opacity: 0", "opacity: 1"]}>
      <span className={classes["betslip__card-coeficient"]} style={{ background: dir === "u" ? "green" : "red" }}>
        <span>{formattedPrice}</span>
      </span>
    </AnimateKeyframes>
  ) : (
    <span className={classes["betslip__card-coeficient"]}>
      <span>{formattedPrice}</span>
    </span>
  );

BetslipPrice.propTypes = propTypes;
BetslipPrice.defaultProps = defaultProps;

export default BetslipPrice;
