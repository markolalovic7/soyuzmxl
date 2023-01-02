import SportBar from "applications/slimmobile/common/components/SportBar";
import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getCmsLayoutMobileSlimDashboardWidgetFeaturedLeagues } from "redux/reselect/cms-layout-widgets";
import { isNotEmpty } from "utils/lodash";

import CentralCarousel from "../../../common/components/CentralCarousel";
import CentralIFrame from "../../../common/components/CentralIFrame";
import LiveDashboard from "../../LivePage/components/LiveDashboard";
import { HOME_TAB_LIVE, HOME_TAB_SPORTS } from "../constants";

import MainPrematchFeaturedCoupon from "./MainPrematchFeaturedCoupon";

const HomePage = () => {
  const { t } = useTranslation();
  const {
    data: { featuredLeagues },
  } = useSelector(getCmsLayoutMobileSlimDashboardWidgetFeaturedLeagues) || { data: {} };

  const [activeTab, setActiveTab] = useState(HOME_TAB_SPORTS);

  const leagueCodes = isNotEmpty(featuredLeagues)
    ? featuredLeagues.map((featuredLeague) => featuredLeague.eventPathId)
    : [];

  const renderBody = () => {
    switch (activeTab) {
      case HOME_TAB_SPORTS:
        return <MainPrematchFeaturedCoupon eventPathListFilter={leagueCodes} />;
      case HOME_TAB_LIVE:
        return <LiveDashboard eventPathListFilter={leagueCodes} />;
      default:
        return null;
    }
  };

  return (
    <>
      <SportBar />
      <div className={classes["main"]}>
        <CentralCarousel />
        <CentralIFrame />
        <div className={classes["result"]}>
          <div className={classes["result__switcher"]}>
            <div
              className={`${classes["result__switch-btn"]} ${
                activeTab === HOME_TAB_SPORTS
                  ? classes["result__switch-btn_primary"]
                  : classes["result__switch-btn_secondary"]
              }`}
              onClick={() => setActiveTab(HOME_TAB_SPORTS)}
            >
              {t("sports")}
            </div>
            <div
              className={`${classes["result__switch-btn"]} ${
                activeTab === HOME_TAB_LIVE
                  ? classes["result__switch-btn_primary"]
                  : classes["result__switch-btn_secondary"]
              }`}
              onClick={() => setActiveTab(HOME_TAB_LIVE)}
            >
              {t("live")}
            </div>
          </div>
          {renderBody()}
        </div>
      </div>
    </>
  );
};

export default HomePage;
