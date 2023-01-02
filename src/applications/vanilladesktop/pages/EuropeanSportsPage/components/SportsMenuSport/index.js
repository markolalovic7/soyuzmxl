import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import {
  APPLICATION_TYPE_CONTINENTAL_DESKTOP,
  APPLICATION_TYPE_EUROPEAN_DESKTOP,
} from "../../../../../../constants/application-types";
import { SPORT_TREE_COUNT_TYPE_MARKET } from "../../../../../../constants/navigation-drawer";
import { getAuthDesktopView } from "../../../../../../redux/reselect/auth-selector";
import SportsMenuCountries, { sportCountryDataType } from "../SportsMenuCountries";

const sportDataType = PropTypes.shape({
  code: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  desc: PropTypes.string.isRequired,
  eventCount2: PropTypes.number.isRequired,
  path: PropTypes.arrayOf(sportCountryDataType).isRequired,
});

const propTypes = {
  activeIndex: PropTypes.string,
  countType: PropTypes.string,
  data: sportDataType.isRequired,
  setActiveIndex: PropTypes.func.isRequired,
  showCount: PropTypes.bool.isRequired,
  sportId: PropTypes.number.isRequired,
  sportKey: PropTypes.string.isRequired,
  treeItemsDefaultOpen: PropTypes.array.isRequired,
};

const defaultProps = {
  activeIndex: undefined,
  countType: undefined,
};

const SportsMenuSport = ({
  activeIndex,
  countType,
  data,
  setActiveIndex,
  showCount,
  sportId,
  sportKey,
  treeItemsDefaultOpen,
}) => {
  const history = useHistory();
  const view = useSelector(getAuthDesktopView);

  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    setIsOpened(treeItemsDefaultOpen.includes(sportKey));
  }, [treeItemsDefaultOpen, sportKey]);

  return (
    <li className={classes["menu-sports__item"]}>
      <div
        className={cx(classes["menu-sports__item-content"], classes["accordion"], {
          [classes["active"]]: activeIndex === sportKey,
        })}
        onClick={() => {
          if ([APPLICATION_TYPE_EUROPEAN_DESKTOP, APPLICATION_TYPE_CONTINENTAL_DESKTOP].includes(view)) {
            setActiveIndex(sportKey);
            history.push(`/prematch/eventpath/${sportId}`);
          } else {
            setIsOpened((isOpened) => !isOpened);
          }
        }}
      >
        <span className={classes["menu-sports__item-icon"]}>
          <span className={cx(classes["qicon-default"], classes[`qicon-${data.code.toLowerCase()}`])} />
        </span>
        <h4 className={classes["menu-sports__item-title"]}>{data.desc}</h4>
        {showCount && (
          <span className={classes["menu-sports__item-numbers"]}>
            {countType === SPORT_TREE_COUNT_TYPE_MARKET ? data.count : data.eventCount2}
          </span>
        )}
        <span
          className={cx(classes["menu-sports__item-arrow"], classes["accordion-arrow"], {
            [classes["active"]]: isOpened,
          })}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpened((isOpened) => !isOpened);
          }}
        />
      </div>
      {isOpened && (
        <SportsMenuCountries
          activeIndex={activeIndex}
          countType={countType}
          countries={data?.path}
          setActiveIndex={setActiveIndex}
          showCount={!!showCount}
          treeItemsDefaultOpen={treeItemsDefaultOpen}
        />
      )}
    </li>
  );
};

SportsMenuSport.propTypes = propTypes;
SportsMenuSport.defaultProps = defaultProps;

export default SportsMenuSport;
