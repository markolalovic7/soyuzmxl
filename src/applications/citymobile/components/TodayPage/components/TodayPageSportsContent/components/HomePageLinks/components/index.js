import * as PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";

import classes from "../../../../../../../scss/citymobile.module.scss";

const HomePageLinks = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();

  return (
    <div className={classes["sport-titles"]}>
      <div
        className={`${classes["sport-title"]} ${activeTab === "TODAY" ? classes["sport-title_active"] : ""}`}
        onClick={() => setActiveTab("TODAY")}
      >
        {t("todays_matches_page")}
      </div>
      <div
        className={`${classes["sport-title"]} ${activeTab === "INPLAY" ? classes["sport-title_active"] : ""}`}
        onClick={() => setActiveTab("INPLAY")}
      >
        {t("in_play_page")}
      </div>
      <div
        className={`${classes["sport-title"]} ${activeTab === "UPCOMING" ? classes["sport-title_active"] : ""}`}
        onClick={() => setActiveTab("UPCOMING")}
      >
        {t("upcoming")}
      </div>
      <div
        className={`${classes["sport-title"]} ${activeTab === "HIGHLIGHTS" ? classes["sport-title_active"] : ""}`}
        onClick={() => setActiveTab("HIGHLIGHTS")}
      >
        {t("highlights")}
      </div>
    </div>
  );
};

HomePageLinks.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default React.memo(HomePageLinks);
