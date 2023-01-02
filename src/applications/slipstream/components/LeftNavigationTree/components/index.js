import { faGem } from "@fortawesome/free-regular-svg-icons";
import { faDesktop, faHome } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import trim from "lodash.trim";
import React, { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link, useLocation } from "react-router-dom";

import { ReactComponent as FallbackWorldImage } from "../../../../../assets/img/icons/World_Flag.svg";
import { getAuthLanguage, getAuthTimezoneOffset } from "../../../../../redux/reselect/auth-selector";
import { getSportsTreeSelector } from "../../../../../redux/reselect/sport-tree-selector";
import { searchForCouponData } from "../../../../../redux/slices/couponSlice";
import { getEvents } from "../../../../../utils/prematch-data-utils";
import { getPatternHome } from "../../../../../utils/route-patterns";
import classes from "../../../scss/slipstream.module.scss";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

const VIRTUAL_SPORTS = [
  { desc: "Football", eventPathId: 240, live: false },
  { desc: "Basketball", eventPathId: 227, live: false },
  { desc: "Baseball", eventPathId: 226, live: true },
  { desc: "Tennis", eventPathId: 239, live: true },
];

const LeftNavigationTree = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const pathname = location.pathname;

  const authLanguage = useSelector(getAuthLanguage);
  const timezoneOffset = useSelector(getAuthTimezoneOffset);
  const sportsTreeData = useSelector(getSportsTreeSelector);
  const searchCouponData = useSelector((state) => state.coupon.searchCouponData);
  const searchLoading = useSelector((state) => state.coupon.searchLoading);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchString, setSearchString] = useState("");

  const [expandedSportsTreeItems, setExpandedSportsTreeItems] = useState([]);

  const onToggleSportsTreeItem = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (expandedSportsTreeItems.includes(id)) {
      setExpandedSportsTreeItems(expandedSportsTreeItems.filter((x) => x !== id));
    } else {
      setExpandedSportsTreeItems([...expandedSportsTreeItems, id]);
    }
  };

  const onChangeSearchInputHandler = (e) => {
    setSearchString(e.target.value);
  };

  const enoughCharsForSearch =
    (authLanguage === "en" && trim(searchString).length > 2) ||
    (authLanguage !== "en" && trim(searchString).length > 0);

  const onSearchHandler = () => {
    if (enoughCharsForSearch) {
      const eventPathSubscriptionData = {
        allMarkets: false,
        keyword: searchString,
        live: false,
        virtual: false,
        // african: false,
        // asianCriteria: null,
        // marketTypeGroups: null,
        // count: null,
        // from: null,
      };

      dispatch(searchForCouponData({ ...eventPathSubscriptionData }));
    }
  };

  const searchEvents = searchCouponData ? getEvents(Object.values(searchCouponData)) : [];

  const onSelectEventHandler = (live, tournamentId, matchId) => {
    if (live) {
      history.push(`/prematch/eventpath/${tournamentId}/event/${matchId}?live=1`);
    } else {
      history.push(`/prematch/eventpath/${tournamentId}/event/${matchId}`);
    }
    setSearchString("");
  };

  return (
    <div className={classes["sidebar"]}>
      <div
        className={cx(classes["sidebar__item"], classes["sidebar__item_menu"])}
        onClick={() => setIsSearchOpen((prevState) => !prevState)}
      >
        <div className={classes["sidebar__icon"]}>
          <i className={classes["qicon-futs"]} />
        </div>
        <div className={classes["sidebar__title"]}>All events</div>
      </div>
      <div className={cx(classes["sidebar__menu"], classes["sidebar-menu"], { [classes["collapsed"]]: isSearchOpen })}>
        <ul className={classes["sidebar-menu__list"]}>
          <li className={classes["sidebar-menu__item"]}>
            <Link className={cx(classes["accordion"], classes["sidebar-menu__item-content"])} to={getPatternHome()}>
              <span className={classes["sidebar-menu__icon"]}>
                <FontAwesomeIcon icon={faHome} />
              </span>
              <h4 className={classes["sidebar-menu__title"]}>Home</h4>
            </Link>
          </li>
          {sportsTreeData?.find((sport) => sport.criterias?.live) && (
            <li className={classes["sidebar-menu__item"]}>
              <div
                className={cx(classes["accordion"], classes["sidebar-menu__item-content"], {
                  [classes["active"]]: expandedSportsTreeItems.includes("live-key"),
                })}
                onClick={(e) => onToggleSportsTreeItem(e, "live-key")}
              >
                <span className={classes["sidebar-menu__icon"]}>
                  <i className={classes["qicon-foot"]} />
                </span>
                <h4 className={classes["sidebar-menu__title"]}>In play</h4>
              </div>
              <ul className={classes["sidebar-menu__sublist"]}>
                {sportsTreeData
                  ?.filter((sport) => sport.criterias?.live)
                  ?.map((item) => (
                    <li className={classes["sidebar-menu__subitem"]} key={item.id}>
                      <div
                        className={cx(
                          classes["sidebar-menu__subitem-content"],
                          classes["accordion"],
                          {
                            [classes["open"]]: expandedSportsTreeItems.includes("live-key"),
                          },
                          {
                            [classes["selected"]]: location.pathname === `/live/sport/${item.code}`,
                          },
                        )}
                        onClick={() => history.push(`/live/sport/${item.code}`)}
                      >
                        <h5 className={classes["sidebar-menu__title"]}>{item.desc}</h5>
                      </div>
                    </li>
                  ))}
              </ul>
            </li>
          )}
          <li className={classes["sidebar-menu__item"]}>
            <div
              className={cx(classes["accordion"], classes["sidebar-menu__item-content"], {
                [classes["active"]]: expandedSportsTreeItems.includes("virtual-key"),
              })}
              onClick={(e) => onToggleSportsTreeItem(e, "virtual-key")}
            >
              <span className={classes["sidebar-menu__icon"]}>
                <FontAwesomeIcon icon={faDesktop} />
              </span>
              <h4 className={classes["sidebar-menu__title"]}>Virtual Sports</h4>
            </div>
            <ul className={classes["sidebar-menu__sublist"]}>
              {VIRTUAL_SPORTS.map((virtualSport) => (
                <li className={classes["sidebar-menu__subitem"]} key={virtualSport.eventPathId}>
                  <div
                    className={cx(classes["sidebar-menu__subitem-content"], classes["accordion"], {
                      [classes["open"]]: expandedSportsTreeItems.includes("virtual-key"),
                    })}
                    onClick={() =>
                      history.push(
                        `/prematch/eventpath/${virtualSport.eventPathId}?max=20&virtual=1${
                          virtualSport.live ? "&live=1" : ""
                        }`,
                      )
                    }
                  >
                    <h5 className={classes["sidebar-menu__title"]}>{virtualSport.desc}</h5>
                  </div>
                </li>
              ))}
            </ul>
          </li>
          <li className={classes["sidebar-menu__item"]}>
            <a className={cx(classes["accordion"], classes["sidebar-menu__item-content"])} href="#">
              <span className={classes["sidebar-menu__icon"]}>
                <FontAwesomeIcon icon={faGem} />
              </span>
              <h4 className={classes["sidebar-menu__title"]}>Jackpot bets</h4>
            </a>
          </li>

          {sportsTreeData.map((item) => {
            const sportsKey = `sports-${item.id}`;

            return (
              <li className={classes["sidebar-menu__item"]} key={sportsKey}>
                <div
                  className={cx(classes["accordion"], classes["sidebar-menu__item-content"], {
                    [classes["active"]]: expandedSportsTreeItems.includes(sportsKey),
                  })}
                  onClick={(e) => onToggleSportsTreeItem(e, sportsKey)}
                >
                  <span className={classes["sidebar-menu__icon"]}>
                    <i className={cx(classes["qicon-default"], classes[`qicon-${item.code.toLowerCase()}`])} />
                  </span>
                  <h4 className={classes["sidebar-menu__title"]}>{item.desc}</h4>
                </div>
                <ul className={classes["sidebar-menu__sublist"]}>
                  <li className={classes["sidebar-menu__subitem"]}>
                    <div
                      className={cx(
                        classes["sidebar-menu__subitem-content"],
                        classes["accordion"],
                        {
                          [classes["open"]]: expandedSportsTreeItems.includes(sportsKey),
                        },
                        {
                          [classes["selected"]]: location.pathname === `/prematch/eventpath/${item.id}`,
                        },
                      )}
                      onClick={() => history.push(`/prematch/eventpath/${item.id}?max=5`)}
                    >
                      <h5 className={classes["sidebar-menu__title"]}>Next 5 Matches</h5>
                    </div>
                  </li>

                  {item?.path &&
                    item.path.map((category) => {
                      const categoryKey = `category-${category.id}`;

                      return (
                        <li className={classes["sidebar-menu__subitem"]} key={categoryKey}>
                          <div
                            className={cx(classes["sidebar-menu__subitem-content"], classes["accordion"], {
                              [classes["open"]]: expandedSportsTreeItems.includes(sportsKey),
                            })}
                            onClick={(e) => onToggleSportsTreeItem(e, categoryKey)}
                          >
                            <span className={classes["sidebar-menu__icon"]}>
                              {category.countryCode ? (
                                <ReactCountryFlag svg countryCode={category.countryCode} />
                              ) : (
                                <FallbackWorldImage
                                  style={{
                                    height: "1em",
                                    verticalAlign: "middle",
                                    width: "1em",
                                  }}
                                />
                              )}
                            </span>
                            <h5 className={classes["sidebar-menu__title"]}>{category.desc}</h5>
                          </div>
                          <ul className={classes["sidebar-menu__subsublist"]}>
                            {category?.path &&
                              category.path.map((tournament) => {
                                const tournamentKey = `tournament-${tournament.id}`;

                                return (
                                  <li className={classes["sidebar-menu__subsubsubitem"]} key={tournamentKey}>
                                    <div
                                      className={cx(
                                        classes["sidebar-menu__subsubsubitem-content"],
                                        classes["accordion"],
                                        {
                                          [classes["open"]]: expandedSportsTreeItems.includes(categoryKey),
                                        },
                                        {
                                          [classes["selected"]]:
                                            location.pathname === `/prematch/eventpath/${tournament.id}`,
                                        },
                                      )}
                                      onClick={() => history.push(`/prematch/eventpath/${tournament.id}`)}
                                    >
                                      <span className={classes["sidebar-menu__title"]}>{tournament.desc}</span>
                                    </div>
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
      </div>
      <div className={classes["sidebar-search"]}>
        <div
          className={cx(classes["sidebar__item"], classes["sidebar__item_search"])}
          onClick={() => setIsSearchOpen((prevState) => !prevState)}
        >
          <div className={classes["sidebar__icon"]}>
            <i className={classes["qicon-search"]} />
          </div>
          <div className={classes["sidebar__title"]}>Search events</div>
        </div>
        <div className={classes["sidebar-search__body"]}>
          <div className={classes["sidebar-search__input"]}>
            <input placeholder="Search..." type="text" value={searchString} onChange={onChangeSearchInputHandler} />
          </div>
          <button
            className={cx(classes["sidebar-search__button"], { [classes["disabled"]]: !enoughCharsForSearch })}
            disabled={!enoughCharsForSearch}
            type="submit"
            onClick={onSearchHandler}
          >
            {searchLoading ? (
              <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} />
            ) : (
              "Search"
            )}
          </button>
          <div className={classes["sidebar-search__results"]}>
            <div className={classes["sidebar-search__label"]}>Search Result</div>
          </div>
          <ul className={classes["sidebar-search__found"]}>
            {searchEvents?.map((match) => (
              <li
                className={classes["sidebar-search__result"]}
                key={match.id}
                onClick={() => onSelectEventHandler(match.type === "l", match.parent.substring(1), match.id)}
              >
                {match.desc}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LeftNavigationTree);
