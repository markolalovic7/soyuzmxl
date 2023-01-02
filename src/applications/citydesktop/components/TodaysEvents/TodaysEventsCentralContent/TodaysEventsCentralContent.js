import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import classes from "../../../scss/citywebstyle.module.scss";
import HomepageSportsCarousel from "../../Homepage/HomepageCentralContent/HomepageSportsCarousel/HomepageSportsCarousel";
import HomepageSportsContent from "../../Homepage/HomepageCentralContent/HomepageSportsContent/HomepageSportsContent";
import PagePath from "../../Navigation/PagePath/PagePath";

const TodaysEventsCentralContent = () => {
  const { t } = useTranslation();

  const [activeCarouselSport, setActiveCarouselSport] = useState(null);
  const [activeCentralContentTab, setActiveCentralContentTab] = useState("TODAY"); // TODAY, INPLAY, UPCOMING, HIGHLIGHTS
  const showContentTabSelector = false;

  return (
    <section className={classes["content"]}>
      <div className={classes["content__container"]}>
        <PagePath paths={[{ description: t("home_page"), target: "/" }, { description: t("todays_matches_page") }]} />

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

export default React.memo(TodaysEventsCentralContent);
