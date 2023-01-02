import { createSlice } from "@reduxjs/toolkit";

export const getEZBetslipCacheInitialState = (betslipOutcomeInitialPrices = {}) => ({
  betslipOutcomeInitialPrices,
});

const ezBetslipCacheSlice = createSlice({
  extraReducers: {
    //
  },
  initialState: getEZBetslipCacheInitialState({}),
  name: "ezBetslipCache",
  reducers: {
    persistLatestOutcomePrices(state, action) {
      state.betslipOutcomeInitialPrices = action.payload.betslipOutcomeInitialPrices;
    },
  },
});

const { actions, reducer } = ezBetslipCacheSlice;
export const { persistLatestOutcomePrices } = actions;
export default reducer;
