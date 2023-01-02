import { SPORT_BAR_TAB_LEAGUE, SPORT_BAR_TAB_SPORT } from "../constants";

export function isActivePanelSport(panelActive) {
  return panelActive === SPORT_BAR_TAB_SPORT;
}

export function isActivePanelLeague(panelActive) {
  return panelActive === SPORT_BAR_TAB_LEAGUE;
}
