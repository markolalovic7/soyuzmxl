import * as PropTypes from "prop-types";

import classes from "../../../../scss/vanilladesktop.module.scss";
import BetslipExclamationSVG from "../BetslipExclamationSVG";

const BetslipWarningNotification = ({ text }) => (
  <div className={`${classes["betslip__notification"]} ${classes["betslip__notification_changes"]}`}>
    <div className={classes["betslip__notification-top"]}>
      <BetslipExclamationSVG />
      {text}
    </div>
  </div>
);

BetslipWarningNotification.propTypes = {
  text: PropTypes.string.isRequired,
};

export default BetslipWarningNotification;
