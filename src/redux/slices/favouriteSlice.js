import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";
import { getAuthAccountId } from "../reselect/auth-selector";

export const getInitialState = (favourites = null) => ({
  error: null,
  favourites,
  loading: false,
});

export const getFavourites = createAsyncThunk("favourites/loadFavourites", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
    const accountId = getAuthAccountId(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    const result = await axios.get(`/player/acc/${accountId}/favourites?originId=${originId}&lineId=${lineId}`);

    return {
      favourites: result.data,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to obtain favourite details", // serializable (err.response.data)
      name: "Favourite List Fetch Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

export const addFavourite = createAsyncThunk("favourites/addFavourite", async ({ eventId, eventPathId }, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
    const accountId = getAuthAccountId(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });
    await axios.post(`/player/acc/${accountId}/favourites?originId=${originId}&lineId=${lineId}`, {
      eventId,
      eventPathId,
    });

    thunkAPI.dispatch(getFavourites()); // refresh cleanly after modifying...

    return {};
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to update favourites", // serializable (err.response.data)
      name: "Favourite Add Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

export const deleteFavourite = createAsyncThunk("favourites/deleteFavourite", async ({ id }, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
    const accountId = getAuthAccountId(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });
    await axios.delete(`/player/acc/${accountId}/favourites/${id}?originId=${originId}&lineId=${lineId}`);

    thunkAPI.dispatch(getFavourites()); // refresh cleanly after modifying...

    return {};
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to delete favourites", // serializable (err.response.data)
      name: "Favourite Delete Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});
const favouriteSlice = createSlice({
  extraReducers: {
    [getFavourites.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [getFavourites.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [getFavourites.fulfilled]: (state, action) => {
      state.favourites = action.payload.favourites;
      state.error = null;
      state.loading = false;
    },
    [addFavourite.pending]: (state) => {
      state.error = null;
    },
    [addFavourite.rejected]: (state, action) => {
      state.error = action.error.message;
    },
    [addFavourite.fulfilled]: (state) => {
      state.error = null;
    },
    [deleteFavourite.pending]: (state) => {
      state.error = null;
    },
    [deleteFavourite.rejected]: (state, action) => {
      state.error = action.error.message;
    },
    [deleteFavourite.fulfilled]: (state) => {
      state.error = null;
    },
  },
  initialState: getInitialState(),
  name: "favourite",
  reducers: {},
});
const { reducer } = favouriteSlice;
export default reducer;
