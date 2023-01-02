import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getLeagueRecommendations } from "../../../../../../../redux/reselect/recommender-selector";
import { loadLeagueRecommendations } from "../../../../../../../redux/slices/recommenderSlice";

import SectionMatchRecommendationLink from "./components/SectionLeagueRecommendationLink";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { isNotEmpty } from "utils/lodash";
import cx from "classnames";

const propTypes = {
  onClose: PropTypes.func.isRequired,
};

const LeagueRecommendations = ({ onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const recommendations = useSelector(getLeagueRecommendations);

  useEffect(() => {
    if (!recommendations) {
      dispatch(loadLeagueRecommendations());
    }
  }, [dispatch, recommendations]);

  return (
    <div className={classes["overlay-burger__service"]}>
      <h2 className={classes["overlay-burger__heading"]}>{t("league_recommendations_for_you")}</h2>
      <ul className={classes["overlay-burger__list"]}>
        {isNotEmpty(recommendations) &&
          recommendations.map((data) => (
            <SectionMatchRecommendationLink
              description={data.description}
              eventPathId={data.eventPathId}
              key={data.eventId}
              sportCode={data.sportCode}
              onClose={onClose}
            />
          ))}
        {isEmpty(recommendations) && (
          <div className={classes["link_featured_league"]}>
            <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
          </div>
        )}
      </ul>
    </div>
  );
};

LeagueRecommendations.propTypes = propTypes;

export default LeagueRecommendations;
