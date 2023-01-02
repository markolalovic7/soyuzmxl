import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import classes from "../../../../scss/citywebstyle.module.scss";
import { getFeaturedLeagues } from "../utils/NavigationUtils";

const LeftNavigationHighlights = () => {
  const { t } = useTranslation();

  const sports = useSelector((state) => state.sport.sports);
  const cmsConfig = useSelector((state) => state.cms.config);
  const featuredLeagues = getFeaturedLeagues(cmsConfig);

  return (
    <>
      <h2 className={`${classes["accordion-title"]} ${classes["accordion-title_blue"]}`}>{t("highlights")}</h2>
      <div className={classes["dropdowns"]}>
        {featuredLeagues
          .sort((a, b) => a.ordinal - b.ordinal)
          .map((featuredItem) => (
            <Link
              className={classes["dropdown"]}
              key={featuredItem.eventPathId}
              to={`/leagues/${featuredItem.sportCode}/${featuredItem.eventPathId}`}
            >
              <div className={classes["dropdown__body"]}>
                <div className={classes["dropdown__text"]}>
                  <h4 className={classes["dropdown__title"]}>
                    {sports ? sports[featuredItem.sportCode].description : ""}
                  </h4>
                  <h5 className={`${classes["dropdown__title"]}}`} style={{ lineHeight: "normal" }}>
                    {featuredItem.eventPathDescription}
                  </h5>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
};

export default LeftNavigationHighlights;
