import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

export function getButtonStyles(isActive) {
  return `${classes["settled-navigation__item"]} ${isActive ? classes["settled-navigation__item_active"] : "none"}`;
}
