import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import isEmpty from "lodash.isempty";
import * as PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";

import { ReactComponent as FallbackWorldImage } from "../../../../../../../../assets/img/icons/World_Flag.svg";
import { getSportsTreeSelector } from "../../../../../../../../redux/reselect/sport-tree-selector";
import { isNotEmpty } from "../../../../../../../../utils/lodash";
import { getPatternHome } from "../../../../../../../../utils/route-patterns";
import { getSortedSportTreesBySportsOrder } from "../../../../../../../../utils/sort/sport-tree-sort";
import classes from "../../../../../../scss/slimdesktop.module.scss";

const Tree = ({ activeEventId, eventPathIds, isLive, isLivePage, isPrematchPage, widgetData }) => {
  const history = useHistory();

  const { t } = useTranslation();

  const [initialised, setInitialised] = useState(false);
  const { countType, hiddenSports, showCount, sportsOrder } = widgetData;

  const sportsTreeData = useSelector(getSportsTreeSelector);
  const sportsTreeLoading = useSelector((state) => state.sportsTree?.loading);

  const sportsTreeDataFiltered = useMemo(() => {
    if (isEmpty(sportsTreeData)) {
      return [];
    }

    return getSortedSportTreesBySportsOrder(sportsTreeData, sportsOrder).filter(
      (sportTree) => !hiddenSports?.includes(sportTree.code),
    );
  }, [hiddenSports, sportsOrder, sportsTreeData]);

  const [activeIndexes, setActiveIndexes] = useState([]);

  const [treeItemsOpen, setTreeItemsOpen] = useState([]);

  // Initialise the state of the tree (as it was before a page refresh), if we are in a location other than the root of prematch.
  useEffect(() => {
    if (!initialised && sportsTreeDataFiltered.length > 0 && isNotEmpty(eventPathIds)) {
      for (let i = 0; i < sportsTreeDataFiltered.length; i += 1) {
        // make sure this appears expanded in the tree...
        const item = sportsTreeDataFiltered[i];
        const sportsKey = `sport-${item.id}`;

        if (eventPathIds.includes(item.id)) {
          setTreeItemsOpen((prevState) => [...new Set([...prevState, sportsKey])]);
          setActiveIndexes((prevState) => [...new Set([...prevState, sportsKey])]);

          // return; // break hard
        }

        if (item.path) {
          for (let j = 0; j < item.path.length; j += 1) {
            const country = item.path[j];
            const countryKey = `country-${country.id}`;

            if (eventPathIds.includes(country.id)) {
              setTreeItemsOpen((prevState) => [...new Set([...prevState, sportsKey, countryKey])]);
              setActiveIndexes((prevState) => [...new Set([...prevState, countryKey])]);

              // return; // break hard
            }

            if (country.path) {
              for (let k = 0; k < country.path.length; k += 1) {
                const league = country.path[k];
                const leagueKey = `league-${league.id}`;

                if (eventPathIds.includes(league.id)) {
                  setTreeItemsOpen((prevState) => [...new Set([...prevState, sportsKey, countryKey])]);
                  setActiveIndexes((prevState) => [...new Set([...prevState, leagueKey])]);

                  // return; // break hard
                }
              }
            }
          }
        }
      }
      setInitialised(true);
    }
  }, [eventPathIds, initialised, sportsTreeDataFiltered]);

  const location = useLocation();
  useEffect(() => {
    if (location.pathname === getPatternHome()) return undefined;

    // if no eventPathId set, go to the first one
    if (isPrematchPage && sportsTreeDataFiltered?.length > 0 && isEmpty(eventPathIds)) {
      const suitableEventPathIds = sportsTreeDataFiltered.filter(
        (sport) => sport.eventCount2 > 0 && Object.keys(sport.criterias).filter((c) => c !== "live").length > 0,
      );

      const firstEventPathId = suitableEventPathIds.length > 0 ? suitableEventPathIds[0].id : undefined;

      if (firstEventPathId) {
        history.push(`/prematch/eventpath/${firstEventPathId}`);

        setTreeItemsOpen([`sport-${firstEventPathId}`]);
        setActiveIndexes([`sport-${firstEventPathId}`]);
      }
    }
    if (isLivePage && sportsTreeDataFiltered?.length > 0 && isEmpty(eventPathIds)) {
      const filtered = sportsTreeDataFiltered.filter(
        (sport) => sport.eventCount2 > 0 && Object.keys(sport.criterias).filter((c) => c === "live").length > 0,
      );

      if (filtered.length > 0) {
        const firstEventPathId = filtered[0].id;
        history.push(`/live/eventpath/${firstEventPathId}`);

        setTreeItemsOpen([`sport-${firstEventPathId}`]);
        setActiveIndexes([`sport-${firstEventPathId}`]);
      }
    }

    return undefined;
  }, [location, eventPathIds, sportsTreeDataFiltered]);

  useEffect(() => {
    if (activeIndexes.length > 0) {
      const path = `/${isLive ? "live" : "prematch"}/eventpath/${activeIndexes.map((x) => x.split("-")[1]).join(",")}${
        activeEventId ? `/event/${activeEventId}` : ""
      }`;
      if (location.pathname !== path) {
        history.push(path);
      }
    }
  }, [activeIndexes]);

  if (!sportsTreeData && sportsTreeLoading) {
    return (
      <div style={{ margin: "10px 0px", textAlign: "center" }}>
        <FontAwesomeIcon className="fa-spin" icon={faCircleNotch} size="lg" />
      </div>
    );
  }

  return (
    <ul className={classes["sidebar__list"]}>
      {sportsTreeDataFiltered?.map((data) => {
        const sportKey = `sport-${data.id}`;

        if (
          Object.keys(data.criterias).filter((c) => (isLive && c === "live") || (!isLive && c !== "live")).length === 0
        )
          return null;

        return (
          <li className={cx(classes["sidebar-dropdown"])} key={sportKey}>
            <div
              className={cx(
                classes["sidebar-item"],
                classes["sidebar-item--with-counter"],
                {
                  [classes["active"]]: treeItemsOpen.includes(sportKey),
                },
                {
                  [classes["selected"]]: activeIndexes.includes(sportKey),
                },
              )}
              onClick={() => {
                if (activeIndexes.includes(sportKey)) {
                  setActiveIndexes((prevState) => prevState.filter((x) => x !== sportKey));
                } else {
                  setActiveIndexes((prevState) => [...new Set([...prevState, sportKey])]);
                }

                if (treeItemsOpen.includes(sportKey)) {
                  setTreeItemsOpen((prevState) => prevState.filter((x) => x !== sportKey));
                } else {
                  setTreeItemsOpen((prevState) => [...new Set([...prevState, sportKey])]);
                }
              }}
            >
              <span
                className={cx(classes["qicon-default"], classes[`qicon-${data.code.toLowerCase()}`], classes["icon"])}
              />
              <div className={classes["sidebar-item__title"]}>{data.desc}</div>
              {showCount && (
                <span className={classes["sidebar-item__counter"]}>
                  {isLive ? data.criterias.live : data.eventCount2}
                </span>
              )}
              {/* <ArrowSVG /> */}
            </div>

            <ul
              className={cx(classes["sidebar-dropdown__list"], classes["js-dropdown-box"])}
              style={{ display: treeItemsOpen.includes(sportKey) ? "block" : "none" }}
            >
              {data?.path?.map((country) => {
                const countryKey = `country-${country.id}`;

                if (
                  Object.keys(country.criterias).filter((c) => (isLive && c === "live") || (!isLive && c !== "live"))
                    .length === 0
                )
                  return null;

                return (
                  <li className={cx(classes["sidebar-dropdown"])} key={countryKey}>
                    <div
                      className={cx(classes["sidebar-item"], classes["sidebar-item--with-flag"], {
                        [classes["active"]]: treeItemsOpen.includes(countryKey),
                        [classes["selected"]]: activeIndexes.includes(countryKey),
                      })}
                      onClick={() => {
                        if (activeIndexes.includes(countryKey)) {
                          setActiveIndexes((prevState) => prevState.filter((x) => x !== countryKey));
                        } else {
                          // if a country is selected, unselect any possible prior selection of the parent sport
                          setActiveIndexes((prevState) =>
                            [...new Set([...prevState, countryKey])].filter((key) => key !== sportKey),
                          );
                        }

                        if (treeItemsOpen.includes(countryKey)) {
                          setTreeItemsOpen((prevState) => prevState.filter((x) => x !== countryKey));
                        } else {
                          setTreeItemsOpen((prevState) => [...new Set([...prevState, sportKey, countryKey])]);
                        }
                      }}
                    >
                      {country.countryCode ? (
                        <ReactCountryFlag
                          svg
                          className={classes["sidebar-item__icon"]}
                          countryCode={country.countryCode}
                          style={{ height: "0.75em", width: "1em" }}
                        />
                      ) : (
                        <FallbackWorldImage
                          className={classes["sidebar-item__icon"]}
                          style={{ height: "0.75em", width: "1em" }}
                        />
                      )}
                      <div className={classes["sidebar-item__title"]}>{country.desc}</div>
                      {/* <ArrowSVG /> */}
                    </div>
                    <ul
                      className={cx(classes["sidebar-dropdown__list"], classes["js-dropdown-box"])}
                      style={{ display: treeItemsOpen.includes(countryKey) ? "block" : "none" }}
                    >
                      {country?.path?.map((league) => {
                        const leagueKey = `league-${league.id}`;

                        if (
                          Object.keys(league.criterias).filter(
                            (c) => (isLive && c === "live") || (!isLive && c !== "live"),
                          ).length === 0
                        )
                          return null;

                        return (
                          <li
                            className={cx(classes["sidebar-item"], classes["sidebar-item--pl"], {
                              [classes["selected"]]: activeIndexes.includes(leagueKey),
                            })}
                            key={leagueKey}
                            onClick={() => {
                              if (activeIndexes.includes(leagueKey)) {
                                setActiveIndexes((prevState) => prevState.filter((key) => key !== leagueKey));
                              } else {
                                // if a leagueKey is selected, unselect any possible prior selection of the parent country
                                setActiveIndexes((prevState) =>
                                  [...new Set([...prevState, leagueKey])].filter(
                                    (key) => key !== sportKey && key !== countryKey,
                                  ),
                                );
                              }
                            }}
                          >
                            <a className={classes["sidebar-item__title"]}>{league.desc}</a>
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
  );
};

Tree.propTypes = {
  activeEventId: PropTypes.number.isRequired,
  eventPathIds: PropTypes.array,
  isLive: PropTypes.bool.isRequired,
  isLivePage: PropTypes.bool.isRequired,
  isPrematchPage: PropTypes.bool.isRequired,
  widgetData: PropTypes.object.isRequired,
};

Tree.defaultProps = {
  eventPathIds: undefined,
};

export default React.memo(Tree);
