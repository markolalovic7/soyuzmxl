import * as PropTypes from "prop-types";

import classes from "../../../../../../../scss/vanillamobilestyle.module.scss";

const CashoutConfirmationPopUp = ({ cashoutConfirmed, onClick }) => (
  <div
    className={`${classes["bet-popup"]} ${classes["bet-popup_success"]} ${cashoutConfirmed ? classes["active"] : ""}`}
  >
    <div className={classes["bet-popup__body"]}>
      <div className={classes["bet-popup__content"]}>
        <div className={classes["bet-popup__header"]}>
          <h3>Success</h3>
        </div>
        <div className={classes["bet-popup__main"]}>
          <div className={classes["bet-popup__result"]}>
            <span>Transaction completed</span>
          </div>
          <p className={classes["bet-popup__text"]}>Your bet has been successfully cashed out</p>
          <div className={classes["bet-popup__buttons"]}>
            <button className={classes["bet-popup__button"]} onClick={onClick}>
              {" "}
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

CashoutConfirmationPopUp.propTypes = {
  cashoutConfirmed: PropTypes.any.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CashoutConfirmationPopUp;
