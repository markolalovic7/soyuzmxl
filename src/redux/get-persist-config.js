import get from "lodash.get";
import set from "lodash.set";
import { createTransform } from "redux-persist";

function persistFilter(state, paths = []) {
  const subset = {};
  paths.forEach((path) => {
    const value = get(state, path);
    if (typeof value !== "undefined") {
      set(subset, path, value);
    }
  });

  return subset;
}

function createFilter(reducerName, inboundPaths, outboundPaths) {
  return createTransform(
    (inboundState) => (inboundPaths ? persistFilter(inboundState, inboundPaths) : inboundState),
    (outboundState) => (outboundPaths ? persistFilter(outboundState, outboundPaths) : outboundState),
    {
      whitelist: [reducerName],
    },
  );
}

// Explicitly specified what fields to persist for `auth` reducer.
const authReducersFilter = createFilter("auth", [
  "accountId",
  "authToken",
  "currencyCode",
  "desktopView",
  "language",
  "loggedIn",
  "isSplitModePreferred",
  "mobileTheme",
  "desktopTheme",
  "mobileView",
  "priceFormat",
  "username",
  "rememberedUsername",
  "timezoneOffset",
]);

// Explicitly specified what fields to persist for `betslip` reducer.
const betslipReducersFilter = createFilter("betslip", ["betslipData", "jackpotBetslipData"]);

// Explicitly specified what fields to persist for `chat` reducer.
const chatReducersFilter = createFilter("chat", ["sessionId", "startTime"]);
const ezBetslipCacheReducersFilter = createFilter("ezBetslipCache", ["betslipOutcomeInitialPrices"]);
const liveReducersFilter = createFilter("live", ["liveFavourites", "multiViewEventIds"]);
const retailReducersFilter = createFilter("retailAccount", ["selectedPlayerAccountId"]);

export default ({ storage }) => ({
  key: "root",
  stateReconciler: false,
  storage,
  transforms: [
    authReducersFilter,
    betslipReducersFilter,
    chatReducersFilter,
    ezBetslipCacheReducersFilter,
    liveReducersFilter,
    retailReducersFilter,
  ],
  version: 1,
  whitelist: ["auth", "betslip", "chat", "ezBetslipCache", "live", "retailAccount"],
});
