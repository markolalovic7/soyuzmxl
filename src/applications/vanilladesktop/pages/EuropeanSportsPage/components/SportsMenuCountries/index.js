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

const leagueDataType = PropTypes.shape({
  count: PropTypes.number.isRequired,
  desc: PropTypes.string.isRequired,
  eventCount2: PropTypes.number.isRequired,
});

export const sportCountryDataType = PropTypes.shape({
  count: PropTypes.number.isRequired,
  desc: PropTypes.string.isRequired,
  eventCount2: PropTypes.number.isRequired,
  path: PropTypes.arrayOf(leagueDataType).isRequired,
});

const CountryLeague = ({ activeIndex, countType, data, leagueId, leagueKey, setActiveIndex, showCount }) => {
  const history = useHistory();

  return (
    <ul className={classes["menu-sports__subsublist"]}>
      <li className={classes["menu-sports__subsubitem"]}>
        <div
          className={cx(classes["menu-sports__subsubitem-content"], classes["accordion"], classes["open"], {
            [classes["active"]]: activeIndex === leagueKey,
          })}
          onClick={() => {
            setActiveIndex(leagueKey);
            history.push(`/prematch/eventpath/${leagueId}`);
          }}
        >
          <span className={classes["menu-sports__subsubitem-title"]}>{data.desc}</span>
          {showCount && (
            <span className={classes["menu-sports__item-numbers"]}>
              {countType === SPORT_TREE_COUNT_TYPE_MARKET ? data.count : data.eventCount2}
            </span>
          )}
        </div>
      </li>
    </ul>
  );
};

CountryLeague.propTypes = {
  activeIndex: PropTypes.string,
  countType: PropTypes.string,
  data: leagueDataType.isRequired,
  leagueId: PropTypes.number.isRequired,
  leagueKey: PropTypes.string.isRequired,
  setActiveIndex: PropTypes.func.isRequired,
  showCount: PropTypes.bool.isRequired,
};

CountryLeague.defaultProps = {
  activeIndex: undefined,
  countType: undefined,
};

const CountryDropdown = ({
  activeIndex,
  countType,
  countryId,
  countryKey,
  data,
  setActiveIndex,
  showCount,
  treeItemsDefaultOpen,
}) => {
  const view = useSelector(getAuthDesktopView);

  const history = useHistory();

  const [isOpened, setIsOpened] = useState(treeItemsDefaultOpen.includes(countryKey));

  useEffect(() => {
    setIsOpened(treeItemsDefaultOpen.includes(countryKey));
  }, [treeItemsDefaultOpen, countryKey]);

  return (
    <li className={classes["menu-sports__subitem"]}>
      <div
        className={cx(
          classes["menu-sports__subitem-content"],
          classes["menu-sports__subitem-content_white"],
          classes["accordion"],
          classes["open"],
          {
            [classes["active"]]: activeIndex === countryKey,
          },
        )}
        onClick={() => {
          if ([APPLICATION_TYPE_EUROPEAN_DESKTOP, APPLICATION_TYPE_CONTINENTAL_DESKTOP].includes(view)) {
            setActiveIndex(countryKey);
            history.push(`/prematch/eventpath/${countryId}`);
          } else {
            setIsOpened((isOpened) => !isOpened);
          }
        }}
      >
        <h5 className={classes["menu-sports__subitem-title"]}>{data.desc}</h5>
        {showCount && (
          <span className={classes["menu-sports__item-numbers"]}>
            {countType === SPORT_TREE_COUNT_TYPE_MARKET ? data.count : data.eventCount2}
          </span>
        )}
        <span
          className={cx(classes["accordion-arrow"], classes["menu-sports__item-arrow"], {
            [classes["active"]]: isOpened,
          })}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpened((isOpened) => !isOpened);
          }}
        />
      </div>
      {isOpened &&
        data.path?.map((league) => {
          const leagueKey = `league-${league.id}`;

          if (Object.keys(league.criterias).filter((c) => c !== "live").length === 0) return null;

          return (
            <CountryLeague
              activeIndex={activeIndex}
              countType={countType}
              data={league}
              key={leagueKey}
              leagueId={league.id}
              leagueKey={leagueKey}
              setActiveIndex={setActiveIndex}
              showCount={!!showCount}
            />
          );
        })}
    </li>
  );
};

CountryDropdown.propTypes = {
  activeIndex: PropTypes.string,
  countType: PropTypes.string,
  countryId: PropTypes.number.isRequired,
  countryKey: PropTypes.string.isRequired,
  data: sportCountryDataType.isRequired,
  setActiveIndex: PropTypes.func.isRequired,
  showCount: PropTypes.bool.isRequired,
  treeItemsDefaultOpen: PropTypes.array.isRequired,
};

CountryDropdown.defaultProps = {
  activeIndex: undefined,
  countType: undefined,
};

const SportsMenuCountries = ({
  activeIndex,
  countType,
  countries,
  setActiveIndex,
  showCount,
  treeItemsDefaultOpen,
}) => (
  <ul className={classes["menu-sports__sublist"]}>
    {countries?.map((country) => {
      const countryKey = `country-${country.id}`;

      if (Object.keys(country.criterias).filter((c) => c !== "live").length === 0) return null;

      return (
        <CountryDropdown
          activeIndex={activeIndex}
          countType={countType}
          countryId={country.id}
          countryKey={countryKey}
          data={country}
          key={country.id}
          setActiveIndex={setActiveIndex}
          showCount={!!showCount}
          treeItemsDefaultOpen={treeItemsDefaultOpen}
        />
      );
    })}
  </ul>
);

SportsMenuCountries.propTypes = {
  activeIndex: PropTypes.string,
  countType: PropTypes.string,
  countries: PropTypes.arrayOf(sportCountryDataType).isRequired,
  setActiveIndex: PropTypes.func.isRequired,
  showCount: PropTypes.bool.isRequired,
  treeItemsDefaultOpen: PropTypes.array.isRequired,
};

SportsMenuCountries.defaultProps = {
  activeIndex: undefined,
  countType: undefined,
};

export default SportsMenuCountries;
