import { ReactComponent as FallbackWorldImage } from "assets/img/icons/World_Flag.svg";
import cx from "classnames";
import { SPORT_TREE_COUNT_TYPE_MARKET } from "constants/navigation-drawer";
import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { getSportsTreeSelector } from "redux/reselect/sport-tree-selector";
import { getHrefPrematch } from "utils/route-href";
import { getSortedSportTreesBySportsOrder } from "utils/sort/sport-tree-sort";

import classes from "../../styles/index.module.scss";

const propTypes = {
  countType: PropTypes.string,
  hiddenSports: PropTypes.array,
  onCloseSportsTree: PropTypes.func.isRequired,
  searchKeyword: PropTypes.string,
  showCount: PropTypes.bool,
  sportsOrder: PropTypes.array,
};

const defaultProps = {
  countType: SPORT_TREE_COUNT_TYPE_MARKET,
  hiddenSports: [],
  searchKeyword: undefined,
  showCount: false,
  sportsOrder: [],
};

const SportsTree = ({ countType, hiddenSports, onCloseSportsTree, searchKeyword, showCount, sportsOrder }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const pathname = location.pathname;
  const [sportTreeItemBeingToggled, setSportTreeItemBeingToggled] = useState({});

  const sportsTreeData = useSelector(getSportsTreeSelector);

  const sportsTreeDataFiltered = useMemo(() => {
    if (isEmpty(sportsTreeData)) {
      return [];
    }

    return getSortedSportTreesBySportsOrder(sportsTreeData, sportsOrder).filter((sportTree) => {
      if (!searchKeyword) {
        return !hiddenSports.includes(sportTree.code);
      }

      return (
        !hiddenSports.includes(sportTree.code) && sportTree.desc.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    });
  }, [hiddenSports, sportsOrder, sportsTreeData, searchKeyword]);

  const toggleSportsTreeItem = useCallback((id) => {
    setSportTreeItemBeingToggled((prevActiveIndexes) => ({
      ...prevActiveIndexes,
      [id]: !prevActiveIndexes[id],
    }));
  }, []);

  const onToggleSportsTreeItem = useCallback((e, id) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSportsTreeItem(id);
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
                toggleSportsTreeItem(sportsKey);
                toggleSportsTreeItem(categoryKey);
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
  }, [pathname, sportsTreeData, sportTreeItemBeingToggled, toggleSportsTreeItem]);

  return (
    <>
      <h2 className={classes["section_menu_title"]}>{t("sports")}</h2>
      <ul className={classes["link_menu_wrapper"]}>
        {sportsTreeDataFiltered.map((item) => {
          const sportsKey = `sports-${item.id}`;
          const activeSport = !!sportTreeItemBeingToggled[sportsKey];

          return (
            <li key={item.id}>
              <div className={classes["link_sport"]} onClick={(e) => onToggleSportsTreeItem(e, sportsKey)}>
                <span
                  className={cx(
                    classes["link_sport__icon"],
                    classes["qicon-default"],
                    classes[`qicon-${item.code.toLowerCase()}`],
                  )}
                />
                <span className={classes["link_sport__title"]}>{item.desc}</span>
                {showCount && (
                  <span className={classes["link_sport__numbers"]}>
                    {countType === SPORT_TREE_COUNT_TYPE_MARKET ? item.count : item.eventCount2}
                  </span>
                )}
                <div
                  className={`${classes["arrow"]} ${classes["arrow1"]} ${activeSport ? classes["active"] : ""}`}
                  onClick={(e) => onToggleSportsTreeItem(e, sportsKey)}
                />
              </div>
              {activeSport && (
                <ul className={classes["link_menu_wrapper"]}>
                  {item?.path &&
                    item.path.map((category) => {
                      const categoryKey = `category-${category.id}`;
                      const isCategoryToggled = sportTreeItemBeingToggled[categoryKey];

                      return (
                        <li key={category.id} onClick={(e) => onToggleSportsTreeItem(e, categoryKey)}>
                          <div className={classes["link_sub_sport"]}>
                            {category.countryCode ? (
                              <ReactCountryFlag
                                svg
                                className={classes["link_sub_sport__icon"]}
                                countryCode={category.countryCode}
                              />
                            ) : (
                              <FallbackWorldImage className={classes["link_sub_sport__icon"]} />
                            )}
                            <p className={classes["link_sub_sport__title"]}>{category.desc}</p>
                            {showCount && (
                              <span className={classes["link_sub_sport__numbers"]}>
                                {countType === SPORT_TREE_COUNT_TYPE_MARKET ? category.count : category.eventCount2}
                              </span>
                            )}
                            <div
                              className={`${classes["arrow"]} ${classes["arrow1"]} ${
                                isCategoryToggled ? classes["active"] : ""
                              }`}
                              onClick={(e) => onToggleSportsTreeItem(e, categoryKey)}
                            />
                          </div>
                          {isCategoryToggled && (
                            <ul className={classes["link_menu_wrapper"]}>
                              {category?.path &&
                                category.path.map((tournament) => (
                                  <Link
                                    className={`${classes["link_sub_sub_sport"]} ${
                                      activeEventPathId === tournament.id ? classes["active"] : ""
                                    }`}
                                    key={`tournament-${tournament.id}`}
                                    to={getHrefPrematch(`p${tournament.id}`)}
                                    onClick={onCloseSportsTree}
                                  >
                                    <div className={classes["link_sub_sub_sport__title"]}>{tournament.desc}</div>
                                    {showCount && (
                                      <span className={classes["link_sub_sub_sport__numbers"]}>
                                        {countType === SPORT_TREE_COUNT_TYPE_MARKET
                                          ? tournament.count
                                          : tournament.eventCount2}
                                      </span>
                                    )}
                                  </Link>
                                ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};

SportsTree.propTypes = propTypes;
SportsTree.defaultProps = defaultProps;

export default SportsTree;
