import * as PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { gaEvent } from "../../../../../../../../../utils/google-analytics-utils";
import classes from "../../../../../../../scss/citymobile.module.scss";

const SportPageLinks = ({ activeTab, liveOn, setActiveTab, sportCode }) => {
  const { t } = useTranslation();

  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData);
  const sports = useSelector((state) => state.sport.sports);

  const onActiveTabChangeHandler = (newActiveTab) => {
    setActiveTab(newActiveTab);
    gaEvent("Sport Page Content Type Change", "sportpage_content_type_change", newActiveTab, undefined, true); // Sport page change active tab
  };
  let showGameEvents = true;
  const sportObject =
    sportsTreeData && sportsTreeData.ept
      ? Object.values(sportsTreeData.ept).find((sportSubTree) => sportSubTree.code === sportCode)
      : null;

  if (sportObject?.criterias) {
    showGameEvents = Object.keys(sportObject.criterias).filter((c) => c !== "oc").length > 0;
  }

  return (
    <div className={classes["sport-titles"]}>
      {liveOn ? (
        <div
          className={`${classes["sport-title"]} ${activeTab === "INPLAY" ? classes["sport-title_active"] : ""}`}
          onClick={() => onActiveTabChangeHandler("INPLAY")}
        >
          {t("in_play_page")}
        </div>
      ) : null}
      <div
        className={`${classes["sport-title"]} ${activeTab === "TOP_LEAGUES" ? classes["sport-title_active"] : ""}`}
        onClick={() => onActiveTabChangeHandler("TOP_LEAGUES")}
      >
        {t("top_leagues_page")}
      </div>
      <div
        className={`${classes["sport-title"]} ${activeTab === "ALL_LEAGUES" ? classes["sport-title_active"] : ""}`}
        onClick={() => onActiveTabChangeHandler("ALL_LEAGUES")}
      >
        {t("all_leagues_page")}
      </div>
      {showGameEvents && (
        <div
          className={`${classes["sport-title"]} ${
            activeTab === "DAILY_MATCH_LIST" ? classes["sport-title_active"] : ""
          }`}
          onClick={() => onActiveTabChangeHandler("DAILY_MATCH_LIST")}
        >
          {t("daily_match_list_page")}
        </div>
      )}
    </div>
  );
};

SportPageLinks.propTypes = {
  activeTab: PropTypes.string.isRequired,
  liveOn: PropTypes.bool.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  sportCode: PropTypes.string.isRequired,
};

export default React.memo(SportPageLinks);
