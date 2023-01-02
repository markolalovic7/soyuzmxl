import {
  BETRADAR_VIRTUAL_FEED_CODE_VBL,
  BETRADAR_VIRTUAL_FEED_CODE_VFAC,
  BETRADAR_VIRTUAL_FEED_CODE_VFC,
  BETRADAR_VIRTUAL_FEED_CODE_VFLC,
  BETRADAR_VIRTUAL_FEED_CODE_VFNC,
  BETRADAR_VIRTUAL_FEED_CODE_VFWC,
  BETRADAR_VIRTUAL_FEED_CODE_VTI,
} from "constants/betradar-virtual-sport-feed-code-types";
import { getBetradarFeedCodeTranslated } from "utils/betradar-virtual-sport";

import { BETRADAR_VIRTUAL_FEED_CODE_VBI } from "../constants/betradar-virtual-sport-feed-code-types";

const BR_VIRTUAL_PATH = "/brvirtual";

export const getBetradarVirtualSportList = (t) =>
  [
    BETRADAR_VIRTUAL_FEED_CODE_VFLC,
    BETRADAR_VIRTUAL_FEED_CODE_VFNC,
    BETRADAR_VIRTUAL_FEED_CODE_VFWC,
    BETRADAR_VIRTUAL_FEED_CODE_VFAC,
    BETRADAR_VIRTUAL_FEED_CODE_VFC,
    BETRADAR_VIRTUAL_FEED_CODE_VBI,
    BETRADAR_VIRTUAL_FEED_CODE_VBL,
    BETRADAR_VIRTUAL_FEED_CODE_VTI,
  ].map((feedCode) => ({
    code: feedCode,
    label: getBetradarFeedCodeTranslated(feedCode, t),
  }));

export const isWidgetTypeIntegration = (feedCode) =>
  [
    BETRADAR_VIRTUAL_FEED_CODE_VFLC,
    BETRADAR_VIRTUAL_FEED_CODE_VFNC,
    BETRADAR_VIRTUAL_FEED_CODE_VFWC,
    BETRADAR_VIRTUAL_FEED_CODE_VFAC,
    BETRADAR_VIRTUAL_FEED_CODE_VFC,
    BETRADAR_VIRTUAL_FEED_CODE_VBL,
  ].includes(feedCode);

export const getSportCode = (feedCode) =>
  ({
    [BETRADAR_VIRTUAL_FEED_CODE_VBI]: "BASE",
    [BETRADAR_VIRTUAL_FEED_CODE_VBL]: "BASK",
    [BETRADAR_VIRTUAL_FEED_CODE_VFAC]: "FOOT",
    [BETRADAR_VIRTUAL_FEED_CODE_VFC]: "FOOT",
    [BETRADAR_VIRTUAL_FEED_CODE_VFLC]: "FOOT",
    [BETRADAR_VIRTUAL_FEED_CODE_VFNC]: "FOOT",
    [BETRADAR_VIRTUAL_FEED_CODE_VFWC]: "FOOT",
    [BETRADAR_VIRTUAL_FEED_CODE_VTI]: "TENN",
  }[feedCode] ?? "FOOT");

export const getAPIFeedCode = (feedCode, matches) => {
  const prefix =
    {
      [BETRADAR_VIRTUAL_FEED_CODE_VBL]: "BR:MATCH:vbl:match:",
      [BETRADAR_VIRTUAL_FEED_CODE_VFAC]: "BR:MATCH:vf:match:",
      [BETRADAR_VIRTUAL_FEED_CODE_VFC]: "BR:MATCH:vf:match:",
      [BETRADAR_VIRTUAL_FEED_CODE_VFLC]: "BR:MATCH:vf:match:",
      [BETRADAR_VIRTUAL_FEED_CODE_VFNC]: "BR:MATCH:vf:match:",
      [BETRADAR_VIRTUAL_FEED_CODE_VFWC]: "BR:MATCH:vf:match:",
    }[feedCode] ?? "BR:MATCH:vf:match:";

  return matches.map((m) => `c${prefix}${m}`).join(",");
};

export const getSportMobileTagByFeedCode = (feedCode) =>
  ({
    [BETRADAR_VIRTUAL_FEED_CODE_VBL]: "vbl.widget-mobile",
    [BETRADAR_VIRTUAL_FEED_CODE_VFAC]: "vfas.widget-mobile",
    [BETRADAR_VIRTUAL_FEED_CODE_VFC]: "vfas.widget-mobile",
    [BETRADAR_VIRTUAL_FEED_CODE_VFLC]: "vflm.widget-mobile",
    [BETRADAR_VIRTUAL_FEED_CODE_VFNC]: "vfnc.widget-mobile",
    [BETRADAR_VIRTUAL_FEED_CODE_VFWC]: "vfwc.widget-mobile",
  }[feedCode] ?? "vflm.widget-mobile");

export const isResponsiveIntegration = (feedCode) =>
  [BETRADAR_VIRTUAL_FEED_CODE_VBI, BETRADAR_VIRTUAL_FEED_CODE_VTI].includes(feedCode);

export const isLiveBetradarVirtualSports = (feedCode) =>
  [BETRADAR_VIRTUAL_FEED_CODE_VBI, BETRADAR_VIRTUAL_FEED_CODE_VTI].includes(feedCode);

export const getDesktopIFrameUrl = (isProduction, clientId, clientName, language, feedCode) => {
  const platform = "desktop"; // mobile
  if (isProduction) {
    if (feedCode === BETRADAR_VIRTUAL_FEED_CODE_VTI) {
      return `/vti/vti/index?clientid=${clientId}&lang=${language}&pathprefix=off`;
    }
    if (feedCode === BETRADAR_VIRTUAL_FEED_CODE_VBI) {
      return `/vbi/?clientid=${clientId}&lang=${language}&sport=vbi&platform=${platform}&style=${clientName}&channel=0&screen=vbi&oddType=dec`;
    }
  } else {
    if (feedCode === BETRADAR_VIRTUAL_FEED_CODE_VTI) {
      return `/vtistaging/vti/index?clientid=${clientId}&lang=${language}&pathprefix=off`;
    }
    if (feedCode === BETRADAR_VIRTUAL_FEED_CODE_VBI) {
      return `/vbi/?clientid=${clientId}&lang=${language}&sport=vbi&platform=${platform}&style=${clientName}&channel=0&screen=vbi&oddType=dec`;
    }
  }

  return undefined;
};

export const getMobileIFrameUrl = (isProduction, clientId, clientName, language, feedCode) => {
  const platform = "mobile"; // desktop
  if (isProduction) {
    if (feedCode === BETRADAR_VIRTUAL_FEED_CODE_VTI) {
      return `/vti/vti/index?clientid=${clientId}&lang=${language}&pathprefix=off`;
    }
    if (feedCode === BETRADAR_VIRTUAL_FEED_CODE_VBI) {
      return `/vbi/?clientid=${clientId}&lang=${language}&sport=vbi&platform=${platform}&style=${clientName}&channel=0&screen=vbi&oddType=dec`;
    }
  } else {
    if (feedCode === BETRADAR_VIRTUAL_FEED_CODE_VTI) {
      return `/vtistaging/vti/index?clientid=${clientId}&lang=${language}&pathprefix=off`;
    }
    if (feedCode === BETRADAR_VIRTUAL_FEED_CODE_VBI) {
      return `/vbi/?clientid=${clientId}&lang=${language}&sport=vbi&platform=${platform}&style=${clientName}&channel=0&screen=vbi&oddType=dec`;
    }
  }

  return undefined;
};

export const isBrVirtualSportsLocation = (pathname) => pathname.startsWith(BR_VIRTUAL_PATH);
