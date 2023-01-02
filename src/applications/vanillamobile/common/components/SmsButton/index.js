import { useCallback, useState } from "react";

import SmsModal from "../SmsModal";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const SmsButton = () => {
  const [show, setShow] = useState(false);

  const onSmsHideHandler = useCallback((event) => {
    if (event.target === event.currentTarget) {
      setShow(false);
    }
  }, []);

  return (
    <>
      <button
        className={`${classes["bet__icon"]} ${classes["icon-dialog"]}`}
        type="button"
        onClick={() => {
          setShow(true);
        }}
      >
        <i className={classes["qicon-sms-bet"]} />
      </button>
      {show && <SmsModal onBackdropClick={onSmsHideHandler} />}
    </>
  );
};

export default SmsButton;
