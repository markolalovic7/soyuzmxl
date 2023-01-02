import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import { getCmsConfigIframeMode } from "../../../../../../../../../redux/reselect/cms-selector";
import { getSportsSelector } from "../../../../../../../../../redux/reselect/sport-selector";

const AfricanLiveLeftColumn = ({ sportCode }) => {
  const history = useHistory();
  const { t } = useTranslation();

  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);
  const africanDashboardLiveData = useSelector((state) => state.live.liveData["african-dashboard"]);
  const sports = useSelector(getSportsSelector);

  const liveSports = africanDashboardLiveData
    ? Object.entries(africanDashboardLiveData)
        .map((sportEntry) => ({ count: Object.keys(sportEntry[1]).length, sportCode: sportEntry[0] }))
        .filter((sportEntry) => sportEntry.count > 0)
    : [];

  // Mark the first available sport for display
  useEffect(() => {
    if (!sportCode && africanDashboardLiveData && Object.keys(africanDashboardLiveData).length > 0) {
      const sport = Object.keys(africanDashboardLiveData)[0];
      history.push(`/live/sport/${sport}`);
    }
  }, [sportCode, africanDashboardLiveData]);

  return (
    <div className={cx(classes["left-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
      <div className={classes["left-section__content"]}>
        <div className={classes["left-section__item"]}>
          <h3 className={classes["left-section__title"]}>{t("sports")}</h3>
          <div className={classes["menu-sports"]}>
            <ul className={classes["menu-sports__list"]}>
              {liveSports?.map((sportEntry) => {
                const sportKey = sportEntry.sportCode;
                const sportMatchCount = sportEntry.count;

                return (
                  <li className={classes["menu-sports__item"]} key={sportKey}>
                    <div
                      className={cx(classes["menu-sports__item-content"], classes["accordion"], {
                        [classes["active"]]: sportKey === sportCode,
                      })}
                      onClick={() => {
                        history.push(`/live/sport/${sportKey}`);
                      }}
                    >
                      <span className={classes["menu-sports__item-icon"]}>
                        <span className={cx(classes["qicon-default"], classes[`qicon-${sportKey.toLowerCase()}`])} />
                      </span>
                      <h4 className={classes["menu-sports__item-title"]}>
                        {sports ? sports[sportKey].description : ""}
                      </h4>
                      <span className={classes["menu-sports__item-numbers"]}>{sportMatchCount}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const propTypes = {
  sportCode: PropTypes.string,
};
const defaultProps = {
  sportCode: undefined,
};

AfricanLiveLeftColumn.propTypes = propTypes;
AfricanLiveLeftColumn.defaultProps = defaultProps;

export default React.memo(AfricanLiveLeftColumn);
