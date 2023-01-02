import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import classes from "../../../../scss/citywebstyle.module.scss";
import PagePath from "../../../Navigation/PagePath/PagePath";

import TodaysEventSportsContent from "./DailyMatchListSportsContent/DailyMatchListSportsContent";
import SportpageNavigation from "./SportpageDailyMatchListNavigation/SportpageDailyMatchListNavigation";

const SportpageDailyMatchListCentralContent = (props) => {
  const sports = useSelector((state) => state.sport.sports);

  const { t } = useTranslation();

  const [activeDateTab, setActiveDateTab] = useState(0); // Numeric - 0 for today, 1 for tomorrow, etc

  useEffect(() => {
    if (props.sportCode) {
      props.setActiveCarouselSport(props.sportCode);
    }
  }, [props.sportCode]);

  return (
    <>
      <PagePath
        paths={[
          {
            description: t("home_page"),
            target: "/",
          },
          { description: sports && props.activeCarouselSport ? sports[props.activeCarouselSport].description : "" },
        ]}
      />
      <div className={classes["content__container"]}>
        <SportpageNavigation
          activeCarouselSport={props.activeCarouselSport}
          activeCentralContentTab={props.activeCentralContentTab}
          activeDateTab={activeDateTab}
          setActiveCentralContentTab={props.setActiveCentralContentTab}
          setActiveDateTab={setActiveDateTab}
        />
        <TodaysEventSportsContent
          activeCarouselSport={props.activeCarouselSport}
          activeCentralContentTab={props.activeCentralContentTab}
          activeDateTab={activeDateTab}
        />
      </div>
    </>
  );
};

export default React.memo(SportpageDailyMatchListCentralContent);
