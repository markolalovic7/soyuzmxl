import PropTypes from "prop-types";

import classes from "../../../../../../../../scss/citymobile.module.scss";

const ExternalMenuItemLink = ({ bold, count, inner, label, onClick, path, subLabel }) => {
  const navigateToPath = () => {
    onClick();
    if (!inner) {
      // Navigate top frame (parent)
      window.top.location.href = path;
    } else {
      window.location.href = path;
    }
  };

  return (
    <div className={classes["menu__item"]} onClick={navigateToPath}>
      <h3 className={`${classes["menu__title"]} ${bold ? classes["menu__title-bold"] : ""}`}>{label}</h3>
      {count ? <span className={classes["menu__number"]}>{count}</span> : null}
      {subLabel ? <span className={classes["menu__link"]}>{subLabel}</span> : null}
    </div>
  );
};

ExternalMenuItemLink.propTypes = {
  bold: PropTypes.bool,
  count: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  subLabel: PropTypes.string,
};

ExternalMenuItemLink.defaultProps = {
  bold: undefined,
  subLabel: undefined,
};

export default ExternalMenuItemLink;
