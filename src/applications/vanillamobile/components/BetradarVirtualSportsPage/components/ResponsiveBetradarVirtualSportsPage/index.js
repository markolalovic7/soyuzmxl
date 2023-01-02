import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getAuthLanguage } from "../../../../../../redux/reselect/auth-selector";
import { getCmsConfigBetradarVirtual } from "../../../../../../redux/reselect/cms-selector";
import { getMobileIFrameUrl } from "../../../../../../utils/betradar-virtual-utils";
import PrematchContainer from "../../../../common/components/PrematchContainer/components";
import classes from "../../styles/index.module.scss";

const getAPIFeedCode = (feedCode, matches) => {
  const prefix = "BR:MATCH:";

  return matches.map((m) => `c${prefix}${m}`).join(",");
};

const propTypes = {
  feedCode: PropTypes.string.isRequired,
};

const ResponsiveBetradarVirtualSportsPage = ({ feedCode }) => {
  const authLanguage = useSelector(getAuthLanguage);
  const cmsConfigBetradarVirtual = useSelector(getCmsConfigBetradarVirtual);

  const [height, setHeight] = useState(300);
  const [currentMatches, setCurrentMatches] = useState([]);

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
          setCurrentMatches([...messageData.unified_event_ids]);
          break;
        case "setHeight":
          /* Do 'setHeight' stuff here */
          setHeight(messageData.height);
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
    setCurrentMatches([]);
    setHeight(300);
  }, [feedCode]);

  useEffect(() => {
    window.addEventListener("message", subscribe);

    return () => window.removeEventListener("message", subscribe);
  }, [subscribe]);

  const isProduction = mode === "PRODUCTION";

  const url = getMobileIFrameUrl(isProduction, clientId, clientName, authLanguage, feedCode);

  return (
    <>
      <iframe height={height} src={url} title="Virtual Sports" />
      {currentMatches?.length > 0 && (
        <div className={classes["bets"]}>
          {/* Review if this would work for prematch and live */}
          <PrematchContainer live virtual eventType="ALL" searchCode={getAPIFeedCode(feedCode, currentMatches)} />
        </div>
      )}
    </>
  );
};

ResponsiveBetradarVirtualSportsPage.propTypes = propTypes;

export default ResponsiveBetradarVirtualSportsPage;
