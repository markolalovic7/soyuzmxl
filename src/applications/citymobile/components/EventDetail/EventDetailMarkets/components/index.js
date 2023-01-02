import React from "react";

import MarketDetail from "./MarketDetail";

function EventDetailMarkets({ brMatchId, groupedMarkets, listOfFavouriteMarkets, matchId, setListOfFavouriteMarkets }) {
  return groupedMarkets.map((markets) => (
    <MarketDetail
      brMatchId={brMatchId}
      key={`${markets[0].desc} – ${markets[0].period}`}
      listOfFavouriteMarkets={listOfFavouriteMarkets}
      markets={markets}
      matchId={matchId}
      setListOfFavouriteMarkets={setListOfFavouriteMarkets}
    />
  ));
}

export default React.memo(EventDetailMarkets);
