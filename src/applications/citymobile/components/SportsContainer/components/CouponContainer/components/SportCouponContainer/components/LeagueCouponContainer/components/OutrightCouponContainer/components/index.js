import * as PropTypes from "prop-types";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { makeGetBetslipOutcomeIds } from "../../../../../../../../../../../../../redux/reselect/betslip-selector";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../../../../../../../../../utils/betslip-utils";
import classes from "../../../../../../../../../../../scss/citymobile.module.scss";

const OutrightCouponContainer = ({ match, sportCode }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const toggleBetslipHandler = (outcomeId, eventId) => {
    // eslint-disable-next-line sort-keys
    onToggleSelection(dispatch, location.pathname, outcomeId, eventId, true);
    onRefreshBetslipHandler(dispatch, location.pathname, true);
  };

  return (
    // <div className={classes["sports-spoiler__content"]}>
    <div className={classes["outcomes"]}>
      {match.markets &&
        match.markets.length > 0 &&
        match.markets[0].outcomes
          .filter((o) => !o.outcomeHidden)
          .sort((a, b) => a.price - b.price)
          .map((o) => (
            <div
              className={`${classes["outcome"]} ${
                betslipOutcomeIds.includes(parseInt(o.outcomeId, 10)) ? classes["selected"] : ""
              }`}
              key={o.outcomeId}
              onClick={() => toggleBetslipHandler(o.outcomeId, match.eventId)}
            >
              <span className={classes["outcome__description"]}>{o.outcomeDescription}</span>
              <span className={classes["outcome__odds"]}>{o.price}</span>
            </div>
          ))}
    </div>
    // </div>
  );
};

const propTypes = {
  match: PropTypes.object.isRequired,
  sportCode: PropTypes.string.isRequired,
};

const defaultProps = {};

OutrightCouponContainer.propTypes = propTypes;
OutrightCouponContainer.defaultProps = defaultProps;

export default OutrightCouponContainer;
