import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getDatejsObject } from "utils/dayjs";
import { formatDateDayMonthYear } from "utils/dayjs-format";

const propTypes = {
  createdDate: PropTypes.string.isRequired,
  credit: PropTypes.number.isRequired,
  debit: PropTypes.number.isRequired,
  description: PropTypes.string,
  transactionId: PropTypes.number.isRequired,
  transactionTypeDescription: PropTypes.string.isRequired,
};
const defaultProps = {
  description: undefined,
};

const TransactionItem = ({ createdDate, credit, debit, description, transactionId, transactionTypeDescription }) => {
  const { t } = useTranslation();

  return (
    <div className={classes["settled-card"]}>
      <div className={classes["settled-card__top"]}>
        <div className={classes["settled-card__container"]}>
          <div className={classes["settled-card__header"]}>
            <span className={classes["settled-card__transaction"]}>
              {t("vanillamobile.pages.my_statements_page.my_statements_transaction_id", { transactionId })}
            </span>
            <span className={classes["settled-card__receipt"]}>{transactionTypeDescription}</span>
          </div>
        </div>
      </div>
      <div className={classes["settled-card__body"]}>
        <div className={classes["settled-card__container"]}>
          <div className={classes["settled-card__info"]}>
            <span className={classes["settled-card__points"]}>
              {t("vanillamobile.pages.my_statements_page.my_statements_debit_credit", { credit, debit })}
            </span>
            <span className={classes["settled-card__date"]}>
              {formatDateDayMonthYear(getDatejsObject(createdDate))}
            </span>
          </div>
          {description && <p className={classes["settled-card__text"]}>{description}</p>}
        </div>
      </div>
    </div>
  );
};

TransactionItem.propTypes = propTypes;
TransactionItem.defaultProps = defaultProps;

export default TransactionItem;
