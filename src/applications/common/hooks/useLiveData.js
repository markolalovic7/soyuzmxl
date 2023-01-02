import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAuthLanguage, getAuthPriceFormat } from "redux/reselect/auth-selector";

import { clearStaleData, evictEndedMatches } from "../../../redux/slices/liveSlice";
import { WebSocketContext } from "../components/websockets/WebSocket";

// eslint-disable-next-line no-unused-vars
const WS_STATUS_CONNECTING = 0; // Socket has been created. The connection is not yet open.
const WS_STATUS_READY = 1; // The connection is open and ready to communicate.
// eslint-disable-next-line no-unused-vars
const WS_STATUS_CLOSING = 2; // The connection is in the process of closing.
// eslint-disable-next-line no-unused-vars
const WS_STATUS_CLOSED = 3; // The connection is closed or couldn't be opened.

function useLiveData(dispatch, subscription) {
  const wsWrapper = useContext(WebSocketContext);
  const language = useSelector(getAuthLanguage);
  const priceFormat = useSelector(getAuthPriceFormat);
  const [readyState, setReadyState] = useState(wsWrapper.ws.readyState);

  // Keep an eye on the readyState - allow to push forward with changes once the readyState is WS_STATUS_READY
  // We do this in an effect + interval because the updates to readyState happen within the WS, which is not driven by any state pushed by React,
  // so we would not get notified unless we keep an eye on it and force it into a state change...
  useEffect(() => {
    // if (readyState === WS_STATUS_CONNECTING) {
    const intervalId = setInterval(() => {
      setReadyState(wsWrapper.ws.readyState);
    }, 100);

    return () => clearInterval(intervalId);
    // }
    // return undefined;
  }, [wsWrapper, language, priceFormat]);

  // Subscribe (if an existing connection is in place)
  useEffect(() => {
    if (
      wsWrapper.ws && // WS connection of any kind exists?
      wsWrapper.ws.readyState === readyState && // make sure the state change that triggered this update in the Effect is in sync with the actual WS (delays can cause us to send SEND messages to connecting sockets or disconnecting sockets)
      wsWrapper.ws.readyState === WS_STATUS_READY && // only go ahead when READY...
      subscription
    ) {
      // ...and we have a valid subscription

      dispatch(clearStaleData({ subscription }));
      wsWrapper.ws.send(JSON.stringify({ subscription }));

      return () => {
        // if the ws is not the latest, we might try to unsubscribe against the newest reconnected WS (causing an "InvalidStateError: Failed to execute 'send' on 'WebSocket': Still in CONNECTING state.")
        // Even if this IF block is accessed when we are on WS_STATUS_READY, we don't know where we are when we return (exit) from it
        if (wsWrapper.ws.readyState === WS_STATUS_READY) {
          wsWrapper.ws.send(JSON.stringify({ subscription: `unsubscribe-${subscription}` }));
        }
        dispatch(clearStaleData({ subscription }));
      };
    }

    return undefined;
  }, [wsWrapper, readyState, subscription, language, priceFormat]); // readyState used to trigger reconnections (due to ws disconnect)

  // Evict ended events
  useEffect(() => {
    const intervalId = setInterval(() => dispatch(evictEndedMatches()), 10000);

    return () => clearInterval(intervalId);
  }, [dispatch, language, priceFormat]);
}

export { useLiveData };
