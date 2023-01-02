import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import * as PropTypes from "prop-types";
import React, { useState } from "react";

import MenuLink from "../MenuLink";

const SideMenu = ({ menuWidget }) => {
  const [isExpanded, setIsExpanded] = useState({});

  return (
    <div className={classes["left-section__item"]}>
      <h3 className={classes["left-section__title"]}>{menuWidget.description}</h3>
      <ul className={classes["menu-sports__list"]}>
        {menuWidget.children.map((menuItem, index) => (
          <React.Fragment key={index}>
            <li className={classes["menu-sports__item"]}>
              <MenuLink linkEnabled={!(menuItem.children?.length > 0)} navigationData={menuItem.navigationData}>
                <div
                  className={classes["menu-sports__item-content"]}
                  style={{ cursor: menuItem.children?.length > 0 ? "auto" : "pointer" }}
                >
                  <h4 className={classes["menu-sports__item-title"]}>{menuItem.description}</h4>
                  {menuItem.children?.length > 0 && (
                    <span
                      className={cx(classes["menu-sports__item-arrow"], {
                        [classes["active"]]: isExpanded[menuItem.id],
                      })}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setIsExpanded((prevState) => {
                          const newIsExpanded = { ...prevState };
                          if (newIsExpanded[menuItem.id]) {
                            newIsExpanded[menuItem.id] = !newIsExpanded[menuItem.id];
                          } else {
                            newIsExpanded[menuItem.id] = true;
                          }

                          return newIsExpanded;
                        })
                      }
                    />
                  )}
                </div>
              </MenuLink>
              {menuItem.children?.length > 0 && (
                <ul>
                  {menuItem.children.map((childMenuItem, index2) => (
                    <li key={index2}>
                      <MenuLink
                        linkEnabled={!(childMenuItem.children?.length > 0)}
                        navigationData={childMenuItem.navigationData}
                      >
                        <div
                          className={cx(classes["menu-sports__subitem-content"], {
                            [classes["open"]]: isExpanded[menuItem.id],
                          })}
                          style={{ cursor: childMenuItem.children?.length > 0 ? "auto" : "pointer" }}
                        >
                          <h5 className={classes["menu-sports__subitem-title"]}>{childMenuItem.description}</h5>
                          {childMenuItem.children?.length > 0 && (
                            <span
                              className={cx(classes["menu-sports__item-arrow"], {
                                [classes["active"]]: isExpanded[childMenuItem.id],
                              })}
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                setIsExpanded((prevState) => {
                                  const newIsExpanded = { ...prevState };
                                  if (newIsExpanded[childMenuItem.id]) {
                                    newIsExpanded[childMenuItem.id] = !newIsExpanded[childMenuItem.id];
                                  } else {
                                    newIsExpanded[childMenuItem.id] = true;
                                  }

                                  return newIsExpanded;
                                })
                              }
                            />
                          )}
                        </div>
                      </MenuLink>
                      {childMenuItem.children?.length > 0 && (
                        <ul>
                          {childMenuItem.children.map((grandChildMenuItem, index3) => (
                            <li key={index3}>
                              <MenuLink linkEnabled navigationData={grandChildMenuItem.navigationData}>
                                <div
                                  className={cx(classes["menu-sports__subsubitem-content"], {
                                    [classes["open"]]: isExpanded[childMenuItem.id],
                                  })}
                                  style={{ cursor: "pointer" }}
                                >
                                  <span className={classes["menu-sports__subsubitem-title"]}>
                                    {grandChildMenuItem.description}
                                  </span>
                                </div>
                              </MenuLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

SideMenu.propTypes = {
  menuWidget: PropTypes.object.isRequired,
};

export default React.memo(SideMenu);
