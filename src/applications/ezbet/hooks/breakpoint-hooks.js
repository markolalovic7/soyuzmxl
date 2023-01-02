import { useMemo } from "react";
import { setDefaultBreakpoints, useCurrentBreakpointName } from "react-socks";

import {
  LARGE_CONSTANTS,
  MEDIUM_CONSTANTS,
  SUPERLARGE_CONSTANTS,
  TABLET_CONSTANTS,
  XLARGE_CONSTANTS,
  XSMALL_CONSTANTS,
} from "../utils/breakpoint-constants";

const XSMALL = "xsmall";
const SMALL = "small";
const TABLET = "tablet";
const MEDIUM = "medium";
const LARGE = "large";
const XLARGE = "xlarge";
const SUPERLARGE = "superlarge";

setDefaultBreakpoints([
  { [XSMALL]: 0 }, // all mobile devices
  { [TABLET]: 674 }, // tablet devices
  { [MEDIUM]: 842 }, // small desktop?? large tablet?
  { [LARGE]: 1024 }, // smaller laptops
  { [XLARGE]: 1080 }, // laptops and desktops
  { [SUPERLARGE]: 1920 }, // super large laptops and desktops
]);

export function useActiveBreakPointEllipsisLengths(keyCode) {
  const breakpoint = useCurrentBreakpointName();

  return useMemo(() => {
    switch (breakpoint) {
      case SMALL:
      case XSMALL:
        return XSMALL_CONSTANTS[keyCode];
      case TABLET:
        return TABLET_CONSTANTS[keyCode];
      case MEDIUM:
        return MEDIUM_CONSTANTS[keyCode];
      case LARGE:
        return LARGE_CONSTANTS[keyCode];
      case XLARGE:
        return XLARGE_CONSTANTS[keyCode];
      case SUPERLARGE:
        return SUPERLARGE_CONSTANTS[keyCode];

      default:
        throw new Error(`Unsupported breakpoint: ${breakpoint}`);
    }
  }, [breakpoint]);
}
