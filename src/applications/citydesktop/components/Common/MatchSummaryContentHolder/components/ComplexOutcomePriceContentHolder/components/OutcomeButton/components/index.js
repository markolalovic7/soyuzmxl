import PropTypes from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { AnimateKeyframes } from "react-simple-animate";

import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../../../../../../utils/betslip-utils";
import classes from "../../../../../../../../scss/citywebstyle.module.scss";

const OutcomeButton = ({ betslipOutcomeIds, eventId, label, outcome, price, spread }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const toggleBetslipHandler = (outcomeId, eventId) => {
    if (outcomeId) {
      onToggleSelection(dispatch, location.pathname, outcomeId, eventId, true);

      onRefreshBetslipHandler(dispatch, location.pathname, true);
    }
  };

  return (
    <div
      className={`${classes["sports-spoiler__factor"]} ${!outcome ? classes["sports-spoiler__factor_disabled"] : ""} ${
        betslipOutcomeIds.includes(parseInt(outcome?.outcomeId, 10)) ? classes["sports-spoiler__factor_active"] : ""
      }`}
      onClick={() => toggleBetslipHandler(outcome?.outcomeId, eventId)}
    >
      <div className={classes["sports-spoiler__factor-texts"]}>
        {label ? (
          <span className={classes["sports-spoiler__factor-text"]} style={{ fontWeight: 500 }}>
            {outcome ? label : ""}
          </span>
        ) : null}
        {spread ? (
          <span className={classes["sports-spoiler__factor-text"]} style={{ fontWeight: 500 }}>
            {spread}
          </span>
        ) : null}
        <span>{price}</span>
      </div>

      {outcome?.priceDir === "d" ? (
        <AnimateKeyframes play duration="0.5" iterationCount="2" keyframes={["opacity: 0", "opacity: 1"]}>
          <span className={classes["sports-spoiler__triangle-red"]} />
        </AnimateKeyframes>
      ) : null}

      {outcome?.priceDir === "u" ? (
        <AnimateKeyframes play duration="0.5" iterationCount="2" keyframes={["opacity: 0", "opacity: 1"]}>
          <span className={classes["sports-spoiler__triangle-green"]} />
        </AnimateKeyframes>
      ) : null}
    </div>
  );
};

OutcomeButton.propTypes = {
  betslipOutcomeIds: PropTypes.array,
  eventId: PropTypes.number,
  label: PropTypes.string,
  outcome: PropTypes.object,
  price: PropTypes.string,
  spread: PropTypes.string,
};

export default React.memo(OutcomeButton);
