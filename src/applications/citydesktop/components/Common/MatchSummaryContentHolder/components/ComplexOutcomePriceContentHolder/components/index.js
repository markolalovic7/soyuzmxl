import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

import { makeGetBetslipOutcomeIds } from "../../../../../../../../redux/reselect/betslip-selector";
import classes from "../../../../../../scss/citywebstyle.module.scss";

import OutcomeButton from "./OutcomeButton";

const formatSpread = (spread) => {
  if (spread) {
    return spread > 0 ? `+${spread}` : `${spread}`;
  }

  return "";
};
const formatSpreads = (spread, spread2) => {
  if (spread) {
    if (spread2) {
      if (Math.abs(spread) < Math.abs(spread2)) {
        return `${formatSpread(spread)},${formatSpread(spread2)}`;
      }

      return `${formatSpread(spread2)},${formatSpread(spread)}`;
    }

    return formatSpread(spread);
  }

  return "";
};

const ComplexOutcomePriceContentHolder = ({ eventId, markets }) => {
  const location = useLocation();

  const priceFormat = useSelector((state) => state.auth.priceFormat);

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const handicapMarket = markets.find((m) => m.marketTypeGroup === "FIXED_SPREAD");
  const handicapHomeOutcome =
    handicapMarket?.outcomes && handicapMarket.outcomes.length === 2 ? handicapMarket.outcomes[0] : null;
  const handicapHomePrice = handicapHomeOutcome
    ? handicapHomeOutcome.outcomeHidden
      ? "--.--"
      : priceFormat === "EURO"
      ? parseFloat(handicapHomeOutcome.price).toFixed(2)
      : handicapHomeOutcome.price
    : null;
  const handicapAwayOutcome =
    handicapMarket?.outcomes && handicapMarket.outcomes.length === 2 ? handicapMarket.outcomes[1] : null;
  const handicapAwayPrice = handicapAwayOutcome
    ? handicapAwayOutcome.outcomeHidden
      ? "--.--"
      : priceFormat === "EURO"
      ? parseFloat(handicapAwayOutcome.price).toFixed(2)
      : handicapAwayOutcome.price
    : null;
  const homeSpread = handicapHomeOutcome ? formatSpreads(handicapHomeOutcome.spread, handicapHomeOutcome.spread2) : "";
  const awaySpread = handicapAwayOutcome ? formatSpreads(handicapAwayOutcome.spread, handicapAwayOutcome.spread2) : "";

  const overUnderMarket = markets.find((m) => m.marketTypeGroup === "FIXED_TOTAL");
  const overOutcome =
    overUnderMarket?.outcomes && overUnderMarket.outcomes.length === 2 ? overUnderMarket.outcomes[0] : null;
  const overPrice = overOutcome
    ? overOutcome.outcomeHidden
      ? "--.--"
      : priceFormat === "EURO"
      ? parseFloat(overOutcome.price).toFixed(2)
      : overOutcome.price
    : null;
  const underOutcome =
    overUnderMarket?.outcomes && overUnderMarket.outcomes.length === 2 ? overUnderMarket.outcomes[1] : null;
  const underPrice = underOutcome
    ? underOutcome.outcomeHidden
      ? "--.--"
      : priceFormat === "EURO"
      ? parseFloat(underOutcome.price).toFixed(2)
      : underOutcome.price
    : null;
  const total = overOutcome ? formatSpreads(overOutcome.spread, overOutcome.spread2) : "";

  const moneyLineMarket = markets.find((m) => m.marketTypeGroup === "MONEY_LINE");
  const homeOutcome =
    moneyLineMarket?.outcomes && moneyLineMarket.outcomes.length >= 2 ? moneyLineMarket.outcomes[0] : null;
  const homePrice = homeOutcome
    ? homeOutcome.outcomeHidden
      ? "--.--"
      : priceFormat === "EURO"
      ? parseFloat(homeOutcome.price).toFixed(2)
      : homeOutcome.price
    : null;
  const drawOutcome =
    moneyLineMarket?.outcomes && moneyLineMarket.outcomes.length > 2 ? moneyLineMarket.outcomes[1] : null;
  const drawPrice = drawOutcome
    ? drawOutcome.outcomeHidden
      ? "--.--"
      : priceFormat === "EURO"
      ? parseFloat(drawOutcome.price).toFixed(2)
      : drawOutcome.price
    : null;
  const awayOutcome =
    moneyLineMarket?.outcomes && moneyLineMarket.outcomes.length >= 2
      ? moneyLineMarket.outcomes[moneyLineMarket.outcomes.length - 1]
      : null;
  const awayPrice = awayOutcome
    ? awayOutcome.outcomeHidden
      ? "--.--"
      : priceFormat === "EURO"
      ? parseFloat(awayOutcome.price).toFixed(2)
      : awayOutcome.price
    : null;

  return (
    <div className={classes["sports-spoiler__factors-box"]}>
      {/* handicapMarket */}
      <div className={classes["sports-spoiler__factors"]}>
        <OutcomeButton
          betslipOutcomeIds={betslipOutcomeIds}
          eventId={eventId}
          outcome={handicapHomeOutcome}
          price={handicapHomePrice}
          spread={homeSpread}
        />
        <OutcomeButton
          betslipOutcomeIds={betslipOutcomeIds}
          eventId={eventId}
          outcome={handicapAwayOutcome}
          price={handicapAwayPrice}
          spread={awaySpread}
        />
      </div>

      {/* moneyLineMarket */}
      <div className={classes["sports-spoiler__factors"]}>
        <OutcomeButton
          betslipOutcomeIds={betslipOutcomeIds}
          eventId={eventId}
          outcome={homeOutcome}
          price={homePrice}
        />
        {drawOutcome ? (
          <OutcomeButton
            betslipOutcomeIds={betslipOutcomeIds}
            eventId={eventId}
            outcome={drawOutcome}
            price={drawPrice}
          />
        ) : null}
        <OutcomeButton
          betslipOutcomeIds={betslipOutcomeIds}
          eventId={eventId}
          outcome={awayOutcome}
          price={awayPrice}
        />
      </div>

      {/* overUnderMarket */}
      <div className={classes["sports-spoiler__factors"]}>
        <OutcomeButton
          betslipOutcomeIds={betslipOutcomeIds}
          eventId={eventId}
          label="O"
          outcome={overOutcome}
          price={overPrice}
          spread={total}
        />
        <OutcomeButton
          betslipOutcomeIds={betslipOutcomeIds}
          eventId={eventId}
          label="U"
          outcome={underOutcome}
          price={underPrice}
          spread={total}
        />
      </div>
    </div>
  );
};

const propTypes = {
  eventId: PropTypes.number.isRequired,
  markets: PropTypes.array.isRequired,
};

ComplexOutcomePriceContentHolder.propTypes = propTypes;

export default React.memo(ComplexOutcomePriceContentHolder);
