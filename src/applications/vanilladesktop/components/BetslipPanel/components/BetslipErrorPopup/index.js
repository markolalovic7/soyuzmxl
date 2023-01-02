import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  submitError: PropTypes.string,
};

const defaultProps = {
  submitError: undefined,
};

const BetslipErrorPopup = ({ isOpen, onClose, submitError }) => {
  const { t } = useTranslation();

  return (
    <div
      className={cx(
        classes["betslip-popup"],
        classes["betslip-popup_special"],
        classes["betslip-popup_error"],
        classes["betslip-popup1"],
        {
          [classes["open"]]: isOpen,
        },
      )}
    >
      <div className={classes["betslip-popup__body"]}>
        <div className={classes["betslip-popup__content"]}>
          <div className={classes["betslip-popup__header"]}>
            <h5 className={classes["betslip-popup__title"]}>{t("bet_error_header_1")}</h5>
          </div>
          <div className={classes["betslip-popup__message"]}>
            <div className={classes["betslip-popup__transaction"]}>
              <svg height="24" version="1.1" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z" />
              </svg>
              <span>{t("betslip_panel.unable_place_bet")}</span>
            </div>
            <div className={classes["betslip-popup__text"]}>{submitError}</div>
            <div className={classes["betslip-popup__buttons"]}>
              <div className={cx(classes["betslip-popup__button"], classes["betslip-popup-closer1"])} onClick={onClose}>
                {t("ok")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BetslipErrorPopup.propTypes = propTypes;
BetslipErrorPopup.defaultProps = defaultProps;

export default BetslipErrorPopup;
