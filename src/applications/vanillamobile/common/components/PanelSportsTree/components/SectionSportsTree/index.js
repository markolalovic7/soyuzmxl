import cx from "classnames";
import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { ReactComponent as FallbackWorldImage } from "assets/img/icons/World_Flag.svg";
import { SPORT_TREE_COUNT_TYPE_MARKET } from "constants/navigation-drawer";
import { getSportsTreeSelector } from "redux/reselect/sport-tree-selector";
import { getHrefPrematch } from "utils/route-href";
import { getSortedSportTreesBySportsOrder } from "utils/sort/sport-tree-sort";

const propTypes = {
  countType: PropTypes.string,
  hiddenSports: PropTypes.array,
  onPanelClose: PropTypes.func.isRequired,
  showCount: PropTypes.bool,
  sportsOrder: PropTypes.array,
};

const defaultProps = {
  countType: SPORT_TREE_COUNT_TYPE_MARKET,
  hiddenSports: [],
  showCount: false,
  sportsOrder: [],
};

const SectionSportsTree = ({ countType, hiddenSports, onPanelClose, showCount, sportsOrder }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const pathname = location.pathname;
  const [sportTreeItemBeingToggled, setSportTreeItemBeingToggled] = useState({});

  const sportsTreeData = useSelector(getSportsTreeSelector);

  const sportsTreeDataFiltered = useMemo(() => {
    if (isEmpty(sportsTreeData)) {
      return [];
    }

    return getSortedSportTreesBySportsOrder(sportsTreeData, sportsOrder).filter(
      (sportTree) => !hiddenSports.includes(sportTree.code),
    );
  }, [hiddenSports, sportsOrder, sportsTreeData]);

  const onToggleSportsTreeItem = useCallback((id) => {
    setSportTreeItemBeingToggled((prevActiveIndexes) => ({
      ...prevActiveIndexes,
      [id]: !prevActiveIndexes[id],
    }));
  }, []);

  const [activeEventPathId, setActiveEventPathId] = useState(null);

  useEffect(() => {
    if (sportsTreeData && pathname && pathname.includes("prematch/eventpath")) {
      const urlSegments = pathname.split("/");
      const tournamentId = parseInt(urlSegments[urlSegments.length - 1], 10);
      setActiveEventPathId(tournamentId);

      if (sportTreeItemBeingToggled.length === 0) {
        // if indexes are to be initialised...
        let found = false;
        for (let i = 0; i < sportsTreeData.length; i += 1) {
          // make sure this appears expanded in the tree...
          const item = sportsTreeData[i];
          const sportsKey = `sports-${item.id}`;

          if (item.path) {
            for (let j = 0; j < item.path.length; j += 1) {
              const category = item.path[j];
              const categoryKey = `category-${category.id}`;

              if (category.path && category.path.findIndex((tournament) => tournament.id === tournamentId) > -1) {
                onToggleSportsTreeItem(sportsKey);
                onToggleSportsTreeItem(categoryKey);
                found = true;
                break;
              }
            }
            if (found) {
              break;
            }
          }
        }
      }
    }
  }, [pathname, sportsTreeData, sportTreeItemBeingToggled, onToggleSportsTreeItem]);

  return (
    <>
      <h2 className={classes["overlay-burger__heading"]}>{t("sports")}</h2>
      <ul className={classes["overlay-burger__list"]}>
        {sportsTreeDataFiltered.map((item) => {
          const sportsKey = `sports-${item.id}`;
          const activeSport = !!sportTreeItemBeingToggled[sportsKey];

          return (
            <li className={classes["overlay-burger__item"]} key={item.id}>
              <div
                className={cx(classes["overlay-burger__content"], classes["dropdown"])}
                onClick={() => onToggleSportsTreeItem(sportsKey)}
              >
                <span className={classes["overlay-burger__icon"]}>
                  <span className={cx(classes["qicon-default"], classes[`qicon-${item.code.toLowerCase()}`])} />
                </span>
                <h4 className={classes["overlay-burger__title"]}>{item.desc}</h4>
                {showCount && (
                  <span className={classes["overlay-burger__numbers"]}>
                    {countType === SPORT_TREE_COUNT_TYPE_MARKET ? item.count : item.eventCount2}
                  </span>
                )}
                <span
                  className={cx(classes["overlay-burger__arrow"], classes["dropdown-arrow"], {
                    [classes["active"]]: activeSport,
                  })}
                />
              </div>
              <ul className={`${classes["overlay-burger__sublist"]} ${activeSport ? classes["open"] : ""}`}>
                {item?.path &&
                  item.path.map((category) => {
                    const categoryKey = `category-${category.id}`;
                    const isCategoryToggled = sportTreeItemBeingToggled[categoryKey];

                    return (
                      <li className={classes["overlay-burger__subitem"]} key={category.id}>
                        <div
                          className={cx(classes["overlay-burger__subitem-content"], classes["dropdown"], {
                            [classes["open"]]: activeSport,
                          })}
                          onClick={() => onToggleSportsTreeItem(categoryKey)}
                        >
                          {category.countryCode ? (
                            <ReactCountryFlag
                              svg
                              className={classes["overlay-burger__countryFlag"]}
                              countryCode={category.countryCode}
                              style={{ verticalAlign: "baseline" }}
                            />
                          ) : (
                            <FallbackWorldImage className={classes["overlay-burger__countryFlag"]} />
                          )}
                          <h5 className={classes["overlay-burger__title"]}>{category.desc}</h5>
                          {showCount && (
                            <span className={classes["overlay-burger__numbers"]}>
                              {countType === SPORT_TREE_COUNT_TYPE_MARKET ? category.count : category.eventCount2}
                            </span>
                          )}
                          <span />
                          <div
                            className={`${classes["overlay-burger__arrow"]} ${classes["dropdown-arrow"]} ${
                              isCategoryToggled ? classes["active"] : ""
                            }`}
                          />
                        </div>
                        <ul className={classes["overlay-burger__subsublist"]}>
                          {category?.path &&
                            category.path.map((tournament) => {
                              const tournamentKey = `tournament-${tournament.id}`;

                              return (
                                <li className={`${classes["overlay-burger__subsubitem"]}`} key={tournamentKey}>
                                  <Link
                                    className={cx(
                                      classes["overlay-burger__subsubitem-content"],
                                      // classes["dropdown"],
                                      { [classes["active"]]: activeEventPathId === tournament.id },
                                      { [classes["open"]]: isCategoryToggled },
                                    )}
                                    to={getHrefPrematch(tournament.id)}
                                    onClick={onPanelClose}
                                  >
                                    <span className={classes["overlay-burger__title"]}>{tournament.desc}</span>
                                    {showCount && (
                                      <span className={classes["overlay-burger__numbers"]}>
                                        {countType === SPORT_TREE_COUNT_TYPE_MARKET
                                          ? tournament.count
                                          : tournament.eventCount2}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              );
                            })}
                        </ul>
                      </li>
                    );
                  })}
              </ul>
            </li>
          );
        })}
      </ul>
    </>
  );
};

SectionSportsTree.propTypes = propTypes;
SectionSportsTree.defaultProps = defaultProps;

export default SectionSportsTree;
