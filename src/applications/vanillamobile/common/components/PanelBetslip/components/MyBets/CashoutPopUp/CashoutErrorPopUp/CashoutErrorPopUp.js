import * as PropTypes from "prop-types";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const propTypes = {
  cashoutError: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const defaultProps = {};

const CashoutErrorPopUp = ({ cashoutError, onClick }) => (
  <div className={`${classes["bet-popup"]} ${classes["bet-popup_error"]} ${cashoutError ? classes["active"] : ""}`}>
    <div className={classes["bet-popup__body"]}>
      <div className={classes["bet-popup__content"]}>
        <div className={classes["bet-popup__header"]}>
          <h3>Unable to cashout your bet</h3>
        </div>
        <div className={classes["bet-popup__main"]}>
          <div className={classes["bet-popup__result"]}>
            <span>Unable to cashout your bet. Please try again.</span>
          </div>
          <div className={classes["bet-popup__buttons"]}>
            <button className={classes["bet-popup__button"]} type="button" onClick={onClick}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

CashoutErrorPopUp.propTypes = propTypes;
CashoutErrorPopUp.defaultProps = defaultProps;

export default CashoutErrorPopUp;
