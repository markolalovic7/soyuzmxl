import cx from "classnames";
import isEmpty from "lodash.isempty";
import React, { useCallback, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useDispatch } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router";

import { isNotEmpty } from "../../../../../../../utils/lodash";
import { getHrefPrematchSportLeague } from "../../../../../../../utils/route-href";
import SportIcon from "../../../../../components/SportIcon/SportIcon";
import { useActiveSportsTreeData } from "../../../../../hooks/active-sports-tree-data-hooks";
import { useActiveBreakPointEllipsisLengths } from "../../../../../hooks/breakpoint-hooks";
import classes from "../../../../../scss/ezbet.module.scss";
import { COUNTRY_TREE_CATEGORY_DESC } from "../../../../../utils/breakpoint-constants";
import { ALL_KEY } from "../../../../../utils/constants";
import { EarthIconSVG } from "../../../../../utils/icon-utils";

const propTypes = {};

const defaultProps = {};

const CountryTree = () => {
  const { sportCode } = useParams();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const expandedEventPathId = query.get("expandedEventPathId") ? Number(query.get("expandedEventPathId")) : undefined;

  const dispatch = useDispatch();
  const history = useHistory();

  const countryDescMaxLength = useActiveBreakPointEllipsisLengths(COUNTRY_TREE_CATEGORY_DESC);

  const [sportTreeItemBeingToggled, setSportTreeItemBeingToggled] = useState(
    expandedEventPathId ? { [`category-${expandedEventPathId}`]: true } : {},
  );
  const [collapsedSports, setCollapsedSports] = useState([]); // we will use this only in the "featured" tab

  const { activeSportsTreeData, featuredSportsTreeData, sportsTreeDataFiltered } = useActiveSportsTreeData(sportCode);

  const onToggleSportsTreeItem = useCallback((id) => {
    setSportTreeItemBeingToggled((prevActiveIndexes) => ({
      ...prevActiveIndexes,
      [id]: !prevActiveIndexes[id],
    }));
  }, []);

  if (sportCode === ALL_KEY ? isEmpty(featuredSportsTreeData) : isEmpty(sportsTreeDataFiltered)) {
    return null;
  }

  const onCollapseSportHandler = (sportsKey) => {
    if (collapsedSports.includes(sportsKey)) {
      setCollapsedSports(collapsedSports.filter((x) => x !== sportsKey));
    } else {
      setCollapsedSports([...collapsedSports, sportsKey]);
    }
  };

  return activeSportsTreeData?.map((item) => {
    const sportsKey = `sports-${item.id}`;

    if (sportCode !== ALL_KEY && sportCode !== item.code) return null;

    const hasLive = item.criterias?.live;

    return (
      <React.Fragment key={sportsKey}>
        <section className={cx(classes["live-banner"], classes["live-banner-home"])}>
          <div className={cx(classes["left"], classes["sport-iconx-active"])}>
            <SportIcon code={item.code} />
            <p>{item.desc}</p>
          </div>
          <div className={classes["right"]}>
            <i className={cx(classes["live-icon"], { [classes["live-icon-margin"]]: hasLive })}>
              {hasLive ? (
                <div onClick={() => history.push(`/live/sport/${item.code}`)}>
                  <span className={classes["icon-live-icon"]}>
                    <span className={classes["path1"]} />
                    <span className={classes["path2"]} />
                    <span className={classes["path3"]} />
                    <span className={classes["path4"]} />
                    <span className={classes["path5"]} />
                    <span className={classes["path6"]} />
                    <span className={classes["path7"]} />
                  </span>
                </div>
              ) : (
                <span className={classes["icon-live-icon-disabled"]}>
                  <span className={classes["path1"]} />
                  <span className={classes["path2"]} />
                  <span className={classes["path3"]} />
                  <span className={classes["path4"]} />
                  <span className={classes["path5"]} />
                  <span className={classes["path6"]} />
                  <span className={classes["path7"]} />
                </span>
              )}
            </i>
            <i
              className={classes["icon-angle-up-light"]}
              // style={{ visibility: sportCode === ALL_KEY ? "visible" : "hidden" }}
              onClick={() => {
                onCollapseSportHandler(sportsKey);
                history.push(`/live/sport/${item.code}`);
              }}
            />
          </div>
        </section>
        {(sportCode !== ALL_KEY || !collapsedSports.includes(sportsKey)) && (
          <section className={classes["countries"]}>
            <div className={classes["accordion-wrapper"]}>
              {item?.path &&
                item.path.map((category) => {
                  const categoryKey = `category-${category.id}`;
                  const isCategoryToggled = sportTreeItemBeingToggled[categoryKey];

                  const countryEventCount = Object.entries(category.criterias)
                    .filter((c) => c[0] !== "oc" && c[0] !== "live")
                    .map((x) => x[1])
                    .reduce((a, b) => a + b, 0);
                  if (countryEventCount === 0) return null;

                  return (
                    <div
                      className={cx(classes["country"], { [classes["active"]]: isCategoryToggled })}
                      key={categoryKey}
                    >
                      <button
                        className={cx(classes["accordion"], { [classes["active"]]: isCategoryToggled })}
                        type="button"
                        onClick={() => onToggleSportsTreeItem(categoryKey)}
                      >
                        <div className={classes["according-title"]}>
                          <div className={classes["earth-icon"]}>
                            {category.countryCode ? (
                              <ReactCountryFlag
                                svg
                                countryCode={category.countryCode}
                                // className={classes["overlay-burger__countryFlag"]}
                                style={{ border: "0.5px solid #DEDEDE" }}
                              />
                            ) : (
                              <i>
                                <EarthIconSVG />
                              </i>
                            )}
                          </div>
                          <p>{category.desc}</p>
                        </div>
                        <div className={classes["down-wrapper"]}>
                          {!isCategoryToggled && (
                            <span className={classes["country-event-count"]}>{`( ${countryEventCount} )`}</span>
                          )}
                          <i className={classes["icon-angle-up-light-down"]} />
                        </div>
                      </button>
                      {isCategoryToggled && category?.path && isNotEmpty(category.path) && (
                        <div className={classes["panel"]} style={{ display: "block" }}>
                          <ul>
                            {category.path.map((tournament) => {
                              const tournamentKey = `tournament-${tournament.id}`;

                              const tournamentEventCount = Object.entries(tournament.criterias)
                                .filter((c) => c[0] !== "oc" && c[0] !== "live")
                                .map((x) => x[1])
                                .reduce((a, b) => a + b, 0);
                              if (tournamentEventCount === 0) return null;

                              return (
                                <li
                                  key={tournamentKey}
                                  onClick={() => history.push(getHrefPrematchSportLeague(sportCode, tournament.id))}
                                >
                                  <i />
                                  <p>
                                    {tournament.desc}
                                  </p>
                                  <span className={classes["sub-count"]}>
                                    &nbsp;
                                    {`( ${tournamentEventCount} )`}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </section>
        )}
      </React.Fragment>
    );
  });
};

CountryTree.propTypes = propTypes;
CountryTree.defaultProps = defaultProps;

export default React.memo(CountryTree);
