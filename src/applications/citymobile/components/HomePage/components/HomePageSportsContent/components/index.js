import { useState } from "react";

import { gaEvent } from "../../../../../../../utils/google-analytics-utils";
import classes from "../../../../../scss/citymobile.module.scss";
import SportsContainer from "../../../../SportsContainer";

import HomePageLinks from "./HomePageLinks";

const getDateToIndex = (activeTab) => {
  if (activeTab === "TODAY") {
    return 0;
  }
  if (activeTab === "UPCOMING") {
    return 0.25;
  }

  return null;
};

const HomePageSportsContent = () => {
  // Track the state of the active tab in use
  const [activeTab, setActiveTab] = useState("TODAY"); // TODAY, INPLAY, UPCOMING, HIGHLIGHTS

  const onChangeContentTabHandler = (newActiveTab) => {
    setActiveTab(newActiveTab);
    gaEvent("Home Page Content Type Change", "homepage_content_type_change", newActiveTab, undefined, true); // Home page change active tab
  };

  return (
    <div className={classes["sport"]}>
      <HomePageLinks activeTab={activeTab} setActiveTab={onChangeContentTabHandler} />

      <SportsContainer
        sportSelectorModeOn
        dateSelectorModeOn={false}
        eventPathFilter={null}
        highlightsOn={activeTab === "HIGHLIGHTS"}
        liveModeOn={["TODAY", "INPLAY"].includes(activeTab)}
        prematchDateFromIndex={null}
        prematchDateToIndex={getDateToIndex(activeTab)}
        prematchModeOn={["TODAY", "UPCOMING", "HIGHLIGHTS"].includes(activeTab)}
        sportFilter={null}
      />
    </div>
  );
};

export default HomePageSportsContent;
