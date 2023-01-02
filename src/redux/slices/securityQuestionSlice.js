import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";

export const getInitialState = (questions = null) => ({
  error: null,
  loading: false,
  questions,
});

export const getSecurityQuestion = createAsyncThunk("questions/loadQuestions", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    const result = await axios.get(`/player/securityquestions?originId=${originId}&lineId=${lineId}`);

    return {
      questions: result.data,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to obtain question details", // serializable (err.response.data)
      name: "Questions List Fetch Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

const securityQuestionSlice = createSlice({
  extraReducers: {
    [getSecurityQuestion.pending]: (state) => {
      state.error = null;
      state.loading = true;
      state.questions = null;
    },
    [getSecurityQuestion.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [getSecurityQuestion.fulfilled]: (state, action) => {
      state.error = null;
      state.loading = false;
      state.questions = action.payload.questions;
    },
  },
  initialState: getInitialState(),
  name: "question",
  reducers: {},
});
const { reducer } = securityQuestionSlice;
export default reducer;
