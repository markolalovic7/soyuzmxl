import dayjs from "dayjs";
import trim from "lodash.trim";

import { getEvents } from "../../../../../utils/prematch-data-utils";

const dayOfYear = require("dayjs/plugin/dayOfYear");

dayjs.extend(dayOfYear);

const sortPrematchEventPaths = (a, b) => {
  if (a.ordinal !== b.ordinal) {
    return a.ordinal - b.ordinal;
  }

  return `${a.desc}`.localeCompare(b.desc);
};

const sortPrematchEvents = (a, b) => `${a.startSecs}`.localeCompare(b.startSecs);

const addPrematchContentByLeague = (content, prematchData, sport) => {
  if (!prematchData) return;

  const sportTree = sport
    ? Object.values(prematchData).find((data) => data.code === sport) // either we search by a sport
    : Object.values(prematchData).length === 1
    ? Object.values(prematchData)[0]
    : null; // or we are receiving data specific to a sport only...

  if (!sportTree) return;

  if (sportTree.children) {
    const categories = Object.values(sportTree.children).slice().sort(sortPrematchEventPaths);
    categories.forEach((category) => {
      const pathDescription = category.desc;
      if (category.children) {
        const tournaments = Object.values(category.children).slice().sort(sortPrematchEventPaths);
        tournaments.forEach((tournament) => {
          const leagueDescription = tournament.desc;
          const leagueId = tournament.id;

          const events = getEvents(Object.values(tournament.children)).slice().sort(sortPrematchEvents);

          events.forEach((match) => {
            if (dayjs.unix(match.epoch / 1000).isAfter(dayjs(new Date()))) {
              const newEvent = {
                a: match.a,
                b: match.b,
                brMatchId: match.brMatchId,
                count: match.count,
                epoch: match.epoch,
                eventId: match.id,
                live: false,
                markets: [],
              };

              if (match.children) {
                Object.values(match.children).forEach((market) => {
                  const criteria = market.criteria;
                  const marketId = market.id;
                  const marketDescription = market.desc;
                  const marketOpen = market.open;
                  const marketTypeGroup = market.marketTypeGroup;

                  const newMarket = {
                    criteria,
                    marketDescription,
                    marketId,
                    marketOpen,
                    marketTypeGroup,
                    outcomes: [],
                  };
                  newEvent.markets.push(newMarket);

                  if (market.children) {
                    Object.values(market.children).forEach((outcome) => {
                      const outcomeId = outcome.id;
                      const outcomeDescription = outcome.desc;
                      const outcomeHidden = outcome.hidden || !market.open;
                      const priceId = outcome.priceId;
                      const decimalPrice = outcome.decimalPrice;
                      const price = outcome.price;
                      const spread = outcome.spread;
                      const spread2 = outcome.spread2;
                      const priceDir = outcome.dir;

                      const newOutcome = {
                        decimalPrice,
                        outcomeDescription,
                        outcomeHidden,
                        outcomeId,
                        price,
                        priceDir,
                        priceId,
                        spread,
                        spread2,
                      };
                      newMarket.outcomes.push(newOutcome);
                    });
                  }
                });
              }

              const existingLeague = content.find(
                (league) =>
                  league.categoryDescription === pathDescription && league.tournamentDescription === leagueDescription,
              );
              if (existingLeague) {
                // if the league exists, assign the match there...
                existingLeague.events.push(newEvent);
              } else {
                const newLeague = {
                  categoryDescription: pathDescription,
                  categoryPos: category.pos,
                  countryCode: category.countryCode,
                  events: [],
                  sportCode: match.code,
                  sportDescription: sportTree.desc,
                  tournamentDescription: leagueDescription,
                  tournamentId: leagueId,
                  tournamentPos: tournament.pos,
                };
                newLeague.events.push(newEvent);
                content.push(newLeague);
              }
            }
          });
        });
      }
    });
  }
};

const addPrematchContentByDate = (content, prematchData) => {
  if (!prematchData) return;

  const sportTree = Object.values(prematchData).length === 1 ? Object.values(prematchData)[0] : null;

  if (!sportTree) return;

  if (sportTree.children) {
    const categories = Object.values(sportTree.children).slice().sort(sortPrematchEventPaths);
    categories.forEach((category) => {
      if (category.children) {
        const tournaments = Object.values(category.children).slice().sort(sortPrematchEventPaths);
        tournaments.forEach((tournament) => {
          const events = getEvents(Object.values(tournament.children)).slice().sort(sortPrematchEvents);

          events.forEach((match) => {
            const matchDate = dayjs.unix(match.epoch / 1000);
            const now = dayjs(new Date());

            if (matchDate.isAfter(now)) {
              const newEvent = {
                a: match.a,
                b: match.b,
                brMatchId: match.brMatchId,
                code: match.code,
                count: match.count,
                epoch: match.epoch,
                eventId: match.id,
                live: false,
                markets: [],
              };

              if (match.children) {
                Object.values(match.children).forEach((market) => {
                  const marketId = market.id;
                  const marketDescription = market.desc;
                  const marketOpen = market.open;
                  const marketTypeGroup = market.marketTypeGroup;

                  const newMarket = {
                    marketDescription,
                    marketId,
                    marketOpen,
                    marketTypeGroup,
                    outcomes: [],
                  };
                  newEvent.markets.push(newMarket);

                  if (market.children) {
                    Object.values(market.children).forEach((outcome) => {
                      const outcomeId = outcome.id;
                      const outcomeDescription = outcome.desc;
                      const outcomeHidden = outcome.hidden || !market.open;
                      const priceId = outcome.priceId;
                      const price = outcome.price;
                      const spread = outcome.spread;
                      const spread2 = outcome.spread2;
                      const priceDir = outcome.dir;

                      const newOutcome = {
                        outcomeDescription,
                        outcomeHidden,
                        outcomeId,
                        price,
                        priceDir,
                        priceId,
                        spread,
                        spread2,
                      };
                      newMarket.outcomes.push(newOutcome);
                    });
                  }
                });
              }

              const dateOffset = matchDate.dayOfYear() - now.dayOfYear();

              const existingDate = content.find((date) => date.offset === dateOffset);
              if (existingDate) {
                // if the league exists, assign the match there...
                // if already added by live - move on...
                const existingMatchIndex = existingDate.events.findIndex((match) => match.eventId === newEvent.eventId);
                if (existingMatchIndex === -1) {
                  existingDate.events.push(newEvent);
                }
              } else {
                const newDate = {
                  events: [],
                  offset: dateOffset,
                };
                newDate.events.push(newEvent);
                content.push(newDate);
              }
            }
          });
        });
      }
    });
  }
};

const addPrematchContentByHour = (content, prematchData, timezoneOffset) => {
  if (!prematchData) return;

  const sportTree = Object.values(prematchData).length === 1 ? Object.values(prematchData)[0] : null;

  if (!sportTree) return;

  if (sportTree.children) {
    const categories = Object.values(sportTree.children).slice().sort(sortPrematchEventPaths);
    categories.forEach((category) => {
      const categoryDescription = category.desc;
      if (category.children) {
        const tournaments = Object.values(category.children).slice().sort(sortPrematchEventPaths);
        tournaments.forEach((tournament) => {
          const tournamentDescription = tournament.desc;

          const events = getEvents(Object.values(tournament.children)).slice().sort(sortPrematchEvents);

          events.forEach((match) => {
            const matchDate = dayjs.unix(match.epoch / 1000).utcOffset(timezoneOffset);

            const now = dayjs(new Date());

            if (matchDate.isAfter(now)) {
              const newEvent = {
                a: match.a,
                b: match.b,
                brMatchId: match.brMatchId,
                categoryDescription,
                code: match.code,
                count: match.count,
                epoch: match.epoch,
                eventId: match.id,
                live: false,
                markets: [],
                tournamentDescription,
              };

              if (match.children) {
                Object.values(match.children).forEach((market) => {
                  const marketId = market.id;
                  const marketDescription = market.desc;
                  const marketOpen = market.open;
                  const marketTypeGroup = market.marketTypeGroup;

                  const newMarket = {
                    marketDescription,
                    marketId,
                    marketOpen,
                    marketTypeGroup,
                    outcomes: [],
                  };
                  newEvent.markets.push(newMarket);

                  if (market.children) {
                    Object.values(market.children).forEach((outcome) => {
                      const outcomeId = outcome.id;
                      const outcomeDescription = outcome.desc;
                      const outcomeHidden = outcome.hidden || !market.open;
                      const priceId = outcome.priceId;
                      const price = outcome.price;
                      const spread = outcome.spread;
                      const spread2 = outcome.spread2;
                      const priceDir = outcome.dir;

                      const newOutcome = {
                        outcomeDescription,
                        outcomeHidden,
                        outcomeId,
                        price,
                        priceDir,
                        priceId,
                        spread,
                        spread2,
                      };
                      newMarket.outcomes.push(newOutcome);
                    });
                  }
                });
              }

              const time = `${matchDate.hour()}:00`;

              const existingDate = content.find((date) => date.time === time);
              if (existingDate) {
                // if the league exists, assign the match there...
                // if already added by live - move on...
                const existingMatchIndex = existingDate.events.findIndex((match) => match.eventId === newEvent.eventId);
                if (existingMatchIndex === -1) {
                  existingDate.events.push(newEvent);
                }
              } else {
                const newDate = {
                  events: [],
                  time,
                };
                newDate.events.push(newEvent);
                content.push(newDate);
              }
            }
          });
        });
      }
    });
  }

  content.sort((a, b) => parseInt(a.time.split(":")[0], 10) - parseInt(b.time.split(":")[0], 10));
};

const addLiveContentBySport = (content, liveData, sport) => {
  if (liveData) {
    const sportLiveData = liveData[sport];
    if (sportLiveData && Object.values(sportLiveData).length > 0) {
      Object.values(sportLiveData).forEach((match) => {
        if (match.cStatus !== "END_OF_EVENT") {
          const categoryDescription = trim(match.epDesc?.split("/")[0]);
          const leagueDescription = trim(match.epDesc?.split("/")[1]);
          const leagueId = match.leagueId;

          let brMatchId = null;
          if (match.feedCode) {
            const aux = match.feedCode.split(":");
            brMatchId = aux[aux.length - 1];
          }
          const newEvent = {
            a: match.opADesc,
            aScore: match.aScore,
            b: match.opBDesc,
            brMatchId,
            cMin: match.cMin,
            cPeriod: match.cPeriod,
            cSec: match.cSec,
            cStatus: match.cStatus,
            cType: match.cType,
            code: sport,
            count: match.mCount,
            epoch: null,
            eventId: match.eventId,
            hScore: match.hScore,
            hasRapidMarket: match.hasRapidMarket,
            live: true,
            markets: [],
            periodScores: match.pScores,
          };

          // Add markets
          Object.values(match.markets).forEach((market) => {
            const newMarket = {
              marketDescription: market.mDesc,
              marketId: market.mId,
              marketOpen: market.mOpen,
              marketTypeGroup: market.mGroup,
              outcomes: [],
              rapid: market.rapid,
            };

            // Add outcomes
            market.sels.forEach((sel) => {
              let priceDir = null;
              switch (sel.dir) {
                case "<":
                  priceDir = "d";
                  break;
                case ">":
                  priceDir = "u";
                  break;
                default:
                  priceDir = null;
                  break;
              }

              const newOutcome = {
                outcomeDescription: sel.oDesc,
                outcomeHidden: sel.hidden,
                outcomeId: sel.oId,
                price: sel.formattedPrice,
                priceDir,
                priceId: sel.pId,
                spread: null,
                spread2: null,
              };
              newMarket.outcomes.push(newOutcome);
            });

            newEvent.markets.push(newMarket);
          });

          // Assign the match to its league
          const existingLeague = content.find(
            (league) =>
              league.categoryDescription === categoryDescription && league.tournamentDescription === leagueDescription,
          );
          if (existingLeague) {
            // before we add the league, check it's not added for prematch (during a transition period - live should be considered the "important!" one)
            const existingMatchIndex = existingLeague.events.findIndex((match) => match.eventId === newEvent.eventId);
            if (existingMatchIndex > -1) {
              const purgedEvents = [...existingLeague.events];
              purgedEvents.splice(existingMatchIndex, 1);
              existingLeague.events = purgedEvents;
            }
            // now, add it
            existingLeague.events.push(newEvent);

            // enforce the live flag
            existingLeague.hasLive = true;
          } else {
            const newLeague = {
              categoryDescription,
              categoryPos: match.countryPos,
              countryCode: match.country,
              events: [],
              hasLive: true,
              sportCode: sport,
              sportDescription: "",
              tournamentDescription: leagueDescription,
              tournamentId: leagueId,
              tournamentPos: match.leaguePos,
            };
            newLeague.events.push(newEvent);
            content.push(newLeague);
          }
        }
      });
    }
  }
};

const addLiveContentByEventPath = (content, liveData, eventPathId) => {
  if (liveData) {
    let sport = null;
    let sportLiveMatches = null;
    for (let i = 0; i < Object.keys(liveData).length; i++) {
      const sportAux = Object.keys(liveData)[i];
      const leagueFound =
        Object.values(liveData[sportAux]).findIndex((match) => parseInt(match.leagueId) === parseInt(eventPathId)) > -1;
      if (leagueFound) {
        sport = sportAux;
        sportLiveMatches = Object.values(liveData[sport]).filter(
          (match) => parseInt(match.leagueId) === parseInt(eventPathId),
        );
        break;
      }
    }

    if (sportLiveMatches && sportLiveMatches.length > 0) {
      sportLiveMatches.forEach((match) => {
        if (match.cStatus !== "END_OF_EVENT") {
          // const categoryDescription = trim(match.epDesc.split('/')[0]);
          // const leagueDescription = trim(match.epDesc.split('/')[1]);

          let brMatchId = null;
          if (match.feedCode) {
            const aux = match.feedCode.split(":");
            brMatchId = aux[aux.length - 1];
          }
          const newEvent = {
            a: match.opADesc,
            aScore: match.aScore,
            b: match.opBDesc,
            brMatchId,
            cMin: match.cMin,
            cPeriod: match.cPeriod,
            cSec: match.cSec,
            cStatus: match.cStatus,
            cType: match.cType,
            code: sport,
            count: match.mCount,
            epoch: null,
            eventId: match.eventId,
            hScore: match.hScore,
            hasRapidMarket: match.hasRapidMarket,
            live: true,
            markets: [],
            periodScores: match.pScores,
          };

          // Add markets
          Object.values(match.markets).forEach((market) => {
            const newMarket = {
              marketDescription: market.mDesc,
              marketId: market.mId,
              marketOpen: market.mOpen,
              marketTypeGroup: market.mGroup,
              outcomes: [],
              rapid: market.rapid,
            };

            // Add outcomes
            market.sels.forEach((sel) => {
              let priceDir = null;
              switch (sel.dir) {
                case "<":
                  priceDir = "d";
                  break;
                case ">":
                  priceDir = "u";
                  break;
                default:
                  priceDir = null;
                  break;
              }

              const newOutcome = {
                outcomeDescription: sel.oDesc,
                outcomeHidden: sel.hidden,
                outcomeId: sel.oId,
                price: sel.formattedPrice,
                priceDir,
                priceId: sel.pId,
                spread: null,
                spread2: null,
              };
              newMarket.outcomes.push(newOutcome);
            });

            newEvent.markets.push(newMarket);
          });

          // Assign the match to its league
          const existingDate = content.find((date) => date.offset === 0);
          if (existingDate) {
            // before we add the match, check it's not added for prematch (during a transition period - live should be considered the "important!" one)
            const existingMatchIndex = existingDate.events.findIndex((match) => match.eventId === newEvent.eventId);
            if (existingMatchIndex > -1) {
              const purgedEvents = [...existingDate.events];
              purgedEvents.splice(existingMatchIndex, 1);
              existingDate.events = purgedEvents;
            }
            // now, add it
            existingDate.events.push(newEvent);
            existingDate.hasLive = true;
          } else {
            const newDate = { events: [], hasLive: true, offset: 0 };
            newDate.events.push(newEvent);
            content.push(newDate);
          }
        }
      });
    }
  }
};

const addAsianLiveContentBySport = (content, liveData, sport, criteria) => {
  if (liveData && liveData[sport]) {
    const sportLiveData = liveData[sport];
    if (sportLiveData && Object.values(sportLiveData).length > 0) {
      Object.values(sportLiveData).forEach((match) => {
        if (
          match.cStatus !== "END_OF_EVENT" &&
          match.marketViews[criteria.substr(criteria.indexOf("-") + 1, criteria.length)]
        ) {
          const categoryDescription = trim(match.epDesc?.split("/")[0]);
          const leagueDescription = trim(match.epDesc?.split("/")[1]);
          const leagueId = match.leagueId;

          let brMatchId = null;
          if (match.feedCode) {
            const aux = match.feedCode.split(":");
            brMatchId = aux[aux.length - 1];
          }
          const newEvent = {
            a: match.opADesc,
            aScore: match.aScore,
            b: match.opBDesc,
            brMatchId,
            cMin: match.cMin,
            cPeriod: match.cPeriod,
            cSec: match.cSec,
            cStatus: match.cStatus,
            cType: match.cType,
            code: sport,
            count: match.mCount,
            epoch: null,
            eventId: match.eventId,
            hScore: match.hScore,
            hasRapidMarket: match.hasRapidMarket,
            live: true,
            markets: [],
            periodScores: match.pScores,
          };

          // Add markets
          match.marketViews[criteria.substr(criteria.indexOf("-") + 1, criteria.length)].forEach((market) => {
            const newMarket = {
              criteria: market.criteria,
              marketDescription: market.mDesc,
              marketId: market.mId,
              marketOpen: market.mOpen,
              marketTypeGroup: market.mGroup,
              outcomes: [],
              rapid: market.rapid,
              spread: market.spread,
              spread2: market.spread2,
            };

            // Add outcomes
            market.sels.forEach((sel) => {
              let priceDir = null;
              switch (sel.dir) {
                case "<":
                  priceDir = "d";
                  break;
                case ">":
                  priceDir = "u";
                  break;
                default:
                  priceDir = null;
                  break;
              }

              const newOutcome = {
                decimalPrice: sel.price,
                outcomeDescription: sel.oDesc,
                outcomeHidden: sel.hidden,
                outcomeId: sel.oId,
                price: sel.formattedPrice,
                priceDir,
                priceId: sel.pId,
                spread: market.spread,
                spread2: market.spread2,
              };
              newMarket.outcomes.push(newOutcome);
            });

            newEvent.markets.push(newMarket);
          });

          // Assign the match to its league
          const existingLeague = content.find(
            (league) =>
              league.categoryDescription === categoryDescription && league.tournamentDescription === leagueDescription,
          );
          if (existingLeague) {
            // before we add the league, check it's not added for prematch (during a transition period - live should be considered the "important!" one)
            const existingMatchIndex = existingLeague.events.findIndex((match) => match.eventId === newEvent.eventId);
            if (existingMatchIndex > -1) {
              const purgedEvents = [...existingLeague.events];
              purgedEvents.splice(existingMatchIndex, 1);
              existingLeague.events = purgedEvents;
            }
            // now, add it
            existingLeague.events.push(newEvent);
          } else {
            const newLeague = {
              categoryDescription,
              categoryPos: match.countryPos,
              countryCode: match.country,
              events: [],
              sportCode: sport,
              sportDescription: "",
              tournamentDescription: leagueDescription,
              tournamentId: leagueId,
              tournamentPos: match.leaguePos,
            };
            newLeague.events.push(newEvent);
            content.push(newLeague);
          }
        }
      });
    }
  }
};

export {
  addPrematchContentByLeague,
  addPrematchContentByDate,
  addPrematchContentByHour,
  addLiveContentBySport,
  addLiveContentByEventPath,
  addAsianLiveContentBySport,
};
