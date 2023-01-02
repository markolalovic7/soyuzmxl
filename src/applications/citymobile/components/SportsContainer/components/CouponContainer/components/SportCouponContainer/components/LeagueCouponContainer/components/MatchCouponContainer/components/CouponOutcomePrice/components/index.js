import * as PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { AnimateKeyframes } from "react-simple-animate";

import { makeGetBetslipOutcomeIds } from "../../../../../../../../../../../../../../../redux/reselect/betslip-selector";
import {
  onRefreshBetslipHandler,
  onToggleSelection,
} from "../../../../../../../../../../../../../../../utils/betslip-utils";
import classes from "../../../../../../../../../../../../../scss/citymobile.module.scss";

const CouponOutcomePrice = ({ eventId, selection }) => {
  const location = useLocation();
  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const dispatch = useDispatch();
  const toggleBetslipHandler = (outcomeId, eventId) => {
    onToggleSelection(dispatch, location.pathname, outcomeId, eventId, true);
    onRefreshBetslipHandler(dispatch, location.pathname, true);
  };

  return (
    <div
      className={`${classes["sports-spoiler__coeficient"]} ${
        betslipOutcomeIds.includes(selection.outcomeId) ? classes["selected"] : ""
      } ${selection.outcomeHidden ? classes["sports-spoiler__coeficient_hidden"] : ""}`}
      style={{ pointerEvents: selection.outcomeHidden ? "none" : "auto" }}
      onClick={() => toggleBetslipHandler(selection.outcomeId, eventId)}
    >
      <span className={classes["sports-spoiler__coeficient-text-title"]}>{selection.outcomeDescription}</span>

      {selection?.priceDir === "d" ? (
        <AnimateKeyframes play duration="0.5" iterationCount="2" keyframes={["opacity: 0", "opacity: 1"]}>
          <span className={classes["sports-spoiler__triangle-red"]} />
        </AnimateKeyframes>
      ) : null}

      {selection?.priceDir === "u" ? (
        <AnimateKeyframes play duration="0.5" iterationCount="2" keyframes={["opacity: 0", "opacity: 1"]}>
          <span className={classes["sports-spoiler__triangle-green"]} />
        </AnimateKeyframes>
      ) : null}

      {selection.outcomeHidden ? (
        <span className={classes["sports-spoiler__coeficient-text-numbers"]}>--.--</span>
      ) : (
        <span className={classes["sports-spoiler__coeficient-text-numbers"]}>{selection.price}</span>
      )}
    </div>
  );
};

const propTypes = {
  eventId: PropTypes.number.isRequired,
  selection: PropTypes.object.isRequired,
};

const defaultProps = {};

CouponOutcomePrice.propTypes = propTypes;
CouponOutcomePrice.defaultProps = defaultProps;

export default React.memo(CouponOutcomePrice);
