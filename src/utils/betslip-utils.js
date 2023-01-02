import {
  acceptJackpotSubmissionConfirmation,
  acceptSubmissionConfirmation,
  addCustomBetToBetslip,
  applyMaxStake,
  changeMultipleStakes,
  changeSingleStakes,
  claimFreeBetRewardId,
  clearBetslip,
  clearErrors,
  clearJackpotBetslip,
  clearStakes,
  clearStakesByTypeIds,
  refreshBetslip,
  removeJackpotSelection,
  removeSelection,
  submitBetslip,
  submitSingleWalletBetslip,
  toggleSelection,
  toggleSelectionForMultiples,
  unclaimFreeBetRewardId,
} from "../redux/slices/betslipSlice";

import { isBrVirtualSportsLocation } from "./betradar-virtual-utils";
import { isKrVirtualSportsLocation } from "./kiron-virtual-utils";

/*
 * Refresh betslip model
 */

const onRefreshBetslipHandler = (dispatch, pathname, compactSpread = false) => {
  dispatch(
    refreshBetslip({
      brVirtual: isBrVirtualSportsLocation(pathname),
      compactSpread,
      krVirtual: isKrVirtualSportsLocation(pathname),
    }),
  );
};

const onRefreshJackpotBetslipHandler = (dispatch, jackpotId) => {
  dispatch(refreshBetslip({ jackpotId }));
};

/*
 * Change Stakes
 */

const onGlobalStakeChangeHandler = (dispatch, pathname, betslipData, value) => {
  let newStake = 0;
  if (value !== "") {
    newStake = parseInt(value);
  }

  if (newStake <= 0) {
    // Do not allow negatives
    newStake = 0;
  }

  onUpdateGlobalStakeHandler(dispatch, pathname, betslipData, newStake);
};

// Update and validate a specific stake (decorator to validate the input)
const onSpecificStakeChangeHandler = (dispatch, pathname, betslipData, value, typeId, index) => {
  let newStake = 0;
  if (value !== "") {
    newStake = parseInt(value, 10);
  }

  if (newStake <= 0) {
    // Do not allow negatives
    newStake = 0;
  }

  onUpdateSpecificStakeHandler(dispatch, pathname, betslipData, typeId, index, newStake);
};

// Add a global stake change (touches the whole model!)
function onUpdateGlobalStakeHandler(dispatch, pathname, betslipData, newStake) {
  const brVirtual = isBrVirtualSportsLocation(pathname);
  const krVirtual = isKrVirtualSportsLocation(pathname);

  if (betslipData.model.outcomes.length === 1) {
    dispatch(
      changeSingleStakes({
        brVirtual,
        krVirtual,
        singleStakes: [{ outcomeId: betslipData.model.outcomes[0].outcomeId, stake: newStake }],
      }),
    );
  } else if (betslipData.betData.multiples.length > 0) {
    const singleStakes = betslipData.model.outcomes.map((outcome) =>
      // make sure to reset singles
      ({ outcomeId: outcome.outcomeId, stake: 0 }),
    );
    dispatch(changeSingleStakes({ brVirtual, krVirtual, singleStakes }));

    const multipleStakes = betslipData.betData.multiples.map((bet) => {
      // make sure to reset singles
      if (bet.typeId === betslipData.model.outcomes.length) {
        return { stake: newStake, typeId: bet.typeId, unitStake: newStake };
      }

      return { stake: 0, typeId: bet.typeId, unitStake: 0 };
    });
    dispatch(changeMultipleStakes({ brVirtual, krVirtual, multipleStakes }));
  }
}

// Add a specific stake change
function onUpdateSpecificStakeHandler(dispatch, pathname, betslipData, typeId, index, newStake) {
  const brVirtual = isBrVirtualSportsLocation(pathname);
  const krVirtual = isKrVirtualSportsLocation(pathname);

  if (typeId === 1) {
    // For singles, typeId and an index is enough to identify the target bet.
    if (betslipData.model.outcomes.length >= index) {
      dispatch(
        changeSingleStakes({
          brVirtual,
          krVirtual,
          singleStakes: [{ outcomeId: betslipData.model.outcomes[index]?.outcomeId, stake: newStake }],
        }),
      );
    }
  } else {
    // For multiples, the typeId is unique and suffices.
    const multiple = betslipData.betData.multiples.find((multipleBet) => multipleBet.typeId === typeId);
    if (multiple) {
      const updatedMultiple = { ...multiple, unitStake: newStake };
      dispatch(changeMultipleStakes({ brVirtual, krVirtual, multipleStakes: [updatedMultiple] }));
    }
  }
}

const onClearAllStakesHandler = (dispatch, pathname) => {
  dispatch(
    clearStakes({ brVirtual: isBrVirtualSportsLocation(pathname), krVirtual: isKrVirtualSportsLocation(pathname) }),
  );
};

const onClearStakesHandler = (dispatch, pathname, typeIds) => {
  dispatch(
    clearStakesByTypeIds({
      brVirtual: isBrVirtualSportsLocation(pathname),
      krVirtual: isKrVirtualSportsLocation(pathname),
      typeIds,
    }),
  );
  onRefreshBetslipHandler(dispatch, pathname);
};

/**
 * Toggle Selections
 */

const onToggleSelection = (dispatch, pathname, outcomeId, eventId, enforceEventUniqueness) => {
  dispatch(
    toggleSelection({
      brVirtual: isBrVirtualSportsLocation(pathname),
      enforceEventUniqueness,
      eventId,
      krVirtual: isKrVirtualSportsLocation(pathname),
      outcomeId,
    }),
  );
};

/**
 * Create Custom Bet betslip
 */

const onAddCustomBetToBetslip = (dispatch, pathname, customBetRequest, compactSpread) => {
  dispatch(
    addCustomBetToBetslip({
      compactSpread,
      customBetRequest,
    }),
  );
};

/**
 * "Free Bet" actions
 */

const claimFreeBet = (dispatch, pathname, typeId, outcomeId, freeBetId) => {
  dispatch(
    claimFreeBetRewardId({
      brVirtual: isBrVirtualSportsLocation(pathname),
      freeBetId,
      krVirtual: isKrVirtualSportsLocation(pathname),
      outcomeId,
      typeId,
    }),
  );
};

const unclaimFreeBet = (dispatch, pathname, typeId, outcomeId) => {
  dispatch(
    unclaimFreeBetRewardId({
      brVirtual: isBrVirtualSportsLocation(pathname),
      krVirtual: isKrVirtualSportsLocation(pathname),
      outcomeId,
      typeId,
    }),
  );
};

/*
 * Remove Selections
 */

// Clear specific selection
const onRemoveSelectionHandler = (dispatch, pathname, outcomeId, enforceEventUniqueness) => {
  dispatch(
    removeSelection({
      brVirtual: isBrVirtualSportsLocation(pathname),
      enforceEventUniqueness,
      krVirtual: isKrVirtualSportsLocation(pathname),
      outcomeId,
    }),
  );
  onRefreshBetslipHandler(dispatch, pathname);
};

const onRemoveJackpotSelectionHandler = (dispatch, outcomeId, jackpotId) => {
  dispatch(removeJackpotSelection({ jackpotId, outcomeId }));
  dispatch(refreshBetslip({ jackpotId }));
};

// Clear the whole betslip
const onClearBetslipHandler = (dispatch, pathname) => {
  dispatch(
    clearBetslip({ brVirtual: isBrVirtualSportsLocation(pathname), krVirtual: isKrVirtualSportsLocation(pathname) }),
  );
  onRefreshBetslipHandler(dispatch, pathname);
};

const onClearJackpotBetslipHandler = (dispatch, jackpotId) => {
  dispatch(clearJackpotBetslip({ jackpotId }));
};

/*
 * Extract Stakes - event-sorting
 */

// single stakes
const getSingleStake = (betslipData, outcomeId) => {
  const bet = betslipData.betData.singles.find((single) => single.outcomeId === outcomeId);
  if (bet) {
    return bet.stake;
  }

  return 0;
};
const getMultipleStake = (betslipData, typeId) => {
  const bet = betslipData.betData.multiples.find((multiple) => multiple.typeId === typeId);
  if (bet) {
    return bet.stake; // stake? or unit stake?
  }

  return 0;
};

const getGlobalTotalStake = (betslipData) => {
  let total = 0;
  betslipData.betData.singles.forEach((bet) => {
    total += bet.stake;
  });
  betslipData.betData.multiples.forEach((bet) => {
    total += bet.stake;
  });

  return total;
};

const getGlobalSingleTotalStake = (betslipData) => {
  let total = 0;
  betslipData.betData.singles.forEach((bet) => {
    total += bet.stake;
  });

  return total;
};

const getGlobalTotalCashStake = (betslipData) => {
  let total = 0;
  betslipData.betData.singles.forEach((bet) => {
    total += bet.cashStake;
  });
  betslipData.betData.multiples.forEach((bet) => {
    total += bet.cashStake;
  });

  return total;
};

const getGlobalTotalPromoStake = (betslipData) => {
  let total = 0;
  betslipData.betData.singles.forEach((bet) => {
    total += bet.promoStake;
  });
  betslipData.betData.multiples.forEach((bet) => {
    total += bet.promoStake;
  });

  return total;
};

const getGlobalTotalPromoSnrStake = (betslipData) => {
  let total = 0;
  betslipData.betData.singles.forEach((bet) => {
    total += bet.promoSnrStake;
  });
  betslipData.betData.multiples.forEach((bet) => {
    total += bet.promoSnrStake;
  });

  return total;
};

const getGlobalTotalFreeBetStake = (betslipData) => {
  let total = 0;
  betslipData.betData.singles.forEach((bet) => {
    total += bet.freeBetStake;
  });
  betslipData.betData.multiples.forEach((bet) => {
    total += bet.freeBetStake;
  });

  return total;
};

/*
 * Extract Potential Win - event-sorting
 */
const getSingleBetPotentialWin = (betslipData, outcomeId) => {
  const bet = betslipData.betData.singles.find((single) => single.outcomeId === outcomeId);
  if (bet) {
    return bet.potentialWin;
  }

  return 0;
};
const getMultipleBetPotentialWin = (betslipData, typeId) => {
  const bet = betslipData.betData.multiples.find((multiple) => multiple.typeId === typeId);
  if (bet) {
    return bet.potentialWin;
  }

  return 0;
};

const getGlobalPotentialWin = (betslipData) => {
  let total = 0;
  betslipData?.betData?.singles?.forEach((bet) => {
    total += bet.potentialWin;
  });
  betslipData?.betData?.multiples?.forEach((bet) => {
    total += bet.potentialWin;
  });

  return total;
};

const getGlobalSinglePotentialWin = (betslipData) => {
  let total = 0;
  betslipData?.betData?.singles?.forEach((bet) => {
    total += bet.potentialWin;
  });

  return total;
};
/*
 * Notification actions
 */

const acknowledgeErrors = (dispatch, pathname) => {
  dispatch(
    clearErrors({ brVirtual: isBrVirtualSportsLocation(pathname), krVirtual: isKrVirtualSportsLocation(pathname) }),
  );
};
const acknowledgeSubmission = (dispatch, pathname, clearBetslip) => {
  dispatch(
    acceptSubmissionConfirmation({
      brVirtual: isBrVirtualSportsLocation(pathname),
      clearBetslip,
      krVirtual: isKrVirtualSportsLocation(pathname),
    }),
  );

  window.parent.postMessage(
    {
      action: "app.wallet_update",
      code: "BET_PLACEMENT",
    },
    "*",
  );
};
const acknowledgeJackpotSubmission = (dispatch, jackpotId) => {
  dispatch(acceptJackpotSubmissionConfirmation({ jackpotId }));

  window.parent.postMessage(
    {
      action: "app.wallet_update",
      code: "BET_PLACEMENT",
    },
    "*",
  );
};
/*
 * Max Stake
 */
const obtainGlobalMaxStake = (dispatch, betslipData, factor) => {
  if (betslipData.model.outcomes.length === 1) {
    dispatch(applyMaxStake({ factor, outcomeId: betslipData.model.outcomes[0].outcomeId, typeId: 1 }));
  } else if (betslipData.betData.multiples.length > 0) {
    dispatch(applyMaxStake({ factor, typeId: betslipData.model.outcomes.length }));
  }
};

const obtainSpecificMaxStake = (dispatch, betslipData, typeId, outcomeId, factor) => {
  dispatch(applyMaxStake({ factor, outcomeId, typeId }));
};

/**
 * Bet Placement
 */
const onSubmitBetslip = (
  dispatch,
  pathname,
  isCashBet = false,
  placeSinglesOnly = false,
  placeMultipleOnly = false,
  placeSystemsOnly = false,
) => {
  dispatch(
    submitBetslip({
      brVirtual: isBrVirtualSportsLocation(pathname),
      isCashBet,
      krVirtual: isKrVirtualSportsLocation(pathname),
      placeMultipleOnly,
      placeSinglesOnly,
      placeSystemsOnly,
    }),
  );
};
const onSubmitSingleWalletBetslip = (
  dispatch,
  pathname,
  isCashBet = false,
  placeSinglesOnly = false,
  placeMultipleOnly = false,
  placeSystemsOnly = false,
) => {
  dispatch(
    submitSingleWalletBetslip({
      brVirtual: isBrVirtualSportsLocation(pathname),
      isCashBet,
      krVirtual: isKrVirtualSportsLocation(pathname),
      placeMultipleOnly,
      placeSinglesOnly,
      placeSystemsOnly,
    }),
  );
};

// Mark a outcome as valid or not valid for Multiples
function onToggleOutcomeForMultiplesHandler(dispatch, pathname, outcomeId) {
  const brVirtual = isBrVirtualSportsLocation(pathname);
  const krVirtual = isKrVirtualSportsLocation(pathname);

  dispatch(toggleSelectionForMultiples({ brVirtual, krVirtual, outcomeId }));
}

// text overflow ellipsis after some length
function textOverflowEllipsis(text, length) {
  return text.length > length ? `${text.substring(0, length)}...` : text;
}

export {
  claimFreeBet,
  onGlobalStakeChangeHandler,
  onSpecificStakeChangeHandler,
  onSubmitBetslip,
  onSubmitSingleWalletBetslip,
  onToggleSelection,
  onRemoveJackpotSelectionHandler,
  onRemoveSelectionHandler,
  onClearBetslipHandler,
  onClearJackpotBetslipHandler,
  onRefreshBetslipHandler,
  onRefreshJackpotBetslipHandler,
  getSingleStake,
  getMultipleStake,
  getSingleBetPotentialWin,
  getMultipleBetPotentialWin,
  getGlobalSingleTotalStake,
  getGlobalTotalStake,
  getGlobalTotalCashStake,
  getGlobalTotalFreeBetStake,
  getGlobalTotalPromoStake,
  getGlobalTotalPromoSnrStake,
  getGlobalPotentialWin,
  getGlobalSinglePotentialWin,
  onClearAllStakesHandler,
  onClearStakesHandler,
  acknowledgeErrors,
  acknowledgeJackpotSubmission,
  acknowledgeSubmission,
  obtainGlobalMaxStake,
  obtainSpecificMaxStake,
  unclaimFreeBet,
  onToggleOutcomeForMultiplesHandler,
  onAddCustomBetToBetslip,
  textOverflowEllipsis,
};
