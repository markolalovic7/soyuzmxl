const should = require("chai").should();
const expect = require("chai").expect;
const betlib = require("betlib-master/dist/betlib");

const SELECTIONS = [
  new betlib.WinSelection({ placeOddsFraction: "1/4", winOdds: 9 }),
  new betlib.PlaceSelection({ placeOddsFraction: "1/5", rule4: 0.15, winOdds: 1 + 2 / 3 }),
  // counts as a loss in non-each way because tied for #2
  new betlib.DeadHeatSelection({
    placeOddsFraction: "1/5",
    placesOffered: 3,
    rule4: 0.15,
    runnersInDeadHeat: 4,
    tiedPosition: 2,
    winOdds: 8,
  }),
  new betlib.VoidSelection(),
  new betlib.LoseSelection(),
  new betlib.WinSelection({ placeOddsFraction: "1/5", winOdds: 101 }),
  new betlib.WinSelection({ placeOddsFraction: "1/1", rule4: 0.2, winOdds: 2 }),
  new betlib.PlaceSelection({ placeOddsFraction: "1/3", winOdds: 1 + 3 / 2 }),
  new betlib.DeadHeatSelection({
    placeOddsFraction: "1/5",
    placesOffered: 3,
    rule4: 0.35,
    runnersInDeadHeat: 2,
    tiedPosition: 1,
    winOdds: 1 + 2 / 3,
  }),
];

const STAKE = 2;

const EXPECTED = {
  "accumulator:4": {
    eachWay: { bets: 252, totalReturns: 12163.21 },
    nonEachWay: { bets: 126, totalReturns: 7204.32 },
  },
  canadian: {
    eachWay: { bets: 6552, totalReturns: 320870.0 },
    nonEachWay: { bets: 3276, totalReturns: 237841.82 },
  },
  double: {
    eachWay: { bets: 72, totalReturns: 3137.41 },
    nonEachWay: { bets: 36, totalReturns: 2599.28 },
  },
  goliath: {
    eachWay: { bets: 4446, totalReturns: 197127.5 },
    nonEachWay: { bets: 2223, totalReturns: 106997.52 },
  },
  heinz: {
    eachWay: { bets: 9576, totalReturns: 461418.83 },
    nonEachWay: { bets: 4788, totalReturns: 317065.81 },
  },
  lucky15: {
    eachWay: { bets: 3780, totalReturns: 150766.34 },
    nonEachWay: { bets: 1890, totalReturns: 117903.15 },
  },
  lucky31: {
    eachWay: { bets: 7812, totalReturns: 341185.63 },
    nonEachWay: { bets: 3906, totalReturns: 253734.15 },
  },
  lucky63: {
    eachWay: { bets: 10584, totalReturns: 477671.34 },
    nonEachWay: { bets: 5292, totalReturns: 329779.68 },
  },
  patent: {
    eachWay: { bets: 1176, totalReturns: 39498.98 },
    nonEachWay: { bets: 588, totalReturns: 31785.24 },
  },
  single: {
    eachWay: { bets: 18, totalReturns: 290.22 },
    nonEachWay: { bets: 9, totalReturns: 227.03 },
  },

  superHeinz: {
    eachWay: { bets: 8640, totalReturns: 401874.02 },
    nonEachWay: { bets: 4320, totalReturns: 249199.6 },
  },
  treble: {
    eachWay: { bets: 168, totalReturns: 9410.82 },
    nonEachWay: { bets: 84, totalReturns: 7233.35 },
  },
  trixie: {
    eachWay: { bets: 672, totalReturns: 31372.72 },
    nonEachWay: { bets: 336, totalReturns: 25428.31 },
  },
  yankee: {
    eachWay: { bets: 2772, totalReturns: 134513.83 },
    nonEachWay: { bets: 1386, totalReturns: 105189.28 },
  },
};

for (const betType in EXPECTED) {
  describe(`${betType} bet`, () => {
    it("calculates non each way bets correctly", () => {
      const bet = new betlib.Bet(betType, STAKE, false);
      const returns = bet.settle(SELECTIONS);

      returns.totalReturn().should.be.closeTo(EXPECTED[betType].nonEachWay.totalReturns, 0.01);
      returns.totalStake().should.equal(EXPECTED[betType].nonEachWay.bets * STAKE);
      returns.numberOfBets().should.equal(EXPECTED[betType].nonEachWay.bets);
    });

    it("calculates each way bets correctly", () => {
      const bet = new betlib.Bet(betType, STAKE, true);
      const returns = bet.settle(SELECTIONS);

      returns.totalReturn().should.be.closeTo(EXPECTED[betType].eachWay.totalReturns, 0.01);
      returns.totalStake().should.equal(EXPECTED[betType].eachWay.bets * STAKE);
      returns.numberOfBets().should.equal(EXPECTED[betType].eachWay.bets);
    });
  });
}
