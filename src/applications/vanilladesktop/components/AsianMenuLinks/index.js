import cx from "classnames";

import classes from "../../scss/vanilladesktop.module.scss";
import MenuLink from "../MenuLink";

const AsianMenuLinks = ({ active, menuWidget }) => (
  <div
    className={cx(classes["asian-menu__links"], {
      [classes["active"]]: active,
    })}
  >
    <div className={classes["left-section__cards"]}>
      {menuWidget.data.children.map((menuItem, index) => {
        if (menuItem.children?.length > 0) return null; // we don't support anything with more than one level for Asian links

        return (
          <MenuLink
            key={menuItem.id}
            linkEnabled={!(menuItem.children?.length > 0)}
            navigationData={menuItem.navigationData}
          >
            <div className={classes["left-section__card"]} key={index}>
              <span className={classes["left-section__text"]}>{menuItem.description}</span>
            </div>
          </MenuLink>
        );
      })}
    </div>
  </div>
);

export default AsianMenuLinks;
