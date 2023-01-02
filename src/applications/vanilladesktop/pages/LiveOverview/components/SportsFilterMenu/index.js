import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { getCmsConfigIframeMode } from "../../../../../../redux/reselect/cms-selector";

const FilterIcon = () => (
  <svg height="12" viewBox="0 0 18 12" width="18" xmlns="http://www.w3.org/2000/svg">
    <g>
      <g>
        <path d="M7 10h4v2H7zM18 0v2H0V0zM3 5h12v2H3z" />
      </g>
    </g>
  </svg>
);

const SportsFilterMenu = ({ activeSport, setActiveSport }) => {
  const { t } = useTranslation();
  const europeanDashboardLiveData = useSelector((state) => state.live.liveData["european-dashboard"]);
  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  return (
    <div
      className={cx(classes["left-section"], classes["left-section_overview"], {
        [classes["iframe"]]: isApplicationEmbedded,
      })}
    >
      <div className={classes["live-overview-navigation"]}>
        <div className={classes["live-overview-navigation__label"]}>
          <FilterIcon />
        </div>
        <div className={classes["live-overview-navigation__items"]}>
          <div
            className={cx(classes["live-overview-navigation__item"], { [classes["active"]]: activeSport === "ALL" })}
            onClick={() => setActiveSport("ALL")}
          >
            <span className={classes["live-overview-navigation__text"]}>{t("all")}</span>
          </div>
          {europeanDashboardLiveData &&
            Object.entries(europeanDashboardLiveData).map((entry) => {
              // merge on top of the previous prematch "sports" object
              const sportCode = entry[0];
              if (Object.values(entry[1]).length === 0) return null;

              return (
                <div
                  className={cx(classes["live-overview-navigation__item"], {
                    [classes["active"]]: activeSport === sportCode,
                  })}
                  key={sportCode}
                  onClick={() => setActiveSport(sportCode)}
                >
                  <span className={classes["live-overview-navigation__icon"]}>
                    <i className={cx(classes["qicon-default"], classes[`qicon-${sportCode.toLowerCase()}`])} />
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

const propTypes = {
  activeSport: PropTypes.string.isRequired,
  setActiveSport: PropTypes.func.isRequired,
};
SportsFilterMenu.propTypes = propTypes;

export default React.memo(SportsFilterMenu);
