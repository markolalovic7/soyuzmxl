import PropsTypes from "prop-types";
import { Link } from "react-router-dom";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const propTypes = {
  href: PropsTypes.string,
  icon: PropsTypes.string.isRequired,
  label: PropsTypes.string.isRequired,
  onClick: PropsTypes.func,
};
const defaultProps = {
  href: undefined,
  onClick: undefined,
};

const ItemLink = ({ href, icon, label, onClick }) => (
  <Link className={classes["login__item"]} to={href} onClick={onClick}>
    <span className={classes["login__item-icon"]}>
      <i className={classes[icon]} />
    </span>
    <span className={classes["login__item-text"]}>{label}</span>
  </Link>
);

ItemLink.propTypes = propTypes;
ItemLink.defaultProps = defaultProps;

export default ItemLink;
