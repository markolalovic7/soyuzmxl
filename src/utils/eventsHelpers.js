const compare = (a, b) => a.ordinal - b.ordinal;

export const getPathDescription = (children) => {
  if (children && Object.values(children).length > 0) {
    // const countryDesc = Object.values(Object.values(children)[0].children)[0].desc;
    const leagueDesc = Object.values(Object.values(Object.values(children)[0].children)[0].children)[0].desc;

    const leagueDescSplit = leagueDesc.split(" - ");

    return leagueDescSplit[leagueDescSplit.length - 1];
  }

  return "";
};

export const getEvent = (children) => {
  let event = null;
  if (children) {
    Object.values(children).forEach((child) => {
      if (child.type === "p") {
        // dive deeper...
        const match = getEvent(child.children);
        if (match) {
          event = match;
        }
      } else if (child.type === "e" || child.type === "l") {
        event = child;
      }
    });
  }

  return event;
};

export const groupMarketsAndPeriods = (rawMarkets) => {
  rawMarkets.sort(compare);

  const groupedMarkets = [];
  rawMarkets.forEach((market) => {
    const thisMarketDescription = market.desc;
    const thisPeriodDescription = market.period;

    const currentGroup = groupedMarkets.find((x) => x.desc === thisMarketDescription);
    if (!currentGroup) {
      // create the group and push it in
      groupedMarkets.push({
        desc: market.desc,
        periods: [{ desc: thisPeriodDescription, markets: [market], ordinal: 1 }],
      });
    } else {
      const currentPeriod = currentGroup.periods.find((x) => x.desc === thisPeriodDescription);

      if (!currentPeriod) {
        currentGroup.periods.push({
          desc: thisPeriodDescription,
          markets: [market],
          ordinal: currentGroup.periods.length + 1,
        });
      } else {
        currentPeriod.markets.push(market);
      }
    }
  });

  return groupedMarkets;
};
export const groupMarkets = (rawMarkets) => {
  rawMarkets.sort(compare);

  let lastMarketDescription = null;
  let currentGroup = [];
  const groupedMarkets = [];
  rawMarkets.forEach((market) => {
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

export const filterMarkets = (selectedMarketTypeGroupTab, markets) => {
  if (!markets) return [];

  switch (selectedMarketTypeGroupTab) {
    case "ALL":
      return markets;
    case "MATCH":
      return markets.filter(
        (market) =>
          market.marketTypeGroup === "MONEY_LINE" && (market.periodAbrv === "M" || market.periodAbrv === "RT"),
      );
    case "HANDICAP":
      return markets.filter(
        (market) =>
          (market.marketTypeGroup === "FIXED_SPREAD" || market.marketTypeGroup === "THREE_WAY_FIXED_SPREAD") &&
          (market.periodAbrv === "M" || market.periodAbrv === "RT"),
      );
    case "OVER_UNDER":
      return markets.filter(
        (market) =>
          (market.marketTypeGroup === "FIXED_TOTAL" || market.marketTypeGroup === "THREE_WAY_FIXED_TOTAL") &&
          (market.periodAbrv === "M" || market.periodAbrv === "RT"),
      );
    case "ODD_EVEN":
      return markets.filter(
        (market) => market.marketTypeGroup === "ODD_EVEN" && (market.periodAbrv === "M" || market.periodAbrv === "RT"),
      );
    case "PERIODS":
      return markets.filter((market) => market.periodAbrv !== "M" && market.periodAbrv !== "RT");
    case "OTHERS":
      return markets.filter(
        (market) =>
          !(market.marketTypeGroup === "MONEY_LINE" && (market.periodAbrv === "M" || market.periodAbrv === "RT")) &&
          !(
            (market.marketTypeGroup === "FIXED_SPREAD" || market.marketTypeGroup === "THREE_WAY_FIXED_SPREAD") &&
            (market.periodAbrv === "M" || market.periodAbrv === "RT")
          ) &&
          !(
            (market.marketTypeGroup === "FIXED_TOTAL" || market.marketTypeGroup === "THREE_WAY_FIXED_TOTAL") &&
            (market.periodAbrv === "M" || market.periodAbrv === "RT")
          ) &&
          !(market.marketTypeGroup === "ODD_EVEN" && (market.periodAbrv === "M" || market.periodAbrv === "RT")) &&
          !(market.periodAbrv !== "M" && market.periodAbrv !== "RT"),
      );
    default:
      return [];
  }
};
