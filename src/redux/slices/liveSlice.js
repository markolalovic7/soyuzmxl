import { createSlice } from "@reduxjs/toolkit";

import backdoor from "../utils/reduxBackdoor";

// https://github.com/reduxjs/redux-toolkit/issues/415

export const getInitialState = (liveFavourites = [], multiViewEventIds = []) => ({
  activeMatchTracker: undefined,
  liveData: {},
  liveFavourites,
  multiViewEventIds,
});

const getPriceFormatKeyword = (priceFormat) => {
  if (!priceFormat) {
    return "l2-Decimal";
  }

  return {
    CHINESE: "l2-Chinese",
    EURO: "l2-Decimal",
    INDO: "l2-Indo",
    MALAY: "l2-Malaysian",
    UK: "l2-Fractions",
    US: "l2-US",
  }[priceFormat];
};

const getLocale = (locale) => {
  if (!locale) {
    return "en_GB";
  }

  return {
    de: "de_DE",
    en: "en_GB",
    es: "es_ES",
    fr: "fr_FR",
    hi: "hi_IN",
    id: "id_ID",
    in: "id_ID",
    ja: "ja_JP",
    km: "km_KH",
    ko: "ko_KR",
    ms: "ms_MY",
    pt: "pt_PT",
    ru: "ru_ru",
    te: "te_IN",
    th: "th_TH",
    vi: "vi_VN",
    zh: "zh_CN",
  }[locale];
};

const extractMinimizedCommonEventData = (locale, priceFormatKeyword, eventData) => {
  const minimizedEventData = {};

  minimizedEventData.maxSet = eventData.maxSet;
  minimizedEventData.p = eventData.p;
  minimizedEventData.eventId = eventData.eventId;
  minimizedEventData.feedCode = eventData.feedCode;
  minimizedEventData.sport = eventData.sport;
  minimizedEventData.cType = eventData.cType;
  minimizedEventData.cMin = eventData.cMin;
  minimizedEventData.cSec = eventData.cSec;
  minimizedEventData.cStatus = eventData.cStatus;
  minimizedEventData.cPeriod = eventData.cPeriod;
  minimizedEventData.hidden = eventData.hidden;
  minimizedEventData.hasRapidMarket = eventData.hasRapidMarket;

  minimizedEventData.opADesc = eventData.opAMap[locale];
  minimizedEventData.opBDesc = eventData.opBMap[locale];
  minimizedEventData.epDesc = eventData.epDescMap[locale];
  minimizedEventData.country = eventData.path.country || null;
  minimizedEventData.countryDesc = eventData.path.epDescMap[locale];
  minimizedEventData.leagueDesc = eventData.path.childPath.epDescMap[locale];

  minimizedEventData.hScore = eventData.hScore;
  minimizedEventData.aScore = eventData.aScore;
  minimizedEventData.pScores = eventData.periodScores;

  minimizedEventData.countryId = eventData.path.id;
  minimizedEventData.countryPos = eventData.path.ordinal;
  minimizedEventData.leagueId = eventData.path.childPath.id;
  minimizedEventData.leaguePos = eventData.path.childPath.ordinal;
  minimizedEventData.activeOp = eventData.activeOp;
  minimizedEventData.hasMatchTracker = eventData.mt;
  minimizedEventData.hasAV = eventData.av;

  return minimizedEventData;
};

const extractMinimizedEventDataDetail = (locale, priceFormatKeyword, eventData) => {
  const minimizedEventData = extractMinimizedCommonEventData(locale, priceFormatKeyword, eventData);

  minimizedEventData.icons = eventData.icons;

  minimizedEventData.opAC = eventData.opAC;
  minimizedEventData.opBC = eventData.opBC;

  minimizedEventData.markets = {};
  if (eventData.marketViews.default) {
    eventData.marketViews.default.forEach((marketView, index) => {
      const market = {
        feedCode: marketView.feedCode,
        mDesc: marketView.desc[locale],
        mGroup: marketView.group,
        mId: marketView.id,
        mOpen: marketView.mOpen,
        mStyle: marketView.style,
        ordinal: index,
        pAbrv: marketView.periodAbrv,
        pDesc: marketView.period[locale],
        rapid: marketView.rapid,
        sels: [],
      };
      marketView.sels.forEach((selectionView) => {
        market.sels.push({
          dir: selectionView.dir,
          formattedPrice: selectionView.pMap[priceFormatKeyword],
          hidden: selectionView.hidden,
          oDesc: selectionView.oDescMap[locale],
          oId: selectionView.oId,
          pId: selectionView.pId,
          price: selectionView.price,
        });
      });
      minimizedEventData.markets[market.mId] = market;
    });
  }

  return minimizedEventData;
};

const extractMinimizedEuropeanEventData = (locale, priceFormatKeyword, eventData) => {
  const minimizedEventData = extractMinimizedCommonEventData(locale, priceFormatKeyword, eventData);

  minimizedEventData.mCount = eventData.mCount;

  minimizedEventData.markets = {};

  if (eventData.mId) {
    minimizedEventData.markets[eventData.mId] = {
      mDesc: eventData.mDescMap[locale],
      mGroup: eventData.group,
      mId: eventData.mId,
      mOpen: eventData.mOpen,
      pAbrv: eventData.periodAbrv,
      pDesc: eventData.pDescMap[locale],
    };

    const sels = [];
    eventData.sels.forEach((selection) => {
      sels.push({
        dir: selection.dir,
        formattedPrice: selection.pMap[priceFormatKeyword],
        hidden: selection.hidden,
        oDesc: selection.oDescMap[locale],
        oId: selection.oId,
        pId: selection.pId,
        price: selection.price,
      });
    });
    minimizedEventData.markets[eventData.mId].sels = sels;
  }

  return minimizedEventData;
};

const extractMinimizedComplexEventData = (locale, priceFormatKeyword, eventData) => {
  const minimizedEventData = extractMinimizedCommonEventData(locale, priceFormatKeyword, eventData);

  minimizedEventData.mCount = eventData.mCount;

  minimizedEventData.marketViews = {};
  Object.entries(eventData.marketViews).forEach((marketViewEntry) => {
    const marketViewName = marketViewEntry[0];
    const marketViewMarkets = marketViewEntry[1];

    minimizedEventData.marketViews[marketViewName] = marketViewMarkets.map((market) => ({
      criteria: market.criteria,
      id: market.id,
      mOpen: market.mOpen,
      sels: market.sels.map((selection) => ({
        dir: selection.dir,
        formattedPrice: selection.pMap[priceFormatKeyword],
        hidden: selection.hidden,
        oDesc: selection.oDescMap[locale],
        oId: selection.oId,
        pId: selection.pId,
        price: selection.price,
      })),
      spread: market.spread,
      spread2: market.spread2,
    }));
  });

  return minimizedEventData;
};

const liveSlice = createSlice({
  extraReducers: {
    // Add reducers for additional action types here, and handle loading state as needed
  },
  initialState: getInitialState(),

  name: "live",
  // reducers actions
  reducers: {
    clearAll(state) {
      state.liveData = {};
    },
    clearStaleData(state, action) {
      delete state.liveData[action.payload.subscription];
    },
    consumeMessage: {
      prepare(subscription, data) {
        return {
          payload: { data, subscription },
        };
      },
      reducer(state, { payload }) {
        const locale = getLocale(backdoor.language);
        const priceFormatKeyword = getPriceFormatKeyword(backdoor.priceFormat);
        if (!state.liveData[payload.subscription]) {
          // first time this is seen...
          state.liveData[payload.subscription] = payload.data;
          if (payload.subscription.startsWith("event-")) {
            if (payload.data) {
              state.liveData[payload.subscription] = extractMinimizedEventDataDetail(
                locale,
                priceFormatKeyword,
                payload.data,
              );
            }
          } else if (payload.subscription.startsWith("european-")) {
            state.liveData[payload.subscription] = {};
            for (const [sport, events] of Object.entries(payload.data)) {
              // iterating sports...
              state.liveData[payload.subscription][sport] = {};
              events.forEach((eventData) => {
                const minData = extractMinimizedEuropeanEventData(locale, priceFormatKeyword, eventData);
                state.liveData[payload.subscription][sport][minData.eventId] = minData;
              });
            }
          } else if (payload.subscription.startsWith("african-") || payload.subscription.startsWith("asian-")) {
            state.liveData[payload.subscription] = {};
            for (const [sport, events] of Object.entries(payload.data)) {
              // iterating sports...
              state.liveData[payload.subscription][sport] = {};
              events.forEach((eventData) => {
                const minData = extractMinimizedComplexEventData(locale, priceFormatKeyword, eventData);
                state.liveData[payload.subscription][sport][minData.eventId] = minData;
              });
            }
          }
        } else if (payload.subscription.startsWith("event-")) {
          state.liveData[payload.subscription] = extractMinimizedEventDataDetail(
            locale,
            priceFormatKeyword,
            payload.data,
          );
        } else if (payload.subscription.startsWith("european-")) {
          for (const [sport, events] of Object.entries(payload.data)) {
            // iterating sports...
            if (!state.liveData[payload.subscription][sport]) {
              state.liveData[payload.subscription][sport] = {};
            }
            events.forEach((eventData) => {
              const minData = extractMinimizedEuropeanEventData(locale, priceFormatKeyword, eventData);
              state.liveData[payload.subscription][sport][minData.eventId] = minData;
            });
          }
        } else if (payload.subscription.startsWith("african-") || payload.subscription.startsWith("asian-")) {
          for (const [sport, events] of Object.entries(payload.data)) {
            // iterating sports...
            if (!state.liveData[payload.subscription][sport]) {
              state.liveData[payload.subscription][sport] = {};
            }
            events.forEach((eventData) => {
              const minData = extractMinimizedComplexEventData(locale, priceFormatKeyword, eventData);
              state.liveData[payload.subscription][sport][minData.eventId] = minData;
            });
          }
        }
      },
    },
    evictEndedMatches(state) {
      Object.entries(state.liveData).forEach((subscriptionEntry) => {
        const subscriptionKey = subscriptionEntry[0];

        if (["african-dashboard", "asian-dashboard", "european-dashboard"].includes(subscriptionKey)) {
          const subscriptionSports = subscriptionEntry[1];

          Object.entries(subscriptionSports).forEach((sportEntry, index) => {
            const sportCode = sportEntry[0];
            const sportMatches = sportEntry[1];

            Object.values(sportMatches).forEach((match) => {
              if (match.cStatus === "END_OF_EVENT") {
                delete state.liveData[subscriptionKey][sportCode][match.eventId];
              }
            });

            if (Object.keys(sportMatches).length === 0) {
              delete state.liveData[subscriptionKey][sportCode];
            }
          });

          // Clean old stale favourites too..
          const four_hours_ago = Date.now() - 4 * 60 * 60 * 1000;
          state.liveFavourites = state.liveFavourites.filter((fav) => fav.timestamp > four_hours_ago);
        } else if (subscriptionKey.startsWith("event-")) {
          const subscriptionMatch = subscriptionEntry[1];
          if (subscriptionMatch?.cStatus === "END_OF_EVENT") {
            delete state.liveData[subscriptionKey];
          }
        }
      });
    },
    setActiveMatchTracker(state, action) {
      if (action?.payload?.feedCode && action?.payload?.sportCode) {
        state.activeMatchTracker = action.payload;
      } else {
        state.activeMatchTracker = undefined;
      }
    },
    setMultiViewEventIds(state, action) {
      state.multiViewEventIds = action?.payload?.multiViewEventIds;
    },
    toggleLiveFavourite(state, action) {
      const eventId = action.payload.eventId;
      if (state.liveFavourites.findIndex((f) => f.eventId === eventId) === -1) {
        state.liveFavourites = [...state.liveFavourites, { eventId, timestamp: Date.now() }];
      } else {
        state.liveFavourites = state.liveFavourites.filter((f) => f.eventId !== eventId);
      }
    },
  },
});

const { actions, reducer } = liveSlice;
export const {
  clearAll,
  clearStaleData,
  consumeMessage,
  evictEndedMatches,
  setActiveMatchTracker,
  setMultiViewEventIds,
  toggleLiveFavourite,
} = actions;
export default reducer;
