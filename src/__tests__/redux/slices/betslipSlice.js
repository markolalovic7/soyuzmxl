import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";

import { setAuthLanguage, setAuthPriceFormat } from "redux/slices/authSlice";
import betslipReducer, {
  acceptSubmissionConfirmation,
  clearBetslip,
  clearErrors,
  clearStakes,
  getInitialState,
  refreshBetslip,
  removeSelection,
  submitBetslip,
  submitSingleWalletBetslip,
} from "redux/slices/betslipSlice";

describe(path.relative(process.cwd(), __filename), () => {
  it("should return initial state", () => {
    expect(getInitialState({ foo: "bar" }, { foo: "bar2" }, { foo: "bar3" }, { foo: "bar4" })).to.be.deep.equal({
      betslipData: { foo: "bar" },
      betslipRefreshingRequests: [],
      brVirtualBetslipData: { foo: "bar3" },
      brVirtualModelUpdateInProgress: false,
      brVirtualRefreshErrors: null,
      brVirtualSubmitConfirmation: false,
      brVirtualSubmitError: null,
      brVirtualSubmitInProgress: false,
      brVirtualWarnings: null,
      dirtyPotentialWin: false, // potential win is meaningless following a stake change, and we are waiting for a API model refresh
      jackpotBetslipData: { foo: "bar2" },
      jackpotModelUpdateInProgress: {},
      jackpotRefreshErrors: {},
      jackpotSubmitConfirmation: {},
      jackpotSubmitError: {},
      jackpotSubmitInProgress: {},
      jackpotWarnings: {},
      krVirtualBetslipData: { foo: "bar4" },
      krVirtualModelUpdateInProgress: false,
      krVirtualRefreshErrors: null,
      krVirtualSubmitConfirmation: false,
      krVirtualSubmitError: null,
      krVirtualSubmitInProgress: false,
      krVirtualWarnings: null,
      modelUpdateInProgress: false,
      refreshErrors: null,
      savedBetslipId: null,
      savedBetslipReference: null,
      submitConfirmation: false,
      submitError: null,
      submitInProgress: false,
      warnings: null,
    });
  });
  it("should update state when action type is `refreshBetslip.pending`", () => {
    expect(betslipReducer({ betslipRefreshingRequests: [] }, refreshBetslip.pending())).to.be.deep.equal({
      betslipRefreshingRequests: [undefined],
      refreshErrors: null,
      warnings: null,
    });
  });
  it("should update state when action type is `refreshBetslip.rejected`", () => {
    expect(
      betslipReducer({ betslipRefreshingRequests: [] }, refreshBetslip.rejected({ message: "message" })),
    ).to.be.deep.equal({
      betslipRefreshingRequests: [],
      refreshErrors: "message",
      warnings: null,
    });
  });
  it("should update state when action type is `refreshBetslip.fulfilled`", () => {
    expect(
      betslipReducer(
        {
          betslipData: [1, 2, 3],
          betslipRefreshingRequests: [],
          modelUpdateInProgress: true,
          refreshErrors: "message",
        },
        refreshBetslip.fulfilled({ betslipData: [2, 3, 99] }),
      ),
    ).to.be.deep.equal({
      betslipData: [2, 3, 99],
      betslipRefreshingRequests: [],
      dirtyPotentialWin: false,
      modelUpdateInProgress: false,
      refreshErrors: null,
      warnings: null,
    });
  });
  it("should update state when action type is `submitBetslip.pending`", () => {
    expect(betslipReducer({}, submitBetslip.pending())).to.be.deep.equal({
      savedBetslipId: null,
      savedBetslipReference: null,
      submitError: null,
      submitInProgress: true,
      warnings: null,
    });
  });
  it("should update state when action type is `submitBetslip.rejected`", () => {
    expect(betslipReducer({}, submitBetslip.rejected({ message: "message" }))).to.be.deep.equal({
      submitError: "message",
      submitInProgress: false,
      warnings: null,
    });
  });
  it("should update state when action type is `submitBetslip.fulfilled`", () => {
    expect(
      betslipReducer({}, submitBetslip.fulfilled({ betslipData: { betslipId: 12345, betslipReference: "AAA-BBB" } })),
    ).to.be.deep.equal({
      savedBetslipId: 12345,
      savedBetslipReference: "AAA-BBB",
      submitConfirmation: true,
      submitError: null,
      submitInProgress: false,
      warnings: null,
    });
  });
  it("should update state when action type is `submitSingleWalletBetslip.pending`", () => {
    expect(betslipReducer({}, submitSingleWalletBetslip.pending())).to.be.deep.equal({
      submitError: null,
      submitInProgress: true,
      warnings: null,
    });
  });
  it("should update state when action type is `submitSingleWalletBetslip.rejected`", () => {
    expect(betslipReducer({}, submitSingleWalletBetslip.rejected({ message: "message" }))).to.be.deep.equal({
      submitError: "message",
      submitInProgress: false,
      warnings: null,
    });
  });
  it("should update state when action type is `submitSingleWalletBetslip.fulfilled`", () => {
    expect(betslipReducer({}, submitSingleWalletBetslip.fulfilled({ betslipData: [2, 3, 99] }))).to.be.deep.equal({
      submitConfirmation: true,
      submitError: null,
      submitInProgress: false,
      warnings: null,
    });
  });
  it("should update state when action `setAuthLanguage`", () => {
    expect(
      betslipReducer(
        {
          betslipData: { foo: "bar" },
        },
        setAuthLanguage({ language: "en" }),
      ),
    ).to.be.deep.equal({
      betslipData: {
        betData: {
          multiples: [],
          singles: [],
        },
        model: {
          outcomes: [],
        },
      },
      brVirtualBetslipData: {
        betData: {
          multiples: [],
          singles: [],
        },
        model: {
          outcomes: [],
        },
      },
      brVirtualDirtyPotentialWin: false,
      brVirtualRefreshErrors: null,
      brVirtualWarnings: null,
      dirtyPotentialWin: false,
      krVirtualBetslipData: {
        betData: {
          multiples: [],
          singles: [],
        },
        model: {
          outcomes: [],
        },
      },
      krVirtualDirtyPotentialWin: false,
      krVirtualRefreshErrors: null,
      krVirtualWarnings: null,
      refreshErrors: null,
      warnings: null,
    });
  });
  it("should update state when action `setAuthPriceFormat`", () => {
    expect(
      betslipReducer(
        {
          betslipData: { foo: "bar" },
        },
        setAuthPriceFormat({ priceFormat: "USD" }),
      ),
    ).to.be.deep.equal({
      betslipData: {
        betData: {
          multiples: [],
          singles: [],
        },
        model: {
          outcomes: [],
        },
      },
      brVirtualBetslipData: {
        betData: {
          multiples: [],
          singles: [],
        },
        model: {
          outcomes: [],
        },
      },
      brVirtualDirtyPotentialWin: false,
      brVirtualRefreshErrors: null,
      brVirtualWarnings: null,
      dirtyPotentialWin: false,
      krVirtualBetslipData: {
        betData: {
          multiples: [],
          singles: [],
        },
        model: {
          outcomes: [],
        },
      },
      krVirtualDirtyPotentialWin: false,
      krVirtualRefreshErrors: null,
      krVirtualWarnings: null,
      refreshErrors: null,
      warnings: null,
    });
  });
  it("should update state when action `acceptSubmissionConfirmation` and action.payload.clearBetslip is empty", () => {
    expect(
      betslipReducer(
        {
          betslipData: { foo: "bar" },
        },
        acceptSubmissionConfirmation({}),
      ),
    ).to.be.deep.equal({
      betslipData: { foo: "bar" },
      submitConfirmation: false,
    });
  });
  it("should update state when action `acceptSubmissionConfirmation`", () => {
    expect(
      betslipReducer(
        {
          betslipData: { foo: "bar" },
        },
        acceptSubmissionConfirmation({
          clearBetslip: true,
        }),
      ),
    ).to.be.deep.equal({
      betslipData: {
        betData: {
          multiples: [],
          singles: [],
        },
        model: {
          outcomes: [],
        },
      },
      submitConfirmation: false,
    });
  });
  it("should update state when action `clearBetslip`", () => {
    expect(
      betslipReducer(
        {
          betslipData: { foo: "bar" },
        },
        clearBetslip({}),
      ),
    ).to.be.deep.equal({
      betslipData: {
        betData: {
          multiples: [],
          singles: [],
        },
        model: {
          outcomes: [],
        },
      },
      dirtyPotentialWin: false,
      refreshErrors: null,
      warnings: null,
    });
  });
  it("should update state when action `clearErrors`", () => {
    expect(
      betslipReducer(
        {
          betslipData: { foo: "bar" },
          submitError: "submitError",
        },
        clearErrors({}),
      ),
    ).to.be.deep.equal({
      betslipData: { foo: "bar" },
      submitError: null,
    });
  });
  it("should update state when action `clearStakes`", () => {
    expect(
      betslipReducer(
        {
          betslipData: {
            betData: {
              multiples: [{ stake: 10, unitStake: 20 }],
              singles: [{ stake: 10 }],
            },
            model: {
              outcomes: [],
            },
          },
          dirtyPotentialWin: false,
          submitError: "submitError",
        },
        clearStakes({}),
      ),
    ).to.be.deep.equal({
      betslipData: {
        betData: {
          multiples: [{ stake: 0, unitStake: 0 }],
          singles: [{ stake: 0 }],
        },
        model: {
          outcomes: [],
        },
      },
      dirtyPotentialWin: true,
      submitError: "submitError",
    });
  });
  it("should update state when action `removeSelection`", () => {
    expect(
      betslipReducer(
        {
          betslipData: {
            betData: {
              multiples: [{ stake: 10, unitStake: 20 }],
              singles: [{ stake: 10 }],
            },
            model: {
              outcomes: [{ outcomeId: 42 }, { outcomeId: 52 }],
            },
          },
          dirtyPotentialWin: false,
          modelUpdateInProgress: false,
          submitError: "submitError",
        },
        removeSelection({
          outcomeId: 42,
        }),
      ),
    ).to.be.deep.equal({
      betslipData: {
        betData: {
          multiples: [{ stake: 10, unitStake: 20 }],
          singles: [{ stake: 10 }],
        },
        model: {
          outcomes: [{ outcomeId: 52 }],
        },
      },
      dirtyPotentialWin: false,
      modelUpdateInProgress: true,
      submitError: "submitError",
    });
  });
  it("shouldn't update state when action type is `undefined`", () => {
    expect(betslipReducer({}, { type: undefined })).to.be.deep.equal({});
  });
});
