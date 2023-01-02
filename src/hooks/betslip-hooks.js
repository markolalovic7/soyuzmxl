import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { makeGetBetslipData } from "../redux/reselect/betslip-selector";
import { onRefreshBetslipHandler } from "../utils/betslip-utils";

export function useBetslipData(dispatch, compactSpread) {
  const location = useLocation();

  const getBetslipData = useMemo(makeGetBetslipData, []);
  const betslipData = useSelector((state) => getBetslipData(state, location.pathname));

  const isRefreshing = useSelector((state) => state.betslip.betslipRefreshingRequests.length > 0);

  const isAddingCustomBet = useSelector((state) => state.betslip.addingCustomBet);
  const isDisplayingSubmitConfirmation = useSelector(
    (state) =>
      state.betslip.brVirtualSubmitConfirmation ||
      state.betslip.krVirtualSubmitConfirmation ||
      state.betslip.submitConfirmation,
  );

  const hasOutcomes = betslipData.model.outcomes.length > 0;
  const hasLiveOutcomes = betslipData.model.outcomes.findIndex((o) => o.live) > -1;

  useEffect(() => {
    let timeout = undefined;

    if (!isRefreshing && !isAddingCustomBet && !isDisplayingSubmitConfirmation) {
      // trigger a refresh as soon as the previous one was completed
      if (hasOutcomes) {
        if (!hasLiveOutcomes) {
          timeout = setTimeout(() => onRefreshBetslipHandler(dispatch, location.pathname, compactSpread), 500);
        } else {
          onRefreshBetslipHandler(dispatch, location.pathname, compactSpread);
        }
      }
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [dispatch, hasLiveOutcomes, isAddingCustomBet, isRefreshing, hasOutcomes, location.pathname]);

  return betslipData;
}
