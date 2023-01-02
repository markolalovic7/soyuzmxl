/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import { getItemBetslipResult, getItemBetslipTransactionResult } from "utils/my-bets";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getItemBetslipTransactionResult", () => {
    const t = (value) => value;
    it("should return betslip when result is `WIN`", () => {
      expect(getItemBetslipTransactionResult("WIN", t)).is.equal("settled-card__score_win");
    });
    it("should return betslip when result is `LOSE`", () => {
      expect(getItemBetslipTransactionResult("LOSE", t)).is.equal("settled-card__score_lose");
    });
    it("should return betslip when result is `VOID`", () => {
      expect(getItemBetslipTransactionResult("VOID", t)).is.equal("settled-card__score_void");
    });
    it("should return default value", () => {
      expect(getItemBetslipTransactionResult(undefined, t)).is.undefined;
    });
  });
  describe("getItemBetslipResult", () => {
    const t = (value) => value;
    it("should undefined when ", () => {
      expect(getItemBetslipResult({}, t, undefined)).is.deep.equal({
        className: "none",
        label: undefined,
      });
    });
    it("should `WIN` when all bets result are `WIN`", () => {
      expect(
        getItemBetslipResult(
          [
            {
              id: 1,
              result: "WIN",
            },
            {
              id: 2,
              result: "WIN",
            },
          ],
          t,
          true,
        ),
      ).is.deep.equal({
        className: "settled-card__score_win",
        label: "event-sorting.my_bets.my_bets_item_betslip_transaction_win",
      });
    });
    it("should `VOID` when all bets result are `VOID`", () => {
      expect(
        getItemBetslipResult(
          [
            {
              id: 1,
              result: "VOID",
            },
            {
              id: 2,
              result: "VOID",
            },
          ],
          t,
          true,
        ),
      ).is.deep.equal({
        className: "settled-card__score_void",
        label: "event-sorting.my_bets.my_bets_item_betslip_transaction_void",
      });
    });
    it("should `LOSE` when all bets result are `LOSE`", () => {
      expect(
        getItemBetslipResult(
          [
            {
              id: 1,
              result: "LOSE",
            },
            {
              id: 2,
              result: "LOSE",
            },
          ],
          t,
          true,
        ),
      ).is.deep.equal({
        className: "settled-card__score_lose",
        label: "event-sorting.my_bets.my_bets_item_betslip_transaction_lose",
      });
    });
    it("should `NO RESULT` when all bets result are `NO RESULT`", () => {
      expect(
        getItemBetslipResult(
          [
            {
              id: 1,
              result: "NO_RESULT",
            },
            {
              id: 2,
              result: "NO_RESULT",
            },
          ],
          t,
          true,
        ),
      ).is.deep.equal({
        className: "settled-card__score_void",
        label: "event-sorting.my_bets.my_bets_item_betslip_transaction_void",
      });
    });
    it("should partial win when all bets result are `LOSE, WIN`", () => {
      expect(
        getItemBetslipResult(
          [
            {
              id: 1,
              result: "WIN",
            },
            {
              id: 2,
              result: "LOSE",
            },
          ],
          t,
          true,
        ),
      ).is.deep.equal({
        className: "settled-card__score_void",
        label: "event-sorting.my_bets.my_bets_item_betslip_transaction_partial-win",
      });
    });
    it("should `LOSE` when all bets result are `LOSE, NO_RESULT`", () => {
      expect(
        getItemBetslipResult(
          [
            {
              id: 1,
              result: "NO_RESULT",
            },
            {
              id: 2,
              result: "LOSE",
            },
          ],
          t,
          true,
        ),
      ).is.deep.equal({
        className: "settled-card__score_void",
        label: "event-sorting.my_bets.my_bets_item_betslip_transaction_lose-void",
      });
    });
    it("should `WIN` when all bets result are `WIN, NO_RESULT`", () => {
      expect(
        getItemBetslipResult(
          [
            {
              id: 1,
              result: "NO_RESULT",
            },
            {
              id: 2,
              result: "WIN",
            },
          ],
          t,
          true,
        ),
      ).is.deep.equal({
        className: "settled-card__score_void",
        label: "event-sorting.my_bets.my_bets_item_betslip_transaction_win-void",
      });
    });
    it("should default value", () => {
      expect(
        getItemBetslipResult(
          [
            {
              id: 1,
              result: "WIN",
            },
            {
              id: 2,
              result: "NO_RESULT",
            },
            {
              id: 3,
              result: "LOSE",
            },
          ],
          t,
          true,
        ),
      ).is.deep.equal({
        className: "settled-card__score_void",
        label: "event-sorting.my_bets.my_bets_item_betslip_transaction_partial-win",
      });
    });
  });
});
