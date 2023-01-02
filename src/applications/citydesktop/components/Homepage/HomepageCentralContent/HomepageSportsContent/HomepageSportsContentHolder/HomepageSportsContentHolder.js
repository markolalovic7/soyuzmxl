import ComplexSportLabels from "applications/citydesktop/components/Common/ComplexSportLabels";
import MatchSummaryContentHolder from "applications/citydesktop/components/Common/MatchSummaryContentHolder";
import complexCouponSportCodes from "applications/citydesktop/components/Common/utils/complexCouponSportCodes.js";
import classes from "applications/citydesktop/scss/citywebstyle.module.scss";
import { ReactComponent as FallbackWorldImage } from "assets/img/icons/World_Flag.svg";
import PropTypes from "prop-types";
import React, { useState } from "react";
import ReactCountryFlag from "react-country-flag";

const sanitiseCountryCode = (code) => {
  if (true) {
    return code;
  }

  return "XX";
};

const HomepageSportsContentHolder = ({ favouriteEnabled, leagues, overviewPageMode }) => {
  const [collapsedLeagues, setCollapsedLeagues] = useState([]);

  const leagueItemToggleCollapsibleHandler = (id) => {
    if (collapsedLeagues.includes(id)) {
      setCollapsedLeagues(collapsedLeagues.filter((index) => id !== index));
    } else {
      setCollapsedLeagues([...collapsedLeagues, id]);
    }
  };

  return leagues
    ? leagues.map((league) => {
        const leagueDescription = `${league.categoryDescription} - ${league.tournamentDescription}`;
        const complexDisplayMode = !overviewPageMode && complexCouponSportCodes.includes(league.sportCode);

        return (
          <React.Fragment key={leagueDescription}>
            <div className={classes["sports-item"]} key={leagueDescription}>
              <div className={classes["sports-spoilers"]} key={leagueDescription}>
                <div
                  className={`${classes["sports-spoiler"]} ${
                    complexDisplayMode ? classes["sports-spoiler_labels"] : ""
                  }`}
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
                    {/*    className={`${classes['accordion-arrow']} ${!collapsedLeagues.includes(leagueDescription) ? classes['active'] : ''}`}/> */}
                  </div>
                  <div className={classes["sports-spoiler__wrapper"]}>
                    <div
                      className={`${classes["sports-spoiler__body"]} ${classes["accordion"]} ${
                        !collapsedLeagues.includes(league.tournamentId) ? classes["open"] : ""
                      }`}
                    >
                      {!collapsedLeagues.includes(league.tournamentId) &&
                        league.events.map((match) => (
                          <MatchSummaryContentHolder
                            favouriteEnabled={favouriteEnabled}
                            key={match.eventId}
                            match={match}
                            overviewPageMode={overviewPageMode}
                            sportCode={league.sportCode}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })
    : null;
};

const propTypes = {
  favouriteEnabled: PropTypes.bool,
  leagues: PropTypes.array,
  overviewPageMode: PropTypes.bool,
};
HomepageSportsContentHolder.propTypes = propTypes;
HomepageSportsContentHolder.defaultProps = { favouriteEnabled: false, overviewPageMode: false };

export default React.memo(HomepageSportsContentHolder);
