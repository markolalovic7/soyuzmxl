import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useGAPageView } from "../../../../hooks/google-analytics-hooks";
import classes from "../../scss/citywebstyle.module.scss";
import HomepageSportsCarousel from "../Homepage/HomepageCentralContent/HomepageSportsCarousel/HomepageSportsCarousel";
import HomepageSportsContent from "../Homepage/HomepageCentralContent/HomepageSportsContent/HomepageSportsContent";

const LiveOverview = () => {
  const { t } = useTranslation();

  const [activeCarouselSport, setActiveCarouselSport] = useState(null);
  const [activeCentralContentTab, setActiveCentralContentTab] = useState("INPLAY");

  const showContentTabSelector = false;

  useGAPageView("Live Overview");

  return (
    <section className={classes["content"]}>
      <div className={classes["content__container"]}>
        <HomepageSportsCarousel
          activeCarouselSport={activeCarouselSport}
          activeCentralContentTab={activeCentralContentTab}
          setActiveCarouselSport={setActiveCarouselSport}
          setActiveCentralContentTab={setActiveCentralContentTab}
          showContentTabSelector={showContentTabSelector}
        />

        <HomepageSportsContent
          favouriteEnabled
          overviewPageMode
          activeCarouselSport={activeCarouselSport}
          activeCentralContentTab={activeCentralContentTab}
        />
      </div>
    </section>
  );
};

export default LiveOverview;
