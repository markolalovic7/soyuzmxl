import cx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";

import CloseRedSvg from "../../../img/icons/close-red.svg";
import classes from "../../../scss/ezbet.module.scss";

const BetslipErrorModal = ({
  differentMarketVisible,
  minBetsVisible,
  networkStatusUnstable,
  onClose,
  sameMarketVisible,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={cx(
        classes["confirmation-modal"],
        classes["confirm-error-modal"],
        classes["multiple-market-error-modal"],
        {
          [classes["network-status-unstable"]]: networkStatusUnstable,
        },
      )}
      id="confirmation-modal"
      style={{ display: "flex" }}
    >
      <div className={classes["modal-content"]}>
        <div className={classes["modal-body"]}>
          <i className={classes["ez-check-icon"]}>
            <img alt="White Check in blue circle" src={CloseRedSvg} />
          </i>
          <div>
            {!networkStatusUnstable && (
              <p className={classes["warning"]} style={{ color: "#E32323" }}>
                {t("ez.unable_to_process")}
              </p>
            )}
            {!networkStatusUnstable && minBetsVisible && <p>{t("ez.min_two_bets")}</p>}
            {networkStatusUnstable && (
              <>
                <p className={classes["warning"]} style={{ color: "#E32323" }}>
                  {t("ez.cash_out_is_not_unavailable")}
                </p>
                <p>{t("ez.try_latter")}</p>
              </>
            )}
            {!networkStatusUnstable && (sameMarketVisible || differentMarketVisible) && <p>{t("ez.same_market")}</p>}
            {!networkStatusUnstable && !minBetsVisible && <p>{t("ez.single_format")}</p>}
            {!networkStatusUnstable && sameMarketVisible && <p>{t("ez.different_market")}</p>}
          </div>
          <div className={cx(classes["modal-footer"], classes["flex-al-center"])}>
            <button className={cx(classes["primary"], classes["confirmation-button"])} type="button" onClick={onClose}>
              {t("ok")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

BetslipErrorModal.propTypes = {
  differentMarketVisible: PropTypes.bool.isRequired,
  minBetsVisible: PropTypes.bool.isRequired,
  networkStatusUnstable: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sameMarketVisible: PropTypes.bool.isRequired,
};

export default React.memo(BetslipErrorModal);
