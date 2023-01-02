import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { getLeagueRecommendations } from "../../../../redux/reselect/recommender-selector";
import { loadLeagueRecommendations } from "../../../../redux/slices/recommenderSlice";
import { isNotEmpty } from "../../../../utils/lodash";

import LeagueRecommendationMenuItem from "./components/LeagueRecommendationMenuItem";

const LeagueRecommendationMenu = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const recommendations = useSelector(getLeagueRecommendations);

  useEffect(() => {
    if (!recommendations) dispatch(loadLeagueRecommendations());
  }, [dispatch, recommendations]);

  const onClick = (eventPathId) => {
    history.push(`/prematch/eventpath/${eventPathId}`);
  };

  return (
    isNotEmpty(recommendations) && (
      <div className={classes["left-section__item"]}>
        <h3 className={classes["left-section__title"]}>{t("league_recommendations_for_you")}</h3>
        {recommendations?.map((data) => (
          <LeagueRecommendationMenuItem data={data} key={data.id} onClick={() => onClick(data.leagueid)} />
        ))}
      </div>
    )
  );
};

export default React.memo(LeagueRecommendationMenu);
