import React, { useState } from "react";

import classes from "../../../scss/citywebstyle.module.scss";

import HomepageSlider from "./HomepageSlider/HomepageSlider";
import HomepageSportsCarousel from "./HomepageSportsCarousel/HomepageSportsCarousel";
import HomepageSportsContent from "./HomepageSportsContent/HomepageSportsContent";

const HomepageCentralContent = () => {
  const [activeCarouselSport, setActiveCarouselSport] = useState(null);
  const [activeCentralContentTab, setActiveCentralContentTab] = useState("TODAY"); // TODAY, INPLAY, UPCOMING, HIGHLIGHTS
  const showContentTabSelector = true;

  return (
    <section className={classes["content"]}>
      <HomepageSlider />

      <div className={classes["content__container"]}>
        <HomepageSportsCarousel
          activeCarouselSport={activeCarouselSport}
          activeCentralContentTab={activeCentralContentTab}
          setActiveCarouselSport={setActiveCarouselSport}
          setActiveCentralContentTab={setActiveCentralContentTab}
          showContentTabSelector={showContentTabSelector}
        />

        <HomepageSportsContent
          activeCarouselSport={activeCarouselSport}
          activeCentralContentTab={activeCentralContentTab}
        />
      </div>
    </section>
  );
};

export default React.memo(HomepageCentralContent);
