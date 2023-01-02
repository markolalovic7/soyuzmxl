import cx from "classnames";
import PropTypes from "prop-types";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { saveSettings } from "../../../../../../../redux/slices/ezSettingsSlice";
import classes from "../../../../../scss/ezbet.module.scss";

const BetSettingsDropdown = ({ dirtyChoice, open, setDirtyChoice, setOpen }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const autoApprovalMode = useSelector((state) => state.ez.autoApprovalMode); // AUTO_ALL, AUTO_HIGHER, MANUAL
  const moneyButton1 = useSelector((state) => state.ez.moneyButton1);
  const moneyButton2 = useSelector((state) => state.ez.moneyButton2);
  const moneyButton3 = useSelector((state) => state.ez.moneyButton3);

  const cancelChange = () => {
    setDirtyChoice(undefined);
    setOpen(false);
  };

  const confirmChange = () => {
    dispatch(saveSettings({ autoApprovalMode: dirtyChoice, moneyButton1, moneyButton2, moneyButton3 }));
    // setDirtyChoice(undefined);
    setOpen(false);
  };

  const getChoiceMessage = useCallback((choice) => {
    switch (choice) {
      case "AUTO_HIGHER":
        return t("ez.approval_auto_high");
      case "AUTO_ALL":
        return t("ez.approval_auto");
      case "MANUAL":
        return t("ez.approval_manual");
      default:
        return "";
    }
  }, []);

  function handleOpen() {
    setOpen((prevState) => !prevState);
    setDirtyChoice(autoApprovalMode);
  }

  return (
    <div
      className={cx(
        classes["accordion-wrapper"],
        classes["settings"],
        classes["betslip-fullscreen-modal"],
        classes["absolute"],
      )}
    >
      <div className={classes["country"]}>
        <button className={cx(classes["accordion"], { [classes["active"]]: open })} type="button" onClick={handleOpen}>
          <p>
            {t("ez.bet_settings")}
            <span>{getChoiceMessage(dirtyChoice ?? autoApprovalMode)}</span>
          </p>
          <div className={classes["down-wrapper"]}>
            <i className={classes["icon-angle-up-light-down"]} />
          </div>
        </button>
        {open && (
          <div className={cx(classes["panel"], classes["settings-panel"])} style={{ display: open ? "block" : "none" }}>
            <div className={classes["cash-out-settings-radio"]}>
              <p>{t("ez.auto_approve")}</p>
              <fieldset>
                <div className={classes["radio"]} onClick={() => setDirtyChoice("AUTO_HIGHER")}>
                  <input
                    defaultChecked={dirtyChoice ? dirtyChoice === "AUTO_HIGHER" : autoApprovalMode === "AUTO_HIGHER"}
                    id="option1"
                    name="settings-options"
                    type="radio"
                    value="option1"
                  />
                  <label className={classes["radio-label"]} htmlFor="option1">
                    <p>
                      {t("ez.approval_auto_high")}
                      <span>{t("ez.approval_auto_high_detail")}</span>
                    </p>
                  </label>
                </div>
                <div className={classes["radio"]} onClick={() => setDirtyChoice("AUTO_ALL")}>
                  <input
                    defaultChecked={dirtyChoice ? dirtyChoice === "AUTO_ALL" : autoApprovalMode === "AUTO_ALL"}
                    id="option2"
                    name="settings-options"
                    type="radio"
                    value="option2"
                  />
                  <label className={classes["radio-label"]} htmlFor="option2">
                    <p>
                      {t("ez.approval_auto")}
                      <span>{t("ez.approval_auto_detail")}</span>
                    </p>
                  </label>
                </div>
                <div className={classes["radio"]} onClick={() => setDirtyChoice("MANUAL")}>
                  <input
                    defaultChecked={dirtyChoice ? dirtyChoice === "MANUAL" : autoApprovalMode === "MANUAL"}
                    id="option3"
                    name="settings-options"
                    type="radio"
                    value="option3"
                  />
                  <label className={classes["radio-label"]} htmlFor="option3">
                    <p>
                      {t("ez.approval_manual")}
                      <span>{t("ez.approval_manual_detail")}</span>
                    </p>
                  </label>
                </div>
              </fieldset>
            </div>
            <hr />
            <div className={classes["flex-al-jus-center"]}>
              <button
                className={cx(classes["primary"], classes["confirmation-button"])}
                disabled={!dirtyChoice || dirtyChoice === autoApprovalMode}
                type="button"
                onClick={confirmChange}
              >
                {t("confirm")}
              </button>
              <button className={classes["default"]} type="button" onClick={cancelChange}>
                {t("cancel")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

BetSettingsDropdown.propTypes = {
  dirtyChoice: PropTypes.object,
  open: PropTypes.bool.isRequired,
  setDirtyChoice: PropTypes.func.isRequired,
  setOpen: PropTypes.func.isRequired,
};
BetSettingsDropdown.defaultProps = {
  dirtyChoice: undefined,
};
export default React.memo(BetSettingsDropdown);
