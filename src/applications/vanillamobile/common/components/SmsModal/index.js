import PropTypes from "prop-types";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const propTypes = {
  onBackdropClick: PropTypes.func.isRequired,
};
const defaultProps = {};

const SmsModal = ({ onBackdropClick }) => (
  <div className={`${classes["phone-popup"]} ${classes["active"]}`}>
    <div className={classes["phone-popup__body"]} onClick={onBackdropClick}>
      <div className={classes["phone-popup__content"]}>
        <div className={classes["phone-popup__container"]}>
          <div className={classes["phone-popup__header"]}>
            <h4 className={classes["phone-popup__title"]}>Bet via SMS</h4>
            <span className={classes["phone-popup__close"]} onClick={onBackdropClick} />
          </div>
          <form action="#" className={classes["phone-popup__form"]}>
            <div className={classes["phone-popup__row"]}>
              <div className={classes["phone-popup__select"]}>
                <select id="" name="sms">
                  <option value="888">888</option>
                  <option value="999">999</option>
                  <option value="000">000</option>
                </select>
                <span className={classes["phone-popup__triangle"]} />
              </div>
              <button className={classes["phone-popup__arrow"]} type="button">
                <i className={classes["qicon-send"]} />
              </button>
            </div>
            <div className={classes["phone-popup__example"]}>
              <span>Example : ODDS BK 2 -0.5</span>
              <span>To bet via SMS, send to 8888</span>
            </div>
            <div className={classes["phone-popup__numbers"]}>
              {`${20978500}# `}
              <span className={classes["phone-popup__text-red"]}>1</span>
              {`#${100}`}
            </div>
            <div className={classes["phone-popup__description"]}>
              <span className={classes["phone-popup__text-highlighted"]}>{`${20978500}`}</span>
              {` = Game ID, `}
              <span className={classes["phone-popup__text-red"]}>1</span>
              {` = Kongsvinger IL Fotball,`}
              <span className={classes["phone-popup__text-highlighted"]}>{100}</span>
              {` = Bet Amount) Bet limits applied :`}
              <span className={classes["phone-popup__text-bold"]}>5 - 1,000</span>
            </div>
            <h5 className={classes["phone-popup__label"]}>Outcomes:</h5>
            <button
              className={`${classes["phone-popup__button"]} ${classes["phone-popup__button_active"]}`}
              type="button"
            >
              1 - Kongsvinger IL Fotball
            </button>
            <button className={classes["phone-popup__button"]} type="button">
              X - Draw
            </button>
            <button className={classes["phone-popup__button"]} type="button">
              2 - Molde FK
            </button>
            <button className={classes["phone-popup__submit"]} type="button">
              Ok
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
);

SmsModal.propTypes = propTypes;
SmsModal.defaultProps = defaultProps;

export default SmsModal;
