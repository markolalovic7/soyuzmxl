import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

import {
  CMS_LAYOUT_WIDGET_TYPE_BANNER_ADS,
  CMS_LAYOUT_WIDGET_TYPE_CAROUSEL_BANNER,
  CMS_LAYOUT_WIDGET_TYPE_IFRAME,
} from "../../../../constants/cms-layout-widget-types";
import { getCmsLayoutDesktopWidgetsTopCentralColumn } from "../../../../redux/reselect/cms-layout-widgets";
import classes from "../../scss/vanilladesktop.module.scss";
import BannerAds from "../BannerAds";
import CarouselBanner from "../CarouselBanner";
import IFrameMenu from "../IFrameMenu";

const CentralColumnWidgets = () => {
  const location = useLocation();
  const widgets = useSelector((state) => getCmsLayoutDesktopWidgetsTopCentralColumn(state, location));

  return (
    <div className={classes["top-section"]}>
      <div className={classes["top-section__content"]}>
        {widgets?.map((widget, index) => {
          if (widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_BANNER_ADS) {
            return (
              <BannerAds
                bannerAdWidget={widget?.data}
                containerClassName="top-section__item"
                key={index}
                titleClassName="top-section__title"
              />
            );
          }

          if (widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_CAROUSEL_BANNER) {
            return (
              <CarouselBanner
                carouselWidget={widget?.data}
                containerClassName="top-section__item"
                key={index}
                titleClassName="top-section__title"
              />
            );
          }

          if (widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_IFRAME) {
            return (
              <IFrameMenu
                containerClassName="top-section__item"
                iFrameWidget={widget?.data}
                key={index}
                titleClassName="top-section__title"
              />
            );
          }

          return undefined;
        })}
      </div>
    </div>
  );
};

export default React.memo(CentralColumnWidgets);
