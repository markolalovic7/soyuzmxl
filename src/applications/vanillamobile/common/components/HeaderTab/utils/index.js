import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

export const getButtonStyles = (isActive) =>
  `${classes["navigation__button"]} ${
    isActive ? classes["navigation__button_dark-active"] : classes["navigation__button_dark"]
  }`;
