export function convertLiveDir(dir) {
  if (dir === "=") {
    return undefined;
  }

  if (dir === "<") {
    return "d";
  }

  if (dir === ">") {
    return "u";
  }

  return undefined;
}

export function decorateMatch(eventLiveData, sportCode, matchStatuses) {
  const feedcodeChunks = eventLiveData.feedCode?.split(":");

  return {
    a: eventLiveData.opADesc,
    aScore: eventLiveData.hScore,
    ac: eventLiveData.opAC, // home team country
    b: eventLiveData.opBDesc,
    bScore: eventLiveData.aScore,
    bc: eventLiveData.opBC,
    brMatchId: feedcodeChunks[feedcodeChunks.length - 1],
    cStatus: eventLiveData.cStatus,
    cType: eventLiveData.cType,
    // home team country
    code: sportCode,
    eventId: eventLiveData.eventId,
    feedcode: eventLiveData.feedCode,
    hasAV: eventLiveData.hasAV,
    hasMatchTracker: eventLiveData.hasMatchTracker,
    min: eventLiveData.cMin,
    period: matchStatuses
      ? matchStatuses.find((period) => period.abbreviation === eventLiveData.cPeriod)?.description
      : "",
    sec: eventLiveData.cSec,
  };
}

export function decorateMarkets(eventLiveData) {
  return Object.values(eventLiveData.markets)
    .sort((a, b) => a.ordinal - b.ordinal)
    .map((x) => ({
      children: x.sels.map((y, index) => ({
        desc: y.oDesc,
        dir: convertLiveDir(y.dir),
        hidden: y.hidden,
        id: y.oId,
        pos: index + 1,
        price: y.formattedPrice,
      })),
      desc: x.mDesc,
      externalCode: x.feedCode,
      id: x.mId,
      marketTypeGroup: x.mGroup,
      open: x.mOpen,
      period: x.pDesc,
      style: x.mStyle,
    }));
}

export function sortPeriodsWithinMarketGroups(marketGroups, matchStatuses, cPeriod) {
  // if (isEmpty(matchStatuses) || !cPeriod) return [];
  //
  // const clockPeriodDesc = matchStatuses.find((period) => period.abbreviation === cPeriod)?.description;
  //
  // marketGroups.forEach((marketGroup) => {
  //   if (marketGroup.periods.length > 1) {
  //     marketGroup.periods.sort((a, b) => {
  //       if (a.desc === clockPeriodDesc) {
  //         return -1;
  //       }
  //
  //       if (b.desc === clockPeriodDesc) {
  //         return 1;
  //       }
  //
  //       return a.ordinal - b.ordinal;
  //     });
  //
  //     marketGroup.periods = marketGroup.periods?.map((x, index) => ({ ...x, ordinal: index + 1 }));
  //   }
  // });

  return marketGroups;
}
