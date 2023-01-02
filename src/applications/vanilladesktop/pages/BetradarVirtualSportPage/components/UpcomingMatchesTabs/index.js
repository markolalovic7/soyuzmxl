import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import { useState } from "react";

const TABS = [
  "#1197",
  "#1198",
  "#1199",
  "#1200",
  "#1201",
  "#1202",
  "#1203",
  "#1204",
  "#1205",
  "#1206",
  "#1207",
  "#1208",
];

const UpcomingMatchesTabs = () => {
  const [selectedTab, setSelectedTab] = useState(TABS[0]);

  const selectPreviousTab = () => {
    const selectedTabIndex = TABS.indexOf(selectedTab);
    if (selectedTabIndex > 0) {
      setSelectedTab(TABS[selectedTabIndex - 1]);
    }
  };

  const selectNextTab = () => {
    const selectedTabIndex = TABS.indexOf(selectedTab);
    if (selectedTabIndex !== TABS.length - 1) {
      setSelectedTab(TABS[selectedTabIndex + 1]);
    }
  };

  return (
    <div className={classes["matches-tabs"]}>
      {TABS.map((tab, index) => (
        <div
          className={cx(classes["match-tab"], { [classes["active"]]: tab === selectedTab })}
          key={index}
          onClick={() => setSelectedTab(tab)}
        >
          {tab}
        </div>
      ))}
      <div className={classes["matches-tabs__button"]} onClick={selectPreviousTab}>
        <span />
      </div>
      <div className={classes["matches-tabs__button"]} onClick={selectNextTab}>
        <span />
      </div>
    </div>
  );
};

export default UpcomingMatchesTabs;
