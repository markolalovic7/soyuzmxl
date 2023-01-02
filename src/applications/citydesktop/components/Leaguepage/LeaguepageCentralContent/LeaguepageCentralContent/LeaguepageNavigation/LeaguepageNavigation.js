import React from "react";
import { useTranslation } from "react-i18next";

import classes from "../../../../../scss/citywebstyle.module.scss";

const LeaguepageNavigation = (props) => {
  const { t } = useTranslation();

  return (
    <div className={classes["links"]}>
      {props.gameOddsTabEnabled ? (
        <div
          className={`${classes["links__item"]} ${
            props.activeCentralContentTab === "GAME_ODDS" ? classes["links__item_active"] : ""
          }`}
          onClick={() => props.setActiveCentralContentTab("GAME_ODDS")}
        >
          {t("game_odds")}
        </div>
      ) : null}
      {props.outrightTabEnabled ? (
        <div
          className={`${classes["links__item"]} ${
            props.activeCentralContentTab === "OUTRIGHT" ? classes["links__item_active"] : ""
          }`}
          onClick={() => props.setActiveCentralContentTab("OUTRIGHT")}
        >
          {t("outright")}
        </div>
      ) : null}
    </div>
  );
};

export default React.memo(LeaguepageNavigation);
