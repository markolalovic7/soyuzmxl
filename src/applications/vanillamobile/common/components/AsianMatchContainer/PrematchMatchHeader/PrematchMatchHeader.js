import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";

import BetButton from "applications/vanillamobile/common/components/BetButton";
import ExpandMarketsButton from "applications/vanillamobile/components/Sports/Buttons/ExpandMarketsButton/ExpandMarketsButton";
import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getCmsConfigSportsBook } from "redux/reselect/cms-selector";
import dayjs from "services/dayjs";

const propTypes = {
  additionalMarketsExpanded: PropTypes.bool.isRequired,
  event: PropTypes.object.isRequired,
  onToggleActiveEvent: PropTypes.func.isRequired,
};

const PrematchMatchHeader = ({ additionalMarketsExpanded, event, onToggleActiveEvent }) => {
  const cmsConfigSportsBook = useSelector(getCmsConfigSportsBook)?.data || {};
  const { betradarStatsOn, betradarStatsURL } = cmsConfigSportsBook;

  const onExpandMarketsHandler = () => {
    onToggleActiveEvent(event.id);
  };

  return (
    <div className={classes["bet__header"]}>
      <div className={classes["bet__numbers"]}>
        <div className={classes["bet__id"]}>
          ID
          {event.id}
        </div>
        <div className={classes["bet__time"]}>{dayjs.unix(event.epoch / 1000).calendar()}</div>
      </div>
      <div className={classes["bet__header-container"]}>
        <div className={classes["bet__team"]}>
          <span>{event.a}</span>
          <span>{event.b}</span>
        </div>
        <div className={classes["bet__icons"]}>
          {betradarStatsOn && betradarStatsURL && event.brMatchId && (
            <BetButton feedCode={event.brMatchId} url={betradarStatsURL} />
          )}
          <ExpandMarketsButton
            active={additionalMarketsExpanded}
            marketCount={
              event.count - Object.values(event.children).length > 0
                ? event.count - Object.values(event.children).length
                : 0
            }
            onClick={onExpandMarketsHandler}
          />
        </div>
      </div>
    </div>
  );
};

PrematchMatchHeader.propTypes = propTypes;

export default React.memo(PrematchMatchHeader);
