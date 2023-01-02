import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getItemBetslipTransactionResult } from "utils/my-bets";

const propTypes = {
  betTypeDescription: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool,
  transactions: PropTypes.array,
};
const defaultProps = {
  isExpanded: true,
  transactions: [],
};

const ItemBetslipExpanded = ({ betTypeDescription, isExpanded, transactions }) => {
  const { t } = useTranslation();
  const [isExpandedRow, setIsExpandedRow] = useState(isExpanded);

  if (transactions.length === 0) {
    return null;
  }

  return (
    <>
      <div
        className={`${classes["settled-card__selection"]} ${classes["spoiler-list"]}`}
        onClick={() => setIsExpandedRow(!isExpandedRow)}
      >
        <span className={`${classes["settled-card__arrow"]} ${classes["spoiler-arrow"]}`} />
        <span>{betTypeDescription}</span>
      </div>
      {isExpandedRow &&
        transactions.map((transaction) => (
          <div className={classes["settled-card__item"]} key={transaction.transactionId}>
            <div className={classes["settled-card__item"]}>
              <div className={classes["settled-card__body"]}>
                <div className={classes["settled-card__container"]}>
                  <div className={classes["settled-card__info"]}>
                    <span
                      className={`${classes["settled-card__score"]} ${
                        classes[getItemBetslipTransactionResult(transaction.resultDescription)]
                      }`}
                    >
                      {transaction.resultDescription}
                    </span>
                    <span className={classes["settled-card__id"]}>
                      {t("vanillamobile.pages.my_bets_page.my_bets_item_betslip_transaction_id", {
                        transactionId: transaction.transactionId,
                      })}
                    </span>
                  </div>
                  <p className={`${classes["settled-card__text"]} ${classes["settled-card__text_translucent"]}`}>
                    {transaction.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

ItemBetslipExpanded.propTypes = propTypes;
ItemBetslipExpanded.defaultProps = defaultProps;

export default ItemBetslipExpanded;
