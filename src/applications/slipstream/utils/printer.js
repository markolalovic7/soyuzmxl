import dayjs from "dayjs";

import { EPOS } from "./epos";

function formatNumber(numberString) {
  if (typeof numberString === "number") numberString = numberString.toString();
  numberString = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace(/(\.)/g, "."); // added comma to the number format

  const parts = numberString.split(".");
  if (parts.length === 1) {
    numberString += ".00"; // adding decimal part
  } else if (parts[1].length === 1) {
    numberString += "0"; // 2 decimal precision
  }

  return numberString;
}

function formatDate(dateStr, format = undefined) {
  format = format || "DD MMM YYYY hh:mm:ss A";
  const formattedDate = dayjs(dateStr).format(format);

  return formattedDate;
}

export const printBetslip = (
  brandName,
  accountName,
  username,
  currencyCode,
  isJackpotBet,
  isMultiple,
  isSingle,
  jackpotDetails,
  shopAddress,
  shopDescription,
  tillDescription,
  outcomes,
  singles,
  multiples,
  totalOdds,
  betReference,
  betPlacementDate = undefined,
) => {
  //
  // const EMPTY_BETSLIP = {
  //   betData: {
  //     multiples: [],
  //     singles: [],
  //   },
  //   model: {
  //     outcomes: [],
  //   },
  // };

  //
  const underscoreLineStr = "________________________________________";
  const dashedLineStr = "----------------------------------------";

  EPOS.reset();

  const title = function (enlarge) {
    EPOS.centre();

    if (enlarge) {
      EPOS.large(brandName);
    } else {
      EPOS.text(brandName);
    }

    let address = "";
    if (shopAddress) {
      address += `${shopAddress} : `;
    }
    address += `${shopDescription} - ${tillDescription}`;

    // shopDescription address
    EPOS.text(address);
  };

  title(true);

  EPOS.left();
  EPOS.dashedLine();

  const slip = () => {
    if (isSingle) {
      EPOS.bold("Single Bet");
    } else if (isMultiple) {
      const multipleBet = multiples[0];
      EPOS.bold(multipleBet["description"]);
    }
    // else if (Masagi.Betslip["isSystemKind"]()) {
    //   ref = Masagi.Betslip.getSelectedSystemBetRef();
    //
    //   for (s = 0; s < model["systems"].length; s++) {
    //     if (model["systems"][s]["ref"] == ref) {
    //       EPOS.bold(model["systems"][s]["fullDescription"]);
    //       break;
    //     }
    //   }
    // }

    for (let scounter = 0; scounter < outcomes.length; scounter++) {
      const outcome = outcomes[scounter];

      EPOS.text(`${outcome.categoryDescription} - ${outcome.tournamentDescription}`);
      EPOS.text(outcome.eventDescription);

      const startTime = formatDate(
        outcome.startTime || dayjs.unix(outcome.startTime / 1000).toDate(),
        "DD MMM YYYY hh:mm A",
      );
      EPOS.text(startTime);

      EPOS.text(`${outcome.marketDescription} - ${outcome.periodDescription}`);

      // price = price ? formatNumber(price) : "SP";
      EPOS.bold(`${outcome.outcomeDescription}|@ ${outcome.formattedPrice}`);
    }
    EPOS.dashedLine();

    EPOS.bold(`Odds:|${formatNumber(totalOdds)}`);

    let totalStake;
    let totalPotentialWin;
    if (isSingle) {
      totalStake = singles.reduce((n, { stake }) => n + stake, 0);
      totalPotentialWin = singles.reduce((n, { potentialWin }) => n + potentialWin, 0);
    } else if (isMultiple) {
      totalStake = multiples.reduce((n, { stake }) => n + stake, 0);
      totalPotentialWin = multiples.reduce((n, { potentialWin }) => n + potentialWin, 0);
    }

    EPOS.bold(`Stake:|${currencyCode} ${formatNumber(totalStake)}`);
    EPOS.dashedLine();
    EPOS.bold(`Possible Win:|${currencyCode} ${formatNumber(totalPotentialWin)}`);

    // else if (Masagi.Betslip["isSystemKind"]()) {
    //   ref = Masagi.Betslip.getSelectedSystemBetRef();
    //
    //   for (s = 0; s < model["systems"].length; s++) {
    //     if (model["systems"][s]["ref"] == ref) {
    //       var systemBet = model["systems"][s];
    //       EPOS.bold("Stake:|PHP " + formatNumber(systemBet["totalStake"]));
    //       EPOS.dashedLine();
    //       EPOS.bold("Possible Win:|PHP " + formatNumber(systemBet["potentialReturns"]));
    //       break;
    //     }
    //   }
    // }
  };

  slip();

  // EPOS.underscoreLine();

  // EPOS.small("SHOP SIGNATURE|" + user);
  // EPOS.small();

  const now = betPlacementDate || new Date();

  const signature = () => {
    EPOS.underscoreLine();
    EPOS.small(`Customer: ${accountName} [${username}]`);
    // EPOS.underscoreLine();
    EPOS.small(formatDate(now, "DD MMM YYYY hh:mm:ss A"));
  };

  signature();

  EPOS.barcode(betReference);
  EPOS.centre();
  EPOS.small("Check tickets and money before leaving the counter.");
  EPOS.small(`Subject to ${brandName} maximum payout.`);
  EPOS.small();

  title(false);

  EPOS.paperCut(); // placed with some delay to account for header spacing whe the

  EPOS.left();

  EPOS.dashedLine();

  slip();
  EPOS.bold(`Reference:|${betReference}`);
  signature();

  // EPOS.text("\r\n\r\n\r\n");
  EPOS.text("\r\n\r\n\r\n");

  EPOS.paperCut();

  EPOS.print();
};

export const printTicketPayout = (
  betslipReference,
  brandName,
  currencyCode,
  amount,
  shopAddress,
  shopDescription,
  tillDescription,
) => {
  EPOS.reset();

  EPOS.centre();
  EPOS.text(brandName);

  let addr1 = "";
  if (shopAddress) {
    addr1 = `${shopAddress} : `;
  }
  EPOS.text(addr1 + shopDescription);

  EPOS.left();
  EPOS.dashedLine();
  EPOS.centre();
  EPOS.large("PAID OUT");
  EPOS.left();
  EPOS.text();
  EPOS.bold(`Reference:|${betslipReference}`);
  EPOS.bold(`Amount:|${currencyCode} ${formatNumber(amount)}`);
  // EPOS.underscoreLine();
  // var user = localStorage.getItem("MIFY_USER");
  // EPOS.small("SHOP SIGNATURE|" + user);

  // EPOS.small();
  // EPOS.underscoreLine();
  // EPOS.small("CUSTOMER SIGNATURE|" + data["betslipInformation"]);
  // EPOS.small();
  EPOS.underscoreLine();

  const now = new Date();

  EPOS.text(formatDate(now));
  EPOS.text("\r\n\r\n\r\n");
  EPOS.paperCut();

  // console.log(EPOS.print());
  console.log("Print confirmation: ");
  EPOS.print();
};

export const printPlayerTransaction = (
  brandName,
  credit,
  currencyCode,
  debit,
  info,
  shopAddress,
  shopDescription,
  tillDescription,
  transactionTypeDescription,
  transactionCategoryDescription,
  transactionIdentification,
  username,
) => {
  const emailDetails = {
    transactionId: info["id"],
    type: transactionTypeDescription,
  };

  EPOS.reset();
  const copy = function () {
    EPOS.text(`Reference ID:|${info["id"]}`);
    EPOS.text(`Transaction:|${credit > 0 ? "Deposit" : "Withdraw"}`);

    const now = info["createdDate"];

    EPOS.text(`Date/Time:|${formatDate(now)}`);

    const accountName = info["accountName"] ? info["accountName"] : username;
    EPOS.text(`Account Name:|${accountName}`);

    EPOS.text(`User Name:|${username}`);
    emailDetails["username"] = username;

    EPOS.text(`ID Type & No.:|${transactionCategoryDescription} - ${transactionIdentification}`);
    emailDetails["idType"] = transactionCategoryDescription;
    emailDetails["idNumber"] = transactionIdentification;

    const currentBalance = Number(info["userStartingBalance"]).toFixed(2); // transType.isIn ? "0" : amountValue;
    EPOS.text(`Current Balance:|${currencyCode} ${formatNumber(currentBalance)}`);

    EPOS.text(`Amount:|${currencyCode} ${formatNumber(Math.max(credit, debit))}`);
    emailDetails["credit"] = credit;
    emailDetails["debit"] = debit;

    const endingBalance = Number(info["userEndingBalance"]).toFixed(2); // transType.isIn ? amountValue : "0";
    EPOS.text(`Ending Balance:|${currencyCode} ${formatNumber(endingBalance)}`);

    // EPOS.text("CS/Telebet ID:|");
    // EPOS.text("Control No.:|");
    EPOS.underscoreLine();

    EPOS.text(`${credit > 0 ? "Receiving Staff" : "Disbursing Staff"}:|${username}`);
  };

  copy();
  EPOS.text("\r\n");
  EPOS.centre();
  EPOS.large(brandName);
  EPOS.paperCut();

  let address = "";
  if (shopAddress) address += `${shopAddress} : `;

  if (tillDescription) address += `${tillDescription} - `;

  address += shopDescription;

  EPOS.text(address);

  copy();
  EPOS.text("\r\n\r\n\r\n");

  EPOS.paperCut();
  // console.log("Print Telebet: " + EPOS.print());
  console.log("Print Telebet: ");
  EPOS.print();

  return emailDetails;
};

export const printTillTransaction = (
  currencyCode,
  id,
  username,
  createdDate,
  transType,
  isCashIn,
  isCashOut,
  amount,
) => {
  EPOS.reset();
  EPOS.text(`Reference ID:|${id}`);
  EPOS.text(`Transaction:|${transType}`);

  const now = createdDate;

  EPOS.text(`Date/Time:| ${formatDate(now)}`);

  if (isCashIn) {
    EPOS.text(`From:|${transType}`);
  } else {
    EPOS.text(`To:|${transType}`);
  }

  EPOS.text(`Amount:|${currencyCode} ${formatNumber(amount)}`);
  EPOS.text(`${isCashIn ? "Receiving Staff" : "Disbursing Staff"}:|${username}`);

  EPOS.text("\r\n\r\n\r\n");

  EPOS.paperCut();

  console.log("Print Transaction: ");
  EPOS.print();
};

export const printShiftSummary = (currencyCode, info) => {
  EPOS.reset();

  EPOS.text(`Date:|${info["date"]}`);
  EPOS.text(`Staff:|${info["staff"]}`);
  EPOS.dashedLine();
  EPOS.bold("Bet Transactions");
  EPOS.dashedLine();
  EPOS.text(`Bet Placement|${formatNumber(info["betPlacement"])}`);
  EPOS.text(`Bet Payout|${formatNumber(info["betPayout"])}`);
  EPOS.dashedLine();
  EPOS.bold("Other Transactions");
  EPOS.dashedLine();
  EPOS.bold(`Cash In|${formatNumber(info["cashInTotal"])}`);
  // EPOS.text("  Adjustment|" + formatNumber(info["cashInAdjustment"]) + "     ");
  EPOS.text(`  Fund Transfer From|${formatNumber(info["cashInFundTransferTotal"])}     `);
  EPOS.text(`  Deposits|${formatNumber(info["cashInDeposits"])}     `);
  EPOS.bold(`Cash Out|${formatNumber(info["cashOutTotal"])}`);
  // EPOS.text("  Adjustment|" + formatNumber(info["cashOutAdjustment"]) + "     ");
  EPOS.text(`  Fund Transfer To|${formatNumber(info["cashOutFundTransferTotal"])}     `);
  EPOS.text(`  Withdrawals|${formatNumber(info["cashOutWithdrawals"])}     `);
  EPOS.underscoreLine();
  EPOS.text(`Total Cash Available|${currencyCode} ${formatNumber(info["cashAvailable"])}`);
  EPOS.text("\r\n\r\n\r\n");
  EPOS.paperCut();

  // console.log("Print Summary: " + EPOS.print());
  console.log("Print Summary: ");
  EPOS.print();
};

const CASH_LEDGER_TYPE_DESC = {
  ADJUSTMENT_CREDIT: "Fund Transfer From",
  ADJUSTMENT_DEBIT: "Fund Transfer To",
  BET_CREDIT: "BETS PLACED",
  BET_DEBIT: "BETS PAID-OUT",
  BONUS_CREDIT: null,
  BONUS_DEBIT: null,
  COMMISSION_CREDIT: null,
  COMMISSION_DEBIT: null,
  END_SHIFT: null,
  EXTERNAL_TRANSFER_CREDIT: null,
  EXTERNAL_TRANSFER_DEBIT: null,
  PAYMENT: "Withdrawals",
  // "Deposits",
  RECEIPT: "Deposits",

  TRANSFER_CREDIT: null,

  TRANSFER_DEBIT: null,
  VOID_DEBIT: null, // "Withdrawals"
};

export const printShiftHistory = (info, items) => {
  EPOS.reset();
  let shop = localStorage.getItem("SHOP_DETAILS");
  let till = localStorage.getItem("TILL_DETAILS");
  shop = JSON.parse(shop);
  till = JSON.parse(till);

  let address = "";
  if (shop["addr1"]) address += `${shop["addr1"]} : `;

  if (till["description"]) address += `${till["description"]} - `;

  address += shop["description"];

  // EPOS.centre();
  EPOS.bold(`Outlet:|${address}`);
  EPOS.bold(`Date:|${info["date"]}`);
  // EPOS.left();
  EPOS.dashedLine();

  if (items["BET_CREDIT"] && items["BET_CREDIT"].length) {
    EPOS.header("BETS PLACED");
    for (let i = 0; i < items["BET_CREDIT"].length; i++) {
      const desc1 = items["BET_CREDIT"][i]["desc"].replace("|", "&pipe;");
      const amount1 = formatNumber(items["BET_CREDIT"][i]["amount"]);
      EPOS.text(`${desc1}|${amount1}`);
    }
    EPOS.dashedLine(); // EPOS.text("\r\n");
  }

  if (items["BET_DEBIT"] && items["BET_DEBIT"].length) {
    EPOS.header("BETS PAID OUT");
    for (let i = 0; i < items["BET_DEBIT"].length; i++) {
      const desc1 = items["BET_DEBIT"][i]["desc"].replace("|", "&pipe;");
      const amount1 = formatNumber(items["BET_DEBIT"][i]["amount"]);
      EPOS.text(`${desc1}|${amount1}`);
    }
    EPOS.dashedLine(); // EPOS.text("\r\n");
  }

  EPOS.header("OTHER TRANSACTIONS");

  for (const t in items) {
    const excludedTypes = [
      "BET_CREDIT",
      "BET_DEBIT",
      "ADJUSTMENT_DEBIT",
      "TRANSFER_DEBIT",
      "ADJUSTMENT_CREDIT",
      "TRANSFER_CREDIT",
      "PAYMENT",
      "RECEIPT",
    ];

    if (excludedTypes.indexOf(t) < 0) {
      // EPOS.centre();
      let typeDesc = CASH_LEDGER_TYPE_DESC[t];
      typeDesc = typeDesc || t.replace("_", " ");
      // EPOS.bold("" + typeDesc);
      // EPOS.left();
      for (let i = 0; i < items[t].length; i++) {
        const desc1 = items[t][i]["desc"].replace("|", "&pipe;");
        const amount1 = formatNumber(items[t][i]["amount"]);
        EPOS.text(`${desc1}|${amount1}`);
      }
      // EPOS.dashedLine();// EPOS.text("\r\n");
    }
    EPOS.dashedLine();
  }
  /*
  var fundTransferTo = getItemTotal(items, "ADJUSTMENT_DEBIT");
  fundTransferTo = fundTransferTo + getItemTotal(items, "TRANSFER_DEBIT");
  
  var fundTransferFrom = getItemTotal(items, "ADJUSTMENT_CREDIT");
  fundTransferFrom = fundTransferFrom + getItemTotal(items, "TRANSFER_CREDIT");
  
  EPOS.text(Masagi.ShiftSummary.CASH_LEDGER_TYPE_DESC["ADJUSTMENT_DEBIT"] + "|" + formatNumber(fundTransferTo));
  EPOS.text(Masagi.ShiftSummary.CASH_LEDGER_TYPE_DESC["ADJUSTMENT_CREDIT"] + "|" + formatNumber(fundTransferFrom));
  EPOS.dashedLine();
  */

  let hasAdjusment = items["ADJUSTMENT_DEBIT"] && items["ADJUSTMENT_DEBIT"].length;
  let hasTransfer = items["TRANSFER_DEBIT"] && items["TRANSFER_DEBIT"].length;
  if (hasAdjusment || hasTransfer) {
    EPOS.bold("Fund Transfer To");

    if (hasAdjusment) {
      for (let i = 0; i < items["ADJUSTMENT_DEBIT"].length; i++) {
        const desc1 = items["ADJUSTMENT_DEBIT"][i]["desc"].replace("|", "&pipe;");
        const amount1 = formatNumber(items["ADJUSTMENT_DEBIT"][i]["amount"]);
        EPOS.text(`${desc1}|${amount1}`);
      }
    }

    if (hasTransfer) {
      for (let i = 0; i < items["TRANSFER_DEBIT"].length; i++) {
        const desc1 = items["TRANSFER_DEBIT"][i]["desc"].replace("|", "&pipe;");
        const amount1 = formatNumber(items["TRANSFER_DEBIT"][i]["amount"]);
        EPOS.text(`${desc1}|${amount1}`);
      }
    }

    EPOS.dashedLine(); // EPOS.text("\r\n");
  }

  hasAdjusment = items["ADJUSTMENT_CREDIT"] && items["ADJUSTMENT_CREDIT"].length;
  hasTransfer = items["TRANSFER_CREDIT"] && items["TRANSFER_CREDIT"].length;
  if (hasAdjusment || hasTransfer) {
    EPOS.bold("Fund Transfer From");

    if (hasAdjusment) {
      for (let i = 0; i < items["ADJUSTMENT_CREDIT"].length; i++) {
        const desc1 = items["ADJUSTMENT_CREDIT"][i]["desc"].replace("|", "&pipe;");
        const amount1 = formatNumber(items["ADJUSTMENT_CREDIT"][i]["amount"]);
        EPOS.text(`${desc1}|${amount1}`);
      }
    }

    if (hasTransfer) {
      for (let i = 0; i < items["TRANSFER_CREDIT"].length; i++) {
        const desc1 = items["TRANSFER_CREDIT"][i]["desc"].replace("|", "&pipe;");
        const amount1 = formatNumber(items["TRANSFER_CREDIT"][i]["amount"]);
        EPOS.text(`${desc1}|${amount1}`);
      }
    }

    EPOS.dashedLine(); // EPOS.text("\r\n");
  }

  if (items["RECEIPT"] && items["RECEIPT"].length) {
    EPOS.bold("Deposits");
    for (let i = 0; i < items["RECEIPT"].length; i++) {
      const desc1 = items["RECEIPT"][i]["desc"].replace("|", "&pipe;");
      const amount1 = formatNumber(items["RECEIPT"][i]["amount"]);
      EPOS.text(`${desc1}|${amount1}`);
    }
    EPOS.dashedLine(); // EPOS.text("\r\n");
  }

  if (items["PAYMENT"] && items["PAYMENT"].length) {
    EPOS.bold("Withdrawals");
    for (let i = 0; i < items["PAYMENT"].length; i++) {
      const desc1 = items["PAYMENT"][i]["desc"].replace("|", "&pipe;");
      const amount1 = formatNumber(items["PAYMENT"][i]["amount"]);
      EPOS.text(`${desc1}|${amount1}`);
    }
    EPOS.dashedLine(); // EPOS.text("\r\n");
  }

  // EPOS.dashedLine();
  EPOS.bold(`TOTAL CASH AVAILABLE:|${formatNumber(info["cashAvailable"])}`);
  EPOS.dashedLine();
  EPOS.bold("STAFF-IN-CHARGE:|");
  EPOS.underscoreLine();
  const user = localStorage.getItem("MIFY_USER");
  EPOS.small(`|${user}`);
  EPOS.text("\r\n\r\n\r\n");
  EPOS.paperCut();

  // console.log("Print Items: " + EPOS.print());
  console.log("Print Items: ");
  EPOS.print();
};

export const printPlayerBalance = (
  accountName,
  brandName,
  currencyCode,
  promoBalance,
  promoSnrBalance,
  realBalance,
  shopAddress,
  shopDescription,
  tillDescription,
  username,
) => {
  //
  EPOS.reset();
  const title = function (enlarge) {
    EPOS.centre();
    if (enlarge) {
      EPOS.large(brandName);
    } else {
      EPOS.text(brandName);
    }

    let address = "";

    if (shopAddress) {
      address += `${shopAddress} : `;
    }

    if (tillDescription) {
      address += `${tillDescription} - `;
    }

    address += shopDescription;

    EPOS.text(address);
  };

  title(true);

  EPOS.left();

  EPOS.text(`Transaction: Request Balance`);

  const now = new Date();
  EPOS.text(`Date / Time: ${formatDate(now)}`);
  EPOS.text(`Account Name: ${accountName}`);
  EPOS.text(`Username: ${username}`);

  EPOS.text(`Balance:     ${currencyCode} ${realBalance.toLocaleString()}`);
  EPOS.text(`Promo Money: ${currencyCode} ${promoBalance.toLocaleString()}`);
  EPOS.text(`Promo SNR:   ${currencyCode} ${promoSnrBalance.toLocaleString()}`);

  EPOS.underscoreLine();
  EPOS.text("\r\n\r\n\r\n");
  EPOS.paperCut();
  // EPOS.save(model["reference"]); // Save the data in case we want to reprint last ticket.
  EPOS.print();

  console.log("--------- PRINT BALANCE ----------");
};

export const testPrint = () => {
  EPOS.reset();
  EPOS.large("         1         2");
  EPOS.large("123456789012345678901");
  EPOS.text();
  EPOS.text("         1         2         3         4");
  EPOS.text("123456789012345678901234567890123456789012");
  EPOS.text();
  EPOS.small("         1         2         3         4         5    ");
  EPOS.small("12345678901234567890123456789012345678901234567890123456");
  EPOS.text("\r\n\r\n\r\n");

  EPOS.paperCut();
  EPOS.print();
};
