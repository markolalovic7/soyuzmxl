import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  APPLICATION_TYPE_MOBILE_ASIAN,
  APPLICATION_TYPE_MOBILE_VANILLA,
} from "../../../../../constants/application-types";
import { getAuthMobileView } from "../../../../../redux/reselect/auth-selector";
import { getCmsLayoutMobileVanilla } from "../../../../../redux/reselect/cms-layout-selector";
import { TAB_FEATURED, TAB_LIVE, TAB_NEXT } from "../constants";
import { getFeaturedSearchCode } from "../utils";

import AsianLiveHomeTab from "./AsianLiveHomeTab";
import EuropeanLiveHomeTab from "./EuropeanLiveHomeTab";
import HomeCarousel from "./HomeCarousel";
import HomeIFrame from "./HomeIFrame";
import NavigationSportCarousel from "./NavigationSportCarousel";
import NavigationTabButtons from "./NavigationTabButtons";

import PrematchContainer from "applications/vanillamobile/common/components/PrematchContainer";
import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getCmsConfigAppearanceMobileDashboardPreferences } from "redux/reselect/cms-selector";

const HomePage = () => {
  const { sportCode } = useParams(); // allow a route to optionally predefine the landing sport

  const view = useSelector(getAuthMobileView);

  const viewLayouts = useSelector(getCmsLayoutMobileVanilla);
  const tabs = useSelector(getCmsConfigAppearanceMobileDashboardPreferences);
  const [selectedTab, setSelectedTab] = useState(tabs[0] ?? TAB_LIVE);
  const [activeSportCode, setActiveSportCode] = useState(sportCode ?? "");

  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData);

  const validTabs = useMemo(() => {
    // Decide if the live tab should be offered at all
    if (tabs && !tabs.includes(TAB_LIVE)) {
      return tabs; // nothing to see here, move on
    }
    if (activeSportCode && tabs && sportsTreeData?.ept) {
      const sportData = sportsTreeData.ept.find((sport) => sport.code === activeSportCode);
      if (sportData.criterias?.live > 0) {
        return tabs;
      }

      return tabs.filter((tab) => tab !== TAB_LIVE);
    }

    return [];
  }, [activeSportCode, sportsTreeData, tabs]);

  useEffect(() => {
    if (!validTabs.includes(selectedTab)) {
      setSelectedTab(validTabs[0]);
    }
  }, [selectedTab, validTabs]);

  const renderBody = () => {
    if (!activeSportCode) {
      return null;
    }
    switch (selectedTab) {
      case TAB_FEATURED: {
        const searchCode = getFeaturedSearchCode(viewLayouts, activeSportCode);

        if (searchCode === `s${activeSportCode}`) {
          // if there is no featured content, return just the next 20 games.
          return (
            <PrematchContainer
              eventType="GAME"
              max={20}
              searchCode={`s${activeSportCode}`}
              sportCode={activeSportCode}
            />
          );
        }

        return <PrematchContainer eventType="GAME" searchCode={searchCode} sportCode={activeSportCode} />;
      }
      case TAB_NEXT: {
        return (
          <PrematchContainer eventType="GAME" max={20} searchCode={`s${activeSportCode}`} sportCode={activeSportCode} />
        );
      }
      case TAB_LIVE: {
        if (view === APPLICATION_TYPE_MOBILE_VANILLA)
          return <EuropeanLiveHomeTab activeSportCode={activeSportCode} sportCode={activeSportCode} />;

        if (view === APPLICATION_TYPE_MOBILE_ASIAN)
          return <AsianLiveHomeTab activeSportCode={activeSportCode} sportCode={activeSportCode} />;

        return null;
      }
      default:
        return null;
    }
  };

  return (
    <>
      <HomeCarousel />
      <HomeIFrame />
      <div className={classes["navigation"]}>
        <NavigationSportCarousel activeSportCode={activeSportCode} setActiveSportCode={setActiveSportCode} />

        <NavigationTabButtons selectedTab={selectedTab} setSelectedTab={setSelectedTab} tabs={validTabs} />
      </div>
      <div className={classes["bets"]}>{renderBody()}</div>
    </>
  );
};

export default HomePage;
