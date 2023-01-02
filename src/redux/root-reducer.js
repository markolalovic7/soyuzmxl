import { combineReducers } from "redux";
import { PURGE, REHYDRATE } from "redux-persist";

import { AUTH_USER_UNAUTHORIZED } from "./actions/auth-actions";
import accountReducer from "./slices/accountSlice";
import assetReducer from "./slices/assetSlice";
import authReducer, { getInitialState as getAuthInitialState } from "./slices/authSlice";
import avLiveReducer from "./slices/avLiveSlice";
import balanceReducer from "./slices/balanceSlice";
import betslipReducer, { getInitialState as getBetslipInitialState } from "./slices/betslipSlice";
import bonusReducer from "./slices/bonusSlice";
import cashoutReducer from "./slices/cashoutSlice";
import chatReducer, { getInitialState as getChatInitialState } from "./slices/chatSlice";
import cmsReducer from "./slices/cmsSlice";
import countryReducer from "./slices/countrySlice";
import couponReducer from "./slices/couponSlice";
import currencyReducer from "./slices/currencySlice";
import ezBetslipCacheReducer, { getEZBetslipCacheInitialState } from "./slices/ezBetslipCacheSlice";
import ezSettingReducer from "./slices/ezSettingsSlice";
import favouriteReducer from "./slices/favouriteSlice";
import jackpotReducer from "./slices/jackpotSlice";
import languagesReducer from "./slices/languageSlice";
import liveCalendarReducer from "./slices/liveCalendarSlice";
import liveReducer, { getInitialState as getLiveInitialState } from "./slices/liveSlice";
import matchStatusesReducer from "./slices/matchStatusSlice";
import periodsReducer from "./slices/periodSlice";
import recommenderReducer from "./slices/recommenderSlice";
import referralReducer from "./slices/referralSlice";
import resultReducer from "./slices/resultSlice";
import retailAccountReducer, { getRetailInitialState } from "./slices/retailAccountSlice";
import retailTillReducer from "./slices/retailTillSlice";
import retailTransactionReducer from "./slices/retailTransactionSlice";
import securityQuestionReducer from "./slices/securityQuestionSlice";
import solidGamingReducer from "./slices/solidGamingSlice";
import sportReducer from "./slices/sportSlice";
import sportsTreeReducer from "./slices/sportsTreeSlice";
import backdoor from "./utils/reduxBackdoor";

function accountReducerWrapper(state, action) {
  switch (action.type) {
    case AUTH_USER_UNAUTHORIZED:
    case PURGE:
      return accountReducer(undefined, action);
    default:
      return accountReducer(state, action);
  }
}

function authReducerWrapper(state, action) {
  switch (action.type) {
    case REHYDRATE: {
      // Hack: `liveSlice` uses `language`, `priceFormat` but has no direct access to this state.
      // Therefore, update them when in redux values changed.
      backdoor.language = action.payload?.auth?.language;
      backdoor.priceFormat = action.payload?.auth?.priceFormat;

      return authReducer(
        getAuthInitialState({
          accountId: action.payload?.auth?.accountId,
          authLoginURL: action.payload?.auth?.authLoginURL,
          authToken: action.payload?.auth?.authToken,
          currencyCode: action.payload?.auth?.currencyCode,
          desktopTheme: action.payload?.auth?.desktopTheme,
          desktopView: action.payload?.auth?.desktopView,
          isSplitModePreferred: action.payload?.auth?.isSplitModePreferred,
          language: action.payload?.auth?.language,
          loggedIn: action.payload?.auth?.loggedIn,
          mobileTheme: action.payload?.auth?.mobileTheme,
          mobileView: action.payload?.auth?.mobileView,
          priceFormat: action.payload?.auth?.priceFormat,
          rememberedUsername: action.payload?.auth?.rememberedUsername,
          timezoneOffset: action.payload?.auth?.timezoneOffset,
          username: action.payload?.auth?.username,
        }),
        action,
      );
    }
    case AUTH_USER_UNAUTHORIZED:
      return authReducer(
        getAuthInitialState({
          ...state,
          accountId: null,
          authToken: null,
          loggedIn: false,
          username: null,
        }),
        action,
      );
    case PURGE:
      return authReducer(undefined, action);
    default:
      return authReducer(state, action);
  }
}

function assetReducerWrapper(state, action) {
  switch (action.type) {
    case PURGE:
      return assetReducer(undefined, action);
    default:
      return assetReducer(state, action);
  }
}

function avLiveReducerWrapper(state, action) {
  switch (action.type) {
    case PURGE:
      return avLiveReducer(undefined, action);
    default:
      return avLiveReducer(state, action);
  }
}

function balanceReducerWrapper(state, action) {
  switch (action.type) {
    case AUTH_USER_UNAUTHORIZED:
    case PURGE:
      return balanceReducer(undefined, action);
    default:
      return balanceReducer(state, action);
  }
}

function betslipReducerWrapper(state, action) {
  switch (action.type) {
    case REHYDRATE: {
      return betslipReducer(
        getBetslipInitialState(
          action.payload?.betslip?.betslipData,
          action.payload?.betslip?.jackpotBetslipData,
          action.payload?.betslip?.brVirtualBetslipData,
          action.payload?.betslip?.krVirtualBetslipData,
        ),
        action,
      );
    }
    case AUTH_USER_UNAUTHORIZED:
    case PURGE:
      return betslipReducer(undefined, action);
    default:
      return betslipReducer(state, action);
  }
}

function bonusReducerWrapper(state, action) {
  switch (action.type) {
    case AUTH_USER_UNAUTHORIZED:
    case PURGE:
      return bonusReducer(undefined, action);
    default:
      return bonusReducer(state, action);
  }
}

function cashoutReducerWrapper(state, action) {
  switch (action.type) {
    case AUTH_USER_UNAUTHORIZED:
    case PURGE:
      return cashoutReducer(undefined, action);
    default:
      return cashoutReducer(state, action);
  }
}

function chatReducerWrapper(state, action) {
  switch (action.type) {
    case REHYDRATE: {
      return chatReducer(getChatInitialState(action.payload?.chat?.sessionId, action.payload?.chat?.startTime), action);
    }
    case AUTH_USER_UNAUTHORIZED:
    case PURGE:
      return chatReducer(undefined, action);
    default:
      return chatReducer(state, action);
  }
}

function cmsReducerWrapper(state, action) {
  switch (action.type) {
    case PURGE:
      return cmsReducer(undefined, action);
    default:
      return cmsReducer(state, action);
  }
}

function countryReducerWrapper(state, action) {
  switch (action.type) {
    case PURGE:
      return countryReducer(undefined, action);
    default:
      return countryReducer(state, action);
  }
}

function couponReducerWrapper(state, action) {
  switch (action.type) {
    case PURGE:
      return couponReducer(undefined, action);
    default:
      return couponReducer(state, action);
  }
}

function currencyReducerWrapper(state, action) {
  switch (action.type) {
    case PURGE:
      return currencyReducer(undefined, action);
    default:
      return currencyReducer(state, action);
  }
}

function ezSettingReducerWrapper(state, action) {
  switch (action.type) {
    case AUTH_USER_UNAUTHORIZED:
    case PURGE:
      return ezSettingReducer(undefined, action);
    default:
      return ezSettingReducer(state, action);
  }
}

function ezBetslipCacheReducerWrapper(state, action) {
  switch (action.type) {
    case REHYDRATE: {
      return ezBetslipCacheReducer(
        getEZBetslipCacheInitialState(action.payload?.ezBetslipCache?.betslipOutcomeInitialPrices),
        action,
      );
    }
    case PURGE:
      return ezBetslipCacheReducer(undefined, action);
    default:
      return ezBetslipCacheReducer(state, action);
  }
}

function favouriteReducerWrapper(state, action) {
  switch (action.type) {
    case PURGE:
      return favouriteReducer(undefined, action);
    default:
      return favouriteReducer(state, action);
  }
}

function jackpotReducerWrapper(state, action) {
  switch (action.type) {
    case PURGE:
      return jackpotReducer(undefined, action);
    default:
      return jackpotReducer(state, action);
  }
}

function languagesReducerWrapper(state, action) {
  switch (action.type) {
    case PURGE:
      return languagesReducer(undefined, action);
    default:
      return languagesReducer(state, action);
  }
}

function liveCalendarReducerWrapper(state, action) {
  switch (action.type) {
    // Todo: add 401 action to clean the storage.
    // Todo: dispatch `PURGE` action when error occurs.
    case PURGE:
      return liveCalendarReducer(undefined, action);
    default:
      return liveCalendarReducer(state, action);
  }
}

function liveReducerWrapper(state, action) {
  switch (action.type) {
    case REHYDRATE: {
      return liveReducer(
        getLiveInitialState(action.payload?.live?.liveFavourites, action.payload?.live?.multiViewEventIds),
        action,
      );
    }
    // Todo: add 401 action to clean the storage.
    // Todo: dispatch `PURGE` action when error occurs.
    case PURGE:
      return liveReducer(undefined, action);
    default:
      return liveReducer(state, action);
  }
}

function periodsReducerWrapper(state, action) {
  switch (action.type) {
    case PURGE:
      return periodsReducer(undefined, action);
    default:
      return periodsReducer(state, action);
  }
}

function matchStatusesReducerWrapper(state, action) {
  switch (action.type) {
    case PURGE:
      return matchStatusesReducer(undefined, action);
    default:
      return matchStatusesReducer(state, action);
  }
}

function recommenderReducerWrapper(state, action) {
  switch (action.type) {
    // Todo: add 401 action to clean the storage.
    // Todo: dispatch `PURGE` action when error occurs.
    case PURGE:
      return recommenderReducer(undefined, action);
    default:
      return recommenderReducer(state, action);
  }
}

function referralReducerWrapper(state, action) {
  switch (action.type) {
    // Todo: add 401 action to clean the storage.
    // Todo: dispatch `PURGE` action when error occurs.
    case PURGE:
      return referralReducer(undefined, action);
    default:
      return referralReducer(state, action);
  }
}

function resultReducerWrapper(state, action) {
  switch (action.type) {
    // Todo: add 401 action to clean the storage.
    // Todo: dispatch `PURGE` action when error occurs.
    case PURGE:
      return resultReducer(undefined, action);
    default:
      return resultReducer(state, action);
  }
}

function retailAccountReducerWrapper(state, action) {
  switch (action.type) {
    // Todo: add 401 action to clean the storage.
    // Todo: dispatch `PURGE` action when error occurs.
    case REHYDRATE: {
      return retailAccountReducer(
        getRetailInitialState(action.payload?.retailAccount?.selectedPlayerAccountId),
        action,
      );
    }
    case AUTH_USER_UNAUTHORIZED:
    case PURGE:
      return retailAccountReducer(undefined, action);
    default:
      return retailAccountReducer(state, action);
  }
}

function retailTillReducerWrapper(state, action) {
  switch (action.type) {
    // Todo: add 401 action to clean the storage.
    // Todo: dispatch `PURGE` action when error occurs.
    case PURGE:
      return retailTillReducer(undefined, action);
    default:
      return retailTillReducer(state, action);
  }
}

function retailTransactionReducerWrapper(state, action) {
  switch (action.type) {
    // Todo: add 401 action to clean the storage.
    // Todo: dispatch `PURGE` action when error occurs.
    case PURGE:
      return retailTransactionReducer(undefined, action);
    default:
      return retailTransactionReducer(state, action);
  }
}

function securityQuestionReducerWrapper(state, action) {
  switch (action.type) {
    // Todo: add 401 action to clean the storage.
    // Todo: dispatch `PURGE` action when error occurs.
    case PURGE:
      return securityQuestionReducer(undefined, action);
    default:
      return securityQuestionReducer(state, action);
  }
}

function solidGamingReducerWrapper(state, action) {
  switch (action.type) {
    // Todo: add 401 action to clean the storage.
    // Todo: dispatch `PURGE` action when error occurs.
    case PURGE:
      return solidGamingReducer(undefined, action);
    default:
      return solidGamingReducer(state, action);
  }
}

function sportReducerWrapper(state, action) {
  switch (action.type) {
    // Todo: add 401 action to clean the storage.
    // Todo: dispatch `PURGE` action when error occurs.
    case PURGE:
      return sportReducer(undefined, action);
    default:
      return sportReducer(state, action);
  }
}

function sportsTreeReducerWrapper(state, action) {
  switch (action.type) {
    // Todo: add 401 action to clean the storage.
    // Todo: dispatch `PURGE` action when error occurs.
    case PURGE:
      return sportsTreeReducer(undefined, action);
    default:
      return sportsTreeReducer(state, action);
  }
}

const reducer = combineReducers({
  account: accountReducerWrapper,
  asset: assetReducerWrapper,
  auth: authReducerWrapper,
  avlive: avLiveReducerWrapper,
  balance: balanceReducerWrapper,
  betslip: betslipReducerWrapper,
  bonus: bonusReducerWrapper,
  cashout: cashoutReducerWrapper,
  chat: chatReducerWrapper,
  cms: cmsReducerWrapper,
  country: countryReducerWrapper,
  coupon: couponReducerWrapper,
  currency: currencyReducerWrapper,
  ez: ezSettingReducerWrapper,
  ezBetslipCache: ezBetslipCacheReducerWrapper,
  favourite: favouriteReducerWrapper,
  jackpot: jackpotReducerWrapper,
  language: languagesReducerWrapper,
  live: liveReducerWrapper,
  liveCalendar: liveCalendarReducerWrapper,
  matchStatus: matchStatusesReducerWrapper,
  period: periodsReducerWrapper,
  recommender: recommenderReducerWrapper,
  referral: referralReducerWrapper,
  result: resultReducerWrapper,
  retailAccount: retailAccountReducerWrapper,
  retailTill: retailTillReducerWrapper,
  retailTransaction: retailTransactionReducerWrapper,
  securityQuestion: securityQuestionReducerWrapper,
  solidGaming: solidGamingReducerWrapper,
  sport: sportReducerWrapper,
  sportsTree: sportsTreeReducerWrapper,
});

export default reducer;
