import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import { useOnClickOutside } from "hooks/utils-hooks";
import PropTypes from "prop-types";
import React, { useRef } from "react";

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

const SmsPopup = ({ isOpen, onClose }) => {
  const ref = useRef();
  useOnClickOutside(ref, onClose);

  return (
    <div
      className={cx(classes["popup-sms"], classes["popup"], {
        [classes["open"]]: isOpen,
      })}
      id="popup-sms"
    >
      <div className={classes["popup__body"]}>
        <div className={cx(classes["popup__content"], classes["popup-sms__content"])} ref={ref}>
          <div className={classes["popup-sms__header"]}>
            <div className={classes["popup-sms__title"]}>Bet via SMS</div>
            <span className={cx(classes["popup-sms__close"], classes["close-popup"])} onClick={onClose} />
          </div>
          <div className={classes["popup-sms__information"]}>
            <div className={classes["popup-sms__label"]}>Asian Handicap</div>
            <div className={classes["popup-sms__help"]}>
              <div>Example : ODDS BK 2 -0.5</div>
              <div>To bet via SMS, send to 8888</div>
            </div>
            <div className={classes["popup-sms__bet"]}>
              14530901#
              <span className={cx(classes["popup-sms__text"], classes["popup-sms__text_highlight"])}>1H#HC#0.5#2</span>
              #100
            </div>
            <div className={classes["popup-sms__description"]}>
              (
              <span className={cx(classes["popup-sms__text"], classes["popup-sms__text_underline"])}>
                <span className={cx(classes["popup-sms__text"], classes["popup-sms__text_special"])}>14530901</span> =
                Game ID,
                <span className={cx(classes["popup-sms__text"], classes["popup-sms__text_highlight"])}>
                  1H#HC#-0.5#1
                </span>
                &nbsp; = ODDS BK 2 -0.5,
                <span className={cx(classes["popup-sms__text"], classes["popup-sms__text_special"])}>
                  1H#HC#-0.5#1#100
                </span>
              </span>
              &nbsp; = Bet Amount )
            </div>
            <div className={classes["popup-sms__limit"]}>
              Bet limits applied :
              <span className={cx(classes["popup-sms__text"], classes["popup-sms__text_bold"])}>5 - 1,000</span>
            </div>
            <div className={classes["popup-sms__sublabel"]}>
              <span className={cx(classes["popup-sms__text"], classes["popup-sms__text_bold"])}>Outcomes:</span>
            </div>
            <div className={cx(classes["popup-sms__button"], classes["popup-sms__button_special"])}>
              <span className={cx(classes["popup-sms__text"], classes["popup-sms__text_bold"])}>1H#HC#0.5#2</span>- ODDS
              BK 2 -0.5
            </div>
            <div className={classes["popup-sms__button"]}>
              <span className={cx(classes["popup-sms__text"], classes["popup-sms__text_bold"])}>1H#HC#0.5#2</span>-
              FLORO +0.5
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SmsPopup.propTypes = propTypes;

export default React.memo(SmsPopup);
