import cx from "classnames";
import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getCmsLayoutMobileVanillaDashboardWidgetSportCarousel } from "redux/reselect/cms-layout-widgets";
import { getSportsTreeSelector } from "redux/reselect/sport-tree-selector";
import { getSortedSportTreesBySportsOrder } from "utils/sort/sport-tree-sort";

const propTypes = {
  activeSportCode: PropTypes.string.isRequired,
  setActiveSportCode: PropTypes.func.isRequired,
};

const defaultProps = {};

const NavigationSportCarousel = ({ activeSportCode, setActiveSportCode }) => {
  const sectionSportCarousel = useSelector(getCmsLayoutMobileVanillaDashboardWidgetSportCarousel);
  const sportsTreeData = useSelector(getSportsTreeSelector);

  const sportsTreeDataFiltered = useMemo(() => {
    if (!sectionSportCarousel) {
      return sportsTreeData;
    }
    const {
      data: { hiddenSports, sportsOrder },
    } = sectionSportCarousel || { data: { hiddenSports: [], sportsOrder: [] } };
    if (isEmpty(sportsTreeData)) {
      return [];
    }

    return getSortedSportTreesBySportsOrder(sportsTreeData, sportsOrder).filter(
      (sportTree) => !hiddenSports?.includes(sportTree.code),
    );
  }, [sectionSportCarousel, sportsTreeData]);

  useEffect(() => {
    if (!activeSportCode && !isEmpty(sportsTreeDataFiltered) && !isEmpty(sportsTreeDataFiltered[0])) {
      setActiveSportCode(sportsTreeDataFiltered[0].code);
    }
  }, [setActiveSportCode, sportsTreeDataFiltered]);

  if (isEmpty(sportsTreeDataFiltered)) {
    return null;
  }

  return (
    <div className={classes["navigation-slider"]}>
      {sportsTreeDataFiltered.map((sport) => (
        <div
          className={`${classes["navigation-slider__item"]} ${
            activeSportCode === sport.code ? classes["navigation-slider__item_active"] : ""
          }`}
          key={sport.code}
          onClick={() => setActiveSportCode(sport.code)}
        >
          <div className={classes["navigation-slider__icon"]}>
            <i className={cx(classes[`qicon-default`], classes[`qicon-${sport.code.toLowerCase()}`])} />
          </div>
          <span className={classes["navigation-slider__text"]}>{sport.desc}</span>
        </div>
      ))}
    </div>
  );
};

NavigationSportCarousel.propTypes = propTypes;
NavigationSportCarousel.defaultProps = defaultProps;

export default NavigationSportCarousel;
