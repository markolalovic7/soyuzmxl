import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import dayjs from "dayjs";
import PropTypes from "prop-types";

const TableRow = ({ transaction }) => (
  <tr>
    <td className={classes["table__reference"]}>{transaction.transactionId}</td>
    <td className={classes["table__center"]}>{dayjs(transaction.createdDate).format("DD-MMM-YYYY HH:mm")}</td>
    <td className={classes["table__center"]}>
      {transaction.debit.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
    </td>
    <td className={classes["table__center"]}>
      {transaction.credit.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
    </td>
    <td className={classes["table__center"]}>{transaction.transactionTypeDescription}</td>
    <td className={classes["table__center"]}>{transaction.transactionSubTypeDescription}</td>
    <td className={classes["table__center"]}>{transaction.settled ? "Settled" : "Pending"}</td>
    <td className={classes["table__center"]}>{transaction.description}</td>
  </tr>
);

TableRow.propTypes = {
  transaction: PropTypes.object.isRequired,
};

export default TableRow;
