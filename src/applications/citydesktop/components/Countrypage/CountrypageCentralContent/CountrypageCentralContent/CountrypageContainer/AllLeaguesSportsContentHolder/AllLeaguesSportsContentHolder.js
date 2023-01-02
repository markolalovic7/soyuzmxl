import ComplexSportLabels from "applications/citydesktop/components/Common/ComplexSportLabels";
import MatchSummaryContentHolder from "applications/citydesktop/components/Common/MatchSummaryContentHolder";
import complexCouponSportCodes from "applications/citydesktop/components/Common/utils/complexCouponSportCodes.js";
import classes from "applications/citydesktop/scss/citywebstyle.module.scss";
import { ReactComponent as FallbackWorldImage } from "assets/img/icons/World_Flag.svg";
import React, { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";

const sanitiseCountryCode = (code) => {
  if (true) {
    return code;
  }

  return "XX";
};

const AllLeaguesSportsContentHolder = (props) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [collapsedLeagues, setCollapsedLeagues] = useState([]);

  const leagueItemToggleCollapsibleHandler = (id) => {
    if (collapsedLeagues.includes(id)) {
      setCollapsedLeagues(collapsedLeagues.filter((tournamentId) => id !== tournamentId));
    } else {
      setCollapsedLeagues([...collapsedLeagues, id]);
    }
  };

  const complexDisplayMode = complexCouponSportCodes.includes(props.sportCode);

  return props.leagues
    ? props.leagues.map((league) => {
        const leagueDescription = `${league.categoryDescription} - ${league.tournamentDescription}`;

        return (
          <React.Fragment key={leagueDescription}>
            {/* <div key={leagueDescription} className={classes['sports-item']}> */}
            <div className={classes["sports-spoilers"]} key={leagueDescription}>
              <div
                className={`${classes["sports-spoiler"]} ${complexDisplayMode ? classes["sports-spoiler_labels"] : ""}`}
              >
                <div
                  className={`${classes["sports-spoiler__item"]} ${classes["accordion"]} ${
                    !collapsedLeagues.includes(league.tournamentId) ? classes["active"] : ""
                  }`}
                  onClick={() => leagueItemToggleCollapsibleHandler(league.tournamentId)}
                >
                  <span>
                    {" "}
                    {league.countryCode ? (
                      <ReactCountryFlag
                        svg
                        className={classes["sports-spoiler__item-icon"]}
                        countryCode={sanitiseCountryCode(league.countryCode)}
                      />
                    ) : (
                      <FallbackWorldImage
                        className={classes["sports-spoiler__item-icon"]}
                        style={{ height: "1em", width: "1em" }}
                      />
                    )}{" "}
                  </span>
                  <span className={classes["sports-spoiler__item-text"]}>
                    {leagueDescription} ({league.events.length})
                  </span>
                  <ComplexSportLabels enabled={complexDisplayMode} />
                  {/* <span */}
                  {/*    className={`${classes['accordion-arrow']} ${!collapsedLeagues.includes(leagueDescription) ? classes['active'] : ''}`}></span> */}
                </div>
                <div className={classes["sports-spoiler__wrapper"]}>
                  <div
                    className={`${classes["sports-spoiler__body"]} ${classes["accordion"]} ${
                      !collapsedLeagues.includes(league.tournamentId) ? classes["open"] : ""
                    }`}
                  >
                    {!collapsedLeagues.includes(league.tournamentId) &&
                      league.events.map((match, index) => {
                        if (index < 5) {
                          return (
                            <MatchSummaryContentHolder key={match.eventId} match={match} sportCode={league.sportCode} />
                          );
                        }

                        return null;
                      })}
                  </div>
                </div>
              </div>
            </div>
            {!collapsedLeagues.includes(league.tournamentId) && league.events.length > 5 ? (
              <div
                className={classes["sports-spoiler__button"]}
                style={{ cursor: "pointer" }}
                onClick={() => history.push(`/leagues/${props.sportCode}/${league.tournamentId}`)}
              >
                <div>{t("go_to_leagues_view")}</div>
              </div>
            ) : null}
            {/* </div> */}
          </React.Fragment>
        );
      })
    : null;
};

export default React.memo(AllLeaguesSportsContentHolder);
