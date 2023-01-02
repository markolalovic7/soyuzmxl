import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import { isEmpty } from "lodash";
import * as PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import { getSportsTreeSelector } from "../../../../../../redux/reselect/sport-tree-selector";
import { getFeaturedLeagueItems } from "../../../../../../utils/navigation-drawer/featured-league";
import classes from "../../../../scss/slimdesktop.module.scss";

const FeaturedLeagueSideWidget = ({ widgetData }) => {
  const history = useHistory();
  const { t } = useTranslation();

  const leagues = widgetData?.featuredLeagues || [];

  const sportTreeData = useSelector(getSportsTreeSelector);
  const sportsTreeLoading = useSelector((state) => state.sportsTree?.loading);

  const featuredLeagues = useMemo(() => {
    if (isEmpty(leagues) || isEmpty(sportTreeData)) {
      return [];
    }

    return getFeaturedLeagueItems(leagues, sportTreeData);
  }, [leagues, sportTreeData]);

  if (isEmpty(sportTreeData) && sportsTreeLoading) {
    return (
      <div className={classes["sidebar__box"]}>
        <div className={classes["box-title"]}>{widgetData.description}</div>
        <div style={{ margin: "10px 0px", textAlign: "center" }}>
          <FontAwesomeIcon className="fa-spin" icon={faCircleNotch} size="lg" />
        </div>
      </div>
    );
  }
  if (!(featuredLeagues?.length > 0)) return null;

  return (
    <div className={classes["sidebar__box"]}>
      <div className={classes["box-title"]}>{widgetData.description}</div>
      <ul className={classes["sidebar__list"]}>
        {featuredLeagues
          .sort((a, b) => a.ordinal - b.ordinal)
          .map((featuredLeague) => (
            <li
              className={classes["sidebar-item"]}
              key={featuredLeague.eventPathId}
              style={{ cursor: "pointer", pointerEvents: "auto" }}
              onClick={() => history.push(`/prematch/eventpath/${featuredLeague.eventPathId}`)}
            >
              <span
                className={cx(
                  classes["qicon-default"],
                  classes[`qicon-${featuredLeague.sportCode.toLowerCase()}`],
                  classes["icon"],
                )}
              />
              <div className={classes["sidebar-item__title"]}>{featuredLeague.eventPathDescription}</div>
              {featuredLeague.live && <span className={classes["sidebar-item__label"]}>{t("live")}</span>}
            </li>
          ))}
      </ul>
    </div>
  );
};

FeaturedLeagueSideWidget.propTypes = {
  widgetData: PropTypes.object.isRequired,
};

export default React.memo(FeaturedLeagueSideWidget);
