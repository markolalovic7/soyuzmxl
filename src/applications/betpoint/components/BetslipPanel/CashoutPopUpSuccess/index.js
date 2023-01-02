import cx from "classnames";
import React from "react";
import { useDispatch } from "react-redux";

import { clearCashoutState } from "../../../../../redux/slices/cashoutSlice";
import classes from "../../../scss/betpoint.module.scss";

const CashoutPopUpSuccess = () => {
  const dispatch = useDispatch();

  return (
    <div className={cx(classes["betslip-popup"], classes["open"])}>
      <div className={classes["betslip-popup__body"]}>
        <div className={classes["betslip-popup__content"]}>
          <div className={classes["betslip-popup__header"]}>
            <h5 className={classes["betslip-popup__title"]}>Success</h5>
          </div>
          <div className={classes["betslip-popup__message"]}>
            <div className={classes["betslip-popup__transaction"]}>
              <svg
                height="24"
                version="1.1"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" />
              </svg>
              <span>Cash Out Completed.</span>
            </div>
            <div className={classes["betslip-popup__text"]}>Cashout Bet Successfully.</div>
          </div>
          <div className={classes["betslip-popup__buttons"]}>
            <div
              className={cx(classes["betslip-popup__button"], classes["betslip-popup-closer"])}
              onClick={() => dispatch(clearCashoutState())}
            >
              Ok
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CashoutPopUpSuccess);
