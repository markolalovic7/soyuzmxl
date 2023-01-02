import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import originalAxios from "axios";

import { isNotEmpty } from "../../utils/lodash";
import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";

export const getRetailInitialState = (selectedPlayerAccountId = undefined) => ({
  accountSearchResults: null,
  error: null,
  loading: false,
  nfcUploadError: undefined,
  photoUploadError: undefined,
  pinValidationError: null,
  pinValidationSuccess: false,
  playerAccountBalance: null,
  playerAccountPhoto: null,
  savingNfc: false,
  savingPhoto: false,
  selectedPlayerAccountData: null,
  selectedPlayerAccountId,
  validatingPin: false,
});

export const loadRetailPlayerAccountData = createAsyncThunk(
  "retailAccount/loadRetailPlayerAccountData",
  async ({ accountId }, thunkAPI) => {
    try {
      const { authToken, language, lineId, originId, tillAuth } = getRequestParams(thunkAPI.getState());

      const result = await createAxiosInstance(thunkAPI.dispatch, { authToken, language, tillAuth }).get(
        `/retail/accounts/${accountId}?originId=${originId}&lineId=${lineId}`,
      );

      return { selectedPlayerAccountData: result.data };
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

export const searchAccountData = createAsyncThunk(
  "retailAccount/searchAccountData",
  async ({ emailSearch, firstNameSearch, lastNameSearch, usernameSearch }, thunkAPI) => {
    try {
      const { authToken, language, lineId, originId, tillAuth } = getRequestParams(thunkAPI.getState());

      let params = "";
      if (firstNameSearch) {
        params = `${params}&firstName=${firstNameSearch}`;
      }
      if (lastNameSearch) {
        params = `${params}&lastName=${lastNameSearch}`;
      }
      if (usernameSearch) {
        params = `${params}&username=${usernameSearch}`;
      }
      if (emailSearch) {
        params = `${params}&email=${emailSearch}`;
      }

      const result = await createAxiosInstance(thunkAPI.dispatch, { authToken, language, tillAuth }).get(
        `/retail/accounts/search?originId=${originId}&lineId=${lineId}${params}`,
      );

      return { accountSearchResults: result.data };
    } catch (err) {
      const customError = {
        message: err.response?.headers["x-information"] || "Unable to search account information", // serializable (err.response.data)
        name: "Search Account Error",
        status: err.response?.statusText,
      };
      throw customError;
    }
  },
);

export const searchAccountByNfc = createAsyncThunk("retailAccount/searchbynfc", async ({ nfc }, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId, tillAuth } = getRequestParams(thunkAPI.getState());

    const result = await createAxiosInstance(thunkAPI.dispatch, { authToken, language, tillAuth }).get(
      `/retail/accounts/searchbynfc/${nfc}?originId=${originId}&lineId=${lineId}`,
    );

    return { accountSearchResult: result.data };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to search account information", // serializable (err.response.data)
      name: "Search Account Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

export const createRetailPlayerAccount = createAsyncThunk("retailAccount/createAccount", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId, tillAuth } = getRequestParams(thunkAPI.getState());

    const { user } = data;
    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
      tillAuth,
    });
    const result = await axios.post(`/retail/accounts?originId=${originId}&lineId=${lineId}`, {
      ...user,
      lineId,
      originId,
    });

    return {
      selectedPlayerAccountData: result.data,
      selectedPlayerAccountId: result.data.id,
    };
  } catch (err) {
    throw thunkAPI.rejectWithValue(err?.response?.data || err);
  }
});

export const updateRetailPlayerAccount = createAsyncThunk("retailAccount/updateAccount", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId, tillAuth } = getRequestParams(thunkAPI.getState());
    const { accountId, user } = data;

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
      tillAuth,
    });

    const result = await axios.put(`/retail/accounts/${accountId}?originId=${originId}&lineId=${lineId}`, {
      ...user,
      lineId,
      originId,
    });

    return {
      selectedPlayerAccountData: result.data,
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

export const validatePin = createAsyncThunk("retailAccount/validatePin", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId, tillAuth } = getRequestParams(thunkAPI.getState());

    const { accountId, digitData } = data;
    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
      tillAuth,
    });

    const result = await axios.post(
      `/retail/accounts/${accountId}/validatePin?originId=${originId}&lineId=${lineId}`,
      digitData,
    );

    return {};
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Invalid Pin", // serializable (err.response.data)
      name: "Invalid Pin",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

export const alive = createAsyncThunk("retailAccount/alive", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId, tillAuth } = getRequestParams(thunkAPI.getState());

    const result = await createAxiosInstance(thunkAPI.dispatch, { authToken, language, tillAuth }).get(
      `/retail/alive?originId=${originId}&lineId=${lineId}`,
    );

    return { result: true };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to hit the alive call", // serializable (err.response.data)
      name: "Alive Message Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

export const getRetailAccountBalance = createAsyncThunk(
  "retailAccount/loadRetailPlayerAccountBalance",
  async ({ accountId }, thunkAPI) => {
    try {
      const { authToken, language, lineId, originId, tillAuth } = getRequestParams(thunkAPI.getState());

      const result = await createAxiosInstance(thunkAPI.dispatch, { authToken, language, tillAuth }).get(
        `/retail/accounts/${accountId}/balance?originId=${originId}&lineId=${lineId}`,
      );

      return { playerAccountBalance: result.data };
    } catch (err) {
      const customError = {
        message: err.response?.headers["x-information"] || "Unable to load account balance information", // serializable (err.response.data)
        name: "Load Account Balance Error",
        status: err.response?.statusText,
      };
      throw customError;
    }
  },
);

export const getRetailPlayerAccountPhoto = createAsyncThunk(
  "retailAccount/loadRetailPlayerAccountPhoto",
  async ({ accountId }, thunkAPI) => {
    try {
      const { authToken, language, lineId, originId, tillAuth } = getRequestParams(thunkAPI.getState());

      const axios = createAxiosInstance(thunkAPI.dispatch, { authToken, language, tillAuth });

      axios.defaults.headers["Content-Type"] = null;
      axios.defaults.headers["Accept"] = "*/*";

      const result = await axios.get(
        `/retail/accounts/${accountId}/image?originId=${originId}&lineId=${lineId}`,
        //     {
        //   responseType: "blob",
        // }
      );

      return { playerAccountPhoto: result.data };
    } catch (err) {
      const customError = {
        message: err.response?.headers["x-information"] || "Unable to load account photo information", // serializable (err.response.data)
        name: "Load Account Photo Error",
        status: err.response?.statusText,
      };
      throw customError;
    }
  },
);

export const updateRetailPlayerAccountPhoto = createAsyncThunk(
  "retailAccount/updateAccountPhoto",
  async (data, thunkAPI) => {
    try {
      const { authToken, language, lineId, originId, tillAuth } = getRequestParams(thunkAPI.getState());
      const { accountId, fileObject } = data;

      const axios = createAxiosInstance(thunkAPI.dispatch, {
        authToken,
        language,
        tillAuth,
      });

      axios.defaults.headers["Content-Type"] = "multipart/form-data";

      const bodyFormData = new FormData();
      bodyFormData.append("file", fileObject);

      const result = await axios.put(
        `/retail/accounts/${accountId}/image?originId=${originId}&lineId=${lineId}`,
        bodyFormData,
      );

      thunkAPI.dispatch(getRetailPlayerAccountPhoto({ accountId }));

      return {
        result: true,
      };
    } catch (err) {
      const customError = {
        message: err.response?.headers["x-information"] || "Unable to update account photo", // serializable (err.response.data)
        name: "Error Updating Account Photo",
        status: err.response?.statusText,
        // TODO - map the response fields into actionable error fields
      };
      throw customError;
    }
  },
);

export const updateRetailPlayerAccountNfc = createAsyncThunk(
  "retailAccount/updateRetailPlayerAccountNfc",
  async (data, thunkAPI) => {
    try {
      const { authToken, language, lineId, originId, tillAuth } = getRequestParams(thunkAPI.getState());
      const { accountId, nfc } = data;

      const axios = createAxiosInstance(thunkAPI.dispatch, {
        authToken,
        language,
        tillAuth,
      });

      const result = await axios.put(`/retail/accounts/${accountId}/nfc?originId=${originId}&lineId=${lineId}`, {
        nfc,
      });

      return {
        confirmed: true,
      };
    } catch (err) {
      const customError = {
        message:
          err.response?.headers["x-information"] ||
          (isNotEmpty(err.response?.data?.errors) && err.response?.data?.errors[0]) ||
          "Unable to update account NFC", // serializable (err.response.data)
        name: "Error Updating Account NFC",
        status: err.response?.statusText,
        // TODO - map the response fields into actionable error fields
      };
      throw customError;
    }
  },
);

// export const updatePassword = createAsyncThunk(
//   "account/updatePassword",
//   async ({ accountId, oldPassword, password }, thunkAPI) => {
//     try {
//       const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
//
//       const result = await createAxiosInstance(thunkAPI.dispatch, { authToken, language }).put(
//         `/player/acc/${accountId}/pwd?originId=${originId}&lineId=${lineId}`,
//         {
//           oldPassword,
//           password,
//         },
//       );
//
//       return { result };
//     } catch (err) {
//       const customError = {
//         message: err.response?.headers["x-information"] || "Unable to update account", // serializable (err.response.data)
//         name: "Error Updating Account",
//         status: err.response?.statusText,
//         // TODO - map the response fields into actionable error fields
//       };
//       throw customError;
//     }
//   },
// );

// export const requestPasswordReset = createAsyncThunk("account/requestPasswordReset", async (data, thunkAPI) => {
//   try {
//     const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
//
//     const axios = createAxiosInstance(thunkAPI.dispatch, {
//       authToken,
//       language,
//     });
//     await axios.post(`/player/acc/passwordresetrequest?originId=${originId}&lineId=${lineId}`, {
//       email: data.email,
//       mobile: data.mobile,
//     });
//
//     return {};
//   } catch (err) {
//     throw thunkAPI.rejectWithValue(err?.response?.data || err);
//   }
// });

export const loadRetailNfc = createAsyncThunk("auth/loadRetailNfc", async (data, thunkAPI) => {
  try {
    // This is basically the user's localhost (with a change in /etc/hosts). Please check the Ringfence or BridgeSocket docs for more details
    const nfcResult = await originalAxios.get("https://bridgesocket.platform8.software:8889/nfc");

    return {
      nfc: nfcResult.data.replaceAll("\n", "").trim(),
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to obtain UUID", // serializable (err.response.data)
      name: "UUID retrieval Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

const retailAccountSlice = createSlice({
  extraReducers: {
    [alive.pending]: (state) => {
      //
    },
    [alive.rejected]: (state, action) => {
      //
    },
    [alive.fulfilled]: (state, action) => {
      //
    },
    [getRetailAccountBalance.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getRetailAccountBalance.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getRetailAccountBalance.fulfilled]: (state, action) => {
      state.playerAccountBalance = action.payload.playerAccountBalance;
      state.error = null;
      state.loading = false;
    },

    [loadRetailPlayerAccountData.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [loadRetailPlayerAccountData.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [loadRetailPlayerAccountData.fulfilled]: (state, action) => {
      state.selectedPlayerAccountData = action.payload.selectedPlayerAccountData;
      state.error = null;
      state.loading = false;
    },

    [getRetailPlayerAccountPhoto.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getRetailPlayerAccountPhoto.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getRetailPlayerAccountPhoto.fulfilled]: (state, action) => {
      state.playerAccountPhoto = action.payload.playerAccountPhoto;
      state.error = null;
      state.loading = false;
    },

    [searchAccountData.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [searchAccountData.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [searchAccountData.fulfilled]: (state, action) => {
      state.accountSearchResults = action.payload.accountSearchResults;
      state.error = null;
      state.loading = false;
    },
    [createRetailPlayerAccount.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [createRetailPlayerAccount.rejected]: (state, action) => {
      state.accountFieldErrors = action.payload;
      state.error = action.error.message;
      state.loading = false;
    },
    [createRetailPlayerAccount.fulfilled]: (state, action) => {
      state.selectedPlayerAccountData = action.payload.selectedPlayerAccountData;
      state.selectedPlayerAccountId = action.payload.selectedPlayerAccountId;
      state.accountFieldErrors = null;
      state.error = null;
      state.loading = false;
    },
    [updateRetailPlayerAccount.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [updateRetailPlayerAccount.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
      // TODO: populate the error fields
    },
    [updateRetailPlayerAccount.fulfilled]: (state, action) => {
      state.selectedPlayerAccountData = action.payload.selectedPlayerAccountData;
      state.error = null;
      state.loading = false;
    },

    [updateRetailPlayerAccountPhoto.pending]: (state) => {
      state.photoUploadError = null;
      state.savingPhoto = true;
    },
    [updateRetailPlayerAccountPhoto.rejected]: (state, action) => {
      state.photoUploadError = action.error.message;
      state.savingPhoto = false;
      // TODO: populate the error fields
    },
    [updateRetailPlayerAccountPhoto.fulfilled]: (state, action) => {
      state.photoUploadError = null;
      state.savingPhoto = false;
    },

    [updateRetailPlayerAccountNfc.pending]: (state) => {
      state.nfcUploadError = null;
      state.savingNfc = true;
    },
    [updateRetailPlayerAccountNfc.rejected]: (state, action) => {
      state.nfcUploadError = action.error.message;
      state.savingNfc = false;
      // TODO: populate the error fields
    },
    [updateRetailPlayerAccountNfc.fulfilled]: (state, action) => {
      state.nfcUploadError = null;
      state.savingNfc = false;
    },

    [validatePin.pending]: (state) => {
      state.pinValidationError = null;
      state.validatingPin = true;
      state.pinValidationSuccess = false;
    },
    [validatePin.rejected]: (state, action) => {
      state.pinValidationError = action.error.message;
      state.validatingPin = false;
      state.pinValidationSuccess = false;
      // TODO: populate the error fields
    },
    [validatePin.fulfilled]: (state, action) => {
      state.pinValidationError = null;
      state.validatingPin = false;
      state.pinValidationSuccess = true;
    },

    // [passwordResetValidate.pending]: (state) => {
    //   state.tokenValidationError = null;
    //   state.validatingToken = true;
    //   state.validToken = false;
    // },
    // [passwordResetValidate.rejected]: (state, action) => {
    //   state.tokenValidationError = action.error.message;
    //   state.validatingToken = false;
    // },
    // [passwordResetValidate.fulfilled]: (state, action) => {
    //   state.validToken = action.payload.valid;
    //   state.tokenValidationError = action.error?.message || action.payload.error;
    //   state.validatingToken = false;
    // },
  },
  initialState: getRetailInitialState(),
  name: "retailAccount",
  // reducers actions
  reducers: {
    //
    setClearPinValidationState(state) {
      state.pinValidationError = null;
      state.validatingPin = false;
      state.pinValidationSuccess = false;
    },
    setRetailPlayerAccountId(state, action) {
      state.selectedPlayerAccountId = action.payload.accountId;
      state.selectedPlayerAccountData = undefined;
      state.playerAccountBalance = null;
    },
  },
});
const { actions, reducer } = retailAccountSlice;
export const { setClearPinValidationState, setRetailPlayerAccountId } = actions;
export default reducer;
