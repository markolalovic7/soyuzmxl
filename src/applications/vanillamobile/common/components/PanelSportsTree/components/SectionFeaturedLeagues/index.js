import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import SectionFeaturedLeagueLink from "./components/SectionFeaturedLeagueLink";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getSportsTreeSelector } from "redux/reselect/sport-tree-selector";
import { isNotEmpty } from "utils/lodash";
import { getFeaturedLeagueItems } from "utils/navigation-drawer/featured-league";

const propTypes = {
  featuredLeagueItems: PropTypes.array,
  featuredLeagueTitle: PropTypes.string.isRequired,
  onPanelClose: PropTypes.func.isRequired,
};

const defaultProps = {
  featuredLeagueItems: [],
};

const SectionFeaturedLeagues = ({ featuredLeagueItems, featuredLeagueTitle, onPanelClose }) => {
  const sportTreeData = useSelector(getSportsTreeSelector);

  const featuredLeagues = useMemo(() => {
    if (isEmpty(featuredLeagueItems) || isEmpty(sportTreeData)) {
      return [...featuredLeagueItems];
    }

    return getFeaturedLeagueItems(featuredLeagueItems, sportTreeData);
  }, [featuredLeagueItems, sportTreeData]);

  return (
    isNotEmpty(featuredLeagues) && (
      <div className={classes["overlay-burger__service"]}>
        <h2 className={classes["overlay-burger__heading"]}>{featuredLeagueTitle}</h2>
        <ul className={classes["overlay-burger__list"]}>
          {featuredLeagues
            .sort((a, b) => a.ordinal - b.ordinal)
            .map((featuredLeague) => (
              <SectionFeaturedLeagueLink
                eventPathId={featuredLeague.eventPathId}
                isLiveBadge={featuredLeague.live}
                key={featuredLeague.eventPathId}
                sportCode={featuredLeague.sportCode}
                title={featuredLeague.eventPathDescription}
                onClick={onPanelClose}
              />
            ))}
        </ul>
      </div>
    )
  );
};

SectionFeaturedLeagues.propTypes = propTypes;
SectionFeaturedLeagues.defaultProps = defaultProps;

export default SectionFeaturedLeagues;
