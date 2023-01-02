import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const propTypes = {
  onClearSelections: PropTypes.func,
  onSameSelections: PropTypes.func,
  submitConfirmation: PropTypes.any,
};

const defaultProps = {
  onClearSelections: undefined,
  onSameSelections: undefined,
  submitConfirmation: undefined,
};

const BetslipConfirmationPopUp = ({ onClearSelections, onSameSelections, submitConfirmation }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`${classes["bet-popup"]} ${classes["bet-popup_success"]} ${
        submitConfirmation ? classes["active"] : ""
      }`}
    >
      <div className={classes["bet-popup__body"]}>
        <div className={classes["bet-popup__content"]}>
          <div className={classes["bet-popup__header"]}>
            <h3>{t("success")}</h3>
          </div>
          <div className={classes["bet-popup__main"]}>
            <div className={classes["bet-popup__result"]}>
              <span>{t("betslip_panel.transaction_completed")}</span>
            </div>
            <p className={classes["bet-popup__text"]}>{t("betslip_panel.bet_successfully_placed")}</p>
            <div className={classes["bet-popup__buttons"]}>
              <button className={classes["bet-popup__button"]} type="button" onClick={onSameSelections}>
                {t("betslip_panel.previous_selections")}
              </button>
              <button className={classes["bet-popup__button"]} type="button" onClick={onClearSelections}>
                {t("betslip_panel.new_bets")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BetslipConfirmationPopUp.propTypes = propTypes;
BetslipConfirmationPopUp.defaultProps = defaultProps;

export default BetslipConfirmationPopUp;
