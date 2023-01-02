import PropTypes from "prop-types";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import useScrollLock from "use-scroll-lock";

import { getAuthIsIframe } from "../../../../../../../../redux/reselect/auth-selector";
import DotIcon from "../../../../../../img/icons/sports-icons/dots.png";
import GamingIcon from "../../../../../../img/icons/sports-icons/gaming.svg";
import LiveIcon from "../../../../../../img/icons/sports-icons/live_betting.svg";
import SportIcon from "../../../../../../img/icons/sports-icons/sports.svg";
import classes from "../../../../../../scss/citymobile.module.scss";

import DotMenuItems from "./DotMenuItems";
import GamingMenuItems from "./GamingMenuItems";
import InPlayMenuItems from "./InPlayMenuItems";
import SportMenuItems from "./SportMenuItems";
import SportSliderItem from "./SportSliderItem";

const MenuTree = ({ navigationTreeOpen, setNavigationTreeOpen }) => {
  const { t } = useTranslation();

  const isIframe = useSelector(getAuthIsIframe);

  const [menuIndex, setMenuIndex] = useState(1);
  const [menuMaxHeight, setMenuMaxHeight] = useState(10000000000000);

  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setNavigationTreeOpen(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener(
      "message",
      (event) => {
        const data = event.data || {};

        if (data.action === "app.parent_frame_height") {
          // console.log("Parent frame height updated");
          setMenuMaxHeight(Number(data.value) - 40); // 68 being the nobbaggu header, no allocation made for our own header
        }
      },
      false,
    );
  }, []); // never re-add

  // Never do this when in iframe mode. It is not required when in iframe mode (as we supress scrolls and delegate scrolling on the parent frame),
  // plus it causes unpredictable side effects (scrolls stop working or freeze)
  useScrollLock(!isIframe && navigationTreeOpen); // lock / unlock the scroll. Use the data-scroll-lock-scrollable attribute on whatever element you want to enable scrolling

  return (
    <aside
      data-scroll-lock-scrollable
      className={`${classes["mobile-sidebar"]} ${navigationTreeOpen ? classes["is-active"] : ""}`}
      onClick={onBackdropClick}
    >
      <div
        data-scroll-lock-scrollable
        className={`${classes["mobile-sidebar__wrapper"]} ${navigationTreeOpen ? classes["is-active"] : ""}`}
        style={{ maxHeight: menuMaxHeight - 30 }}
      >
        <div className={`${classes["sports-slider"]} ${classes["sports-slider_menu"]}`}>
          <SportSliderItem
            activeIndex={menuIndex}
            icon={SportIcon}
            index={1}
            label={t("sports")}
            onClick={() => setMenuIndex(1)}
          />
          <SportSliderItem
            activeIndex={menuIndex}
            icon={LiveIcon}
            index={2}
            label={t("in_play_page")}
            onClick={() => setMenuIndex(2)}
          />
          <SportSliderItem
            activeIndex={menuIndex}
            icon={GamingIcon}
            index={3}
            label={t("gaming")}
            onClick={() => setMenuIndex(3)}
          />
          <SportSliderItem
            activeIndex={menuIndex}
            icon={DotIcon}
            index={4}
            label={t("more")}
            onClick={() => setMenuIndex(4)}
          />
        </div>
        <div data-scroll-lock-scrollable className={classes["menu"]} style={{ overflowY: "auto" }}>
          <div data-scroll-lock-scrollable className={classes["menu__container"]} style={{ overflowY: "auto" }}>
            {menuIndex === 1 ? <SportMenuItems onClick={() => setNavigationTreeOpen(false)} /> : null}
            {menuIndex === 2 ? <InPlayMenuItems onClick={() => setNavigationTreeOpen(false)} /> : null}
            {menuIndex === 3 ? <GamingMenuItems onClick={() => setNavigationTreeOpen(false)} /> : null}
            {menuIndex === 4 ? <DotMenuItems onClick={() => setNavigationTreeOpen(false)} /> : null}
          </div>
        </div>
      </div>
    </aside>
  );
};

const propTypes = {
  navigationTreeOpen: PropTypes.bool.isRequired,
  setNavigationTreeOpen: PropTypes.func.isRequired,
};

const defaultProps = {};

MenuTree.propTypes = propTypes;
MenuTree.defaultProps = defaultProps;

export default MenuTree;
