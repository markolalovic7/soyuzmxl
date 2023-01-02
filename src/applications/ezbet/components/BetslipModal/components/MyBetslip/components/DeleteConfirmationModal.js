import cx from "classnames";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import classes from "applications/ezbet/scss/ezbet.module.scss";

const DeleteConfirmationModal = ({ match, onClose, onOk }) => {
  const { t } = useTranslation();

  return (
    <div
      className={cx(classes["confirmation-modal"], classes["confirm-success-modal"], classes["confirm-delete-modal"])}
      id="confirmation-modal"
      style={{ display: "flex" }}
    >
      <div className={classes["modal-content"]}>
        <div className={classes["modal-body"]}>
          <i className={classes["ez-check-icon"]}>
            <span className={classes["icon-delete-alert-icon"]}>
              <span className={classes["path1"]} />
              <span className={classes["path2"]} />
              <span className={classes["path3"]} />
            </span>
          </i>
          <div>
            <p className={classes["match"]}>
              <span style={{ textAlign: "center" }}>베팅 슬립 전체 삭제</span>
            </p>
            <p>{t("ez.wen_you_click_ok_details_deleted")}</p>
          </div>
          <div className={cx(classes["modal-footer"], classes["flex-al-center"])}>
            <button className={cx(classes["primary"], classes["confirmation-button"])} type="button" onClick={onOk}>
              {t("ok")}
            </button>
            <button className={cx(classes["default"], classes["confirmation-button"])} type="button" onClick={onClose}>
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

DeleteConfirmationModal.propTypes = {
  match: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
};
export default DeleteConfirmationModal;
