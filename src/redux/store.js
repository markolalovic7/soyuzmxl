import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";

import persistConfig from "./get-persist-config";
import rootReducer from "./root-reducer";

// Reference: https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist.
const store = configureStore({
  middleware: getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
  reducer: persistReducer(persistConfig({ storage }), rootReducer),
});

export const persistor = persistStore(store);

export default store;
