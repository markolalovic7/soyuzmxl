import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";

export const getInitialState = (accountData = null) => ({
  accountData,
  accountFieldErrors: null,
  error: null,
  loading: false,
  tokenValidationError: null,
  validToken: false,
  validatingToken: false,
});

export const loadAccountData = createAsyncThunk(
  "account/loadAccountData",
  async ({ accountId, authToken, language, lineId, originId }, thunkAPI) => {
    try {
      const result = await createAxiosInstance(thunkAPI.dispatch, { authToken, language }).get(
        `/player/acc/${accountId}?originId=${originId}&lineId=${lineId}`,
      );

      return { accountData: result.data };
    } catch (err) {
      const customError = {
        message: err.response?.headers["x-information"] || "Unable to load account information", // serializable (err.response.data)
        name: "Load Account Error",
        status: err.response?.statusText,
      };
      throw customError;
    }
  },
);

export const createAccount = createAsyncThunk("account/createAccount", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());

    const { user } = data;
    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });
    const result = await axios.post(`/player/acc?originId=${originId}&lineId=${lineId}`, { ...user, lineId, originId });

    return {
      accountData: result.data,
    };
  } catch (err) {
    throw thunkAPI.rejectWithValue(err?.response?.data || err);
  }
});

export const updateAccount = createAsyncThunk("account/updateAccount", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
    const { accountId, user } = data;

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    const result = await axios.put(`/player/acc/${accountId}?originId=${originId}&lineId=${lineId}`, {
      ...user,
      lineId,
      originId,
    });

    return {
      accountData: result.data,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to update account", // serializable (err.response.data)
      name: "Error Updating Account",
      status: err.response?.statusText,
      // TODO - map the response fields into actionable error fields
    };
    throw customError;
  }
});
export const updatePassword = createAsyncThunk(
  "account/updatePassword",
  async ({ accountId, oldPassword, password }, thunkAPI) => {
    try {
      const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());

      const result = await createAxiosInstance(thunkAPI.dispatch, { authToken, language }).put(
        `/player/acc/${accountId}/pwd?originId=${originId}&lineId=${lineId}`,
        {
          oldPassword,
          password,
        },
      );

      return { result };
    } catch (err) {
      const customError = {
        message: err.response?.headers["x-information"] || "Unable to update account", // serializable (err.response.data)
        name: "Error Updating Account",
        status: err.response?.statusText,
        // TODO - map the response fields into actionable error fields
      };
      throw customError;
    }
  },
);

export const requestPasswordReset = createAsyncThunk("account/requestPasswordReset", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });
    await axios.post(`/player/acc/passwordresetrequest?originId=${originId}&lineId=${lineId}`, {
      email: data.email,
      mobile: data.mobile,
    });

    return {};
  } catch (err) {
    throw thunkAPI.rejectWithValue(err?.response?.data || err);
  }
});

export const passwordResetValidate = createAsyncThunk("account/passwordResetValidate", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });
    const result = await axios.post(`/player/acc/passwordresetvalidate?originId=${originId}&lineId=${lineId}`, {
      token: data.token,
    });

    return { ...result.data };
  } catch (err) {
    throw thunkAPI.rejectWithValue(err?.response?.data || err);
  }
});

export const passwordResetConfirm = createAsyncThunk("account/passwordResetConfirm", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });
    await axios.post(`/player/acc/passwordresetconfirm?originId=${originId}&lineId=${lineId}`, {
      password: data.password,
      token: data.token,
    });

    return {};
  } catch (err) {
    throw thunkAPI.rejectWithValue(err?.response?.data || err);
  }
});

const accountSlice = createSlice({
  extraReducers: {
    [loadAccountData.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [loadAccountData.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [loadAccountData.fulfilled]: (state, action) => {
      state.accountData = action.payload.accountData;
      state.error = null;
      state.loading = false;
    },
    [createAccount.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [createAccount.rejected]: (state, action) => {
      state.accountFieldErrors = action.payload;
      state.error = action.error.message;
      state.loading = false;
    },
    [createAccount.fulfilled]: (state, action) => {
      state.accountData = action.payload.accountData;
      state.accountFieldErrors = null;
      state.error = null;
      state.loading = false;
    },
    [updateAccount.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [updateAccount.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
      // TODO: populate the error fields
    },
    [updateAccount.fulfilled]: (state, action) => {
      state.accountData = action.payload.accountData;
      state.error = null;
      state.loading = false;
    },
    [passwordResetValidate.pending]: (state) => {
      state.tokenValidationError = null;
      state.validatingToken = true;
      state.validToken = false;
    },
    [passwordResetValidate.rejected]: (state, action) => {
      state.tokenValidationError = action.error.message;
      state.validatingToken = false;
    },
    [passwordResetValidate.fulfilled]: (state, action) => {
      state.validToken = action.payload.valid;
      state.tokenValidationError = action.error?.message || action.payload.error;
      state.validatingToken = false;
    },
  },
  initialState: getInitialState(),
  name: "account",
  // reducers actions
  reducers: {
    //
  },
});
const { reducer } = accountSlice;
export default reducer;
