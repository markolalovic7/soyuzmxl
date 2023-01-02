import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { getSportsTreeSelector } from "redux/reselect/sport-tree-selector";
import { isNotEmpty } from "utils/lodash";
import { getFeaturedLeagueItems } from "utils/navigation-drawer/featured-league";

import classes from "../../styles/index.module.scss";

import SectionFeaturedLeagueLink from "./components/SectionFeaturedLeagueLink";

const propTypes = {
  featuredLeagueItems: PropTypes.array,
  featuredLeagueTitle: PropTypes.string.isRequired,
  onCloseSportsTree: PropTypes.func.isRequired,
};

const defaultProps = {
  featuredLeagueItems: [],
};

const SectionFeaturedLeagues = ({ featuredLeagueItems, featuredLeagueTitle, onCloseSportsTree }) => {
  const sportTreeData = useSelector(getSportsTreeSelector);

  const featuredLeagues = useMemo(() => {
    if (isEmpty(featuredLeagueItems) || isEmpty(sportTreeData)) {
      return featuredLeagueItems;
    }

    return getFeaturedLeagueItems(featuredLeagueItems, sportTreeData);
  }, [featuredLeagueItems, sportTreeData]);

  return (
    isNotEmpty(featuredLeagues) && (
      <>
        <h2 className={classes["section_menu_title"]}>{featuredLeagueTitle}</h2>
        <ul className={classes["link_menu_wrapper"]}>
          {featuredLeagues
            .sort((a, b) => a.ordinal - b.ordinal)
            .map((featuredLeague) => (
              <SectionFeaturedLeagueLink
                eventPathId={featuredLeague.eventPathId}
                isLiveBadge={featuredLeague.live}
                key={featuredLeague.eventPathId}
                sportCode={featuredLeague.sportCode}
                title={featuredLeague.eventPathDescription}
                onClick={onCloseSportsTree}
              />
            ))}
        </ul>
      </>
    )
  );
};

SectionFeaturedLeagues.propTypes = propTypes;
SectionFeaturedLeagues.defaultProps = defaultProps;

export default React.memo(SectionFeaturedLeagues);
