import * as errors from "betlib-master/src/errors.js";
import { Returns } from "betlib-master/src/returns.js";
import foreachCombination from "foreach-combination";

// Calculate a simple combination bet
function combinationBet(n) {
  return (allSelections, returns, isEachWay) => {
    if (allSelections.length < n) {
      throw new errors.InvalidSelectionCountError(`Expected at least ${n} selections`);
    }

    foreachCombination(allSelections, n, (...selections) => {
      // Calculate win returns
      if (selections.every((selection) => selection.appliesToWinMarket())) {
        returns.addBetReturn(
          selections.reduce((acc, selection) => acc * selection.winMarketReturns(), returns.unitStake),
        );
      } else {
        returns.addBetReturn(0);
      }
      // Calculate place returns, if this is a each-way bet
      if (isEachWay) {
        if (selections.every((selection) => selection.appliesToPlaceMarket())) {
          returns.addBetReturn(
            selections.reduce((acc, selection) => acc * selection.placeMarketReturns(), returns.unitStake),
          );
        } else {
          returns.addBetReturn(0);
        }
      }
    });
  };
}

// Calculate full cover bet
function cover(n, withSingles = false) {
  return (allSelections, returns, isEachWay) => {
    if (allSelections.length < n) {
      throw new errors.InvalidSelectionCountError(`Expected at least ${n} selections`);
    }

    foreachCombination(allSelections, n, (...selections) => {
      for (let i = withSingles ? 1 : 2; i <= n; i++) {
        combinationBet(i)(selections, returns, isEachWay);
      }
    });
  };
}

// Bet types
const BET_TYPES = {
  canadian: cover(5),

  double: combinationBet(2),

  goliath: cover(8),

  heinz: cover(6),

  lucky15: cover(4, true),

  lucky31: cover(5, true),

  lucky63: cover(6, true),

  // Full cover with singles
  patent: cover(3, true),

  // Simple bets
  single: combinationBet(1),

  superHeinz: cover(7),

  treble: combinationBet(3),

  // accumulator is handled in `Bet` constructor
  // Full cover
  trixie: cover(3),

  yankee: cover(4),
  // yap is a lucky 15 without any bonus applied, which we do not support anyway
  yap: cover(4, true),
};

// Bet constructor
export class Bet {
  constructor(type, unitStake, isEachWay) {
    this.type = type;
    this.unitStake = unitStake;
    this.isEachWay = isEachWay;

    if (BET_TYPES.hasOwnProperty(type)) {
      this.betFn = BET_TYPES[type];
    }
    // Handle custom accumulator bet.
    else if (type.slice(0, 11) === "accumulator") {
      const pieces = type.split(":", 2);
      const foldSize = pieces.length === 1 ? 4 : parseInt(pieces[1]);
      if (isNaN(foldSize) || foldSize < 4) {
        throw new Error("Invalid accumulator fold size.");
      }
      this.betFn = combinationBet(foldSize);
    } else {
      throw new Error(`Unknown bet type ${type.toString()}`);
    }
  }

  settle(selections) {
    const returns = new Returns(this.unitStake);
    this.betFn(selections, returns, this.isEachWay);

    return returns;
  }
}
