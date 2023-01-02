import {createContext} from "react";
import {useDispatch} from "react-redux";

import {clearAll, consumeMessage} from "../../../../redux/slices/liveSlice";

// eslint-disable-next-line no-unused-vars
const WS_STATUS_CONNECTING = 0; // Socket has been created. The connection is not yet open.
// eslint-disable-next-line no-unused-vars
const WS_STATUS_READY = 1; // The connection is open and ready to communicate.
// eslint-disable-next-line no-unused-vars
const WS_STATUS_CLOSING = 2; // The connection is in the process of closing.
// eslint-disable-next-line no-unused-vars
const WS_STATUS_CLOSED = 3; // The connection is closed or couldn't be opened.

const wsEndpoint = `${window.location.origin}/ws/live`.replace("https", "wss").replace("http", "ws");

const wsWrapper = { ws: null }; // ws represents the "current" instance
let initialized = false; // semaphore flag to avoid double initialisation...

function closeWebSocket(dispatch, ws) {
  ws.close();
  dispatch(clearAll());
}

const createWebSocket = (dispatch) => {
  let keepAliveIntervalId = null;

  const ws = new WebSocket(wsEndpoint);
  //
  // ws.onopen = () => {
  //     dispatch(clearStaleData({subscription: initialSubscription}));
  //     ws.send(JSON.stringify({subscription: initialSubscription}));
  // };
  ws.onopen = () => {
    keepAliveIntervalId = setInterval(() => {
      // Send a keep alive every x ms just to make sure we have an active connection
      // Particularly for mobile devices, the connection will be severed when the device is idle or the browser in the background
      // This might trigger an error, from where we will recover by creating a new clean WS
      try {
        ws.send(JSON.stringify({ subscription: "ping" }));
      } catch (e) {
        console.log(e);
      }
    }, 1000);
    console.log("WebSocket - Connection established!");
  };
  ws.onmessage = (message) => {
    const payload = JSON.parse(message.data);
    if (payload.subscription === "ping") return;
    dispatch(consumeMessage(payload.subscription, payload.data));
  };
  ws.onclose = (e) => {
    // An event listener to be called when the WebSocket connection's readyState changes to CLOSED

    if (keepAliveIntervalId) {
      // stop the keep alive "pings"
      clearInterval(keepAliveIntervalId);
    }

    switch (e.code) {
      case 1000: // CLOSE_NORMAL
        closeWebSocket(dispatch);
        console.log("WebSocket: Closed by the application");
        break;
      default:
        // Abnormal closure
        console.log("WebSocket: Abnormal closure");
        closeWebSocket(dispatch, ws); // close this WS
        break;
    }
  };
  ws.onerror = (err) => {
    // An event listener to be called when an error occurs
    console.error("WebSocket: Socket encountered error: ", err.message, "Closing socket");
    ws.close();
  };

  wsWrapper.ws = ws;
};

const WebSocketContext = createContext(null);

export { WebSocketContext };

// eslint-disable-next-line react/prop-types
export default ({ children }) => {
  const dispatch = useDispatch();

  if (!initialized && !wsWrapper.ws) {
    // Initialize once and only once (initialized acts as semaphore)
    initialized = true;
    createWebSocket(dispatch);

    // Reconnect mechanism
    // const reconnectInterval =
    setInterval(() => {
      if (wsWrapper.ws.readyState === WS_STATUS_CLOSED) {
        console.log("WebSocket: Reconnecting...");
        try {
          console.log("WebSocket: closing previous WS...");
          wsWrapper.ws.close();
          console.log("WebSocket: closed previous WS");
        } catch (e) {
          console.log("WebSocket: Error closing a (probably already closed) socket");
        }
        createWebSocket(dispatch);
      }
    }, 100);
    //
  }

  return <WebSocketContext.Provider value={wsWrapper}>{children}</WebSocketContext.Provider>;
};
