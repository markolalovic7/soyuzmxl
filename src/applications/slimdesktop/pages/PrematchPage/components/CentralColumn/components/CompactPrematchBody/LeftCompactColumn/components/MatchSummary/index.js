import cx from "classnames";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";

import { getAuthLanguage } from "../../../../../../../../../../../redux/reselect/auth-selector";
import { getCmsConfigSportsBook } from "../../../../../../../../../../../redux/reselect/cms-selector";
import { openLinkInNewWindow } from "../../../../../../../../../../../utils/misc";
import classes from "../../../../../../../../../scss/slimdesktop.module.scss";

import MatchOutcome from "./components/MatchOutcome";

const MatchSummary = ({ allowToUnselect, coefficients, countCode, epoch, eventId, feedCode, label, sportCode }) => {
  const { eventId: eventIdStr, eventPathId } = useParams();
  const selectedEventId = Number(eventIdStr);

  const history = useHistory();
  const language = useSelector(getAuthLanguage);

  const cmsConfigSportsBook = useSelector(getCmsConfigSportsBook)?.data || {};
  const { betradarStatsOn, betradarStatsURL } = cmsConfigSportsBook;

  return (
    <div
      className={cx(classes["card"], classes["card-regular"], {
        [classes["card-regular--active"]]: eventId === selectedEventId,
      })}
    >
      <div className={classes["card-regular__head"]}>
        <span className={cx(classes["qicon-default"], classes[`qicon-${sportCode.toLowerCase()}`], classes["icon"])} />
        <span className={classes["card-regular__head-teams"]}>
          <b>{label}</b>
        </span>
        <span className={classes["card-regular__head-time"]}>{dayjs.unix(epoch / 1000).format("D MMMM hh:mm A")}</span>
      </div>
      <div className={classes["card__results"]}>
        <div className={classes["card__box"]}>
          {coefficients.map((coefficient, index) => (
            <MatchOutcome
              coefficient={coefficient}
              coefficientCount={coefficients.length}
              eventId={eventId}
              index={index}
              key={coefficient.outcomeId}
            />
          ))}
        </div>
        {betradarStatsOn && betradarStatsURL && feedCode && (
          <div
            className={cx(classes["card-result--icon"])}
            onClick={() => openLinkInNewWindow(`${betradarStatsURL}/${language}/match/${feedCode}`)}
          >
            <span className={classes["qicon-stats"]} />
          </div>
        )}
        {/* <div className={cx(classes["card-result"], classes["card-result--icon"])}> */}
        {/*  <span className={classes["qicon-star-empty"]} /> */}
        {/* </div> */}
        <div
          className={cx(classes["card-result--icon"], classes["card-result--icon_special"])}
          onClick={() => {
            if (eventId === selectedEventId && allowToUnselect) {
              history.push(`/prematch/eventpath/${eventPathId}`);
            } else {
              history.push(`/prematch/eventpath/${eventPathId}/event/${eventId}`);
            }
          }}
        >
          <b>{countCode}</b>
        </div>
      </div>
    </div>
  );
};

MatchSummary.propTypes = {
  allowToUnselect: PropTypes.bool,
  coefficients: PropTypes.array.isRequired,
  countCode: PropTypes.string.isRequired,
  epoch: PropTypes.number.isRequired,
  eventId: PropTypes.number.isRequired,
  feedCode: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  sportCode: PropTypes.string.isRequired,
};

MatchSummary.defaultProps = {
  allowToUnselect: false,
};

export default React.memo(MatchSummary);
