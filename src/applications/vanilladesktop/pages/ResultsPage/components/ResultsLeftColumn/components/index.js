import cx from "classnames";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { getCmsConfigIframeMode } from "../../../../../../../redux/reselect/cms-selector";
import classes from "../../../../../scss/vanilladesktop.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

const propTypes = {
  activePath: PropTypes.number,
  setActivePath: PropTypes.func.isRequired,
};

const defaultProps = {
  activePath: undefined,
};

const ResultsLeftColumn = ({ activePath, setActivePath }) => {
  const { t } = useTranslation();
  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  const results = useSelector((state) => state.result.standardResults);
  const loading = useSelector((state) => state.result.loading);

  const [collapsedSections, setCollapsedSections] = useState([]);

  const sectionToggleCollapsibleHandler = (id) => {
    if (collapsedSections.includes(id)) {
      setCollapsedSections(collapsedSections.filter((sectionId) => id !== sectionId));
    } else {
      setCollapsedSections([...collapsedSections, id]);
    }
  };

  return (
    <div className={cx(classes["left-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
      <div className={classes["left-section__content"]}>
        <div className={classes["left-section__item"]}>
          <h3 className={classes["left-section__title"]}>{t("sports")}</h3>
          {loading && <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />}
          {!loading && (
            <div className={classes["menu-sports"]}>
              <ul className={classes["menu-sports__list"]}>
                {results?.sports?.map((sport) => (
                  <li className={classes["menu-sports__item"]} key={sport.sportCode}>
                    <div
                      className={cx(classes["menu-sports__item-content"], classes["accordion"], {
                        [classes["active"]]: activePath?.activePathId === sport.id,
                      })}
                    >
                      <span className={classes["menu-sports__item-icon"]}>
                        <span
                          className={cx(classes["qicon-default"], classes[`qicon-${sport.sportCode.toLowerCase()}`])}
                        />
                      </span>
                      <h4
                        className={classes["menu-sports__item-title"]}
                        onClick={() =>
                          setActivePath({
                            activePathId: sport.id,
                            sportCode: sport.sportCode,
                            sportId: sport.id,
                          })
                        }
                      >
                        {sport.description}
                      </h4>
                      {/* <span className={classes["menu-sports__item-numbers"]}>333</span> */}
                      <span
                        className={cx(classes["menu-sports__item-arrow"], classes["accordion-arrow"], {
                          [classes["active"]]: collapsedSections.includes(sport.id),
                        })}
                        onClick={() => sectionToggleCollapsibleHandler(sport.id)}
                      />
                    </div>

                    {sport.categories.map((category) => (
                      <ul className={classes["menu-sports__sublist"]} key={category.id}>
                        <li className={classes["menu-sports__subitem"]}>
                          <div
                            className={cx(
                              classes["menu-sports__subitem-content"],
                              classes["accordion"],
                              {
                                [classes["open"]]: collapsedSections.includes(sport.id),
                              },
                              classes["accordion"],
                              {
                                [classes["active"]]: activePath?.activePathId === category.id,
                              },
                            )}
                          >
                            <h5
                              className={classes["menu-sports__subitem-title"]}
                              onClick={() =>
                                setActivePath({
                                  activePathId: category.id,
                                  categoryId: category.id,
                                  sportCode: sport.sportCode,
                                  sportId: sport.id,
                                })
                              }
                            >
                              {category.description}
                            </h5>
                            {/* <span className={classes["menu-sports__item-numbers"]}>333</span> */}
                            <span
                              className={cx(classes["menu-sports__item-arrow"], classes["accordion-arrow"], {
                                [classes["active"]]: collapsedSections.includes(category.id),
                              })}
                              onClick={() => sectionToggleCollapsibleHandler(category.id)}
                            />
                          </div>
                          {category.tournaments.map((tournament) => (
                            <ul className={classes["menu-sports__subsublist"]} key={tournament.id}>
                              <li className={classes["menu-sports__subsubitem"]}>
                                <div
                                  className={cx(
                                    classes["menu-sports__subsubitem-content"],
                                    classes["accordion"],
                                    {
                                      [classes["open"]]: collapsedSections.includes(category.id),
                                    },
                                    {
                                      [classes["active"]]: activePath?.activePathId === tournament.id,
                                    },
                                  )}
                                  style={{ cursor: "pointer" }}
                                >
                                  <span
                                    className={classes["menu-sports__subsubitem-title"]}
                                    onClick={() =>
                                      setActivePath({
                                        activePathId: tournament.id,
                                        categoryId: category.id,
                                        sportCode: sport.sportCode,
                                        sportId: sport.id,
                                        tournamentId: tournament.id,
                                      })
                                    }
                                  >
                                    {tournament.description}
                                  </span>
                                  {/* <span className={classes["menu-sports__item-numbers"]}>111</span> */}
                                </div>
                              </li>
                            </ul>
                          ))}
                        </li>
                      </ul>
                    ))}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ResultsLeftColumn.propTypes = propTypes;
ResultsLeftColumn.defaultProps = defaultProps;

export default React.memo(ResultsLeftColumn);
