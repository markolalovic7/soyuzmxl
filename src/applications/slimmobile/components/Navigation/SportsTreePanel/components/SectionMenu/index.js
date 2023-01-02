import PropTypes from "prop-types";
import { isNotEmpty } from "utils/lodash";

import classes from "../../styles/index.module.scss";
import SectionMenuLink from "../SectionMenuLink";

const propTypes = {
  menuItems: PropTypes.array,
  menuTitle: PropTypes.string.isRequired,
  onCloseSportsTree: PropTypes.func.isRequired,
};

const defaultProps = {
  menuItems: [],
};

const SectionMenu = ({ menuItems, menuTitle, onCloseSportsTree }) =>
  isNotEmpty(menuItems) && (
    <>
      <h2 className={classes["section_menu_title"]}>{menuTitle}</h2>
      <ul className={classes["link_menu_wrapper"]}>
        {menuItems.map((item) => (
          <SectionMenuLink
            key={item.id}
            navigationData={item.navigationData}
            subItems={item.children}
            title={item.description}
            onClick={onCloseSportsTree}
          />
        ))}
      </ul>
    </>
  );

SectionMenu.propTypes = propTypes;
SectionMenu.defaultProps = defaultProps;

export default SectionMenu;
