import PropTypes from "prop-types";

import SectionMenuLink from "../SectionMenuLink";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { isNotEmpty } from "utils/lodash";

const propTypes = {
  menuItems: PropTypes.array,
  menuTitle: PropTypes.string.isRequired,
  onPanelClose: PropTypes.func.isRequired,
};

const defaultProps = {
  menuItems: [],
};

const SectionMenu = ({ menuItems, menuTitle, onPanelClose }) =>
  isNotEmpty(menuItems) && (
    <>
      <h2 className={classes["overlay-burger__heading"]}>{menuTitle}</h2>
      <ul className={classes["overlay-burger__list"]}>
        {menuItems.map((item) => (
          <SectionMenuLink
            key={item.id}
            navigationData={item.navigationData}
            subItems={item.children}
            title={item.description}
            onClick={onPanelClose}
          />
        ))}
      </ul>
    </>
  );

SectionMenu.propTypes = propTypes;
SectionMenu.defaultProps = defaultProps;

export default SectionMenu;
