import React, { useEffect, useState } from "react";

import { gaEvent } from "../../../../../utils/google-analytics-utils";
import classes from "../../../scss/citywebstyle.module.scss";

import SportpageDailyMatchListCentralContent from "./SportpageDailyMatchListCentralContent/SportpageDailyMatchListCentralContent";
import SportpageInPlayCentralContent from "./SportpageInPlayCentralContent/SportpageInPlayCentralContent";
import SportpageAllLeaguesCentralContent from "./SportspageAllLeaguesCentralContent/SportpageAllLeaguesCentralContent";
import SportpageTopLeaguesCentralContent from "./SportspageTopLeaguesCentralContent/SportpageTopLeaguesCentralContent";

const SportpageCentralContent = (props) => {
  const [activeCarouselSport, setActiveCarouselSport] = useState(props.sportCode);
  const [activeCentralContentTab, setActiveCentralContentTab] = useState("TOP_LEAGUES"); // INPLAY, TOP_LEAGUES, ALL_LEAGUES, DAILY_MATCH_LIST

  useEffect(() => {
    if (props.sportCode) {
      setActiveCarouselSport(props.sportCode);
    }
  }, [props.sportCode]);

  const onActiveTabChangeHandler = (newActiveTab) => {
    setActiveCentralContentTab(newActiveTab);
    gaEvent("Sport Page Content Type Change", "sportpage_content_type_change", newActiveTab, undefined, true); // Sport page change active tab
  };

  return (
    <section className={classes["content"]}>
      {activeCentralContentTab === "DAILY_MATCH_LIST" ? (
        <SportpageDailyMatchListCentralContent
          activeCarouselSport={activeCarouselSport}
          activeCentralContentTab={activeCentralContentTab}
          setActiveCentralContentTab={onActiveTabChangeHandler}
        />
      ) : null}
      {activeCentralContentTab === "INPLAY" ? (
        <SportpageInPlayCentralContent
          activeCarouselSport={activeCarouselSport}
          activeCentralContentTab={activeCentralContentTab}
          setActiveCentralContentTab={onActiveTabChangeHandler}
        />
      ) : null}
      {activeCentralContentTab === "ALL_LEAGUES" ? (
        <SportpageAllLeaguesCentralContent
          activeCarouselSport={activeCarouselSport}
          activeCentralContentTab={activeCentralContentTab}
          setActiveCentralContentTab={onActiveTabChangeHandler}
        />
      ) : null}
      {activeCentralContentTab === "TOP_LEAGUES" ? (
        <SportpageTopLeaguesCentralContent
          activeCarouselSport={activeCarouselSport}
          activeCentralContentTab={activeCentralContentTab}
          setActiveCentralContentTab={onActiveTabChangeHandler}
        />
      ) : null}
    </section>
  );
};

export default React.memo(SportpageCentralContent);
