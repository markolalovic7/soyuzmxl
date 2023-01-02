export function getHrefAccountCreate() {
  return "/createaccount";
}

export function getHrefAccountEdit() {
  return "/editaccount";
}

export function getHrefAccountPasswordEdit() {
  return "/security";
}

export function getHrefBetCalculator() {
  return "/betcalculator";
}

export function getHrefContentPage(pageContentId) {
  return `/pagecontent/${pageContentId}`;
}

export function getHrefBaseBetradarVirtualSport() {
  return `/brvirtual`;
}

export function getHrefBetradarVirtualSport(feedCode) {
  return `/brvirtual/${feedCode}`;
}

export function getHrefBetRadar() {
  return "/brvirtual";
}

export function getHrefJackpot(jackpotId) {
  return `/jackpots/${jackpotId}`;
}

export function getHrefJackpots() {
  return "/jackpots";
}

export function getHrefHome() {
  return "/";
}

export function getHrefBaseKironVirtualSport() {
  return `/krvirtual`;
}

export function getHrefKironVirtualSport(feedCode) {
  return `/krvirtual/${feedCode}`;
}

export function getHrefLiveEventDetail(eventId) {
  return `/live/event/${eventId}`;
}

export function getHrefLiveSportLeague(sportCode, eventPathId) {
  return `/live/sport/${sportCode}/eventpath/${eventPathId}`;
}

export function getHrefLiveSportLeagueEvent(sportCode, eventPathId, eventId) {
  return `/live/sport/${sportCode}/eventpath/${eventPathId}/event/${eventId}`;
}

export function getHrefLiveCalendar() {
  return "/livecalendar";
}

export function getHrefLive() {
  return "/live";
}

export function getHrefMyBets() {
  return "/mybets";
}

export function getHrefMyStatements() {
  return "/mystatements";
}

export function getHrefBaseSports() {
  return `/sports`;
}

export function getHrefBasePrematch() {
  return `/prematch`;
}

export function getHrefPrematch(eventPathId) {
  return `/prematch/eventpath/${eventPathId}`;
}

export function getHrefPrematchSportLeague(sportCode, eventPathId) {
  return `/prematch/sport/${sportCode}/eventpath/${eventPathId}`;
}

export function getHrefPrematchSportLeagueEvent(sportCode, eventPathId, eventId) {
  return `/prematch/sport/${sportCode}/eventpath/${eventPathId}/event/${eventId}`;
}

export function getHrefPrematchEvent(eventPathId, eventId) {
  return `/prematch/eventpath/${eventPathId}/${eventId}`;
}

export function getHrefSearch() {
  return "/prematch/search";
}

export function getHrefSearchResults(searchPhrase) {
  return `/prematch/search/${searchPhrase}`;
}

export function getHrefResults() {
  return "/results";
}

export function getHrefSolidGaming() {
  return "/casino/sg";
}

export function getHrefPromotions() {
  return "/promotions";
}
