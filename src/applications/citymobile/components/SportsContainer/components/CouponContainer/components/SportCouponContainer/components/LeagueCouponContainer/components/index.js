import * as PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";

import complexCouponSportCodes from "../../../../../../../../../../citydesktop/components/Common/utils/complexCouponSportCodes";
import classes from "../../../../../../../../../scss/citymobile.module.scss";

import CountryLeagueCouponHeader from "./CountryLeagueCouponHeader";
import DateCouponHeader from "./DateCouponHeader";
import MatchCouponContainer from "./MatchCouponContainer";
import OutrightCouponContainer from "./OutrightCouponContainer";
import TimeCouponHeader from "./TimeCouponHeader";

const isOutright = (match) => {
  if (match) {
    if (match.markets?.length > 0 && match.markets[0].marketTypeGroup === "RANK_OUTRIGHT") {
      return true;
    }
  }

  return false;
};

const LeagueCouponContainer = ({
  container,
  enabled,
  groupModePreference,
  maxMatchesPerLeague,
  onToggleSection,
  sportCode,
  strictLive,
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  const isComplexSport = complexCouponSportCodes.includes(sportCode);

  return (
    <div
      className={`${classes["sports-spoiler"]} ${
        isComplexSport && !strictLive ? classes["sports-spoiler_outcome"] : ""
      }`}
    >
      {container.tournamentDescription ? (
        <CountryLeagueCouponHeader
          categoryDescription={container.categoryDescription}
          countryCode={container.countryCode}
          eventCount={container.events.length}
          tournamentDescription={container.tournamentDescription}
          onToggleSection={onToggleSection}
        />
      ) : container.offset ? (
        <DateCouponHeader
          dateIndex={container.offset}
          eventCount={container.events.length}
          onToggleSection={onToggleSection}
        />
      ) : container.time ? (
        <TimeCouponHeader
          eventCount={container.events.length}
          time={container.time}
          onToggleSection={onToggleSection}
        />
      ) : null}

      <div className={classes["sports-spoiler__wrapper"]}>
        <div
          className={`${classes["sports-spoiler__body"]} ${classes["accordion"]} ${classes["open"]}`}
          style={{ display: enabled ? "block" : "none" }}
        >
          {(maxMatchesPerLeague ? container.events.slice(0, maxMatchesPerLeague) : container.events).map((match) => {
            if (isOutright(match)) {
              return <OutrightCouponContainer key={match.eventId} match={match} sportCode={sportCode} />;
            }

            return (
              <MatchCouponContainer
                groupModePreference={groupModePreference}
                key={match.eventId}
                match={match}
                sportCode={sportCode}
                strictLive={strictLive}
              />
            );
          })}
          {maxMatchesPerLeague && container.events.length > maxMatchesPerLeague ? (
            <div
              className={classes["sports-spoiler__button"]}
              onClick={() => history.push(`/leagues/${sportCode}/${container.tournamentId}`)}
            >
              {t("go_to_leagues_view")}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const propTypes = {
  container: PropTypes.object.isRequired,
  enabled: PropTypes.bool.isRequired,
  maxMatchesPerLeague: PropTypes.number,
  onToggleSection: PropTypes.func.isRequired,
  sportCode: PropTypes.string.isRequired,
  strictLive: PropTypes.bool.isRequired,
};

const defaultProps = { maxMatchesPerLeague: undefined };

LeagueCouponContainer.propTypes = propTypes;
LeagueCouponContainer.defaultProps = defaultProps;

export default React.memo(LeagueCouponContainer);
