import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import { getCmsConfigIframeMode } from "../../../../../../redux/reselect/cms-selector";
import CentralColumnWidgets from "../../../../components/CentralColumnWidgets";
import CentralColumnTopBar from "../../../../components/PrematchDateNavigationBar";
import CentralColumnSportTabs from "../CentralColumnSportTabs";

import CentralColumnCoupon from "./CentralColumnCoupon";

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

const CentralColumn = () => {
  const { eventPathId: eventPathIdStr } = useParams();

  const eventPathId = eventPathIdStr ? parseInt(eventPathIdStr, 10) : 240;

  const [selectedTopTab, setSelectedTopTab] = useState();
  const [selectedMarketTypeGroup, setSelectedMarketTypeGroup] = useState("MONEY_LINE", "HANDICAP", "OVER_UNDER"); //
  const [excludedTournaments, setExcludedTournaments] = useState([]);

  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  const code = selectedTopTab && `p${eventPathId}`;

  const eventType = getEventType(selectedTopTab);

  return (
    <div className={cx(classes["central-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
      <div className={classes["central-section__content"]}>
        <CentralColumnWidgets />
        <CentralColumnTopBar
          eventPathId={eventPathId}
          selectedTopTab={selectedTopTab}
          setSelectedTopTab={setSelectedTopTab}
        />
        <div className={classes["central-section__container"]}>
          <CentralColumnSportTabs
            eventPathId={eventPathId}
            excludedTournaments={excludedTournaments}
            isOutright={eventType === "RANK"}
            selectedMarketTypeGroup={selectedMarketTypeGroup}
            setExcludedTournaments={setExcludedTournaments}
            setSelectedMarketTypeGroup={setSelectedMarketTypeGroup}
          />
          {code && (
            <CentralColumnCoupon
              code={code}
              eventPathId={eventPathId}
              eventType={eventType}
              excludedTournaments={excludedTournaments}
              fromDate={selectedTopTab && getFromDate(selectedTopTab)}
              selectedMarketTypeGroup={selectedMarketTypeGroup}
              toDate={selectedTopTab && getToDate(selectedTopTab)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CentralColumn);
