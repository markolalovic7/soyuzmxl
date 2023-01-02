import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getAuthLanguage } from "../../../../../redux/reselect/auth-selector";
import { getCmsConfigBetradarVirtual } from "../../../../../redux/reselect/cms-selector";
import { getDesktopIFrameUrl } from "../../../../../utils/betradar-virtual-utils";

const propTypes = {
  feedCode: PropTypes.string.isRequired,
  setCurrentCodes: PropTypes.func.isRequired,
};

const correctIframeStyles = () => {
  // Inject css rules
  try {
    const brIframe = document.getElementById("brIframe");
    const doc = brIframe.contentDocument;
    doc.head.innerHTML += "<style>.quickBetting {display: none} .oddsview {display: none}</style>";
  } catch (e) {
    console.err("Unable to inject custom css rules into iframe");
  }
};

const ResponsiveBetradarVirtualSportsFrame = ({ feedCode, setCurrentCodes }) => {
  const authLanguage = useSelector(getAuthLanguage);
  const cmsConfigBetradarVirtual = useSelector(getCmsConfigBetradarVirtual);

  const [height, setHeight] = useState(300);

  const {
    data: { clientId, clientName, mode },
  } = cmsConfigBetradarVirtual || { data: {} };

  const subscribe = (message) => {
    try {
      const data = JSON.parse(message.data);

      const messageType = data.messageType;
      const messageData = data.messageData;

      switch (messageType) {
        case "switchEvents":
          /* Do 'switchEvents' stuff here */
          setCurrentCodes([...messageData.unified_event_ids].map((m) => `cBR:MATCH:${m}`));
          break;
        case "setHeight":
          /* Do 'setHeight' stuff here */
          setHeight(messageData.height);

          correctIframeStyles(); // Less intrusive place to do this.
          break;
        case "placeBets":
          // console.log(messageData);
          /* Do 'placeBets' stuff here */
          break;
        case "seekEvents":
          // console.log(messageData);
          /* 'seekEvents' is not supported by Virtual In-Play Tennis */
          break;
        default:
        /* handle unknown message types here and exit function */
      }
    } catch (e) {
      // ignore if we receive garbage
    }
  };

  useEffect(() => {
    setCurrentCodes([]);
    setHeight(300);
  }, [feedCode]);

  useEffect(() => {
    window.addEventListener("message", subscribe);

    return () => window.removeEventListener("message", subscribe);
  }, [subscribe]);

  const isProduction = mode === "PRODUCTION";

  const url = getDesktopIFrameUrl(isProduction, clientId, clientName, authLanguage, feedCode);

  return <iframe height={height} id="brIframe" src={url} title="Virtual Sports" width="100%" />;
};

ResponsiveBetradarVirtualSportsFrame.propTypes = propTypes;

export default ResponsiveBetradarVirtualSportsFrame;
