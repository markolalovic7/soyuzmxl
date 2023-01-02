import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import classes from "../../../../scss/citywebstyle.module.scss";
import PagePath from "../../../Navigation/PagePath/PagePath";

import InPlaySportsContent from "./InPlaySportsContent/InPlaySportsContent";
import SportpageNavigation from "./SportpageInPlayNavigation/SportpageInPlayNavigation";

const SportpageInPlayCentralContent = (props) => {
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
          { description: props.activeCarouselSport ? props.activeCarouselSport : "" },
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
        <InPlaySportsContent
          activeCarouselSport={props.activeCarouselSport}
          activeCentralContentTab={props.activeCentralContentTab}
          activeDateTab={activeDateTab}
        />
      </div>
    </>
  );
};

export default React.memo(SportpageInPlayCentralContent);
