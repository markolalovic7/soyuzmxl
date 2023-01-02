import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import classes from "../../../../scss/citywebstyle.module.scss";
import CountrypageContainer from "../../../Countrypage/CountrypageCentralContent/CountrypageCentralContent/CountrypageContainer/CountrypageContainer";
import LeaguepageOutrightContent from "../../../Leaguepage/LeaguepageCentralContent/LeaguepageCentralContent/LeaguepageOutrightContent";
import PagePath from "../../../Navigation/PagePath/PagePath";
import SportpageNavigation from "../SportpageDailyMatchListCentralContent/SportpageDailyMatchListNavigation/SportpageDailyMatchListNavigation";

const getTopLeagueEventPathIds = (cmsConfig, sportsTreeData, sportCode) => {
  const viewLayouts = cmsConfig.layouts.DESKTOP_CITY_VIEW;
  if (viewLayouts && sportsTreeData) {
    const eventPathId = Object.values(sportsTreeData.ept).find((sport) => sport.code === sportCode).id;

    // find the top level prematch config.
    const targetLayout = viewLayouts.find(
      (layout) => layout.route === "PREMATCH_SPECIFIC_EVENT_PATH" && layout.eventPathIds.includes(eventPathId),
    );
    if (targetLayout) {
      const widget = targetLayout.widgets.find(
        (w) => w.section === "CENTER_NAVIGATION_COLUMN" && w.cmsWidgetType === "FEATURED_LEAGUES" && w.enabled === true,
      );

      if (widget) {
        return widget.data.featuredLeagues.filter((l) => l.sportCode === sportCode).map((l) => `p${l.eventPathId}`);
      }
    }
  }

  return null;
};

const SportpageTopLeaguesCentralContent = (props) => {
  const { t } = useTranslation();

  const cmsConfig = useSelector((state) => state.cms.config);
  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData);
  const sports = useSelector((state) => state.sport.sports);

  const cmsLeagueIds = getTopLeagueEventPathIds(cmsConfig, sportsTreeData, props.activeCarouselSport);
  const code = cmsLeagueIds ? cmsLeagueIds.join(",") : `s${props.activeCarouselSport}`;

  let showGameEvents = true;
  let sportObject = null;
  if (!cmsLeagueIds) {
    sportObject =
      sportsTreeData && sportsTreeData.ept
        ? Object.values(sportsTreeData.ept).find((sportSubTree) => sportSubTree.code === props.activeCarouselSport)
        : null;

    if (sportObject?.criterias) {
      showGameEvents = Object.keys(sportObject.criterias).filter((c) => c !== "oc").length > 0;
    }
  }

  return (
    <section className={classes["content"]}>
      <PagePath
        paths={[
          {
            description: t("home_page"),
            target: "/",
          },
          { description: props.activeCarouselSport && sports ? sports[props.activeCarouselSport].description : "" },
        ]}
      />

      <div className={classes["content__container"]}>
        <SportpageNavigation
          activeCarouselSport={props.activeCarouselSport}
          activeCentralContentTab={props.activeCentralContentTab}
          setActiveCentralContentTab={props.setActiveCentralContentTab}
        />

        {showGameEvents ? (
          <CountrypageContainer code={code} sportCode={props.activeCarouselSport} />
        ) : (
          <LeaguepageOutrightContent showFullDescription activeEventPathId={sportObject.id} />
        )}
      </div>
    </section>
  );
};

export default React.memo(SportpageTopLeaguesCentralContent);
