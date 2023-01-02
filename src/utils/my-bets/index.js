import { BET_RESULT_LOSE, BET_RESULT_NO_RESULT, BET_RESULT_VOID, BET_RESULT_WIN } from "constants/bet-types";

export function getItemBetslipTransactionResult(resultDescription) {
  return {
    [BET_RESULT_LOSE]: "settled-card__score_lose",
    [BET_RESULT_NO_RESULT]: "settled-card__score_void",
    [BET_RESULT_VOID]: "settled-card__score_void",
    [BET_RESULT_WIN]: "settled-card__score_win",
  }[resultDescription];
}

// Note: the logic is the following:
// If all bets under a betslip are `WIN` --> `WIN`
// If all bets under a betslip are `VOID` --> `VOID`
// If all bets under a betslip are `LOSE` --> `VOID`
// If all bets under a betslip are `LOSE` and `WIN` (combination of those subsets) --> `PARTIAL WIN`
// If all bets under a betslip are `LOSE` and `VOID` --> `LOSE / VOID`
// If all bets under a betslip are `WIN` and `VOID` --> `WIN / VOID`
// Any other scenario --> `PARTIAL WIN`.
export function getItemBetslipResult(bets, t, isSettled) {
  if (!isSettled) {
    return {
      className: "none",
      label: undefined,
    };
  }
  const transactionResults = bets.map((bet) => bet.result);
  if (transactionResults.every((transactionResult) => transactionResult === BET_RESULT_WIN)) {
    return {
      className: "settled-card__score_win",
      label: t("event-sorting.my_bets.my_bets_item_betslip_transaction_win"),
    };
  }
  if (transactionResults.every((transactionResult) => transactionResult === BET_RESULT_VOID)) {
    return {
      className: "settled-card__score_void",
      label: t("event-sorting.my_bets.my_bets_item_betslip_transaction_void"),
    };
  }
  if (transactionResults.every((transactionResult) => transactionResult === BET_RESULT_LOSE)) {
    return {
      className: "settled-card__score_lose",
      label: t("event-sorting.my_bets.my_bets_item_betslip_transaction_lose"),
    };
  }
  if (transactionResults.every((transactionResult) => transactionResult === BET_RESULT_NO_RESULT)) {
    return {
      className: "settled-card__score_void",
      label: t("event-sorting.my_bets.my_bets_item_betslip_transaction_void"),
    };
  }
  if (transactionResults.every((transactionResult) => [BET_RESULT_WIN, BET_RESULT_LOSE].includes(transactionResult))) {
    return {
      className: "settled-card__score_void",
      label: t("event-sorting.my_bets.my_bets_item_betslip_transaction_partial-win"),
    };
  }
  if (
    transactionResults.every((transactionResult) => [BET_RESULT_LOSE, BET_RESULT_NO_RESULT].includes(transactionResult))
  ) {
    return {
      className: "settled-card__score_void",
      label: t("event-sorting.my_bets.my_bets_item_betslip_transaction_lose-void"),
    };
  }
  if (
    transactionResults.every((transactionResult) => [BET_RESULT_WIN, BET_RESULT_NO_RESULT].includes(transactionResult))
  ) {
    return {
      className: "settled-card__score_void",
      label: t("event-sorting.my_bets.my_bets_item_betslip_transaction_win-void"),
    };
  }

  return {
    className: "settled-card__score_void",
    label: t("event-sorting.my_bets.my_bets_item_betslip_transaction_partial-win"),
  };
}
