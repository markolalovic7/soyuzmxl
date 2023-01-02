import cx from "classnames";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

import { getCmsLayoutDesktopHeaderMenuWidget } from "../../../../../../redux/reselect/cms-layout-widgets";
import classes from "../../../../scss/slimdesktop.module.scss";

import HeaderCarousel from "./components/HeaderCarousel";
import HeaderMenuItem from "./components/HeaderMenuItem";
import SubHeaderMenuItem from "./components/SubHeaderMenuItem";

const NavigationMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();
  const headerWidget = useSelector((state) => getCmsLayoutDesktopHeaderMenuWidget(state, location));

  return (
    <nav className={classes["navigation"]}>
      <ul className={classes["navigation__list"]}>
        {headerWidget?.children?.slice(0, 3)?.map((menu, index) => {
          if (!index) {
            // we place ALL children here...
            return (
              <HeaderMenuItem key={menu.id} menuItem={menu} setIsMenuOpen={setIsMenuOpen}>
                <div
                  className={cx(classes["navigation-submenu"], { [classes["open"]]: isMenuOpen })}
                  style={{ visibility: isMenuOpen ? "visible" : "hidden" }}
                >
                  <div className={classes["navigation-submenu__inner"]}>
                    {headerWidget.children?.slice(0, 3)?.map((headerMenuItem) => (
                      <div className={classes["navigation-submenu__box"]} key={headerMenuItem.id}>
                        <ul className={classes["navigation-submenu__list"]}>
                          {headerMenuItem.children?.map((childMenuItem) => (
                            <SubHeaderMenuItem
                              key={childMenuItem.id}
                              menuItem={childMenuItem}
                              setIsMenuOpen={setIsMenuOpen}
                            />
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className={classes["navigation-submenu__box"]}>
                      <HeaderCarousel />
                    </div>
                  </div>
                </div>
              </HeaderMenuItem>
            );
          }

          return <HeaderMenuItem key={menu.id} menuItem={menu} setIsMenuOpen={setIsMenuOpen} />;
        })}

        {/* <li className={classes["navigation__list-item"]}> */}
        {/*  <a className={classes["navigation__link"]}>Game center</a> */}
        {/*  <div className={classes["navigation-submenu"]} style={{ visibility: isMenuOpen ? "visible" : "hidden" }}> */}
        {/*    <div className={classes["navigation-submenu__inner"]}> */}
        {/*      <div className={classes["navigation-submenu__box"]}> */}
        {/*        <ul className={classes["navigation-submenu__list"]}> */}
        {/*          <li className={classes["navigation-submenu__item"]}> */}
        {/*            <a className={classes["navigation-submenu__link"]} href="#"> */}
        {/*              Sports */}
        {/*            </a> */}
        {/*          </li> */}
        {/*          <li className={classes["navigation-submenu__item"]}> */}
        {/*            <a className={classes["navigation-submenu__link"]} href="#"> */}
        {/*              Live Sports */}
        {/*            </a> */}
        {/*          </li> */}
        {/*          <li className={classes["navigation-submenu__item"]}> */}
        {/*            <a className={classes["navigation-submenu__link"]} href="#"> */}
        {/*              Live Calendar */}
        {/*            </a> */}
        {/*          </li> */}
        {/*          <li className={classes["navigation-submenu__item"]}> */}
        {/*            <a className={classes["navigation-submenu__link"]} href="#"> */}
        {/*              Sports Results */}
        {/*            </a> */}
        {/*          </li> */}
        {/*          <li className={classes["navigation-submenu__item"]}> */}
        {/*            <a className={classes["navigation-submenu__link"]} href="#"> */}
        {/*              Betradar Virtuals */}
        {/*            </a> */}
        {/*          </li> */}
        {/*          <li className={classes["navigation-submenu__item"]}> */}
        {/*            <a className={classes["navigation-submenu__link"]} href="#"> */}
        {/*              Kiron Virtuals */}
        {/*            </a> */}
        {/*          </li> */}
        {/*          <li className={classes["navigation-submenu__item"]}> */}
        {/*            <a className={classes["navigation-submenu__link"]} href="#"> */}
        {/*              Microgaming Casino */}
        {/*            </a> */}
        {/*          </li> */}
        {/*          <li className={classes["navigation-submenu__item"]}> */}
        {/*            <a className={classes["navigation-submenu__link"]} href="#"> */}
        {/*              Solid Gaming Casino */}
        {/*            </a> */}
        {/*          </li> */}
        {/*        </ul> */}
        {/*      </div> */}
        {/*      <div className={classes["navigation-submenu__box"]}> */}
        {/*        <ul className={classes["navigation-submenu__list"]}> */}
        {/*          <li className={classes["navigation-submenu__item"]}> */}
        {/*            <a className={classes["navigation-submenu__link"]} href="#"> */}
        {/*              Tutorial Video */}
        {/*            </a> */}
        {/*          </li> */}
        {/*          <li className={classes["navigation-submenu__item"]}> */}
        {/*            <a className={classes["navigation-submenu__link"]} href="#"> */}
        {/*              How to Bet */}
        {/*            </a> */}
        {/*          </li> */}
        {/*          <li className={classes["navigation-submenu__item"]}> */}
        {/*            <a className={classes["navigation-submenu__link"]} href="#"> */}
        {/*              How to Deposit */}
        {/*            </a> */}
        {/*          </li> */}
        {/*          <li className={classes["navigation-submenu__item"]}> */}
        {/*            <a className={classes["navigation-submenu__link"]} href="#"> */}
        {/*              How to Withdraw */}
        {/*            </a> */}
        {/*          </li> */}
        {/*        </ul> */}
        {/*      </div> */}
        {/*      <div className={classes["navigation-submenu__box"]}> */}
        {/*        <ul className={classes["navigation-submenu__list"]}> */}
        {/*          <li className={classes["navigation-submenu__item"]}> */}
        {/*            <a className={classes["navigation-submenu__link"]} href="#"> */}
        {/*              Bet Calculator */}
        {/*            </a> */}
        {/*          </li> */}
        {/*          <li className={classes["navigation-submenu__item"]}> */}
        {/*            <a className={classes["navigation-submenu__link"]} href="#"> */}
        {/*              FAQs */}
        {/*            </a> */}
        {/*          </li> */}
        {/*          <li className={classes["navigation-submenu__item"]}> */}
        {/*            <a className={classes["navigation-submenu__link"]} href="#"> */}
        {/*              Contact Us */}
        {/*            </a> */}
        {/*          </li> */}
        {/*          <li className={classes["navigation-submenu__item"]}> */}
        {/*            <a className={classes["navigation-submenu__link"]} href="#"> */}
        {/*              About Us */}
        {/*            </a> */}
        {/*          </li> */}
        {/*          <li className={classes["navigation-submenu__item"]}> */}
        {/*            <a className={classes["navigation-submenu__link"]} href="#"> */}
        {/*              Terms and Conditions */}
        {/*            </a> */}
        {/*          </li> */}
        {/*          <li className={classes["navigation-submenu__item"]}> */}
        {/*            <a className={classes["navigation-submenu__link"]} href="#"> */}
        {/*              Privacy Policy */}
        {/*            </a> */}
        {/*          </li> */}
        {/*        </ul> */}
        {/*      </div> */}
        {/*      <div className={classes["navigation-submenu__box"]}> */}
        {/*        <div className={classes["navigation-submenu__slider"]}> */}
        {/*          <div className={classes["navigation-slider"]}> */}
        {/*            <div> */}
        {/*              <img alt="text" src={NavSliderImage} /> */}
        {/*            </div> */}
        {/*            <div> */}
        {/*              <img alt="text" src={NavSliderImage} /> */}
        {/*            </div> */}
        {/*            <div> */}
        {/*              <img alt="text" src={NavSliderImage} /> */}
        {/*            </div> */}
        {/*            <div> */}
        {/*              <img alt="text" src={NavSliderImage} /> */}
        {/*            </div> */}
        {/*            <div> */}
        {/*              <img alt="text" src={NavSliderImage} /> */}
        {/*            </div> */}
        {/*          </div> */}
        {/*        </div> */}
        {/*      </div> */}
        {/*      <div className={classes["navigation-submenu__box"]}> */}
        {/*        <ul className={classes["navigation-submenu__list"]}> */}
        {/*          <li className={classes["navigation-submenu__item"]}> */}
        {/*            <a className={classes["navigation-submenu__link"]} href="#"> */}
        {/*              My statements */}
        {/*            </a> */}
        {/*          </li> */}
        {/*          <li className={classes["navigation-submenu__item"]}> */}
        {/*            <a className={classes["navigation-submenu__link"]} href="#"> */}
        {/*              Deposit */}
        {/*            </a> */}
        {/*          </li> */}
        {/*          <li className={classes["navigation-submenu__item"]}> */}
        {/*            <a className={classes["navigation-submenu__link"]} href="#"> */}
        {/*              Withdraw */}
        {/*            </a> */}
        {/*          </li> */}
        {/*        </ul> */}
        {/*      </div> */}
        {/*    </div> */}
        {/*  </div> */}
        {/* </li> */}
        {/* <li className={classes["navigation__list-item"]}> */}
        {/*  <div className={classes["navigation__link"]} href="#"> */}
        {/*    Tutorial */}
        {/*  </div> */}
        {/* </li> */}
        {/* <li className={classes["navigation__list-item"]}> */}
        {/*  <div className={classes["navigation__link"]} href="#"> */}
        {/*    Service */}
        {/*  </div> */}
        {/* </li> */}
      </ul>
    </nav>
  );
};

export default React.memo(NavigationMenu);
