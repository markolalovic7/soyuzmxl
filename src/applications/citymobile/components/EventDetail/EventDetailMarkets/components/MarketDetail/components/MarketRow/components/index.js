import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { AnimateKeyframes } from "react-simple-animate";

import { makeGetBetslipOutcomeIds } from "../../../../../../../../../../redux/reselect/betslip-selector";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../../../../../../utils/betslip-utils";
import classes from "../../../../../../../../scss/citymobile.module.scss";

const MarketRow = ({ index, marketOpen, matchId, outcomes }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const toggleBetslipHandler = (outcomeId, eventId) => {
    onToggleSelection(dispatch, location.pathname, outcomeId, eventId, true);
    onRefreshBetslipHandler(dispatch, location.pathname, true);
  };

  return (
    <div className={classes["event-content__row"]} key={index}>
      {outcomes.map((sel) => {
        const outcomeId = sel.id;
        const outcomeDescription = sel.desc;
        const outcomeHidden = sel.hidden || !marketOpen;
        const priceId = sel.priceId;
        const price = sel.price;
        const spread = sel.spread;
        const spread2 = sel.spread2;
        const priceDir = sel.dir;

        const outcome = {
          outcomeDescription,
          outcomeHidden,
          outcomeId,
          price,
          priceDir,
          priceId,
          spread,
          spread2,
        };

        return (
          <div
            className={`${classes["event-content__coeficient"]} ${
              betslipOutcomeIds.includes(parseInt(outcome.outcomeId, 10)) ? classes["selected"] : ""
            }`}
            key={outcomeId}
            style={{
              cursor: outcome.outcomeHidden ? "none" : "pointer",
              opacity: outcome.outcomeHidden ? 0.6 : 1,
            }}
            onClick={() => toggleBetslipHandler(outcome.outcomeId, matchId)}
          >
            {outcome.priceDir === "<" || outcome.priceDir === "d" ? (
              <AnimateKeyframes play duration="0.5" iterationCount="2" keyframes={["opacity: 0", "opacity: 1"]}>
                <span className={classes["sports-spoiler__triangle-red"]} />
              </AnimateKeyframes>
            ) : null}
            {outcome.priceDir === ">" || outcome.priceDir === "u" ? (
              <AnimateKeyframes play duration="0.5" iterationCount="2" keyframes={["opacity: 0", "opacity: 1"]}>
                <span className={classes["sports-spoiler__triangle-green"]} />
              </AnimateKeyframes>
            ) : null}

            <span className={classes["event-content__text"]}>{outcomeDescription}</span>
            <span className={classes["event-content__numbers"]}>{price}</span>
          </div>
        );
      })}
    </div>
  );
};

const propTypes = {
  index: PropTypes.number.isRequired,
  marketOpen: PropTypes.bool.isRequired,
  matchId: PropTypes.number.isRequired,
  outcomes: PropTypes.array.isRequired,
};

const defaultProps = {};

MarketRow.propTypes = propTypes;
MarketRow.defaultProps = defaultProps;

export default React.memo(MarketRow);
