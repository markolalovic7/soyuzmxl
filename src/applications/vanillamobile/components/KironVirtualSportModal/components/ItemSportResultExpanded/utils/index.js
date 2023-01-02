export function formatResultTitle(draw, name) {
  return `#${draw} ${name}`;
}

export function getNumberWithOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;

  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Note: Find `winOdd` by finding `Win` market object.
// Then in `Selection` find by `ID` where `ID` is `Draw` in `event`.
function getWinOdds(market, drawId) {
  const winOdds = market.find(({ ID: id }) => id === "Win");
  const { Odds: winOdd = undefined } = winOdds?.Selection.find(({ ID: id }) => Number(id) === Number(drawId));

  return winOdd;
}

// Note: Find `placeOdd` by finding `Place` market object.
// Then in `Selection` find by `ID` where `ID` is `Draw` in `event`.
function getPlaceOdd(market, drawId) {
  const placeOdds = market.find(({ ID: id }) => id === "Place");
  const { Odds: placeOdd = undefined } = placeOdds?.Selection.find(({ ID: id }) => Number(id) === Number(drawId));

  return placeOdd;
}

export function getWinPlaceOdds(market, drawId) {
  return {
    placeOdd: getPlaceOdd(market, drawId),
    winOdd: getWinOdds(market, drawId),
  };
}
