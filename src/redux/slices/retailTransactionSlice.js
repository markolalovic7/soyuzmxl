import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";

export const getInitialState = () => ({
  error: null,
  loading: false,
  savedAdjustmentId: undefined,
  saving: false,
  ticketData: null,
  ticketPaidOut: false,
  tillAdjustmentCompleted: false,
});

export const loadTicketData = createAsyncThunk(
  "retailTransaction/loadTicket",
  async ({ betslipReference }, thunkAPI) => {
    try {
      const { authToken, language, lineId, originId, tillAuth } = getRequestParams(thunkAPI.getState());

      const result = await createAxiosInstance(thunkAPI.dispatch, { authToken, language, tillAuth }).get(
        `/retail/tickets?originId=${originId}&lineId=${lineId}&betslipReference=${betslipReference}`,
      );

      return { ticketData: result.data };
    } catch (err) {
      const customError = {
        message: err.response?.headers["x-information"] || "Unable to load ticket information", // serializable (err.response.data)
        name: "Load Ticket Details Error",
        status: err.response?.statusText,
      };
      throw customError;
    }
  },
);

export const postTicketPayout = createAsyncThunk("retailTransaction/payTicket", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId, tillAuth } = getRequestParams(thunkAPI.getState());

    const { amount, betslipId, betslipReference } = data;

    const result = await createAxiosInstance(thunkAPI.dispatch, { authToken, language, tillAuth }).post(
      `/retail/tickets/payout?originId=${originId}&lineId=${lineId}`,
      { amount, betslipId },
    );

    thunkAPI.dispatch(loadTicketData({ betslipReference }));

    return { result };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to pay ticket out", // serializable (err.response.data)
      name: "Pay Ticket Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

export const postTillTransaction = createAsyncThunk("retailTransaction/tillTransaction", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId, tillAuth } = getRequestParams(thunkAPI.getState());

    const { amount, description, isCashIn, isCashOut } = data;

    const result = await createAxiosInstance(thunkAPI.dispatch, { authToken, language, tillAuth }).post(
      `/retail/tills/adjustment?originId=${originId}&lineId=${lineId}`,
      { cashIn: isCashIn ? amount : 0, cashOut: isCashOut ? amount : 0, description },
    );

    return { transaction: result.data };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to create adjustment", // serializable (err.response.data)
      name: "Till Adjustment Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

const retailTransactionSlice = createSlice({
  extraReducers: {
    [loadTicketData.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [loadTicketData.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [loadTicketData.fulfilled]: (state, action) => {
      state.ticketData = action.payload.ticketData;
      state.error = null;
      state.loading = false;
    },

    [postTicketPayout.pending]: (state) => {
      state.saving = true;
      state.error = null;
      state.ticketPaidOut = false;
    },
    [postTicketPayout.rejected]: (state, action) => {
      state.saving = false;
      state.error = action.error.message;
    },
    [postTicketPayout.fulfilled]: (state, action) => {
      state.error = null;
      state.saving = false;
      state.ticketPaidOut = true;
    },

    [postTillTransaction.pending]: (state) => {
      state.saving = true;
      state.error = null;
      state.tillAdjustmentCompleted = false;
    },
    [postTillTransaction.rejected]: (state, action) => {
      state.saving = false;
      state.error = action.error.message;
    },
    [postTillTransaction.fulfilled]: (state, action) => {
      state.error = null;
      state.saving = false;
      state.tillAdjustmentCompleted = true;
      state.savedAdjustmentId = action.payload.transaction?.id;
    },
  },
  initialState: getInitialState(),
  name: "retailTransaction",
  // reducers actions
  reducers: {
    //
    clearTicketPaidOutStatus(state) {
      state.error = null;
      state.ticketPaidOut = false;
    },
    //
    clearTillOperationStatus(state) {
      state.error = null;
      state.tillAdjustmentCompleted = false;
      state.savedAdjustmentId = undefined;
    },
  },
});

const { actions, reducer } = retailTransactionSlice;
export const { clearTicketPaidOutStatus, clearTillOperationStatus } = actions;
export default reducer;
