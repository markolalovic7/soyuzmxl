import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import originalAxios from "axios";
import cloneDeep from "lodash.clonedeep";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";
import { getAuthAccountId, getAuthCurrencyCode, getAuthPriceFormat } from "../reselect/auth-selector";

import { setAuthLanguage, setAuthPriceFormat } from "./authSlice";
import { loadBalance, loadSingleWalletBalance } from "./balanceSlice";
import { getAvailablePromotions } from "./bonusSlice";
import { getActiveBetCount } from "./cashoutSlice";

const EMPTY_BETSLIP = {
  betData: {
    multiples: [],
    singles: [],
  },
  model: {
    outcomes: [],
  },
};

const getSpecificBetslipData = (state, br, kr) => {
  if (br) return state.brVirtualBetslipData;
  if (kr) return state.krVirtualBetslipData;

  return state.betslipData;
};

const setBetslipData = (state, betslipData, br, kr) => {
  if (br) {
    state.brVirtualBetslipData = betslipData;
  } else if (kr) {
    state.krVirtualBetslipData = betslipData;
  } else {
    state.betslipData = betslipData;
  }
};

const setDirtyPotentialWin = (state, dirtyPotentialWin, br, kr) => {
  if (br) {
    state.brVirtualDirtyPotentialWin = dirtyPotentialWin;
  } else if (kr) {
    state.krVirtualDirtyPotentialWin = dirtyPotentialWin;
  } else {
    state.dirtyPotentialWin = dirtyPotentialWin;
  }
};

const setModelUpdateInProgress = (state, modelUpdateInProgress, br, kr) => {
  if (br) {
    state.brVirtualModelUpdateInProgress = modelUpdateInProgress;
  } else if (kr) {
    state.krVirtualModelUpdateInProgress = modelUpdateInProgress;
  } else {
    state.modelUpdateInProgress = modelUpdateInProgress;
  }
};

const setRefreshErrors = (state, refreshErrors, br, kr) => {
  if (br) {
    state.brVirtualRefreshErrors = refreshErrors;
  } else if (kr) {
    state.krVirtualRefreshErrors = refreshErrors;
  } else {
    state.refreshErrors = refreshErrors;
  }
};

const setSubmitConfirmation = (state, submitConfirmation, br, kr) => {
  if (br) {
    state.brVirtualSubmitConfirmation = submitConfirmation;
  } else if (kr) {
    state.krVirtualSubmitConfirmation = submitConfirmation;
  } else {
    state.submitConfirmation = submitConfirmation;
  }
};

const setSubmitError = (state, submitError, br, kr) => {
  if (br) {
    state.brVirtualSubmitError = submitError;
  } else if (kr) {
    state.krVirtualSubmitError = submitError;
  } else {
    state.submitError = submitError;
  }
};

const setSubmitInProgress = (state, submitInProgress, br, kr) => {
  if (br) {
    state.brVirtualSubmitInProgress = submitInProgress;
  } else if (kr) {
    state.krVirtualSbmitInProgress = submitInProgress;
  } else {
    state.submitInProgress = submitInProgress;
  }
};

const setWarnings = (state, warnings, br, kr) => {
  if (br) {
    state.brVirtualWarnings = warnings;
  } else if (kr) {
    state.krVirtualWarnings = warnings;
  } else {
    state.warnings = warnings;
  }
};

export const getInitialState = (
  betslipData = EMPTY_BETSLIP,
  jackpotBetslipData = {},
  brVirtualBetslipData = EMPTY_BETSLIP,
  krVirtualBetslipData = EMPTY_BETSLIP,
) => ({
  betslipData,
  betslipRefreshingRequests: [],
  brVirtualBetslipData,
  brVirtualModelUpdateInProgress: false,
  brVirtualRefreshErrors: null,
  brVirtualSubmitConfirmation: false,
  brVirtualSubmitError: null,
  brVirtualSubmitInProgress: false,
  brVirtualWarnings: null,
  dirtyPotentialWin: false, // potential win is meaningless following a stake change, and we are waiting for a API model refresh
  jackpotBetslipData,
  jackpotModelUpdateInProgress: {},
  jackpotRefreshErrors: {},
  jackpotSubmitConfirmation: {},
  jackpotSubmitError: {},
  jackpotSubmitInProgress: {},
  jackpotWarnings: {},
  krVirtualBetslipData,
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

const BETSLIP_MODE_STANDARD = true; // TODO this comes from CMS??? Or set in local storage when CMS loads??

const sanitizeBetslipData = (betslipData) => {
  if (!BETSLIP_MODE_STANDARD) {
    // !BETSLIP_MODE_STANDARD
    const modifiedBetslipData = { ...betslipData };
    // make sure no garbage stays in the model...
    const numOutcomes = modifiedBetslipData.model.outcomes.length;
    if (numOutcomes > 1) {
      // no single should have stakes... clean it up in case it's dirty after adding/removing selections
      const cleanSingles = modifiedBetslipData.betData.singles.map((single) => ({ ...single, stake: 0 }));
      modifiedBetslipData.betData = { ...modifiedBetslipData.betData, singles: cleanSingles };
    }

    return modifiedBetslipData;
  }

  return betslipData;
};

let betslipRefreshCancelToken = null;

export const refreshBetslip = createAsyncThunk("betslips/refresh", async (data, thunkAPI) => {
  try {
    const { accountId, authToken, language, lineId, originId, retailSelectedPlayerAccountId, tillAuth } =
      getRequestParams(thunkAPI.getState());
    const priceFormat = getAuthPriceFormat(thunkAPI.getState());

    // avoid at all costs corrupting data when we are in the middle of a model override due to custom bet
    if (thunkAPI.getState().betslip.addingCustomBet) {
      const customError = {
        message: "Unable to refresh old betslip model due to ongoing custom bet processing",
        name: "Error Updating Betslips",
        status: "Betslip refresh cancelled",
      };
      throw customError;
    }
    if (
      thunkAPI.getState().betslip.brVirtualSubmitConfirmation ||
      thunkAPI.getState().betslip.krVirtualSubmitConfirmation ||
      thunkAPI.getState().betslip.submitConfirmation
    ) {
      const customError = {
        message: "Unable to refresh old betslip model due to submit bet in process",
        name: "Error Updating Betslips",
        status: "Betslip refresh cancelled",
      };
      throw customError;
    }

    // Check if there are any previous pending requests
    if (betslipRefreshCancelToken) {
      betslipRefreshCancelToken.cancel("Operation canceled due to new request.");
    }
    const axios = createAxiosInstance(thunkAPI.dispatch, { authToken, language, tillAuth });
    if (priceFormat) {
      axios.defaults.headers["x-priceformat"] = priceFormat;
    }

    // Save the cancel token for the current request
    betslipRefreshCancelToken = originalAxios.CancelToken.source();

    let betslipData = null;
    if (data?.jackpotId) {
      const currencyCode = getAuthCurrencyCode(thunkAPI.getState());
      betslipData = cloneDeep(thunkAPI.getState().betslip.jackpotBetslipData[data.jackpotId]);
      betslipData.model.currencyIsoCode = currencyCode;
    } else {
      betslipData = getSpecificBetslipData(thunkAPI.getState().betslip, data?.brVirtual, data?.krVirtual);
    }

    const sanitizedBetslipData = sanitizeBetslipData(betslipData);
    const request = { ...sanitizedBetslipData, lineId, originId };

    let url;

    if (retailSelectedPlayerAccountId) {
      // Slipstream
      url = `/retail/${
        retailSelectedPlayerAccountId ? `accounts/${retailSelectedPlayerAccountId}/` : ""
      }betslips?originId=${originId}&lineId=${lineId}`;
    } else {
      url = `/player/${accountId ? `acc/${accountId}/` : ""}betslips?originId=${originId}&lineId=${lineId}${
        data?.compactSpread ? "&compactSpread=true" : ""
      }`;
    }

    const result = await axios.put(
      url,
      request,
      { cancelToken: betslipRefreshCancelToken.token }, // Pass the cancel token to the current request
    );

    betslipRefreshCancelToken = null;

    return { betslipData: result.data, jackpotId: data?.jackpotId };
  } catch (err) {
    const customError = {
      // TODO - map the response fields into actionable error fields
      jackpotId: data?.jackpotId,
      message: err.response?.headers["x-information"] || "Unable to refresh betslip", // serializable (err.response.data)
      name: "Error Updating Betslips",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

export const submitBetslip = createAsyncThunk("betslips/submit", async (data, thunkAPI) => {
  try {
    const { accountId, authToken, language, lineId, originId, retailSelectedPlayerAccountId, tillAuth } =
      getRequestParams(thunkAPI.getState());

    const { brVirtual, isCashBet, jackpotId, krVirtual, placeMultipleOnly, placeSinglesOnly, placeSystemsOnly } = data;

    let betslipData = null;
    if (jackpotId) {
      const currencyCode = getAuthCurrencyCode(thunkAPI.getState());
      betslipData = cloneDeep(thunkAPI.getState().betslip.jackpotBetslipData[jackpotId]);
      betslipData.model.currencyIsoCode = currencyCode;
    } else {
      betslipData = cloneDeep(getSpecificBetslipData(thunkAPI.getState().betslip, brVirtual, krVirtual));
      if (placeSinglesOnly) {
        betslipData = { ...betslipData, betData: { ...betslipData.betData, multiples: [] } };
      }
      if (placeMultipleOnly) {
        betslipData = {
          ...betslipData,
          betData: {
            ...betslipData.betData,
            multiples: betslipData.betData.multiples.filter((x) => x.numOfSubBets === 1),
            singles: [],
          },
        };
      }
      if (placeSystemsOnly) {
        betslipData = {
          ...betslipData,
          betData: {
            ...betslipData.betData,
            multiples: betslipData.betData.multiples.filter((x) => x.numOfSubBets !== 1),
            singles: [],
          },
        };
      }
    }
    betslipData.model.isRetailCashBet = isCashBet;

    const axios = createAxiosInstance(thunkAPI.dispatch, { authToken, language, tillAuth });

    let url;
    if (retailSelectedPlayerAccountId) {
      url = `/retail/accounts/${retailSelectedPlayerAccountId}/betslips/submit?originId=${originId}&lineId=${lineId}`;
    } else {
      url = `/player/acc/${accountId}/betslips/submit?originId=${originId}&lineId=${lineId}`;
    }

    const result = await axios.post(url, {
      betData: betslipData.betData,
      lineId,
      model: betslipData.model,
      originId,
    });

    if (!retailSelectedPlayerAccountId) {
      thunkAPI.dispatch(getActiveBetCount());
      thunkAPI.dispatch(loadBalance());
      thunkAPI.dispatch(getAvailablePromotions());
    }

    return { betslipData: result.data };
  } catch (err) {
    const customError = {
      jackpotId: data?.jackpotId,
      message: err.response?.data?.errorMessages?.length
        ? [...new Set(err.response.data.errorMessages.map((error) => error.descriptionI18n))].join(". ")
        : "Unable to save betslip", // serializable (err.response.data),
      name: "Error Saving Betslip",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

export const submitSingleWalletBetslip = createAsyncThunk("betslips/singleWalletSubmit", async (data, thunkAPI) => {
  try {
    const { accountId, authToken, language, lineId, originId, retailSelectedPlayerAccountId, tillAuth } =
      getRequestParams(thunkAPI.getState());
    const { brVirtual, isCashBet, jackpotId, krVirtual, placeMultipleOnly, placeSinglesOnly, placeSystemsOnly } = data;

    let betslipData = null;
    if (jackpotId) {
      const currencyCode = getAuthCurrencyCode(thunkAPI.getState());
      betslipData = cloneDeep(thunkAPI.getState().betslip.jackpotBetslipData[jackpotId]);
      betslipData.model.currencyIsoCode = currencyCode;
    } else {
      betslipData = cloneDeep(getSpecificBetslipData(thunkAPI.getState().betslip, brVirtual, krVirtual));
      if (placeSinglesOnly) {
        betslipData = { ...betslipData, betData: { ...betslipData.betData, multiples: [] } };
      }
      if (placeMultipleOnly) {
        betslipData = {
          ...betslipData,
          betData: {
            ...betslipData.betData,
            multiples: betslipData.betData.multiples.filter((x) => x.numSubBets === 1),
            singles: [],
          },
        };
      }
      if (placeSystemsOnly) {
        betslipData = {
          ...betslipData,
          betData: {
            ...betslipData.betData,
            multiples: betslipData.betData.multiples.filter((x) => x.numSubBets !== 1),
            singles: [],
          },
        };
      }
    }
    betslipData.model.isRetailCashBet = isCashBet;

    const result = await createAxiosInstance(thunkAPI.dispatch, { authToken, language, tillAuth }).post(
      `/player/acc/${accountId}/singlewallet/betslips?originId=${originId}&lineId=${lineId}`,
      {
        betData: betslipData.betData,
        lineId,
        model: betslipData.model,
        originId,
      },
    );
    thunkAPI.dispatch(getActiveBetCount());
    thunkAPI.dispatch(loadSingleWalletBalance());
    thunkAPI.dispatch(getAvailablePromotions());

    return { betslipData: result.data };
  } catch (err) {
    const customError = {
      jackpotId: data?.jackpotId,
      message: err.response?.data?.errorMessages?.length
        ? [...new Set(err.response.data.errorMessages.map((error) => error.descriptionI18n))].join(". ")
        : "Unable to save betslip", // serializable (err.response.data),
      name: "Error Saving Betslip",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

async function getMaxStake(thunkAPI, data) {
  const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
  const accountId = getAuthAccountId(thunkAPI.getState());

  const betslipData = getSpecificBetslipData(thunkAPI.getState().betslip);

  const modifiedBetData = { ...betslipData.betData };
  modifiedBetData.singles = [...modifiedBetData.singles];
  modifiedBetData.multiples = [...modifiedBetData.multiples];

  // clear out preexisting stakes for the purpose of this query
  for (let index = 0; index < modifiedBetData.singles.length; index += 1) {
    modifiedBetData.singles[index] = { ...modifiedBetData.singles[index], stake: 0 }; // clear out any pre-existing stakes
  }
  for (let index = 0; index < modifiedBetData.singles.length; index += 1) {
    modifiedBetData.multiples[index] = { ...modifiedBetData.multiples[index], stake: 0, unitStake: 0 }; // clear out any pre-existing stakes
  }

  // ...and set a sample stake just for the specific bet we are after
  if (data["typeId"] === 1) {
    if (data.outcomeId) {
      const index = modifiedBetData.singles.findIndex((bet) => bet.outcomeId === parseInt(data["outcomeId"], 10));
      if (index > -1) {
        modifiedBetData.singles[index] = { ...modifiedBetData.singles[index], stake: 1 }; // sample stake for max stake purposes
      }
    } else {
      // in the case of multi-singles, brute force ask for max stake for the entire betslip
      modifiedBetData.singles = modifiedBetData.singles.map((s) => ({ ...s, stake: 1 }));
    }
  } else {
    const index = modifiedBetData.multiples.findIndex((bet) => bet.typeId === parseInt(data["typeId"], 10));
    if (index > -1) {
      modifiedBetData.multiples[index] = { ...modifiedBetData.multiples[index], stake: 1, unitStake: 1 }; // sample stake for max stake purposes
    }
  }

  const request = {
    betData: modifiedBetData,
    lineId,
    model: betslipData.model,
    originId,
  };

  const result = await createAxiosInstance(thunkAPI.dispatch, { authToken, language }).post(
    `/player/acc/${accountId}/betslips/maxstake?originId=${originId}&lineId=${lineId}`,
    request,
  );

  return result;
}

export const obtainMaxStake = createAsyncThunk("betslips/maxStake", async (data, thunkAPI) => {
  try {
    const result = await getMaxStake(thunkAPI, data);

    const maxStake = parseInt(result.data.maxStake * data["factor"], 10); // round the decimals down by converting to int

    return { maxStake };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to obtain max stake", // serializable (err.response.data)
      name: "Error Obtaining Max Stake",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

export const applyMaxStake = createAsyncThunk("betslips/maxStake", async (data, thunkAPI) => {
  try {
    const result = await getMaxStake(thunkAPI, data);

    const maxStake = parseInt(result.data.maxStake * data["factor"], 10); // round the decimals down by converting to int

    if (data["typeId"] === 1) {
      thunkAPI.dispatch(changeSingleStakes({ singleStakes: [{ outcomeId: data["outcomeId"], stake: maxStake }] }));
      thunkAPI.dispatch(refreshBetslip());
    } else {
      thunkAPI.dispatch(changeMultipleStakes({ multipleStakes: [{ typeId: data["typeId"], unitStake: maxStake }] }));
      thunkAPI.dispatch(refreshBetslip());
    }

    return { maxStake };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to obtain max stake", // serializable (err.response.data)
      name: "Error Obtaining Max Stake",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

const carryOverCompactStake = (enforceEventUniqueness, betslipData, state, brVirtual, krVirtual) => {
  if (enforceEventUniqueness && betslipData.model.outcomes.length > 0) {
    // In the case of compact betslip, carry over the stake to the new main bet type -- Note - done for HB, consider if this should only be done optionally
    let unitStake = 0;
    betslipData.betData.singles.forEach((x) => {
      if (x.stake > 0) {
        unitStake = x.stake;
      }
    });
    betslipData.betData.multiples.forEach((x) => {
      if (x.unitStake > 0) {
        unitStake = x.unitStake;
      }
    });

    if (betslipData.model.outcomes.length === 1) {
      betslipData.betData.singles[0] = { outcomeId: betslipData.model.outcomes[0].outcomeId, stake: unitStake };
    } else {
      // make sure to clear single stakes..
      const stakeClearedSingles = betslipData.betData.singles.map((x) => ({
        ...x,
        stake: 0,
      }));
      betslipData.betData.singles = stakeClearedSingles;

      // and now add a synthetic selection and unit stake to be picked up by the API
      betslipData.betData.multiples.push({
        stake: unitStake,
        typeId: betslipData.model.outcomes.length,
        unitStake,
      });
    }

    setDirtyPotentialWin(state, true, brVirtual, krVirtual);
  }
};

let addCustomBetCancelToken = null;

export const addCustomBetToBetslip = createAsyncThunk(
  "betslips/addCustomBet",
  async ({ compactSpread, customBetRequest }, thunkAPI) => {
    try {
      const { accountId, authToken, language, lineId, originId, retailSelectedPlayerAccountId, tillAuth } =
        getRequestParams(thunkAPI.getState());

      const priceFormat = getAuthPriceFormat(thunkAPI.getState());

      // Check if there are any previous pending betslip refresh requests, and cancel to avoid data corruption (race condition - tentative fix)
      if (betslipRefreshCancelToken) {
        betslipRefreshCancelToken.cancel("Operation canceled due to model change.");
      }
      // Check if there are any previous pending requests
      if (addCustomBetCancelToken) {
        addCustomBetCancelToken.cancel("Operation canceled due to new request.");
      }

      const axios = createAxiosInstance(thunkAPI.dispatch, { authToken, language, tillAuth });
      if (priceFormat) {
        axios.defaults.headers["x-priceformat"] = priceFormat;
      }

      // Save the cancel token for the current request
      addCustomBetCancelToken = originalAxios.CancelToken.source();

      const url = `/player/${
        accountId ? `acc/${accountId}/` : ""
      }betslips/addbrcustombet?originId=${originId}&lineId=${lineId}${compactSpread ? "&compactSpread=true" : ""}`;

      const result = await axios.put(
        url,
        { ...customBetRequest, lineId, originId },
        { cancelToken: addCustomBetCancelToken.token }, // Pass the cancel token to the current request
      );

      addCustomBetCancelToken = null;

      return { betslipData: result.data };
    } catch (err) {
      const customError = {
        message: err.response?.headers["x-information"] || "Unable to add custom bet to betslip", // serializable (err.response.data)
        name: "Error Updating Betslips",
        status: err.response?.statusText,
      };
      throw customError;
    }
  },
);

const betslipSlice = createSlice({
  extraReducers: {
    [setAuthLanguage]: (state) => {
      state.betslipData = EMPTY_BETSLIP;
      state.refreshErrors = null;
      state.warnings = null;
      state.dirtyPotentialWin = false;
      state.brVirtualBetslipData = EMPTY_BETSLIP;
      state.brVirtualRefreshErrors = null;
      state.brVirtualWarnings = null;
      state.brVirtualDirtyPotentialWin = false;
      state.krVirtualBetslipData = EMPTY_BETSLIP;
      state.krVirtualRefreshErrors = null;
      state.krVirtualWarnings = null;
      state.krVirtualDirtyPotentialWin = false;
    },
    [setAuthPriceFormat]: (state) => {
      state.betslipData = EMPTY_BETSLIP;
      state.refreshErrors = null;
      state.warnings = null;
      state.dirtyPotentialWin = false;
      state.brVirtualBetslipData = EMPTY_BETSLIP;
      state.brVirtualRefreshErrors = null;
      state.brVirtualWarnings = null;
      state.brVirtualDirtyPotentialWin = false;
      state.krVirtualBetslipData = EMPTY_BETSLIP;
      state.krVirtualRefreshErrors = null;
      state.krVirtualWarnings = null;
      state.krVirtualDirtyPotentialWin = false;
    },
    [addCustomBetToBetslip.pending]: (state, action) => {
      const brVirtual = false;
      const krVirtual = false;
      state.addingCustomBet = true;
      setRefreshErrors(state, null, brVirtual, krVirtual);
      setWarnings(state, null, brVirtual, krVirtual);
    },
    [addCustomBetToBetslip.rejected]: (state, action) => {
      const brVirtual = false;
      const krVirtual = false;
      setRefreshErrors(state, action.error.message, brVirtual, krVirtual);
      setWarnings(state, null, brVirtual, krVirtual);
      state.addingCustomBet = false;
    },
    [addCustomBetToBetslip.fulfilled]: (state, action) => {
      const brVirtual = false;
      const krVirtual = false;

      setBetslipData(state, action.payload.betslipData, brVirtual, krVirtual);
      setDirtyPotentialWin(state, false, brVirtual, krVirtual);
      setModelUpdateInProgress(state, false, brVirtual, krVirtual);
      setRefreshErrors(state, null, brVirtual, krVirtual);
      setWarnings(state, null, brVirtual, krVirtual);
      state.addingCustomBet = false;
    },
    [refreshBetslip.pending]: (state, action) => {
      // Track the requests being refreshed (there should not be more than one, but at times we will have one plus another being cancelled by the other)
      state.betslipRefreshingRequests.push(action.meta?.requestId);

      const jackpotId = action.meta?.arg?.jackpotId;
      if (!jackpotId) {
        const brVirtual = action.meta?.arg?.brVirtual;
        const krVirtual = action.meta?.arg?.krVirtual;
        setRefreshErrors(state, null, brVirtual, krVirtual);
        setWarnings(state, null, brVirtual, krVirtual);
      } else {
        state.jackpotRefreshErrors[jackpotId] = null;
        state.jackpotWarnings[jackpotId] = null;
      }
    },
    [refreshBetslip.rejected]: (state, action) => {
      const jackpotId = action.meta?.arg?.jackpotId;
      if (jackpotId) {
        state.jackpotRefreshErrors[jackpotId] = action.error.message;
        state.jackpotWarnings[jackpotId] = null;
      } else {
        const brVirtual = action.meta?.arg?.brVirtual;
        const krVirtual = action.meta?.arg?.krVirtual;
        setRefreshErrors(state, action.error.message, brVirtual, krVirtual);
        setWarnings(state, null, brVirtual, krVirtual);
      }

      state.betslipRefreshingRequests = state.betslipRefreshingRequests.filter((x) => x !== action.meta?.requestId);
    },
    [refreshBetslip.fulfilled]: (state, action) => {
      if (action.payload.jackpotId) {
        state.jackpotBetslipData[action.payload.jackpotId] = action.payload.betslipData;
        state.jackpotModelUpdateInProgress[action.payload.jackpotId] = false;
        state.jackpotRefreshErrors[action.payload.jackpotId] = null;
        state.jackpotWarnings[action.payload.jackpotId] = null;
      } else {
        const brVirtual = action.meta?.arg?.brVirtual;
        const krVirtual = action.meta?.arg?.krVirtual;

        setBetslipData(state, action.payload.betslipData, brVirtual, krVirtual);
        setDirtyPotentialWin(state, false, brVirtual, krVirtual);
        setModelUpdateInProgress(state, false, brVirtual, krVirtual);
        setRefreshErrors(state, null, brVirtual, krVirtual);
        setWarnings(state, null, brVirtual, krVirtual);
      }

      state.betslipRefreshingRequests = state.betslipRefreshingRequests.filter((x) => x !== action.meta?.requestId);
    },
    [submitBetslip.pending]: (state, action) => {
      const jackpotId = action.meta?.arg?.jackpotId;
      if (jackpotId) {
        state.jackpotSubmitError[jackpotId] = null;
        state.jackpotSubmitInProgress[jackpotId] = true;
        state.jackpotWarnings[jackpotId] = null;
      } else {
        const brVirtual = action.meta?.arg?.brVirtual;
        const krVirtual = action.meta?.arg?.krVirtual;

        setSubmitError(state, null, brVirtual, krVirtual);
        setSubmitInProgress(state, true, brVirtual, krVirtual);
        setWarnings(state, null, brVirtual, krVirtual);
      }
      state.savedBetslipId = null;
      state.savedBetslipReference = null;
    },
    [submitBetslip.rejected]: (state, action) => {
      const jackpotId = action.meta?.arg?.jackpotId;
      if (jackpotId) {
        state.jackpotSubmitError[jackpotId] = action.error.message;
        state.jackpotSubmitInProgress[jackpotId] = false;
        state.jackpotWarnings[jackpotId] = null;
      } else {
        const brVirtual = action.meta?.arg?.brVirtual;
        const krVirtual = action.meta?.arg?.krVirtual;

        setSubmitError(state, action.error.message, brVirtual, krVirtual);
        setSubmitInProgress(state, false, brVirtual, krVirtual);
        setWarnings(state, null, brVirtual, krVirtual);
      }
    },
    [submitBetslip.fulfilled]: (state, action) => {
      const jackpotId = action.meta?.arg?.jackpotId;
      if (jackpotId) {
        state.jackpotSubmitConfirmation[jackpotId] = true;
        state.jackpotSubmitError[jackpotId] = null;
        state.jackpotSubmitInProgress[jackpotId] = false;
        state.jackpotWarnings[jackpotId] = null;
      } else {
        const brVirtual = action.meta?.arg?.brVirtual;
        const krVirtual = action.meta?.arg?.krVirtual;

        setSubmitConfirmation(state, true, brVirtual, krVirtual);
        setSubmitError(state, null, brVirtual, krVirtual);
        setSubmitInProgress(state, false, brVirtual, krVirtual);
        setWarnings(state, null, brVirtual, krVirtual);
      }
      state.savedBetslipId = action.payload.betslipData.betslipId;
      state.savedBetslipReference = action.payload.betslipData.betslipReference;
    },
    [submitSingleWalletBetslip.pending]: (state, action) => {
      const jackpotId = action.meta?.arg?.jackpotId;
      if (jackpotId) {
        state.jackpotSubmitError[jackpotId] = null;
        state.jackpotSubmitInProgress[jackpotId] = true;
        state.jackpotWarnings[jackpotId] = null;
      } else {
        const brVirtual = action.meta?.arg?.brVirtual;
        const krVirtual = action.meta?.arg?.krVirtual;

        setSubmitError(state, null, brVirtual, krVirtual);
        setSubmitInProgress(state, true, brVirtual, krVirtual);
        setWarnings(state, null, brVirtual, krVirtual);
      }
    },
    [submitSingleWalletBetslip.rejected]: (state, action) => {
      const jackpotId = action.meta?.arg?.jackpotId;
      if (jackpotId) {
        state.jackpotSubmitError[jackpotId] = action.error.message;
        state.jackpotSubmitInProgress[jackpotId] = false;
        state.jackpotWarnings[jackpotId] = null;
      } else {
        const brVirtual = action.meta?.arg?.brVirtual;
        const krVirtual = action.meta?.arg?.krVirtual;

        setSubmitError(state, action.error.message, brVirtual, krVirtual);
        setSubmitInProgress(state, false, brVirtual, krVirtual);
        setWarnings(state, null, brVirtual, krVirtual);
      }
    },
    [submitSingleWalletBetslip.fulfilled]: (state, action) => {
      const jackpotId = action.meta?.arg?.jackpotId;
      if (jackpotId) {
        state.jackpotSubmitConfirmation[jackpotId] = true;
        state.jackpotSubmitError[jackpotId] = null;
        state.jackpotSubmitInProgress[jackpotId] = false;
        state.jackpotWarnings[jackpotId] = null;
      } else {
        const brVirtual = action.meta?.arg?.brVirtual;
        const krVirtual = action.meta?.arg?.krVirtual;

        setSubmitConfirmation(state, true, brVirtual, krVirtual);
        setSubmitError(state, null, brVirtual, krVirtual);
        setSubmitInProgress(state, false, brVirtual, krVirtual);
        setWarnings(state, null, brVirtual, krVirtual);
      }
    },
  },
  initialState: getInitialState(),
  name: "betslip",
  // reducers actions
  reducers: {
    acceptJackpotSubmissionConfirmation(state, { payload }) {
      state.jackpotSubmitConfirmation[payload.jackpotId] = false;
      if (payload.jackpotId) {
        delete state.jackpotBetslipData[payload.jackpotId];
      }
    },
    acceptSubmissionConfirmation(state, { payload }) {
      setSubmitConfirmation(state, false, payload.brVirtual, payload.krVirtual);
      if (payload.clearBetslip) {
        setBetslipData(state, EMPTY_BETSLIP, payload.brVirtual, payload.krVirtual);
      }
    },
    addSelection(state, action) {
      const outcomeId = Number(action.payload.outcomeId);
      const eventId = Number(action.payload.eventId);
      const enforceEventUniqueness = action.payload.enforceEventUniqueness;

      // Check if there are any previous pending betslip refresh requests, and cancel to avoid data corruption (race condition - tentative fix)
      if (betslipRefreshCancelToken) {
        betslipRefreshCancelToken.cancel("Operation canceled due to model change.");
      }

      setModelUpdateInProgress(state, true, action.payload.brVirtual, action.payload.krVirtual);

      const betslipData = getSpecificBetslipData(state, action.payload.brVirtual, action.payload.krVirtual);
      if (betslipData.model.outcomes.findIndex((outcome) => outcome.outcomeId === outcomeId) < 0) {
        // avoid duplicates
        if (enforceEventUniqueness) {
          const indexByEvent = betslipData.model.outcomes.findIndex((outcome) => outcome.eventId === eventId);
          if (indexByEvent > -1) betslipData.model.outcomes.splice(indexByEvent, 1);
        }
        betslipData.model.outcomes.push({ outcomeId });
      }
    },
    changeMultipleStakes(state, action) {
      action.payload.multipleStakes.forEach((bet) => {
        const typeId = Number(bet.typeId);
        const stake = bet.stake;
        const unitStake = bet.unitStake;
        const betslipData = getSpecificBetslipData(state, action.payload.brVirtual, action.payload.krVirtual);
        const index = betslipData.betData.multiples.findIndex((bet) => bet.typeId === typeId);
        if (index > -1) {
          // Check if there are any previous pending betslip refresh requests, and cancel to avoid data corruption (race condition - tentative fix)
          if (betslipRefreshCancelToken) {
            betslipRefreshCancelToken.cancel("Operation canceled due to model change.");
          }

          betslipData.betData.multiples[index].unitStake = unitStake;
          betslipData.betData.multiples[index].stake = stake;
          setDirtyPotentialWin(state, true, action.payload.brVirtual, action.payload.krVirtual);
        }
      });
    },

    changeSingleStakes(state, action) {
      action.payload.singleStakes.forEach((bet) => {
        const outcomeId = Number(bet.outcomeId);
        const stake = bet.stake;
        const betslipData = getSpecificBetslipData(state, action.payload.brVirtual, action.payload.krVirtual);
        const index = betslipData.betData.singles.findIndex((bet) => bet.outcomeId === outcomeId);
        if (index > -1) {
          // Check if there are any previous pending betslip refresh requests, and cancel to avoid data corruption (race condition - tentative fix)
          if (betslipRefreshCancelToken) {
            betslipRefreshCancelToken.cancel("Operation canceled due to model change.");
          }

          betslipData.betData.singles[index].stake = stake;
          setDirtyPotentialWin(state, true, action.payload.brVirtual, action.payload.krVirtual);
        }
      });
    },

    claimFreeBetRewardId(state, action) {
      const freeBetId = action.payload.freeBetId;
      const outcomeId = action.payload.outcomeId;
      const typeId = action.payload.typeId;

      const betslipData = getSpecificBetslipData(state, action.payload.brVirtual, action.payload.krVirtual);
      if (typeId === 1) {
        const index = betslipData.betData.singles.findIndex((bet) => bet.outcomeId === outcomeId);
        if (index > -1) {
          betslipData.betData.singles[index].selectedFreeBetId = freeBetId;
        }
      } else {
        const index = betslipData.betData.multiples.findIndex((bet) => bet.typeId === typeId);
        if (index > -1) {
          betslipData.betData.multiples[index].selectedFreeBetId = freeBetId;
        }
      }
    },

    clearBetslip(state, action) {
      const brVirtual = action.payload.brVirtual;
      const krVirtual = action.payload.krVirtual;
      // Check if there are any previous pending betslip refresh requests, and cancel to avoid data corruption (race condition - tentative fix)
      if (betslipRefreshCancelToken) {
        betslipRefreshCancelToken.cancel("Operation canceled due to model change.");
      }
      setBetslipData(state, EMPTY_BETSLIP, brVirtual, krVirtual);
      setRefreshErrors(state, null, brVirtual, krVirtual);
      setWarnings(state, null, brVirtual, krVirtual);
      setDirtyPotentialWin(state, false, brVirtual, krVirtual);
    },

    clearErrors(state, action) {
      setSubmitError(state, null, action.payload.brVirtual, action.payload.krVirtual);
    },
    clearJackpotBetslip(state, action) {
      delete state.jackpotBetslipData[action.payload.jackpotId];
      state.jackpotRefreshErrors[action.payload.jackpotId] = null;
      state.jackpotWarnings[action.payload.jackpotId] = null;
      state.dirtyPotentialWin = false;
    },
    clearStakes(state, action) {
      const brVirtual = action.payload.brVirtual;
      const krVirtual = action.payload.krVirtual;

      // Check if there are any previous pending betslip refresh requests, and cancel to avoid data corruption (race condition - tentative fix)
      if (betslipRefreshCancelToken) {
        betslipRefreshCancelToken.cancel("Operation canceled due to model change.");
      }

      const betslipData = getSpecificBetslipData(state, brVirtual, krVirtual);
      betslipData.betData.singles.forEach((bet) => {
        bet.stake = 0;
      });
      betslipData.betData.multiples.forEach((bet) => {
        bet.stake = 0;
        bet.unitStake = 0;
      });
      setDirtyPotentialWin(state, true, brVirtual, krVirtual);
    },
    clearStakesByTypeIds(state, action) {
      const brVirtual = action.payload.brVirtual;
      const krVirtual = action.payload.krVirtual;

      // Check if there are any previous pending betslip refresh requests, and cancel to avoid data corruption (race condition - tentative fix)
      if (betslipRefreshCancelToken) {
        betslipRefreshCancelToken.cancel("Operation canceled due to model change.");
      }

      const betslipData = getSpecificBetslipData(state, brVirtual, krVirtual);
      action.payload.typeIds.forEach((typeId) => {
        if (typeId === 1) {
          betslipData.betData.singles.forEach((bet) => {
            bet.stake = 0;
          });
        } else {
          state.betslipData.betData.multiples
            .filter((m) => m.typeId === typeId)
            .forEach((bet) => {
              bet.stake = 0;
              bet.unitStake = 0;
            });
        }
        setDirtyPotentialWin(state, true, brVirtual, krVirtual);
      });
    },
    removeJackpotSelection(state, action) {
      const outcomeId = parseInt(action.payload.outcomeId, 10);
      const outcomeIndex = state.jackpotBetslipData[action.payload.jackpotId]?.model?.outcomes?.findIndex(
        (outcome) => outcome.outcomeId === outcomeId,
      );
      state.modelUpdateInProgress = true;
      if (outcomeIndex === -1) {
        return;
      }
      state.jackpotBetslipData[action.payload.jackpotId]?.model?.outcomes?.splice(outcomeIndex, 1);
    },
    removeSelection(state, action) {
      const brVirtual = action.payload.brVirtual;
      const krVirtual = action.payload.krVirtual;
      const outcomeId = Number(action.payload.outcomeId);
      const enforceEventUniqueness = action.payload.enforceEventUniqueness;

      // Check if there are any previous pending betslip refresh requests, and cancel to avoid data corruption (race condition - tentative fix)
      if (betslipRefreshCancelToken) {
        betslipRefreshCancelToken.cancel("Operation canceled due to model change.");
      }

      const betslipData = getSpecificBetslipData(state, brVirtual, krVirtual);
      const outcomeIndex = betslipData.model.outcomes.findIndex((outcome) => outcome.outcomeId === outcomeId);
      setModelUpdateInProgress(state, true, brVirtual, krVirtual);
      if (outcomeIndex === -1) {
        return;
      }
      betslipData.model.outcomes.splice(outcomeIndex, 1);

      carryOverCompactStake(enforceEventUniqueness, betslipData, state, brVirtual, krVirtual);
    },
    toggleJackpotSelection(state, action) {
      const eventId = parseInt(action.payload.eventId, 10);
      const jackpotId = parseInt(action.payload.jackpotId, 10);
      const outcomeId = parseInt(action.payload.outcomeId, 10);

      if (!state.jackpotBetslipData[jackpotId]) {
        state.jackpotBetslipData[jackpotId] = cloneDeep(EMPTY_BETSLIP);
        state.jackpotBetslipData[jackpotId].model.jackpotId = jackpotId;
      }

      const jackpotBetslipData = state.jackpotBetslipData[jackpotId];
      const index = jackpotBetslipData.model.outcomes.findIndex((outcome) => outcome.outcomeId === outcomeId);
      if (index > -1) {
        jackpotBetslipData.model.outcomes.splice(index, 1);
      } else {
        state.jackpotBetslipData[jackpotId].model.outcomes.push({ eventId, outcomeId });
      }
      state.jackpotBetslipData[jackpotId] = jackpotBetslipData;

      state.jackmodelUpdateInProgress = true;
    },
    toggleSelection(state, action) {
      const brVirtual = action.payload.brVirtual;
      const krVirtual = action.payload.krVirtual;
      const outcomeId = Number(action.payload.outcomeId);
      const eventId = Number(action.payload.eventId);
      const enforceEventUniqueness = action.payload.enforceEventUniqueness;

      setModelUpdateInProgress(state, true, brVirtual, krVirtual);

      // Check if there are any previous pending betslip refresh requests, and cancel to avoid data corruption (race condition - tentative fix)
      if (betslipRefreshCancelToken) {
        betslipRefreshCancelToken.cancel("Operation canceled due to model change.");
      }

      const betslipData = getSpecificBetslipData(state, brVirtual, krVirtual);
      const index = betslipData.model.outcomes.findIndex((outcome) => outcome.outcomeId === outcomeId);
      if (index > -1) {
        betslipData.model.outcomes.splice(index, 1);
      } else {
        if (enforceEventUniqueness) {
          const indexByEvent = betslipData.model.outcomes.findIndex((outcome) => outcome.eventId === eventId);
          if (indexByEvent > -1) betslipData.model.outcomes.splice(indexByEvent, 1);
        }
        betslipData.model.outcomes.push({ eventId, outcomeId });
      }

      carryOverCompactStake(enforceEventUniqueness, betslipData, state, brVirtual, krVirtual);
    },
    toggleSelectionForMultiples(state, action) {
      const outcomeId = Number(action.payload.outcomeId);
      const betslipData = getSpecificBetslipData(state, action.payload.brVirtual, action.payload.krVirtual);

      const index = betslipData.model.outcomes.findIndex((outcome) => outcome.outcomeId === outcomeId);
      if (index > -1) {
        betslipData.model.outcomes[index] = {
          ...betslipData.model.outcomes[index],
          enabled: !betslipData.model.outcomes[index].enabled,
        };
      }
      setModelUpdateInProgress(state, true, action.payload.brVirtual, action.payload.krVirtual);
    },

    unclaimFreeBetRewardId(state, action) {
      const freeBetId = action.payload.freeBetId;
      const outcomeId = action.payload.outcomeId;
      const typeId = action.payload.typeId;

      const betslipData = getSpecificBetslipData(state, action.payload.brVirtual, action.payload.krVirtual);
      if (typeId === 1) {
        const index = betslipData.betData.singles.findIndex((bet) => bet.outcomeId === outcomeId);
        if (index > -1) {
          betslipData.betData.singles[index].stake = 0;
          betslipData.betData.singles[index].selectedFreeBetId = undefined;
        }
      } else {
        const index = betslipData.betData.multiples.findIndex((bet) => bet.typeId === typeId);
        if (index > -1) {
          betslipData.betData.multiples[index].unitStake = 0;
          betslipData.betData.multiples[index].stake = 0;
          betslipData.betData.multiples[index].selectedFreeBetId = undefined;
        }
      }
    },
  },
});

const { actions, reducer } = betslipSlice;
export const {
  acceptJackpotSubmissionConfirmation,
  acceptSubmissionConfirmation,
  addSelection,
  changeMultipleStakes,
  changeSingleStakes,
  claimFreeBetRewardId,
  clearBetslip,
  clearErrors,
  clearJackpotBetslip,
  clearStakes,
  clearStakesByTypeIds,
  removeJackpotSelection,
  removeSelection,
  toggleJackpotSelection,
  toggleSelection,
  toggleSelectionForMultiples,
  unclaimFreeBetRewardId,
} = actions;
export default reducer;
