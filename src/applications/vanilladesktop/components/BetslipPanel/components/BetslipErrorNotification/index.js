import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as PropTypes from "prop-types";

import classes from "../../../../scss/vanilladesktop.module.scss";

const BetslipErrorNotification = ({ s, s1 }) => (
  <div className={classes["betslip__notification"]}>
    <div className={classes["betslip__notification-top"]}>
      <FontAwesomeIcon icon={faExclamationCircle} />
      {s}
    </div>
    <div className={classes["betslip__notification-bottom"]}>{s1}</div>
  </div>
);

BetslipErrorNotification.propTypes = {
  s: PropTypes.any,
  s1: PropTypes.any,
};

export default BetslipErrorNotification;
