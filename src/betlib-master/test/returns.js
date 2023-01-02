const should = require("chai").should();
const expect = require("chai").expect;
const betlib = require("betlib-master/dist/betlib");

describe("returns", () => {
  it("works with a single bet", () => {
    const returns = new betlib.Returns(100);
    returns.addBetReturn(450);

    returns.totalStake().should.equal(100);
    returns.numberOfBets().should.equal(1);
    returns.totalProfit().should.equal(350);
    returns.totalReturn().should.equal(450);
  });

  it("works with multiple bets", () => {
    const returns = new betlib.Returns(100);
    returns.addBetReturn(550);
    returns.addBetReturn(0);
    returns.addBetReturn(0);

    returns.totalStake().should.equal(300);
    returns.numberOfBets().should.equal(3);
    returns.totalProfit().should.equal(250);
    returns.totalReturn().should.equal(550);
  });
});
