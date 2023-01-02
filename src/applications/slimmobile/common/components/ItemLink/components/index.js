import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import PropsTypes from "prop-types";
import { Link } from "react-router-dom";

const propTypes = {
  href: PropsTypes.string,
  icon: PropsTypes.string,
  label: PropsTypes.string.isRequired,
  onClick: PropsTypes.func,
  renderIcon: PropsTypes.func,
};
const defaultProps = {
  href: undefined,
  icon: undefined,
  onClick: undefined,
  renderIcon: undefined,
};

const ItemLink = ({ href, icon, label, onClick, renderIcon }) => (
  <Link className={classes["login__item"]} to={href} onClick={onClick}>
    <span className={classes["login__item-icon"]}>
      {renderIcon ? renderIcon() : icon && <i className={classes[icon]} />}
    </span>
    <span className={classes["login__item-text"]}>{label}</span>
  </Link>
);

ItemLink.propTypes = propTypes;
ItemLink.defaultProps = defaultProps;

export default ItemLink;
