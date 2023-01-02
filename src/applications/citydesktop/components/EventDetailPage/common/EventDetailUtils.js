const getGroupedMarketsForActiveTab = (activeTab, markets, listOfFavouriteMarkets) => {
  let filteredMarkets = null;

  switch (activeTab) {
    case "ALL":
      filteredMarkets = markets;
      break;
    case "MATCH":
      filteredMarkets = markets.filter(
        (market) =>
          market.marketTypeGroup === "MONEY_LINE" && (market.periodAbrv === "M" || market.periodAbrv === "RT"),
      );
      break;
    case "OVER_UNDER":
      filteredMarkets = markets.filter(
        (market) =>
          (market.marketTypeGroup === "FIXED_TOTAL" || market.marketTypeGroup === "THREE_WAY_FIXED_TOTAL") &&
          (market.periodAbrv === "M" || market.periodAbrv === "RT"),
      );
      break;
    case "HANDICAP":
      filteredMarkets = markets.filter(
        (market) =>
          (market.marketTypeGroup === "FIXED_SPREAD" || market.marketTypeGroup === "THREE_WAY_FIXED_SPREAD") &&
          (market.periodAbrv === "M" || market.periodAbrv === "RT"),
      );
      break;
    case "ODD_EVEN":
      filteredMarkets = markets.filter(
        (market) => market.marketTypeGroup === "ODD_EVEN" && (market.periodAbrv === "M" || market.periodAbrv === "RT"),
      );
      break;
    case "PERIOD":
      filteredMarkets = markets.filter((market) => market.periodAbrv !== "M" && market.periodAbrv !== "RT");
      break;
    case "RAPID":
      filteredMarkets = markets.filter((market) => market.rapid);
      break;
    case "OTHER":
      filteredMarkets = markets.filter(
        (market) =>
          !(market.marketTypeGroup === "MONEY_LINE" && (market.periodAbrv === "M" || market.periodAbrv === "RT")) &&
          !(
            (market.marketTypeGroup === "FIXED_TOTAL" || market.marketTypeGroup === "THREE_WAY_FIXED_TOTAL") &&
            (market.periodAbrv === "M" || market.periodAbrv === "RT")
          ) &&
          !(
            (market.marketTypeGroup === "FIXED_SPREAD" || market.marketTypeGroup === "THREE_WAY_FIXED_SPREAD") &&
            (market.periodAbrv === "M" || market.periodAbrv === "RT")
          ) &&
          !(market.marketTypeGroup === "ODD_EVEN" && (market.periodAbrv === "M" || market.periodAbrv === "RT")) &&
          !(market.periodAbrv !== "M" && market.periodAbrv !== "RT") &&
          !market.rapid,
      );

      break;
  }

  filteredMarkets = filteredMarkets.filter((market) => market.mOpen || market.open); // further filter anything not open

  // sort the markets based on any favourite selections...
  const sorter = (marketA, marketB) => {
    if (listOfFavouriteMarkets.includes(`${marketA.desc} - ${marketA.period}`)) {
      return -1;
    }
    if (listOfFavouriteMarkets.includes(`${marketB.desc} - ${marketB.period}`)) {
      return 1;
    }

    return 0;
  };
  filteredMarkets.sort(sorter);

  let lastMarketDescription = null;
  let currentGroup = [];
  const groupedMarkets = [];
  filteredMarkets.forEach((market) => {
    const thisMarketDescription = `${market.desc} - ${market.period}`;
    if (thisMarketDescription !== lastMarketDescription) {
      lastMarketDescription = thisMarketDescription;
      currentGroup = [market];
      groupedMarkets.push(currentGroup);
    } else {
      currentGroup.push(market);
    }
  });

  return groupedMarkets;
};

export { getGroupedMarketsForActiveTab };
