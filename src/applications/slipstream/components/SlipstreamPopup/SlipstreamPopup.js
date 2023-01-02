import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/slipstream/scss/slipstream.module.scss";
import cx from "classnames";

const SlipstreamPopup = ({ headerText, onClose, text }) => (
  <div className={cx(classes["popup"], { [classes["open"]]: true })} id="popup-validate">
    <div className={classes["popup__body"]}>
      <div className={classes["popup__content"]}>
        <div className={classes["popup__title"]}>{headerText}</div>
        <div className={classes["popup__box"]}>
          <div className={classes["popup__notification"]}>
            <FontAwesomeIcon icon={faInfoCircle} />
            <span>{text}</span>
          </div>
        </div>
        <div className={classes["popup__buttons"]}>
          <div className={classes["popup__button"]} onClick={onClose}>
            ok
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SlipstreamPopup;
