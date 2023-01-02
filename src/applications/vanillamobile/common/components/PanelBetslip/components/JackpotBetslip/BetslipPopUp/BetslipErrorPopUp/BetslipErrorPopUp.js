import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const propTypes = {
  onClick: PropTypes.func.isRequired,
  submitError: PropTypes.string.isRequired,
};

const defaultProps = {};

const BetslipErrorPopUp = ({ onClick, submitError }) => {
  const { t } = useTranslation();

  return (
    <div className={`${classes["bet-popup"]} ${classes["bet-popup_error"]} ${submitError ? classes["active"] : ""}`}>
      <div className={classes["bet-popup__body"]}>
        <div className={classes["bet-popup__content"]}>
          <div className={classes["bet-popup__header"]}>
            <h3>{t("betslip_panel.unable_place_bet")}</h3>
          </div>
          <div className={classes["bet-popup__main"]}>
            <div className={classes["bet-popup__result"]}>
              <span>{submitError}</span>
            </div>
            <div className={classes["bet-popup__buttons"]}>
              <button className={classes["bet-popup__button"]} type="button" onClick={onClick}>
                {t("ok")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BetslipErrorPopUp.propTypes = propTypes;
BetslipErrorPopUp.defaultProps = defaultProps;

export default BetslipErrorPopUp;
