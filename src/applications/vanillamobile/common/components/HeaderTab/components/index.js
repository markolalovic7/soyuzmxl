import PropTypes from "prop-types";

import { getButtonStyles } from "../utils";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const propTypes = {
  active: PropTypes.string.isRequired,
  onTabClick: PropTypes.func,
  tabs: PropTypes.array.isRequired,
};
const defaultProps = {
  onTabClick: () => {},
};

const HeaderTab = ({ active, onTabClick, tabs }) => (
  <div className={classes["navigation__buttons"]}>
    {tabs.map((tab) => (
      <button className={getButtonStyles(tab === active)} key={tab} type="button" onClick={() => onTabClick(tab)}>
        {tab}
      </button>
    ))}
  </div>
);

HeaderTab.propTypes = propTypes;
HeaderTab.defaultProps = defaultProps;

export default HeaderTab;
