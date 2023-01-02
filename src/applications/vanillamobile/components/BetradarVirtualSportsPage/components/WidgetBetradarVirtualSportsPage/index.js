import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getAuthLanguage } from "../../../../../../redux/reselect/auth-selector";
import { getCmsConfigBetradarVirtual } from "../../../../../../redux/reselect/cms-selector";
import { getAPIFeedCode, getSportMobileTagByFeedCode } from "../../../../../../utils/betradar-virtual-utils";
import classes from "../../styles/index.module.scss";

import PrematchContainer from "applications/vanillamobile/common/components/PrematchContainer";

const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");
// dependent on utc plugin
dayjs.extend(utc);
dayjs.extend(timezone);

const WidgetBetradarVirtualSportsPage = ({ feedCode }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const authLanguage = useSelector(getAuthLanguage);
  const cmsConfigBetradarVirtual = useSelector(getCmsConfigBetradarVirtual);

  const [currentMatches, setCurrentMatches] = useState([]);
  const [nextMatches, setNextMatches] = useState([]);

  const {
    data: { clientId, clientName, mode },
  } = cmsConfigBetradarVirtual || { data: {} };

  useEffect(() => {
    const tz = dayjs.tz.guess().replace("/", ":");

    const script = document.createElement("script");
    script.src = `${window.location.protocol}//${
      mode === "PRODUCTION" ? "vsw" : "vswstaging"
    }.betradar.com/ls/mobile/?/${clientName}/${authLanguage}/${tz}/page/vsmobile`;

    document.body.appendChild(script);

    script.onload = () => {
      setScriptLoaded(true);
    };

    return () => {
      document.body.removeChild(script);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLoad = (vsmInstance) => {
    console.log(`onLoad: ${vsmInstance}`);
  };

  const setEvents = (vsmInstance, data) => {
    const chunks = data.chunks;
    const current = chunks?.length > 0 ? chunks[0].event_ids : [];
    const next = chunks?.length > 1 ? chunks[1].event_ids : [];

    setCurrentMatches(current);
    setNextMatches(next);
  };

  useEffect(() => {
    if (scriptLoaded && window.vsmobile && feedCode) {
      const options = {
        clientId,
        currentMatchdayTitleContainer: "#vsm-current-matchday-title",
        nextMatchdayTitleContainer: "#vsm-next-matchday-title",
        onLoad,
        setEvents,
        showUnsupportedDeviceWarning: true,
        sport: getSportMobileTagByFeedCode(feedCode),
      };

      const vsm = window.vsmobile.init("#vsm_container", options);

      return () => {
        setCurrentMatches([]);
        setNextMatches([]);
        vsm.destroy();
      };
    }

    return undefined;
  }, [clientId, feedCode, scriptLoaded]);

  return (
    <>
      <div id="vsm_container" />
      <div className="vsm-current-matchday-title" id="vsm-current-matchday-title" />
      {currentMatches?.length > 0 && (
        <div className={classes["bets"]}>
          {/* Review if this would work for prematch and live */}
          <PrematchContainer virtual eventType="ALL" searchCode={getAPIFeedCode(feedCode, currentMatches)} />
        </div>
      )}

      <div className="vsm-next-matchday-title" id="vsm-next-matchday-title" />
      {nextMatches?.length > 0 && (
        <div className={classes["bets"]}>
          {/* Review if this would work for prematch and live */}
          <PrematchContainer virtual eventType="ALL" searchCode={getAPIFeedCode(feedCode, nextMatches)} />
        </div>
      )}
    </>
  );
};

const propTypes = {
  feedCode: PropTypes.string.isRequired,
};
WidgetBetradarVirtualSportsPage.propTypes = propTypes;

export default WidgetBetradarVirtualSportsPage;
