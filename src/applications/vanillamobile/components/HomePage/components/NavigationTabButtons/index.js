import PropTypes from "prop-types";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { getHomeTabTranslated } from "../../utils";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const propTypes = {
  selectedTab: PropTypes.string,
  setSelectedTab: PropTypes.func.isRequired,
  tabs: PropTypes.array,
};

const defaultProps = {
  selectedTab: undefined,
  tabs: [],
};

const NavigationTabButtons = ({ selectedTab, setSelectedTab, tabs }) => {
  const { t } = useTranslation();

  return (
    <div className={classes["navigation__buttons"]}>
      {tabs.map((tab) => (
        <button
          className={`${classes["navigation__button"]} ${
            selectedTab === tab ? classes["navigation__button_active"] : ""
          }`}
          key={tab}
          type="button"
          onClick={() => setSelectedTab(tab)}
        >
          {getHomeTabTranslated(tab, t)}
        </button>
      ))}
    </div>
  );
};

NavigationTabButtons.propTypes = propTypes;
NavigationTabButtons.defaultProps = defaultProps;

export default memo(NavigationTabButtons);
