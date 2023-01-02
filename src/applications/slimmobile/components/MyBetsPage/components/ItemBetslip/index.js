import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { getDatejsObject } from "utils/dayjs";
import { formatDateDayMonthYear } from "utils/dayjs-format";
import { getItemBetslipResult } from "utils/my-bets";

import ItemBetslipExpanded from "../ItemBetslipExpanded";

const propTypes = {
  bets: PropTypes.array,
  createdDate: PropTypes.string.isRequired,
  isSettled: PropTypes.bool,
  referenceId: PropTypes.string.isRequired,
  totalCredit: PropTypes.number.isRequired,
  totalDebit: PropTypes.number.isRequired,
};
const defaultProps = {
  bets: [],
  isSettled: true,
};

const ItemBetslip = ({ bets, createdDate, isSettled, referenceId, totalCredit, totalDebit }) => {
  const { t } = useTranslation();

  const { className: betslitpResultClassName, label: betslipResultLabel } = getItemBetslipResult(bets, t, isSettled);

  return (
    <div className={classes["settled-card"]}>
      <div className={classes["settled-card__top"]}>
        <div className={classes["settled-card__container"]}>
          <div className={classes["settled-card__header"]}>
            <span className={classes["settled-card__title"]}>
              {t("slimmobile.pages.my_bets_page.my_bets_item_betslip_reference", { referenceId })}
            </span>
            {betslipResultLabel && (
              <span className={`${classes["settled-card__score"]} ${classes[betslitpResultClassName]}`}>
                {betslipResultLabel}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className={classes["settled-card__body"]}>
        <div className={classes["settled-card__container"]}>
          <div className={classes["settled-card__info"]}>
            <span className={classes["settled-card__points"]}>
              {t("slimmobile.pages.my_bets_page.my_bets_item_debit_credit", {
                credit: totalCredit,
                debit: totalDebit,
              })}
            </span>
            <span className={classes["settled-card__date"]}>
              {formatDateDayMonthYear(getDatejsObject(createdDate))}
            </span>
          </div>
        </div>
      </div>
      {bets.map((bet) => (
        <ItemBetslipExpanded
          betTypeDescription={bet.betTypeDescription}
          key={bet.betId}
          transactions={bet.transactions}
        />
      ))}
    </div>
  );
};

ItemBetslip.propTypes = propTypes;
ItemBetslip.defaultProps = defaultProps;

export default ItemBetslip;
