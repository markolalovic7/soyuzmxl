import ErrorBoundaryPage from "components/ErrorBoundaryPage/components";
import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { BreakpointProvider } from "react-socks";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App";
import WebSocketProvider from "./applications/common/components/websockets/WebSocket";
import store, { persistor } from "./redux/store";
import reportWebVitals from "./reportWebVitals";

import "./assets/scss/fonts.module.scss"; // import our fonts
// To finish our setup, we just need to import our initialized i18next instance into our index.js file. This ensures that the file is bundled into our app and its code is run.
import "./services/i18n";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <React.Suspense fallback="">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <WebSocketProvider>
            <HelmetProvider>
              <BrowserRouter>
                <BreakpointProvider>
                  <ErrorBoundaryPage
                    onActionTap={() => {
                      persistor.purge().then(() => {
                        console.warn("A persistor is successfully purged.");
                      });
                      window.location.href = "/";
                    }}
                  >
                    <App />
                  </ErrorBoundaryPage>
                </BreakpointProvider>
              </BrowserRouter>
            </HelmetProvider>
          </WebSocketProvider>
        </PersistGate>
      </Provider>
    </React.Suspense>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
