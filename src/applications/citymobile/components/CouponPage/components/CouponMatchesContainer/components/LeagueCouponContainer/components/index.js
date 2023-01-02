import * as PropTypes from "prop-types";
import React from "react";

import complexCouponSportCodes from "../../../../../../../../citydesktop/components/Common/utils/complexCouponSportCodes";
import classes from "../../../../../../../scss/citymobile.module.scss";
import MatchCouponContainer from "../../../../../../SportsContainer/components/CouponContainer/components/SportCouponContainer/components/LeagueCouponContainer/components/MatchCouponContainer";

import CountryLeagueCouponHeader from "./CountryLeagueCouponHeader";

const LeagueCouponContainer = ({ container, sportCode, strictLive }) => {
  const isComplexSport = complexCouponSportCodes.includes(sportCode);

  return (
    <div
      className={`${classes["sports-spoiler"]} ${
        !strictLive && isComplexSport ? classes["sports-spoiler_outcome"] : ""
      }`}
    >
      <CountryLeagueCouponHeader
        categoryDescription={container.categoryDescription}
        countryCode={container.countryCode}
        eventCount={container.events.length}
        tournamentDescription={container.tournamentDescription}
      />

      <div className={classes["sports-spoiler__wrapper"]}>
        <div className={`${classes["sports-spoiler__body"]} ${classes["accordion"]} ${classes["open"]}`}>
          {container.events.map((match) => (
            <MatchCouponContainer key={match.eventId} match={match} sportCode={sportCode} strictLive={strictLive} />
          ))}
        </div>
      </div>
    </div>
  );
};

const propTypes = {
  container: PropTypes.object.isRequired,
  sportCode: PropTypes.string.isRequired,
  strictLive: PropTypes.bool.isRequired,
};

const defaultProps = {};

LeagueCouponContainer.propTypes = propTypes;
LeagueCouponContainer.defaultProps = defaultProps;

export default React.memo(LeagueCouponContainer);
