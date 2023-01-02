import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { makeGetJackpotBetslipOutcomesByJackpotId } from "../../../../../redux/reselect/betslip-selector";
import { refreshBetslip, toggleJackpotSelection } from "../../../../../redux/slices/betslipSlice";

const JackpotSelectableCoefficient = ({ desc, dir, eventId, hidden, jackpotId, outcomeId, price }) => {
  const dispatch = useDispatch();

  const getJackpotBetslipOutcomesByJackpotId = useMemo(makeGetJackpotBetslipOutcomesByJackpotId, []);
  const jackpotBetslipOutcomes = useSelector((state) => getJackpotBetslipOutcomesByJackpotId(state, jackpotId));
  const jackpotOutcomeIds = jackpotBetslipOutcomes.map((jackpotOutcome) => jackpotOutcome.outcomeId);

  const toggleBetslipHandler = (outcomeId, eventId) => {
    dispatch(toggleJackpotSelection({ eventId, jackpotId, outcomeId }));
    dispatch(refreshBetslip({ jackpotId }));
  };

  return (
    <div
      className={cx(classes["coeficient"], {
        [classes["active"]]: jackpotOutcomeIds.includes(outcomeId),
        [classes["disabled"]]: hidden,
      })}
      onClick={() => toggleBetslipHandler(outcomeId, eventId)}
    >
      <span className={classes["coeficient__label"]}>{desc}</span>
      <span className={classes["coeficient__numbers"]}>
        {price}
        {dir === "<" && <span className={cx(classes["coeficient__triangle"], classes["coeficient__triangle_red"])} />}
        {dir === ">" && <span className={cx(classes["coeficient__triangle"], classes["coeficient__triangle_green"])} />}
      </span>
    </div>
  );
};

JackpotSelectableCoefficient.propTypes = {
  desc: PropTypes.string.isRequired,
  dir: PropTypes.string.isRequired,
  eventId: PropTypes.number.isRequired,
  hidden: PropTypes.bool.isRequired,
  jackpotId: PropTypes.number.isRequired,
  outcomeId: PropTypes.number.isRequired,
  price: PropTypes.string.isRequired,
};

export default JackpotSelectableCoefficient;
