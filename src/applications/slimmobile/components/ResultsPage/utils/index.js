import dayjs from "dayjs";

export const mapMainBookResults = (data, dateFormat) => {
  const arr = [];
  data?.forEach((sport) => {
    sport.categories.forEach((category) => {
      category.tournaments.forEach((tournament) =>
        arr.push({
          events: tournament.events.map((event) => ({
            awayScore: event.opponentB?.score || 0,
            feedCode: event.feedCode,
            homeScore: event.opponentA?.score || 0,
            id: event.id,
            periods: event.periods[0].score?.marketResults[0]?.outcomeResults.map((result) => ({
              id: result.outcomeId,
              label: result.description,
              result: result.result,
            })),
            players: event.description,
            result: `${event.opponentA.score}:${event.opponentB.score}`,
            time: dayjs(event.startDateTime).format(dateFormat),
          })),
          heading: `${category.description} ${tournament.description}`,
          id: tournament.id,
          sportCode: sport.sportCode,
        }),
      );
    });
  });

  return arr;
};

export const mapPeriods = (expandedDetails) => {
  const arr = [];
  const periods = expandedDetails && expandedDetails[0]?.categories[0]?.tournaments[0]?.events[0].periods;
  if (periods && periods[0]?.score.marketResults.length) {
    periods.forEach((period) => {
      period.score.marketResults.forEach((result) =>
        arr.push({
          description: `${period.description} - ${result.marketDescription}`,
          id: period.id,
          players: result.outcomeResults.map((outcome) => ({
            name: outcome.description,
            result: outcome.result,
          })),
          score: period.score.result,
        }),
      );
    });
  }

  return arr;
};

export const getFromDate = (dateOffset) =>
  `${dayjs()
    .add(dateOffset, "hour")
    .set("hour", 0)
    .set("minute", 0)
    .set("second", 0)
    .set("millisecond", 0)
    .toDate()
    .toISOString()
    .slice(0, -1)}+00:00`;

export const getToDate = (dateOffset) =>
  `${dayjs()
    .add(dateOffset, "hour")
    .set("hour", 23)
    .set("minute", 23)
    .set("second", 23)
    .set("millisecond", 999)
    .toDate()
    .toISOString()
    .slice(0, -1)}+00:00`;

export const getTodayDate = () =>
  `${dayjs()
    .set("hour", 23)
    .set("minute", 59)
    .set("second", 59)
    .set("millisecond", 999)
    .toDate()
    .toISOString()
    .slice(0, -1)}+00:00`;
