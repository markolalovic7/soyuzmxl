import cx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import ReactCountryFlag from "react-country-flag";
import { useHistory } from "react-router";

import { ReactComponent as FallbackWorldImage } from "../../../../../../assets/img/icons/World_Flag.svg";
import classes from "../../../../scss/ollehdesktop.module.scss";

const SportLeagueSelector = ({ countryLeagues, sportCountries }) => {
  const history = useHistory();

  return (
    <div className={classes["matches-sorting__body"]}>
      <div className={cx(classes["matches-sorting__item"], classes["matches-sorting__item_sport"])}>
        {sportCountries.map((country) => (
          <div
            className={cx(classes["matches-sorting__card"], classes["matches-sorting-card"])}
            key={country.id}
            onClick={() => history.push(`/prematch/eventpath/${country.path[0].id}`)}
          >
            <div className={classes["matches-sorting-card__icon"]}>
              {country.countryCode ? (
                <ReactCountryFlag
                  svg
                  // className={classes["overlay-burger__countryFlag"]}
                  countryCode={country.countryCode}
                  style={{ verticalAlign: "baseline" }}
                />
              ) : (
                <FallbackWorldImage className={classes["countryFlag"]} />
              )}
            </div>
            <div className={classes["matches-sorting-card__title"]}>{country.desc}</div>
            <div className={classes["matches-sorting-card__arrow"]}>
              <svg height="8" viewBox="0 0 5 8" width="5" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <g transform="rotate(90 2.5 4)">
                    <path d="M-.56 6.5L2.5 3.407 5.56 6.5l.94-.957-4-4.043-4 4.043z" fill="#aaa" />
                  </g>
                </g>
              </svg>
            </div>
          </div>
        ))}
      </div>
      <div className={cx(classes["matches-sorting__item"], classes["matches-sorting__item_country"])}>
        {countryLeagues.map((league) => (
          <div
            className={cx(classes["matches-sorting__card"], classes["matches-sorting-card"])}
            key={league.id}
            onClick={() => history.push(`/prematch/eventpath/${league.id}`)}
          >
            <div className={classes["matches-sorting-card__title"]}>{league.desc}</div>
            <div className={classes["matches-sorting-card__arrow"]}>
              <svg height="8" viewBox="0 0 5 8" width="5" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <g transform="rotate(90 2.5 4)">
                    <path d="M-.56 6.5L2.5 3.407 5.56 6.5l.94-.957-4-4.043-4 4.043z" fill="#aaa" />
                  </g>
                </g>
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

SportLeagueSelector.propTypes = {
  countryLeagues: PropTypes.func,
  sportCountries: PropTypes.array,
};

SportLeagueSelector.defaultProps = {
  countryLeagues: undefined,
  sportCountries: undefined,
};

export default React.memo(SportLeagueSelector);
