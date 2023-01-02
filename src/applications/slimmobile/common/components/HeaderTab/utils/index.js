import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";

export const getButtonStyles = (isActive) =>
  `${classes["sailing__pin"]} ${isActive ? classes["sailing__pin_dark-active"] : classes["sailing__pin_dark"]}`;
