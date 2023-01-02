import {
  BETRADAR_VIRTUAL_FEED_CODE_VFLC,
  BETRADAR_VIRTUAL_FEED_CODE_VFNC,
  BETRADAR_VIRTUAL_FEED_CODE_VFWC,
  BETRADAR_VIRTUAL_FEED_CODE_VFAC,
  BETRADAR_VIRTUAL_FEED_CODE_VFC,
  BETRADAR_VIRTUAL_FEED_CODE_VBI,
  BETRADAR_VIRTUAL_FEED_CODE_VBL,
  BETRADAR_VIRTUAL_FEED_CODE_VTI,
} from "constants/betradar-virtual-sport-feed-code-types";

export function getBetradarFeedCodeTranslated(feedCode, t) {
  return {
    [BETRADAR_VIRTUAL_FEED_CODE_VBI]: t("virtual.betradar.VBI"),
    [BETRADAR_VIRTUAL_FEED_CODE_VBL]: t("virtual.betradar.VBL"),
    [BETRADAR_VIRTUAL_FEED_CODE_VFAC]: t("virtual.betradar.VFAC"),
    [BETRADAR_VIRTUAL_FEED_CODE_VFC]: t("virtual.betradar.VFC"),
    [BETRADAR_VIRTUAL_FEED_CODE_VFLC]: t("virtual.betradar.VFLC"),
    [BETRADAR_VIRTUAL_FEED_CODE_VFNC]: t("virtual.betradar.VFNC"),
    [BETRADAR_VIRTUAL_FEED_CODE_VFWC]: t("virtual.betradar.VFWC"),
    [BETRADAR_VIRTUAL_FEED_CODE_VTI]: t("virtual.betradar.VTI"),
  }[feedCode];
}
