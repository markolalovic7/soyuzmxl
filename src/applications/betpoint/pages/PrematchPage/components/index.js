import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/betpoint/scss/betpoint.module.scss";
import cx from "classnames";
import React, { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link, useParams } from "react-router-dom";

import { ReactComponent as FallbackWorldImage } from "../../../../../assets/img/icons/World_Flag.svg";
import { logout } from "../../../../../redux/actions/auth-actions";
import { getSportsSelector } from "../../../../../redux/reselect/sport-selector";
import { getSportsTreeSelector } from "../../../../../redux/reselect/sport-tree-selector";
import { getPatternMyBets } from "../../../../../utils/route-patterns";
import BetslipPanel from "../../../components/BetslipPanel";
import CentralSportsContent from "../../../components/CentralSportsContent";
import Header from "../../../components/Header";

const PrematchPage = () => {
  const { sportCode } = useParams();
  const { eventPathId: eventPathIdStr } = useParams();
  const { eventId: eventIdStr } = useParams();

  const eventId = eventIdStr ? Number(eventIdStr) : undefined;
  const eventPathId = eventPathIdStr ? Number(eventPathIdStr) : undefined;

  const dispatch = useDispatch();
  const history = useHistory();

  const sports = useSelector(getSportsSelector);
  const sportsTreeData = useSelector(getSportsTreeSelector);

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

  const { t } = useTranslation();

  return (
    <div className={classes["betpoint-body"]}>
      <div className={classes["wrapper"]}>
        <Header />

        <div className={classes["main"]}>
          <div className={classes["main__container"]}>
            <div className={classes["sidebar"]}>
              <div className={classes["sidebar__content"]}>
                <div className={classes["sidebar__title"]}>
                  <div className={classes["sidebar__text"]}>
                    {sports && sports[sportCode] ? sports[sportCode].description : ""}
                  </div>
                </div>
                <div className={classes["sidebar-menu"]}>
                  <ul className={classes["sidebar-menu__list"]}>
                    {sportsTreeData.map((item) => {
                      if (item.code !== sportCode) return null;

                      return item?.path.map((category) => {
                        const categoryKey = `category-${category.id}`;

                        return (
                          <li className={classes["sidebar-menu__item"]} key={categoryKey}>
                            <div
                              className={cx(classes["sidebar-menu__item-content"], classes["accordion"], {
                                [classes["active"]]: expandedSportsTreeItems.includes(categoryKey),
                              })}
                              onClick={(e) => onToggleSportsTreeItem(e, categoryKey)}
                            >
                              <span className={classes["sidebar-menu__arrow"]}>
                                <FontAwesomeIcon icon={faArrowRight} />
                              </span>
                              <span className={classes["sidebar-menu__flag"]}>
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
                              <h4 className={classes["sidebar-menu__title"]}>{category.desc}</h4>
                            </div>
                            <ul className={classes["sidebar-menu__sublist"]}>
                              {category?.path &&
                                category.path.map((tournament) => {
                                  const tournamentKey = `tournament-${tournament.id}`;

                                  return (
                                    <li className={classes["sidebar-menu__subitem"]} key={tournamentKey}>
                                      <Link
                                        className={cx(
                                          classes["sidebar-menu__subitem-content"],
                                          classes["accordion"],
                                          {
                                            [classes["open"]]: expandedSportsTreeItems.includes(categoryKey),
                                          },
                                          {
                                            [classes["active"]]: tournament.id === eventPathId,
                                          },
                                        )}
                                        to={`/prematch/sport/${sportCode}/eventpath/${tournament.id}`}
                                      >
                                        <h5 className={classes["sidebar-menu__title"]}>{tournament.desc}</h5>
                                      </Link>
                                    </li>
                                  );
                                })}
                            </ul>
                          </li>
                        );
                      });
                    })}
                  </ul>
                </div>
              </div>
              <div className={classes["sidebar__controls"]}>
                <div className={classes["sidebar__control"]} onClick={() => history.push("/")}>
                  Main Menu
                </div>
                <div className={classes["sidebar__control"]} onClick={() => history.push(getPatternMyBets())}>
                  History
                </div>
                <div className={classes["sidebar__control"]} onClick={() => history.push("/promotions")}>
                  Promotions
                </div>
                <div className={classes["sidebar__control"]} onClick={() => dispatch(logout())}>
                  Logout
                </div>
              </div>
            </div>

            <CentralSportsContent
              eventId={eventId}
              eventPathId={eventPathId}
              live={false}
              max={undefined}
              sportCode={sportCode}
              virtual={false}
            />

            <BetslipPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrematchPage);
