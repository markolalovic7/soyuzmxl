import cx from "classnames";
import * as PropTypes from "prop-types";
import React from "react";

import classes from "../../../../scss/slimdesktop.module.scss";

import MenuLink from "./components/MenuLink";

const MenuSideWidget = ({ widgetData }) => (
  <div className={classes["sidebar__box"]}>
    <div className={classes["box-title"]}>{widgetData.description}</div>

    <ul className={classes["sidebar__list"]}>
      {widgetData.children.map((menuItem, index) => {
        if (menuItem?.children?.length > 0) return null; // we only tolerate top level links

        return (
          <li className={cx(classes["sidebar-dropdown"])} key={index}>
            <MenuLink linkEnabled={!(menuItem.children?.length > 0)} navigationData={menuItem.navigationData}>
              <div className={cx(classes["sidebar-item"], classes["sidebar-item--with-counter"])}>
                <div className={classes["sidebar-item__title"]}>{menuItem.description}</div>
              </div>
            </MenuLink>
          </li>
        );
      })}
    </ul>
  </div>
);

MenuSideWidget.propTypes = {
  widgetData: PropTypes.object.isRequired,
};

export default React.memo(MenuSideWidget);
