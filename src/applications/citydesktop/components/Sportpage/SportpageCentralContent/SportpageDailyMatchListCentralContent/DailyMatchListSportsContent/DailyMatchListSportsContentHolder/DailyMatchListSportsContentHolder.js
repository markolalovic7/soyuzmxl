import ComplexSportLabels from "applications/citydesktop/components/Common/ComplexSportLabels/index.js";
import MatchSummaryContentHolder from "applications/citydesktop/components/Common/MatchSummaryContentHolder/index.js";
import complexCouponSportCodes from "applications/citydesktop/components/Common/utils/complexCouponSportCodes.js";
import classes from "applications/citydesktop/scss/citywebstyle.module.scss";
import { ReactComponent as FallbackWorldImage } from "assets/img/icons/World_Flag.svg";
import React, { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const sanitiseCountryCode = (code) => {
  if (true) {
    return code;
  }

  return "XX";
};

const getNumberOfMatches = (categories) => {
  let totalNumberOfMatches = 0;

  if (categories) {
    categories.forEach((c) => {
      totalNumberOfMatches += c.events.length;
    });
  }

  return totalNumberOfMatches;
};

const DailyMatchListSportsContentHolder = (props) => {
  const { t } = useTranslation();
  const sports = useSelector((state) => state.sport.sports);

  const [collapsedCategories, setCollapsedCategories] = useState([]);
  const [selectorOpened, setSelectorOpened] = useState(false);

  const categoryItemToggleCollapsibleHandler = (id) => {
    if (collapsedCategories.includes(id)) {
      setCollapsedCategories(collapsedCategories.filter((index) => id !== index));
    } else {
      setCollapsedCategories([...collapsedCategories, id]);
    }
  };

  // {/*<div className={classes['sports-title']}>{sports ? sports[props.sportCode].description : ''}*/}
  // {/*    <FontAwesomeIcon icon={faSlidersH}*/}
  // {/*                     onClick={props.onToggleSortMode}*/}
  // {/*                     style={{position: 'absolute', right: '20px'}}*/}
  // {/*    />*/}
  // {/*</div>*/}

  return (
    <div className={classes["sports-item"]}>
      <h3 className={`${classes["sports-title"]}`}>
        {sports ? sports[props.sportCode].description : ""} ({getNumberOfMatches(props.categories)})
        <div
          className={`${classes["sports-title__settings"]} ${selectorOpened ? classes["active"] : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setSelectorOpened((prevState) => !prevState);
          }}
        >
          <svg
            className={classes["sports-title__settings-svg"]}
            fill="none"
            height="13"
            viewBox="0 0 13 13"
            width="13"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6.39167 1.3C6.06667 0.541667 5.41667 0 4.55 0C3.68333 0 3.03333 0.541667 2.70833 1.3H0V2.6H2.70833C2.925 3.35833 3.68333 3.9 4.55 3.9C5.41667 3.9 6.06667 3.35833 6.39167 2.6H13V1.3H6.39167ZM4.55 2.6C4.225 2.6 3.9 2.275 3.9 1.95C3.9 1.625 4.225 1.3 4.55 1.3C4.875 1.3 5.2 1.625 5.2 1.95C5.2 2.275 4.875 2.6 4.55 2.6ZM8.45 4.55C9.31667 4.55 9.96667 5.09167 10.2917 5.85H13V7.15H10.2917C9.96667 7.90833 9.31667 8.45 8.45 8.45C7.58333 8.45 6.93333 7.90833 6.60833 7.15H0V5.85H6.60833C6.93333 5.09167 7.58333 4.55 8.45 4.55ZM8.45 7.15C8.775 7.15 9.1 6.825 9.1 6.5C9.1 6.175 8.775 5.85 8.45 5.85C8.125 5.85 7.8 6.175 7.8 6.5C7.8 6.825 8.125 7.15 8.45 7.15ZM3.9 9.1C4.76667 9.1 5.41667 9.64167 5.74167 10.4H13V11.7H5.74167C5.41667 12.4583 4.76667 13 3.9 13C3.03333 13 2.38333 12.4583 2.05833 11.7H0V10.4H2.05833C2.38333 9.64167 3.03333 9.1 3.9 9.1ZM3.9 11.7C4.225 11.7 4.55 11.375 4.55 11.05C4.55 10.725 4.225 10.4 3.9 10.4C3.575 10.4 3.25 10.725 3.25 11.05C3.25 11.375 3.575 11.7 3.9 11.7Z" />
          </svg>
          <div className={classes["filter"]}>
            <span className={classes["filter__title"]}>{`${t("city.pages.sport.sort_by")}:`}</span>
            <div className={classes["filter__body"]}>
              <div
                className={classes["filter__league"]}
                onClick={(e) => {
                  e.stopPropagation();
                  props.onToggleSortMode("LEAGUE");
                  setSelectorOpened(false);
                }}
              >
                {`${t("city.pages.sport.sort_by_league")}`}
              </div>
              <div
                className={classes["filter__time"]}
                onClick={(e) => {
                  e.stopPropagation();
                  props.onToggleSortMode("TIME");
                  setSelectorOpened(false);
                }}
              >
                {`${t("city.pages.sport.sort_by_time")}`}
              </div>
            </div>
          </div>
        </div>
      </h3>
      {props.categories
        ? props.categories.map((category) => {
            if (props.toggleMode === "TIME") {
              const time = category.time;

              return (
                <div className={classes["sports-item"]} key={category.time}>
                  <div className={classes["sports-spoilers"]} key={category.time}>
                    <div className={`${classes["sports-spoiler"]}`}>
                      <div
                        className={`${classes["sports-spoiler__item"]} ${classes["accordion"]} ${
                          !collapsedCategories.includes(time) ? classes["active"] : ""
                        }`}
                        onClick={() => categoryItemToggleCollapsibleHandler(time)}
                      >
                        <span className={classes["sports-spoiler__item-text"]}>
                          {time} ({category.events.length})
                        </span>
                        {/* <span */}
                        {/*    className={`${classes['accordion-arrow']} ${!collapsedCategories.includes(time) ? classes['active'] : ''}`}></span> */}
                      </div>
                      <div className={classes["sports-spoiler__wrapper"]}>
                        <div className={`${classes["sports-spoiler__body"]}  ${classes["open"]}`}>
                          {!collapsedCategories.includes(time) &&
                            category.events.map((match) => (
                              <MatchSummaryContentHolder
                                key={match.eventId}
                                leagueAndCountryDesc={`${match.categoryDescription} - ${match.tournamentDescription}`}
                                match={match}
                                sportCode={props.sportCode}
                              />
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            const leagueDescription = `${category.categoryDescription} - ${category.tournamentDescription}`;
            const complexDisplayMode = complexCouponSportCodes.includes(props.sportCode);

            return (
              <div className={classes["sports-item"]} key={leagueDescription}>
                <div className={classes["sports-spoilers"]} key={leagueDescription}>
                  <div
                    className={`${classes["sports-spoiler"]} ${
                      complexDisplayMode ? classes["sports-spoiler_labels"] : ""
                    }`}
                  >
                    <div
                      className={`${classes["sports-spoiler__item"]} ${classes["accordion"]} ${
                        !collapsedCategories.includes(category.tournamentId) ? classes["active"] : ""
                      }`}
                      onClick={() => categoryItemToggleCollapsibleHandler(category.tournamentId)}
                    >
                      <span>
                        {" "}
                        {category.countryCode ? (
                          <ReactCountryFlag
                            svg
                            className={classes["sports-spoiler__item-icon"]}
                            countryCode={sanitiseCountryCode(category.countryCode)}
                          />
                        ) : (
                          <FallbackWorldImage
                            className={classes["sports-spoiler__item-icon"]}
                            style={{ height: "1em", width: "1em" }}
                          />
                        )}{" "}
                      </span>
                      <span className={classes["sports-spoiler__item-text"]}>
                        {leagueDescription} ({category.events.length})
                      </span>
                      <ComplexSportLabels enabled={complexDisplayMode} />
                      {/* <span */}
                      {/*    className={`${classes['accordion-arrow']} ${!collapsedCategories.includes(leagueDescription) ? classes['active'] : ''}`}></span> */}
                    </div>
                    <div className={classes["sports-spoiler__wrapper"]}>
                      <div
                        className={`${classes["sports-spoiler__body"]} ${classes["accordion"]} ${
                          !collapsedCategories.includes(category.tournamentId) ? classes["open"] : ""
                        }`}
                      >
                        {!collapsedCategories.includes(category.tournamentId) &&
                          category.events.map((match) => (
                            <MatchSummaryContentHolder
                              key={match.eventId}
                              match={match}
                              sportCode={category.sportCode}
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
};

export default React.memo(DailyMatchListSportsContentHolder);
