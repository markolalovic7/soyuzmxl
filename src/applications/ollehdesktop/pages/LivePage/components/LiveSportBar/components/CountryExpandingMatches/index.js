import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/ollehdesktop/scss/ollehdesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import React, { useState } from "react";
import ReactCountryFlag from "react-country-flag";

import { ReactComponent as FallbackWorldImage } from "../../../../../../../../assets/img/icons/World_Flag.svg";
import LiveMatch from "../LiveMatch";

const matchData = PropTypes.shape({
  id: PropTypes.number.isRequired,
  part: PropTypes.string.isRequired,
  result: PropTypes.string.isRequired,
  teamLeft: PropTypes.string.isRequired,
  teamRight: PropTypes.string.isRequired,
});

const propTypes = {
  countryCode: PropTypes.string,
  countryName: PropTypes.string.isRequired,
  matches: PropTypes.arrayOf(matchData).isRequired,
  onSelectMatch: PropTypes.func.isRequired,
};

const defaultProps = {
  countryCode: undefined,
};

const CountryExpandingMatches = ({ countryCode, countryName, matches, onSelectMatch }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={classes["country__spoiler"]}>
      <div
        className={cx(classes["country__spoiler-header"], { [classes["active"]]: isExpanded })}
        onClick={() => setIsExpanded((isExpanded) => !isExpanded)}
      >
        <FontAwesomeIcon icon={faChevronRight} />
        {/* <img alt={countryName} src={flag} /> */}
        {countryCode ? (
          <ReactCountryFlag
            svg
            countryCode={countryCode}
            style={{ fontSize: "1.5em", lineHeight: "1.5em", verticalAlign: "baseline" }}
          />
        ) : (
          <FallbackWorldImage
            style={{
              fontSize: "1.5em",
              height: "1em",
              lineHeight: "1.5em",
              margin: "0 -2px 0px 5px",
              transform: "unset",
              verticalAlign: "baseline",
              width: "1.5em",
            }}
          />
        )}
        <p>{`${countryName} (${matches.length})`}</p>
      </div>
      {matches.map((match) => (
        <LiveMatch
          active={match.active}
          cMin={match.cMin}
          cSec={match.cSec}
          cStatus={match.cStatus}
          cType={match.cType}
          isExpanded={isExpanded}
          key={match.id}
          periodAbrv={match.part}
          score={match.result}
          teamLeft={match.teamLeft}
          teamRight={match.teamRight}
          onSelect={() => onSelectMatch(match.id)}
        />
      ))}
    </div>
  );
};

CountryExpandingMatches.propTypes = propTypes;
CountryExpandingMatches.defaultProps = defaultProps;

export default React.memo(CountryExpandingMatches);
