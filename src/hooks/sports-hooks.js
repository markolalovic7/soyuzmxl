import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAuthLanguage } from "redux/reselect/auth-selector";
import { getSports } from "redux/slices/sportSlice";
import { getDesktopLineId, getDesktopOriginId, getMobileLineId, getMobileOriginId } from "utils/AppUtils";

export function useSports(isMobileDevice, dispatch) {
  const language = useSelector(getAuthLanguage);

  useEffect(() => {
    const source = axios.CancelToken.source();
    // if no config, or app type changed...
    const originId = isMobileDevice ? getMobileOriginId() : getDesktopOriginId();
    const lineId = isMobileDevice ? getMobileLineId() : getDesktopLineId();
    dispatch(
      getSports({
        cancelToken: source.token,
        lineId,
        originId,
      }),
    );

    return () => {
      source.cancel();
    };
  }, [isMobileDevice, dispatch, language]);
}
