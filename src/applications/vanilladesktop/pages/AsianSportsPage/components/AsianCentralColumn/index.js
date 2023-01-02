import cx from "classnames";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";

import { getAuthLanguage } from "../../../../../../redux/reselect/auth-selector";
import { getCmsLayoutAsianDesktopRightColumnFirstMatchTracker } from "../../../../../../redux/reselect/cms-layout-widgets";
import { getCmsConfigIframeMode } from "../../../../../../redux/reselect/cms-selector";
import ScrollToTop from "../../../../../common/components/ScrollToTop/ScrollToTop";
import CentralColumnWidgets from "../../../../components/CentralColumnWidgets";
import classes from "../../../../scss/vanilladesktop.module.scss";
import { ASIAN_EARLIER_TAB, ASIAN_TODAY_TAB } from "../constants";

import AsianCoupon from "./components/AsianCoupon";
import PrematchDateNavigationBar from "./components/PrematchDateNavigationBar";

const getEventType = (tab) => {
  switch (tab) {
    case "oc":
      return "RANK";
    default:
      return "GAME";
  }
};

const getFromDate = (tab) => {
  let initDate = 0;

  switch (tab) {
    case "oc":
    case "0":
      initDate = 0;
      break;
    case "7+":
      initDate = 7;
      break;
    default:
      initDate = parseInt(tab, 10);
  }

  const fromDate = `${dayjs()
    .add(initDate, "day")
    .set("hour", 0)
    .set("minute", 0)
    .set("second", 0)
    .set("millisecond", 0)
    .toDate()
    .toISOString()
    .slice(0, -1)}+00:00`;

  return fromDate;
};

const getToDate = (tab) => {
  let endDate = 0;

  switch (tab) {
    case "0":
      endDate = 0;
      break;
    case "oc":
    case "7+":
      endDate = 365;
      break;
    default:
      endDate = parseInt(tab, 10);
  }

  const toDate = `${dayjs()
    .add(endDate, "day")
    .set("hour", 23)
    .set("minute", 59)
    .set("second", 59)
    .set("millisecond", 999)
    .toDate()
    .toISOString()
    .slice(0, -1)}+00:00`;

  return toDate;
};

const AsianCentralColumn = () => {
  const language = useSelector(getAuthLanguage);

  const { criteria, dateTab, sportCode } = useParams();

  const location = useLocation();

  const [selectedTopTab, setSelectedTopTab] = useState();

  const eventType = getEventType(selectedTopTab);

  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  const matchTrackerWidget = useSelector((state) =>
    getCmsLayoutAsianDesktopRightColumnFirstMatchTracker(state, location),
  );

  // Reference:  https://widgets.sir.sportradar.com/docs/Widgets.match.LMT.html.
  useEffect(() => {
    if (matchTrackerWidget?.data?.mode === "BETRADAR") {
      const clientId = matchTrackerWidget.data.betradarClientId;
      const script = document.createElement("script");
      script.innerHTML = `(function(a,b,c,d,e,f,g,h,i){a[e]||(i=a[e]=function(){(a[e].q=a[e].q||[]).push(arguments)},i.l=1*new Date,i.o=f,g=b.createElement(c),h=b.getElementsByTagName(c)[0],g.async=1,g.src=d,g.setAttribute("n",e),h.parentNode.insertBefore(g,h))})(window,document,"script", "https://widgets.sir.sportradar.com/${clientId}/widgetloader", "SIR", {
                              theme: false, // using custom theme
                              language: "${language}"
                          });`;
      // script.type = "application/javascript";
      // script.async = true;

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
        window.SIR = null; // for good measure
      };
    }

    return undefined;
  }, [matchTrackerWidget, language]);

  return (
    <div className={cx(classes["central-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
      <ScrollToTop />

      <CentralColumnWidgets />

      {dateTab === ASIAN_EARLIER_TAB && sportCode && !criteria.endsWith("OUTRIGHT") && (
        <PrematchDateNavigationBar
          asianCriteria={criteria}
          selectedTopTab={selectedTopTab}
          setSelectedTopTab={setSelectedTopTab}
          sportCode={sportCode}
        />
      )}
      {criteria &&
        dateTab &&
        sportCode &&
        (dateTab !== ASIAN_EARLIER_TAB || selectedTopTab || criteria.endsWith("OUTRIGHT")) && (
          <AsianCoupon
            eventType={eventType}
            fromDate={
              dateTab === ASIAN_EARLIER_TAB && !criteria.endsWith("OUTRIGHT")
                ? getFromDate(selectedTopTab)
                : dateTab === ASIAN_TODAY_TAB
                ? getFromDate(0)
                : undefined
            }
            toDate={
              dateTab === ASIAN_EARLIER_TAB && !criteria.endsWith("OUTRIGHT")
                ? getToDate(selectedTopTab)
                : dateTab === ASIAN_TODAY_TAB
                ? getToDate(0)
                : undefined
            }
          />
        )}
    </div>
  );
};

export default AsianCentralColumn;
