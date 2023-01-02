import PropTypes from "prop-types";

import classes from "../../../../../../../../scss/citymobile.module.scss";

const SportSliderItem = ({ activeIndex, icon, index, label, onClick }) => (
  <div
    className={`${classes["sports-slider__item"]} ${
      activeIndex === index ? classes["sports-slider__item_active"] : ""
    }`}
    onClick={onClick}
  >
    <span className={classes["sports-slider__icon"]}>
      <img alt={label} src={icon} />
    </span>
    <span className={classes["sports-slider__text"]}>{label}</span>
  </div>
);

SportSliderItem.propTypes = {
  activeIndex: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SportSliderItem;
