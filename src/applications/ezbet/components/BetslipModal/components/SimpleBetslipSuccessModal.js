import cx from "classnames";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import CheckSvg from "applications/ezbet/img/icons/check.svg";
import classes from "applications/ezbet/scss/ezbet.module.scss";
import { getAccountSelector } from "redux/reselect/account-selector";
import { clearCashoutState } from "redux/slices/cashoutSlice";

const defaultProps = {
  setCashOutModalOpen: undefined,
};

const SimpleBetslipSuccessModal = ({ setCashOutModalOpen }) => {
  SimpleBetslipSuccessModal.propTypes = {
    setCashOutModalOpen: PropTypes.func,
  };
  const { accountData } = useSelector(getAccountSelector);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const sanitiseUsername = (username) => {
    if (username.startsWith("1_")) {
      return username.substr(2, username.length);
    }

    return username;
  };

  function handleConfirmModal() {
    dispatch(clearCashoutState());
    setCashOutModalOpen(false);
  }

  return (
    <div
      className={cx(classes["confirmation-modal"], classes["confirm-success-modal"], classes["cash-out-success-modal"])}
      id="confirmation-modal"
      style={{ display: "flex" }}
    >
      <div className={classes["modal-content"]}>
        <div className={classes["modal-body"]}>
          <i className={classes["ez-check-icon"]}>
            <img alt="White Check in blue circle" src={CheckSvg} />
          </i>
          <p>{t("ez.normally_request")}</p>
          <div className={cx(classes["modal-footer"], classes["flex-al-center"])}>
            <button
              className={cx(classes["primary"], classes["confirmation-button"])}
              type="button"
              onClick={handleConfirmModal}
            >
              {t("confirm")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

SimpleBetslipSuccessModal.defaultProps = defaultProps;

export default SimpleBetslipSuccessModal;
