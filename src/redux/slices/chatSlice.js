import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";
import { getAuthAccountId } from "../reselect/auth-selector";
import { getChatSessionId } from "../reselect/chat-selector";

function getChatUrl(accountId) {
  return accountId ? `/player/acc/${accountId}/chat/sessions` : `/player/chat/sessions`;
}

export const getInitialState = (sessionId = null, startTime = null) => ({
  customerTimeoutWarning: null,
  endReason: null,
  endTime: null,
  error: null,
  loading: false,
  messages: [],
  sessionId,
  startTime,
  startingSession: false,
});

export const startChatSession = createAsyncThunk("chat/startSession", async (data, thunkAPI) => {
  try {
    const { authToken, language, originId } = getRequestParams(thunkAPI.getState());
    const accountId = getAuthAccountId(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    const result = await axios.post(getChatUrl(accountId), { originId });

    return {
      sessionId: result.data?.chatSessionId,
      startTime: result.data?.startTime,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to start chat", // serializable (err.response.data)
      name: "Start Chat Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

export const loadChatSession = createAsyncThunk("chat/loadSession", async ({ chatSessionId }, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
    const accountId = getAuthAccountId(thunkAPI.getState());
    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    const result = await axios.get(`${getChatUrl(accountId)}/${chatSessionId}?originId=${originId}&lineId=${lineId}`);

    return {
      customerTimeoutWarning: result.data?.customerTimeoutWarning,
      endReason: result.data?.endReason,
      endTime: result.data?.endTime,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to load chat session details", // serializable (err.response.data)
      name: "Load Chat Session error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

export const assignChatSession = createAsyncThunk(
  "chat/assignSession",
  async ({ accountId, chatSessionId }, thunkAPI) => {
    try {
      const { authToken, language } = getRequestParams(thunkAPI.getState());

      const axios = createAxiosInstance(thunkAPI.dispatch, {
        authToken,
        language,
      });

      const result = await axios.post(`${getChatUrl(accountId)}/${chatSessionId}/assign`);

      return {
        result,
      };
    } catch (err) {
      const customError = {
        message: err.response?.headers["x-information"] || "Unable to assign chat after login", // serializable (err.response.data)
        name: "Assign Chat Error",
        status: err.response?.statusText,
      };
      throw customError;
    }
  },
);

export const endChatSession = createAsyncThunk("chat/endSession", async ({ chatSessionId }, thunkAPI) => {
  try {
    const { authToken, language } = getRequestParams(thunkAPI.getState());
    const accountId = getAuthAccountId(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    const result = await axios.post(`${getChatUrl(accountId)}/${chatSessionId}/end`, {});

    return {
      result,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to end chat", // serializable (err.response.data)
      name: "End Chat Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

export const loadChatSessionMessages = createAsyncThunk(
  "chat/loadSessionMessages",
  async ({ chatSessionId }, thunkAPI) => {
    try {
      const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
      const accountId = getAuthAccountId(thunkAPI.getState());

      const axios = createAxiosInstance(thunkAPI.dispatch, {
        authToken,
        language,
      });

      const result = await axios.get(
        `${getChatUrl(accountId)}/${chatSessionId}/messages?originId=${originId}&lineId=${lineId}`,
      );

      return {
        messages: result.data,
      };
    } catch (err) {
      const customError = {
        message: err.response?.headers["x-information"] || "Unable to load chat session details", // serializable (err.response.data)
        name: "Load Chat Error",
        status: err.response?.statusText,
      };
      throw customError;
    }
  },
);

export const postChatMessage = createAsyncThunk("chat/sendMessage", async ({ message }, thunkAPI) => {
  try {
    const { authToken, language } = getRequestParams(thunkAPI.getState());
    const accountId = getAuthAccountId(thunkAPI.getState());
    const chatSessionId = getChatSessionId(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    const result = await axios.post(`${getChatUrl(accountId)}/${chatSessionId}/messages`, message);

    return {
      message: result.data?.message,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to send chat message", // serializable (err.response.data)
      name: "Send Chat Message Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

const chatSlice = createSlice({
  extraReducers: {
    [startChatSession.pending]: (state) => {
      state.error = null;
      state.startingSession = true;
    },
    [startChatSession.rejected]: (state, action) => {
      state.error = action.error.message;
      state.startingSession = false;
    },
    [startChatSession.fulfilled]: (state, action) => {
      state.error = null;
      state.sessionId = action.payload.sessionId;
      state.startingSession = false;
      state.startTime = action.payload.startTime;
    },
    [loadChatSession.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [loadChatSession.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [loadChatSession.fulfilled]: (state, action) => {
      state.customerTimeoutWarning = action.payload.customerTimeoutWarning;
      state.endReason = action.payload.endReason;
      state.endTime = action.payload.endTime;
      state.error = null;
      state.loading = false;
    },
    [assignChatSession.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [assignChatSession.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [endChatSession.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [endChatSession.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [endChatSession.fulfilled]: (state) => {
      state.customerTimeoutWarning = null;
      state.error = null;
      state.endReason = null;
      state.endTime = null;
      state.loading = false;
      state.messages = [];
      state.sessionId = null;
      state.startTime = null;
    },
    [loadChatSessionMessages.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [loadChatSessionMessages.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [loadChatSessionMessages.fulfilled]: (state, action) => {
      state.error = null;
      state.loading = false;
      state.messages = action.payload.messages;
    },
    [postChatMessage.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [postChatMessage.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;

      // Scenario where we have a logout...
      state.customerTimeoutWarning = null;
      state.endReason = null;
      state.endTime = null;
      state.messages = [];
      state.sessionId = null;
      state.startTime = null;
    },
    [postChatMessage.fulfilled]: (state, action) => {
      state.messages.push(action.payload.message);
      state.error = null;
      state.loading = false;
    },
  },
  initialState: getInitialState(),
  name: "chat",
  reducers: {
    clearChatSession(state) {
      state.customerTimeoutWarning = null;
      state.endReason = null;
      state.messages = [];
      state.sessionId = null;
      state.startTime = null;
    },
  },
});
const { actions, reducer } = chatSlice;
export const { clearChatSession } = actions;
export default reducer;
