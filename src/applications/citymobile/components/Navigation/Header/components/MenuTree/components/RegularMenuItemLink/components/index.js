import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import classes from "../../../../../../../../scss/citymobile.module.scss";

const RegularMenuItemLink = ({ bold, count, label, onClick, path, subLabel }) => (
  <Link className={classes["menu__item"]} to={path} onClick={onClick}>
    <h3 className={`${classes["menu__title"]} ${bold ? classes["menu__title-bold"] : ""}`}>{label}</h3>
    {count ? <span className={classes["menu__number"]}>{count}</span> : null}
    {subLabel ? <span className={classes["menu__link"]}>{subLabel}</span> : null}
  </Link>
);

RegularMenuItemLink.propTypes = {
  bold: PropTypes.bool,
  count: PropTypes.number,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  subLabel: PropTypes.string,
};

RegularMenuItemLink.defaultProps = {
  bold: undefined,
  count: undefined,
  subLabel: undefined,
};

export default RegularMenuItemLink;
