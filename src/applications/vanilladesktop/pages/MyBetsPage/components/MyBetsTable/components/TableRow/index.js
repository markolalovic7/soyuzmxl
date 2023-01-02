import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import dayjs from "dayjs";
import { MY_BETS_RESULT_TYPES } from "mybets-resulttype-constants/constants";
import PropTypes from "prop-types";

const BetColumnsWrapper = ({ bet, betData, includeBetType, includeTransactionInfo, newRow, transaction }) => {
  if (newRow) {
    return (
      <tr>
        <BetColumns
          bet={bet}
          betData={betData}
          includeBetType={includeBetType}
          includeTransactionInfo={includeTransactionInfo}
          transaction={transaction}
        />
      </tr>
    );
  }

  return (
    <BetColumns
      bet={bet}
      betData={betData}
      includeBetType={includeBetType}
      includeTransactionInfo={includeTransactionInfo}
      transaction={transaction}
    />
  );
};

BetColumnsWrapper.propTypes = {
  bet: PropTypes.object.isRequired,
  betData: PropTypes.object.isRequired,
  includeBetType: PropTypes.bool.isRequired,
  includeTransactionInfo: PropTypes.bool.isRequired,
  newRow: PropTypes.bool.isRequired,
  transaction: PropTypes.object.isRequired,
};

const BetColumns = ({ bet, betData, includeBetType, includeTransactionInfo, transaction }) => {
  let betDataCount = 0;
  bet.transactions.forEach((transaction) => {
    betDataCount += transaction.betData.length;
  });

  return (
    <>
      {includeBetType && (
        <td className={classes["table__center"]} rowSpan={betDataCount}>
          {bet.betTypeDescription}
        </td>
      )}
      {includeTransactionInfo && (
        <>
          <td className={classes["table__center"]} rowSpan={transaction.betData.length}>
            {transaction.transactionId}
          </td>
          <td
            className={cx(classes["table__result"], {
              [classes["table__result_win"]]:
                transaction.result === MY_BETS_RESULT_TYPES.Win ||
                transaction.result === MY_BETS_RESULT_TYPES.WinVoid ||
                transaction.result === MY_BETS_RESULT_TYPES.VoidWin,
              [classes["table__result_lose"]]:
                transaction.result === MY_BETS_RESULT_TYPES.Lose ||
                transaction.result === MY_BETS_RESULT_TYPES.LoseVoid ||
                transaction.result === MY_BETS_RESULT_TYPES.VoidLose,
            })}
            rowSpan={transaction.betData.length}
          >
            {transaction.result}
          </td>
        </>
      )}

      <td>
        <b>{`${betData.outcomeDescription} - `}</b>
        &nbsp;
        {[
          betData.marketDescription,
          betData.periodDescription,
          betData.eventDescription,
          betData.eventPathDescription,
        ].join(" - ")}
      </td>
    </>
  );
};

BetColumns.propTypes = {
  bet: PropTypes.object.isRequired,
  betData: PropTypes.object.isRequired,
  includeBetType: PropTypes.bool.isRequired,
  includeTransactionInfo: PropTypes.bool.isRequired,
  transaction: PropTypes.object.isRequired,
};

const TableRow = ({ betDataCount, bets, createDate, credit, debit, reference, transactionCount }) => (
  <>
    <tr>
      <td className={classes["table__reference"]} rowSpan={betDataCount}>
        {reference}
      </td>
      <td className={classes["table__center"]} rowSpan={betDataCount}>
        {dayjs(createDate).format("DD-MMM-YYYY HH:mm")}
      </td>
      <td className={classes["table__center"]} rowSpan={betDataCount}>
        {debit.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
      </td>
      <td className={classes["table__center"]} rowSpan={betDataCount}>
        {credit.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
      </td>
      {bets.slice(0, 1).map((bet) => (
        // Display first transaction of the first bet
        <BetColumnsWrapper
          includeBetType
          includeTransactionInfo
          bet={bet}
          betData={bet.transactions[0].betData[0]}
          key={0}
          newRow={false}
          transaction={bet.transactions[0]}
        />
      ))}
    </tr>

    {/* Display any additional transaction of the first bet, and subsequent bets */}
    {betDataCount > 1 &&
      bets.map((bet, betIndex) => {
        if (betIndex === 0) {
          // Skip the first transaction, or, if a single transaction bet, skip the whole bet
          if (bet.transactions.length === 1 && bet.transactions[0].betData.length === 1) return null; // Already displayed in the previous block

          return bet.transactions.map((transaction, transactionIndex) => {
            const betDatas =
              transactionIndex === 0 ? transaction.betData.slice(1, transaction.betData.length) : transaction.betData;

            return betDatas.map((betData, betDataIndex) => (
              <BetColumnsWrapper
                newRow
                bet={bet}
                betData={betData}
                includeBetType={false}
                includeTransactionInfo={transactionIndex > 0 && betDataIndex === 0}
                key={`${transaction.transactionId}-${betDataIndex}`}
                transaction={transaction}
              />
            ));
          });
        }

        return bet.transactions.map((transaction, transactionIndex) =>
          transaction.betData.map((betData, betDataIndex) => (
            <BetColumnsWrapper
              newRow
              bet={bet}
              betData={betData}
              includeBetType={transactionIndex === 0 && betDataIndex === 0} // true for the first transaction in a bet....
              includeTransactionInfo={betDataIndex === 0} // true for the first betData in a bet....
              key={`${transaction.transactionId}-${betDataIndex}`}
              transaction={transaction}
            />
          )),
        );
      })}
  </>
);

TableRow.propTypes = {
  betDataCount: PropTypes.number.isRequired,
  bets: PropTypes.array.isRequired,
  createDate: PropTypes.string.isRequired,
  credit: PropTypes.number.isRequired,
  debit: PropTypes.number.isRequired,
  reference: PropTypes.string.isRequired,
  transactionCount: PropTypes.number.isRequired,
};

export default TableRow;
