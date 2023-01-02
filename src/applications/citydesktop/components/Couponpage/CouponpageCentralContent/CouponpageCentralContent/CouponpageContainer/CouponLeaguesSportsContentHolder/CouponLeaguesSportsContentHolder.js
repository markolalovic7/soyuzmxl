import ComplexSportLabels from "applications/citydesktop/components/Common/ComplexSportLabels/index.js";
import MatchSummaryContentHolder from "applications/citydesktop/components/Common/MatchSummaryContentHolder/index.js";
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

const CouponHeader = (props) => {
  const { t } = useTranslation();
  const history = useHistory();

  if (props.leagues) {
    let rows = [];

    const getRows = (leagues) => {
      const arrays = [];
      if (leagues) {
        //
        // props.leagues.forEach(league => {
        //     const leagueDescription = `${league.categoryDescription} - ${league.tournamentDescription}`;
        //     children.push({id: league.id, description: leagueDescription});
        // });

        const size = 3;

        for (let i = 0; i < leagues.length; i += size) {
          arrays.push(leagues.slice(i, i + size));
        }
      }

      return arrays;
    };
    rows = getRows(props.leagues);

    const onNavigateToLeague = (leagueId) => {
      history.push(`/leagues/${props.sportCode}/${leagueId}`);
    };

    return (
      <div className={classes["sports-item"]} key={0}>
        <div className={classes["sports-spoilers"]} key={0}>
          <div className={classes["sports-spoiler"]}>
            <div className={`${classes["sports-spoiler__item"]}`}>
              <span className={classes["sports-spoiler__item-text"]}>{t("city.pages.coupon.coupon_leagues")}</span>
            </div>
            <div className={classes["sports-spoiler__wrapper"]}>
              <div className={`${classes["sports-spoiler__body"]}  ${classes["open"]}`}>
                {rows.map((row, index) => (
                  <div className={classes["event-content__row"]} key={index}>
                    {row.map((league) => {
                      const leagueDescription = `${league.categoryDescription} - ${league.tournamentDescription}`;

                      return (
                        <div
                          className={classes["event-content__coeficient"]}
                          key={league.tournamentId}
                          style={{ marginBottom: "5px" }}
                          onClick={() => onNavigateToLeague(league.tournamentId)}
                        >
                          <span className={classes["event-content__text"]}>{leagueDescription}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const CouponLeagues = (props) => {
  const { t } = useTranslation();
  const history = useHistory();

  if (props.leagues) {
    return props.leagues.map((league) => {
      const leagueDescription = `${league.categoryDescription} - ${league.tournamentDescription}`;

      const complexDisplayMode = complexCouponSportCodes.includes(league.sportCode);

      return (
        <>
          {/* <div key={leagueDescription} className={classes['sports-item']}> */}
          <div className={classes["sports-spoilers"]} key={leagueDescription}>
            <div
              className={`${classes["sports-spoiler"]} ${complexDisplayMode ? classes["sports-spoiler_labels"] : ""}`}
            >
              <div
                className={`${classes["sports-spoiler__item"]} ${classes["accordion"]} ${
                  !props.collapsedLeagues.includes(league.tournamentId) ? classes["active"] : ""
                } `}
                onClick={() => props.leagueItemToggleCollapsibleHandler(league.tournamentId)}
              >
                <span>
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
                  )}
                </span>
                <span className={classes["sports-spoiler__item-text"]}>
                  {leagueDescription}({league.events.length})
                </span>
                <ComplexSportLabels enabled={complexDisplayMode} />
                {/* <span */}
                {/*    className={`${classes['accordion-arrow']} ${!props.collapsedLeagues.includes(leagueDescription) ? classes['active'] : ''}`}></span> */}
              </div>
              <div className={classes["sports-spoiler__wrapper"]}>
                <div
                  className={`${classes["sports-spoiler__body"]} ${classes["accordion"]} ${
                    !props.collapsedLeagues.includes(league.tournamentId) ? classes["open"] : ""
                  }`}
                >
                  {!props.collapsedLeagues.includes(league.tournamentId) &&
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
          {!props.collapsedLeagues.includes(league.tournamentId) && league.events.length > 5 ? (
            <div
              className={classes["sports-spoiler__button"]}
              style={{ cursor: "pointer" }}
              onClick={() => history.push(`/leagues/${props.sportCode}/${league.tournamentId}`)}
            >
              <div>{t("go_to_leagues_view")}</div>
            </div>
          ) : null}
          {/* </div> */}
        </>
      );
    });
  }

  return null;
};

const CouponLeaguesSportsContentHolder = (props) => {
  const [collapsedLeagues, setCollapsedLeagues] = useState([]);

  const leagueItemToggleCollapsibleHandler = (id) => {
    if (collapsedLeagues.includes(id)) {
      setCollapsedLeagues(collapsedLeagues.filter((index) => id !== index));
    } else {
      setCollapsedLeagues([...collapsedLeagues, id]);
    }
  };

  return (
    <>
      <CouponHeader
        leagueItemToggleCollapsibleHandler={leagueItemToggleCollapsibleHandler}
        leagues={props.leagues}
        sportCode={props.sportCode}
      />
      <CouponLeagues
        collapsedLeagues={collapsedLeagues}
        leagueItemToggleCollapsibleHandler={leagueItemToggleCollapsibleHandler}
        leagues={props.leagues}
        sportCode={props.sportCode}
      />
    </>
  );
}

export default React.memo(CouponLeaguesSportsContentHolder);
