import { useDispatch } from "react-redux";
import { useCurrentBreakpointName } from "react-socks";

import {
  getBetPointLineId,
  getBetPointOriginId,
  getDesktopLineId,
  getDesktopOriginId,
  getMobileLineId,
  getMobileOriginId,
  getSlipstreamLineId,
  getSlipstreamOriginId,
} from "../utils/AppUtils";

import { useQueryParams } from "hooks/auth-hooks";
import { useCmsConfig } from "hooks/cms-hooks";

const getOriginAndLineIds = (isMobileDevice, isSlipstream, isBetPoint) => {
  if (isSlipstream) {
    return { lineId: getSlipstreamLineId(), originId: getSlipstreamOriginId() };
  }
  if (isBetPoint) {
    return { lineId: getBetPointLineId(), originId: getBetPointOriginId() };
  }
  if (isMobileDevice) {
    return { lineId: getMobileLineId(), originId: getMobileOriginId() };
  }

  return { lineId: getDesktopLineId(), originId: getDesktopOriginId() };
};

const withCms = (Component) => (props) => {
  // Obtain the CMS configuration
  const dispatch = useDispatch();

  // identify the device type based on media queries... DESKTOP vs MOBILE
  const breakpoint = useCurrentBreakpointName();
  const isMobileDevice = breakpoint === "xsmall" || breakpoint === "small";

  const isSlipstream = !!process.env.REACT_APP_SLIPSTREAM_ON;
  const isBetPoint = !!process.env.REACT_APP_BETPOINT_ON && !process.env.REACT_APP_SLIPSTREAM_ON; // do not allow both to be on at the same time

  // Load `CMS` data base on `isMobileDevice`.
  const { lineId, originId } = getOriginAndLineIds(isMobileDevice, isSlipstream, isBetPoint);
  const cmsConfig = useCmsConfig(dispatch, originId, lineId);

  // Save auth data base on query params.
  useQueryParams(isMobileDevice, dispatch);

  if (!cmsConfig) {
    return <div>Loading...</div>;
  }

  return (
    <Component
      isBetPoint={isBetPoint}
      isMobileDevice={isMobileDevice && !isSlipstream && !isBetPoint}
      isSlipstream={isSlipstream}
      {...props}
    />
  );
};

export default withCms;
