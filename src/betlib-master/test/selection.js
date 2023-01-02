const should = require("chai").should();
const expect = require("chai").expect;
const betlib = require("betlib-master/dist/betlib");

describe("win selection", () => {
  it("calculates returns correctly", () => {
    const selection = new betlib.WinSelection({ placeOddsFraction: "1/4", winOdds: 5.5 });
    selection.appliesToWinMarket().should.equal(true);
    selection.appliesToPlaceMarket().should.equal(true);
    selection.winMarketReturns().should.equal(5.5);
    selection.placeMarketReturns().should.be.closeTo(2.125, 0.001);
  });

  it("handles rule4", () => {
    const selection = new betlib.WinSelection({ placeOddsFraction: "1/4", rule4: 0.35, winOdds: 5.5 });
    selection.winMarketReturns().should.be.closeTo(3.92, 0.01);
  });
});

describe("place selection", () => {
  it("calculates returns correctly", () => {
    const selection = new betlib.PlaceSelection({ placeOddsFraction: "1/4", winOdds: 5.5 });
    selection.appliesToWinMarket().should.equal(false);
    selection.appliesToPlaceMarket().should.equal(true);
    selection.placeMarketReturns().should.be.closeTo(2.125, 0.001);
  });

  it("handles rule4", () => {
    const selection = new betlib.PlaceSelection({ placeOddsFraction: "1/4", rule4: 0.35, winOdds: 5.5 });
    selection.placeMarketReturns().should.be.closeTo(1.73, 0.01);
  });
});

describe("lose selection", () => {
  it("calculates returns correctly", () => {
    const selection = new betlib.LoseSelection();
    selection.appliesToWinMarket().should.equal(false);
    selection.appliesToPlaceMarket().should.equal(false);
  });
});

describe("void selection", () => {
  it("calculates returns correctly", () => {
    const selection = new betlib.VoidSelection();
    selection.appliesToWinMarket().should.equal(true);
    selection.appliesToPlaceMarket().should.equal(true);
    selection.winMarketReturns().should.equal(1);
    selection.placeMarketReturns().should.equal(1);
  });
});

describe("dead heat selection", () => {
  it("calculates tie place returns correctly", () => {
    let selection = new betlib.DeadHeatSelection({
      placeOddsFraction: "1/4",
      placesOffered: 5,
      runnersInDeadHeat: 4,
      tiedPosition: 2,
      winOdds: 9,
    });
    selection.appliesToWinMarket().should.equal(false);
    selection.appliesToPlaceMarket().should.equal(true);
    selection.placeMarketReturns().should.equal(3);

    selection = new betlib.DeadHeatSelection({
      placeOddsFraction: "1/4",
      placesOffered: 4,
      runnersInDeadHeat: 3,
      tiedPosition: 3,
      winOdds: 9,
    });
    selection.appliesToWinMarket().should.equal(false);
    selection.appliesToPlaceMarket().should.equal(true);
    selection.placeMarketReturns().should.equal(2);

    selection = new betlib.DeadHeatSelection({
      placeOddsFraction: "1/4",
      placesOffered: 5,
      runnersInDeadHeat: 3,
      tiedPosition: 2,
      winOdds: 9,
    });
    selection.appliesToWinMarket().should.equal(false);
    selection.appliesToPlaceMarket().should.equal(true);
    selection.placeMarketReturns().should.equal(3);

    selection = new betlib.DeadHeatSelection({
      placeOddsFraction: "1/4",
      placesOffered: 5,
      runnersInDeadHeat: 8,
      tiedPosition: 3,
      winOdds: 9,
    });
    selection.appliesToWinMarket().should.equal(false);
    selection.appliesToPlaceMarket().should.equal(true);
    selection.placeMarketReturns().should.be.closeTo(1.13, 0.01);
  });

  it("calculates tie win returns correctly", () => {
    const selection = new betlib.DeadHeatSelection({
      placeOddsFraction: "1/4",
      placesOffered: 3,
      runnersInDeadHeat: 4,
      tiedPosition: 1,
      winOdds: 9,
    });
    selection.appliesToWinMarket().should.equal(true);
    selection.appliesToPlaceMarket().should.equal(true);
    selection.winMarketReturns().should.equal(2.25);
    selection.placeMarketReturns().should.equal(2.25);
  });

  it("handles rule 4", () => {
    let selection = new betlib.DeadHeatSelection({
      placeOddsFraction: "1/4",
      placesOffered: 3,
      rule4: 0.35,
      runnersInDeadHeat: 4,
      tiedPosition: 1,
      winOdds: 5.5,
    });
    selection.appliesToWinMarket().should.equal(true);
    selection.appliesToPlaceMarket().should.equal(true);
    selection.winMarketReturns().should.be.closeTo(0.98, 0.01);
    selection.placeMarketReturns().should.be.closeTo(1.3, 0.01);

    selection = new betlib.DeadHeatSelection({
      placeOddsFraction: "1/4",
      placesOffered: 3,
      rule4: 0.35,
      runnersInDeadHeat: 4,
      tiedPosition: 2,
      winOdds: 5.5,
    });
    selection.appliesToWinMarket().should.equal(false);
    selection.appliesToPlaceMarket().should.equal(true);
    selection.placeMarketReturns().should.be.closeTo(0.87, 0.01);
  });
});
