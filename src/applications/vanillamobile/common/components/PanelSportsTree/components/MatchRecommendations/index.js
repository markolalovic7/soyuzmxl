import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getMatchRecommendations } from "../../../../../../../redux/reselect/recommender-selector";
import { loadMatchRecommendations } from "../../../../../../../redux/slices/recommenderSlice";

import SectionMatchRecommendationLink from "./components/SectionMatchRecommendationLink";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { isNotEmpty } from "utils/lodash";
import cx from "classnames";

const propTypes = {
  onClose: PropTypes.func.isRequired,
};

const MatchRecommendations = ({ onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const recommendations = useSelector(getMatchRecommendations);

  useEffect(() => {
    if (!recommendations) {
      dispatch(loadMatchRecommendations());
    }
  }, [dispatch, recommendations]);

  return (
    <div className={classes["overlay-burger__service"]}>
      <h2 className={classes["overlay-burger__heading"]}>{t("match_recommendations_for_you")}</h2>
      <ul className={classes["overlay-burger__list"]}>
        {isNotEmpty(recommendations) &&
          recommendations.map((data) => (
            <SectionMatchRecommendationLink
              description={data.description}
              eventId={data.eventId}
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

MatchRecommendations.propTypes = propTypes;

export default MatchRecommendations;
