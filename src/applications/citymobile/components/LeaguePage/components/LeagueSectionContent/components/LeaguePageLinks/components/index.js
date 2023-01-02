import * as PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";

import classes from "../../../../../../../scss/citymobile.module.scss";

const LeaguePageLinks = ({ activeTab, gameAllowed, outrightAllowed, setActiveTab }) => {
  const { t } = useTranslation();

  return (
    <div className={classes["sport-titles"]}>
      {gameAllowed ? (
        <div
          className={`${classes["sport-title"]} ${activeTab === "GAME_ODDS" ? classes["sport-title_active"] : ""}`}
          onClick={() => setActiveTab("GAME_ODDS")}
        >
          {t("game_odds")}
        </div>
      ) : null}
      {outrightAllowed ? (
        <div
          className={`${classes["sport-title"]} ${activeTab === "OUTRIGHT" ? classes["sport-title_active"] : ""}`}
          onClick={() => setActiveTab("OUTRIGHT")}
        >
          {t("outright")}
        </div>
      ) : null}
    </div>
  );
};

LeaguePageLinks.propTypes = {
  activeTab: PropTypes.string.isRequired,
  gameAllowed: PropTypes.bool.isRequired,
  outrightAllowed: PropTypes.bool.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default React.memo(LeaguePageLinks);
