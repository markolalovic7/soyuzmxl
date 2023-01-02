import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { makeGetBetslipData } from "../../../redux/reselect/betslip-selector";
import { persistLatestOutcomePrices } from "../../../redux/slices/ezBetslipCacheSlice";

export function useOutcomeInitialPrices(dispatch) {
  const location = useLocation();

  const betslipOutcomeInitialPrices = useSelector((state) => state.ezBetslipCache.betslipOutcomeInitialPrices);

  const getBetslipData = useMemo(makeGetBetslipData, []);
  const betslipData = useSelector((state) => getBetslipData(state, location.pathname));

  useEffect(() => {
    const outcomes = betslipData.model.outcomes;

    // When an outcome is removed, wipe out the leftover record
    const updatedOutcomePrices = Object.fromEntries(
      Object.entries(betslipOutcomeInitialPrices).filter(([key]) =>
        outcomes.map((o) => o.outcomeId).includes(Number(key)),
      ),
    );

    // When an outcome is added to the betslip, track the original price.
    const newOutcomes = outcomes.filter((outcome) => outcome.price && !updatedOutcomePrices[outcome.outcomeId]);

    newOutcomes.forEach((x) => {
      updatedOutcomePrices[x.outcomeId] = x.price;
    });

    // If any changes - persist to local storage
    if (JSON.stringify(updatedOutcomePrices) !== JSON.stringify(betslipOutcomeInitialPrices)) {
      dispatch(persistLatestOutcomePrices({ betslipOutcomeInitialPrices: updatedOutcomePrices }));
    }
  }, [dispatch, betslipData.model.outcomes]);
}
