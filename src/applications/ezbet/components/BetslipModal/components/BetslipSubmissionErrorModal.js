import cx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";

import CloseRedSvg from "../../../img/icons/close-red.svg";
import classes from "../../../scss/ezbet.module.scss";

const BetslipSubmissionErrorModal = ({ message, onClose }) => {
  const { t } = useTranslation();

  return (
    <div
      className={cx(classes["confirmation-modal"], classes["confirm-error-modal"])}
      id="confirmation-modal"
      style={{ display: "flex" }}
    >
      <div className={classes["modal-content"]}>
        <div className={classes["modal-body"]}>
          <i className={classes["ez-check-icon"]}>
            <img alt="White Check in blue circle" src={CloseRedSvg} />
          </i>
          <p className={classes["warning"]} style={{ color: "red", marginBottom: "11px" }}>
            요청이 정상적으로
          </p>
          <p>{message}</p>
          <div className={cx(classes["modal-footer"], classes["flex-al-center"])}>
            <button className={cx(classes["primary"], classes["confirmation-button"])} type="button" onClick={onClose}>
              {t("confirm")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

BetslipSubmissionErrorModal.propTypes = { message: PropTypes.string.isRequired, onClose: PropTypes.func.isRequired };

export default React.memo(BetslipSubmissionErrorModal);
