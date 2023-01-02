import { useOnClickOutside } from "hooks/utils-hooks";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { SPORT_BAR_TAB_LEAGUE, SPORT_BAR_TAB_SPORT } from "../constants";
import classes from "../styles/index.module.scss";
import { isActivePanelLeague, isActivePanelSport } from "../utils";

import PanelLeague from "./PanelLeague";
import PanelSport from "./PanelSport";
import SearchSport from "./SearchSport";

const propTypes = {
  hideSearchBar: PropTypes.bool,
};

const defaultProps = {
  hideSearchBar: false,
};

const SportBar = ({ hideSearchBar }) => {
  const { t } = useTranslation();
  const [panelActive, setPanelActive] = useState(null);
  const sportBarRef = useRef();

  useOnClickOutside(sportBarRef, () => setPanelActive(null));

  useEffect(() => {
    const show = !!panelActive;
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [panelActive]);

  const togglePanel = (panel) => () => {
    if (panelActive !== panel) {
      setPanelActive(panel);
    } else {
      setPanelActive(null);
    }
  };

  const backdropClickHandler = useCallback((event) => {
    if (event.target === event.currentTarget) {
      setPanelActive(null);
    }
  }, []);

  return (
    <div className={classes["sport_bar_wrapper"]} ref={sportBarRef}>
      <div className={classes["navigation__buttons"]}>
        <button
          className={`${classes["navigation__button"]} ${isActivePanelSport(panelActive) ? classes["active"] : ""}`}
          id={classes["btn-sports"]}
          type="button"
          onClick={togglePanel(SPORT_BAR_TAB_SPORT)}
        >
          {t("sports")}
        </button>
        <button
          className={`${classes["navigation__button"]} ${isActivePanelLeague(panelActive) ? classes["active"] : ""}`}
          id={classes["btn-league"]}
          type="button"
          onClick={togglePanel(SPORT_BAR_TAB_LEAGUE)}
        >
          {t("top_league")}
        </button>
      </div>
      {!hideSearchBar ? <SearchSport /> : null}
      <PanelSport backdropClick={backdropClickHandler} open={isActivePanelSport(panelActive)} />
      <PanelLeague backdropClick={backdropClickHandler} open={isActivePanelLeague(panelActive)} />
    </div>
  );
};

SportBar.propTypes = propTypes;
SportBar.defaultProps = defaultProps;

export default SportBar;
