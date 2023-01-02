import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import { isEmpty } from "lodash";
import * as PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { getSportsTreeSelector } from "../../../../redux/reselect/sport-tree-selector";
import { getFeaturedLeagueItems } from "../../../../utils/navigation-drawer/featured-league";

import FeaturedLeagueMenuItem from "./components/FeaturedLeagueMenuItem";

const FeaturedLeagueMenu = ({ featuredLeagueWidget }) => {
  const { t } = useTranslation();

  const leagues = featuredLeagueWidget?.featuredLeagues || [];

  const sportTreeData = useSelector(getSportsTreeSelector);

  const featuredLeagues = useMemo(() => {
    if (isEmpty(leagues) || isEmpty(sportTreeData)) {
      return [];
    }

    return getFeaturedLeagueItems(leagues, sportTreeData);
  }, [leagues, sportTreeData]);

  return (
    featuredLeagues?.length > 0 && (
      <div className={classes["left-section__item"]}>
        <h3 className={classes["left-section__title"]}>{t("vanilladesktop.featured_leagues")}</h3>
        {featuredLeagues
          .sort((a, b) => a.ordinal - b.ordinal)
          .map((featuredLeague) => (
            <FeaturedLeagueMenuItem
              eventPathId={featuredLeague.eventPathId}
              isLiveBadge={featuredLeague.live}
              key={featuredLeague.eventPathId}
              sportCode={featuredLeague.sportCode}
              title={featuredLeague.eventPathDescription}
            />
          ))}
      </div>
    )
  );
};

FeaturedLeagueMenu.propTypes = {
  featuredLeagueWidget: PropTypes.object.isRequired,
};

export default React.memo(FeaturedLeagueMenu);
