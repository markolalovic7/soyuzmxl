import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import isEmpty from "lodash.isempty";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { getMatchRecommendations } from "../../../../redux/reselect/recommender-selector";
import { loadMatchRecommendations } from "../../../../redux/slices/recommenderSlice";
import { isNotEmpty } from "../../../../utils/lodash";

import MatchRecommendationMenuItem from "./components/MatchRecommendationMenuItem";
import cx from "classnames";

const MatchRecommendationMenu = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const recommendations = useSelector(getMatchRecommendations);

  useEffect(() => {
    if (!recommendations) {
      dispatch(loadMatchRecommendations());
    }
  }, [dispatch, recommendations]);

  const onClick = (eventPathId, eventId) => {
    history.push(`/prematch/eventpath/${eventPathId}/event/${eventId}`);
  };

  return (
    <div className={classes["left-section__item"]}>
      <h3 className={classes["left-section__title"]}>{t("match_recommendations_for_you")}</h3>
      {isNotEmpty(recommendations) &&
        recommendations?.map((data) => (
          <MatchRecommendationMenuItem
            data={data}
            key={data.eventId}
            onClick={() => onClick(data.eventPathId, data.eventId)}
          />
        ))}
      {isEmpty(recommendations) && <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} />}
    </div>
  );
};

export default React.memo(MatchRecommendationMenu);
