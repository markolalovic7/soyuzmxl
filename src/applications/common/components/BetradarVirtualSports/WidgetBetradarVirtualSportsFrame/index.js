import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  BETRADAR_VIRTUAL_FEED_CODE_VBL,
  BETRADAR_VIRTUAL_FEED_CODE_VFAC,
  BETRADAR_VIRTUAL_FEED_CODE_VFC,
  BETRADAR_VIRTUAL_FEED_CODE_VFLC,
  BETRADAR_VIRTUAL_FEED_CODE_VFNC,
  BETRADAR_VIRTUAL_FEED_CODE_VFWC,
} from "../../../../../constants/betradar-virtual-sport-feed-code-types";
import { getAuthLanguage } from "../../../../../redux/reselect/auth-selector";
import { getCmsConfigBetradarVirtual } from "../../../../../redux/reselect/cms-selector";

const getIFrameUrl = (isProduction, clientId, clientName, language, feedCode) => {
  if (isProduction) {
    if (feedCode === BETRADAR_VIRTUAL_FEED_CODE_VFLC) {
      return `/vflm/desktop/index?clientid=${clientId}&lang=${language}&layout=Vflm1`;
    }
    if (feedCode === BETRADAR_VIRTUAL_FEED_CODE_VFNC) {
      return `/vfnc/vfnc/index?clientid=${clientId}&lang=${language}`;
    }
    if (feedCode === BETRADAR_VIRTUAL_FEED_CODE_VFWC) {
      return `/vfwc/vfec/index?clientid=${clientId}&lang=${language}`;
    }
    if (feedCode === BETRADAR_VIRTUAL_FEED_CODE_VFAC) {
      return `/vfas/vfas/index?clientid=${clientId}&lang=${language}`;
    }
    if (feedCode === BETRADAR_VIRTUAL_FEED_CODE_VFC) {
      return `/vfcc/vfcc/index?clientid=${clientId}&lang=${language}`;
    }
    if (feedCode === BETRADAR_VIRTUAL_FEED_CODE_VBL) {
      return `/vbl/vbl/index?clientid=${clientId}&lang=${language}`;
    }
  } else {
    if (feedCode === BETRADAR_VIRTUAL_FEED_CODE_VFLC) {
      return `/vflmstaging/desktop/index?clientid=${clientId}&lang=${language}&layout=Vflm1`;
    }
    if (feedCode === BETRADAR_VIRTUAL_FEED_CODE_VFNC) {
      return `/vfncstaging/vfnc/index?clientid=${clientId}&lang=${language}`;
    }
    if (feedCode === BETRADAR_VIRTUAL_FEED_CODE_VFWC) {
      return `/vfwcstaging/vfec/index?clientid=${clientId}&lang=${language}`;
    }
    if (feedCode === BETRADAR_VIRTUAL_FEED_CODE_VFAC) {
      return `/vfasstaging/vfas/index?clientid=${clientId}&lang=${language}`;
    }
    if (feedCode === BETRADAR_VIRTUAL_FEED_CODE_VFC) {
      return `/vfccstaging/vfcc/index?clientid=${clientId}&lang=${language}`;
    }
    if (feedCode === BETRADAR_VIRTUAL_FEED_CODE_VBL) {
      return `/vblstaging/vbl/index?clientid=${clientId}&lang=${language}`;
    }
  }

  return undefined;
};

const getHeight = (feedCode) => {
  if (feedCode === BETRADAR_VIRTUAL_FEED_CODE_VBL) {
    return 630;
  }

  return 620;
};

const getWidth = (feedCode) => {
  if (feedCode === BETRADAR_VIRTUAL_FEED_CODE_VBL) {
    return 765;
  }

  return 765;
};

const propTypes = {
  feedCode: PropTypes.string.isRequired,
  setCurrentCodes: PropTypes.func.isRequired,
};

const correctIframeStyles = () => {
  // Inject css rules
  try {
    const brIframe = document.getElementById("brIframe");
    const doc = brIframe.contentDocument;
    doc.head.innerHTML += "<style>.oddsview {display: none !important}</style>";
  } catch (e) {
    console.err("Unable to inject custom css rules into iframe");
  }
};

const WidgetBetradarVirtualSportsFrame = ({ feedCode, setCurrentCodes }) => {
  const authLanguage = useSelector(getAuthLanguage);
  const cmsConfigBetradarVirtual = useSelector(getCmsConfigBetradarVirtual);

  const [height, setHeight] = useState(300);

  const {
    data: { clientId, clientName, mode },
  } = cmsConfigBetradarVirtual || { data: {} };

  useEffect(() => {
    setCurrentCodes([]);
    setHeight(getHeight(feedCode));
  }, [feedCode]);

  //
  useEffect(() => {
    if (typeof window.setVblMatchday !== "function") {
      window.setVfecMatches = (data) => {
        if (data?.uf_match_ids) {
          // console.log(data);
          setCurrentCodes([...data.uf_match_ids].map((m) => `cBR:MATCH:${m}`));
        }
      };
      window.setVfMatches = (data) => {
        if (data?.uf_match_ids) {
          // console.log(data);
          setCurrentCodes([...data.uf_match_ids].map((m) => `cBR:MATCH:${m}`));
        }
      };
      window.setVblMatchday = (data) => {
        if (data?.season_no && data?.match_day) {
          // console.log(data);
          setCurrentCodes([`fBR:TNMNT:vbl:tournament:season${data.season_no}:round${data.match_day}`]);
        }
      };
      window.setVblHeight = () => {
        // less intrusive place to do this...
        correctIframeStyles();
      };
    }

    return () => {
      window.setVfecMatches = undefined;
      window.setVfMatches = undefined;
      window.setVblMatchday = undefined;
      window.setVblHeight = undefined;
    };
  }, []);

  const isProduction = mode === "PRODUCTION";

  const url = getIFrameUrl(isProduction, clientId, clientName, authLanguage, feedCode);

  return <iframe height={height} id="brIframe" src={url} title="Virtual Sports" width={getWidth(feedCode)} />;
};

WidgetBetradarVirtualSportsFrame.propTypes = propTypes;

export default WidgetBetradarVirtualSportsFrame;
