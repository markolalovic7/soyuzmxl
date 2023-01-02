import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import classes from "../../../../scss/citywebstyle.module.scss";

const SportsTree = () => {
  const { t } = useTranslation();

  const [activeIndexes, setActiveIndexes] = useState([]);
  const [moreCountryIndexes, setMoreCountryIndexes] = useState([]);

  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData);
  const sportsTreeDataIsLoading = useSelector((state) => state.sportsTree.loading);
  const history = useHistory();

  const sportsTreeItemCollapsibleHandler = (id) => {
    if (activeIndexes.includes(id)) {
      setActiveIndexes(activeIndexes.filter((index) => id !== index));
    } else {
      let updatedIndexes = [...activeIndexes];
      if (id.includes("sports-")) {
        updatedIndexes = updatedIndexes.filter((x) => !x.includes("sports-")); // close other sports first
      }
      setActiveIndexes([...updatedIndexes, id]);
    }
  };

  const moreCountryiesItemCollapsibleHandler = (id) => {
    if (moreCountryIndexes.includes(id)) {
      setMoreCountryIndexes(moreCountryIndexes.filter((index) => id !== index));
    } else {
      setMoreCountryIndexes([...moreCountryIndexes, id]);
    }
  };

  const onNavigateToSportPage = (sportsKey) => {
    history.push(`/sports/${sportsKey}`);
  };

  const onNavigateToCountryPage = (sportCode, countryKey) => {
    history.push(`/countries/${sportCode}/${countryKey}`);
  };

  const onNavigateToLeaguePage = (sportCode, leagueKey) => {
    history.push(`/leagues/${sportCode}/${leagueKey}`);
  };

  return (
    <>
      <span className={classes["left-panel__border"]} />
      <h2 className={`${classes["accordion-title"]} ${classes["accordion-title_blue"]}`}>{t("sports")}</h2>
      <div className={classes["menu-sports"]}>
        <ul className={classes["menu-sports__list"]}>
          {sportsTreeData?.ept?.map((sport) => {
            const sportsKey = `sports-${sport.id}`;
            const activeSport = activeIndexes ? activeIndexes.includes(sportsKey) : false;

            const showAllCountries = moreCountryIndexes.includes(sportsKey);
            const categories = moreCountryIndexes.includes(sportsKey) ? sport.path : sport.path.slice(0, 5);

            // manage onclick addition to expanded, AND add active states.
            // add similar logic for each level...
            // show first x only, unless the more countries flag is enabled...
            return (
              <li className={classes["menu-sports__item"]} key={sportsKey}>
                <div
                  className={`${classes["menu-sports__item-content"]} ${classes["accordion"]} ${
                    activeSport ? classes["active"] : ""
                  }`}
                  onClick={() => {
                    sportsTreeItemCollapsibleHandler(sportsKey);
                    onNavigateToSportPage(sport.code);
                  }}
                >
                  <h4 className={classes["menu-sports__item-title"]}>{sport.desc}</h4>
                  {/* <span className={`${classes['accordion-arrow']} ${activeSport? classes['active'] : ''}`} onClick={() => sportsTreeItemCollapsibleHandler(sportsKey)}></span> */}
                </div>

                <ul className={classes["menu-sports__sublist"]}>
                  {categories &&
                    categories.map((category) => {
                      const categoryKey = `category-${category.id}`;
                      const activeCategory =
                        activeSport && (activeIndexes ? activeIndexes.includes(categoryKey) : false);

                      return (
                        <li className={classes["menu-sports__subitem"]} key={categoryKey}>
                          <div
                            className={`${classes["menu-sports__subitem-content"]} ${
                              classes["menu-sports__subitem-content_white"]
                            } ${classes["accordion"]} ${activeSport ? classes["open"] : ""} ${
                              activeCategory ? classes["active"] : ""
                            }`}
                            onClick={() => {
                              sportsTreeItemCollapsibleHandler(categoryKey);
                              if (category.rawCriterias.length > 0) onNavigateToCountryPage(sport.code, category.id);
                            }}
                          >
                            <span
                              className={`${classes["accordion-arrow"]} ${activeCategory ? classes["active"] : ""}`}
                              onClick={() => sportsTreeItemCollapsibleHandler(categoryKey)}
                            />
                            <h5 className={classes["menu-sports__subitem-title"]}>{category.desc}</h5>
                          </div>
                          <ul className={classes["menu-sports__subsublist"]}>
                            {category.path &&
                              category.path.map((tournament) => {
                                const tournamentKey = `tournament-${tournament.id}`;

                                return (
                                  <li className={classes["menu-sports__subsubitem"]} key={tournamentKey}>
                                    <div
                                      className={`${classes["menu-sports__subsubitem-content"]} ${
                                        classes["accordion"]
                                      } ${activeCategory ? classes["open"] : ""} `}
                                      onClick={() => onNavigateToLeaguePage(sport.code, tournament.id)}
                                    >
                                      <span className={classes["menu-sports__subsubitem-title"]}>
                                        {tournament.desc}
                                      </span>
                                    </div>
                                  </li>
                                );
                              })}
                          </ul>
                        </li>
                      );
                    })}
                </ul>
                {!showAllCountries ? (
                  sport.path.length > 5 ? (
                    <li className={classes["menu-sports__subitem"]} key="more-countries">
                      <div
                        className={`${classes["menu-sports__subitem-content"]} ${
                          classes["menu-sports__subitem-content_white"]
                        } ${classes["accordion"]} ${activeSport ? classes["open"] : ""}`}
                        onClick={() => moreCountryiesItemCollapsibleHandler(sportsKey)}
                      >
                        <h5 className={classes["menu-sports__subitem-title"]}>{t("more_countries")}</h5>
                        {/* <span className={`${classes['accordion-arrow']}`}></span> */}
                      </div>
                    </li>
                  ) : null
                ) : sport.path.length > 5 && activeSport ? (
                  <div
                    className={`${classes["menu-sports__subitem-content"]} ${classes["menu-sports__subitem-content_fewer"]}`}
                    style={{ display: "block" }}
                    onClick={() => moreCountryiesItemCollapsibleHandler(sportsKey)}
                  >
                    <h5 className={classes["menu-sports__subitem-title"]} href="#">
                      {t("fewer_countries")}
                    </h5>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default React.memo(SportsTree);
