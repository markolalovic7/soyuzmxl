import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import PropTypes from "prop-types";
import { memo } from "react";

import { getButtonStyles } from "../utils";

const propTypes = {
  active: PropTypes.string.isRequired,
  onTabClick: PropTypes.func,
  tabs: PropTypes.array.isRequired,
};
const defaultProps = {
  onTabClick: () => {},
};

const HeaderTab = ({ active, onTabClick, tabs }) => (
  <div className={classes["sailing__pins"]}>
    {tabs.map((tab) => (
      <button className={getButtonStyles(tab === active)} key={tab} type="button" onClick={() => onTabClick(tab)}>
        {tab}
      </button>
    ))}
  </div>
);

HeaderTab.propTypes = propTypes;
HeaderTab.defaultProps = defaultProps;

export default memo(HeaderTab);
