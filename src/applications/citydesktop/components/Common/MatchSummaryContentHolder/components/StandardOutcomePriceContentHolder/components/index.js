import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { AnimateKeyframes } from "react-simple-animate";

import { makeGetBetslipOutcomeIds } from "../../../../../../../../redux/reselect/betslip-selector";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../../../../utils/betslip-utils";
import classes from "../../../../../../scss/citywebstyle.module.scss";

const StandardOutcomePriceContentHolder = ({ eventId, markets }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const priceFormat = useSelector((state) => state.auth.priceFormat);

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const toggleBetslipHandler = (outcomeId, eventId) => {
    onToggleSelection(dispatch, location.pathname, outcomeId, eventId, true);
    onRefreshBetslipHandler(dispatch, location.pathname, true);
  };

  return (
    <div className={classes["sports-spoiler__coeficients"]}>
      {markets.slice(0, 1).map((market) => (
        <React.Fragment key={market.marketId}>
          {market.outcomes.map((sel) => {
            const price = sel.outcomeHidden
              ? "--.--"
              : priceFormat === "EURO"
              ? parseFloat(sel.price).toFixed(2)
              : sel.price;

            return (
              <div
                className={`${classes["sports-spoiler__coeficient"]} ${
                  sel.outcomeHidden ? classes["sports-spoiler__coeficient_hidden"] : ""
                } ${
                  betslipOutcomeIds.includes(parseInt(sel.outcomeId, 10))
                    ? classes["sports-spoiler__coeficient_active"]
                    : ""
                }`}
                key={sel.outcomeId}
                style={{ cursor: sel.outcomeHidden ? "none" : "pointer" }}
                onClick={() => toggleBetslipHandler(sel.outcomeId, eventId)}
              >
                <span className={classes["sports-spoiler__coeficient-text-title"]}>{sel.outcomeDescription}</span>
                {sel.priceDir === "d" ? (
                  <AnimateKeyframes play duration="0.5" iterationCount="2" keyframes={["opacity: 0", "opacity: 1"]}>
                    <span className={classes["sports-spoiler__triangle-red"]} />
                  </AnimateKeyframes>
                ) : null}
                {sel.priceDir === "u" ? (
                  <AnimateKeyframes play duration="0.5" iterationCount="2" keyframes={["opacity: 0", "opacity: 1"]}>
                    <span className={classes["sports-spoiler__triangle-green"]} />
                  </AnimateKeyframes>
                ) : null}
                <span className={classes["sports-spoiler__coeficient-text-numbers"]}>{price}</span>
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

const propTypes = {
  eventId: PropTypes.number.isRequired,
  markets: PropTypes.array.isRequired,
};

StandardOutcomePriceContentHolder.propTypes = propTypes;

export default React.memo(StandardOutcomePriceContentHolder);
