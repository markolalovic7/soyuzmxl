import { useEffect } from "react";
import { useSelector } from "react-redux";

import { getEventAVLive } from "../redux/reselect/avlive-selector";
import { clearStream, getAVLiveStreamByEvent } from "../redux/slices/avLiveSlice";

export function useEventStreamUrl(dispatch, eventId) {
  const streamUrl = useSelector((state) => getEventAVLive(state, eventId));

  useEffect(() => {
    dispatch(getAVLiveStreamByEvent({ eventId }));

    return () => dispatch(clearStream(eventId));
  }, [eventId]);

  return streamUrl;
}
