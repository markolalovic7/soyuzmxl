import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import { useOnClickOutside } from "hooks/utils-hooks";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";

import { PANEL_LEAGUE, PANEL_SPORT } from "../constants";

import LeagueSelectorPanel from "./LeagueSelectorPanel";
import SportSelectorPanel from "./SportSelectorPanel";

const propTypes = {
  liveLeagueSelectorHandler: PropTypes.func.isRequired,
  liveSportSelectorHandler: PropTypes.func.isRequired,
};

const defaultProps = {};

const SportBar = ({ liveLeagueSelectorHandler, liveSportSelectorHandler }) => {
  const [openedPanel, setOpenedPanel] = useState("");
  const sportBarRef = useRef();

  useOnClickOutside(sportBarRef, () => setOpenedPanel(""));

  useEffect(() => {
    const show = !!openedPanel;
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [openedPanel]);

  const backdropClickHandler = useCallback((event) => {
    if (event.target === event.currentTarget) {
      setOpenedPanel("");
    }
  }, []);

  const togglePanel = useCallback(
    (panel) => () => {
      if (openedPanel !== panel) {
        setOpenedPanel(panel);
      } else {
        setOpenedPanel("");
      }
    },
    [openedPanel],
  );

  const onLiveSportChange = useCallback(
    (value) => {
      liveSportSelectorHandler(value);
      setOpenedPanel("");
    },
    [liveSportSelectorHandler],
  );

  const onLeagueChange = useCallback(
    (value) => {
      liveLeagueSelectorHandler(value);
      setOpenedPanel("");
    },
    [liveLeagueSelectorHandler],
  );

  return (
    <div ref={sportBarRef}>
      <div className={classes["navigation__buttons"]}>
        <button
          className={`${classes["navigation__button"]} ${openedPanel === PANEL_SPORT ? classes["active"] : ""}`}
          id={classes["btn-sports"]}
          type="button"
          onClick={togglePanel(PANEL_SPORT)}
        >
          Sports
        </button>
        <button
          className={`${classes["navigation__button"]} ${openedPanel === PANEL_LEAGUE ? classes["active"] : ""}`}
          id={classes["btn-league"]}
          type="button"
          onClick={togglePanel(PANEL_LEAGUE)}
        >
          Top League
        </button>
      </div>
      <SportSelectorPanel
        backdropClick={backdropClickHandler}
        open={openedPanel === PANEL_SPORT}
        onLiveSportChange={onLiveSportChange}
      />
      <LeagueSelectorPanel
        backdropClick={backdropClickHandler}
        open={openedPanel === PANEL_LEAGUE}
        onLeagueChange={onLeagueChange}
      />
    </div>
  );
};

SportBar.propTypes = propTypes;
SportBar.defaultProps = defaultProps;

export default SportBar;
