import cx from "classnames";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";

import { makeGetBetslipOutcomeIds } from "../../../../../../redux/reselect/betslip-selector";
import {
  getMobileBetslipMaxSelections,
  isMobileCompactBetslip,
} from "../../../../../../redux/reselect/cms-layout-widgets";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../../utils/betslip-utils";
import classes from "../../../../scss/ollehdesktop.module.scss";

const propTypes = {
  count: PropTypes.number.isRequired,
  desc: PropTypes.string.isRequired,
  epoch: PropTypes.number.isRequired,
  eventId: PropTypes.number.isRequired,
  outcomes: PropTypes.array.isRequired,
};

const SportSummary = ({ count, desc, epoch, eventId, eventPathId, outcomes }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const maxBetslipSelections = useSelector(getMobileBetslipMaxSelections);
  const compactBetslipMode = useSelector(isMobileCompactBetslip);

  const toggleBetslipHandler = (outcomeId, eventId) => {
    if (betslipOutcomeIds.length >= maxBetslipSelections && !betslipOutcomeIds.find((x) => x === outcomeId)) {
      alert(t("betslip_panel.too_many_selections", { value: maxBetslipSelections }));
    } else {
      onToggleSelection(dispatch, location.pathname, outcomeId, eventId, compactBetslipMode);
      onRefreshBetslipHandler(dispatch, location.pathname);
    }
  };

  return (
    <div className={cx(classes["league__spoiler-body"], classes["open"])} key={eventId}>
      <div className={cx(classes["league__spoiler-card"], classes["card"])}>
        <div className={classes["card__top"]}>
          <div className={classes["card__title"]}>{desc}</div>
          <div className={classes["card__date"]}>{dayjs.unix(epoch / 1000).format("D MMMM hh:mm A")}</div>
        </div>
        <div className={classes["card__body"]}>
          <div className={classes["card__elements"]}>
            <div
              className={cx(classes["live__sport-content-left"], classes["card__element"], {
                [classes["selected"]]: betslipOutcomeIds.includes(outcomes[0].id),
              })}
              onClick={() => toggleBetslipHandler(outcomes[0].id, eventId)}
            >
              <div className={classes["live__sport-content-team"]}>
                <span>{outcomes[0].desc}</span>
              </div>
              <div className={classes["live__sport-content-odds"]}>
                <svg
                  aria-hidden="true"
                  className={cx(classes["svg-inline--fa"], classes["fa-arrow-down"], classes["fa-w-14"])}
                  data-fa-i2svg=""
                  data-icon="arrow-down"
                  data-prefix="fas"
                  focusable="false"
                  role="img"
                  viewBox="0 0 448 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"
                    fill="currentColor"
                  />
                </svg>

                <span>{outcomes[0].price}</span>
              </div>
            </div>
            {outcomes.length === 3 && (
              <div
                className={cx(classes["live__sport-content-draw"], classes["card__element"], {
                  [classes["selected"]]: betslipOutcomeIds.includes(outcomes[1].id),
                })}
                onClick={() => toggleBetslipHandler(outcomes[1].id, eventId)}
              >
                <div className={classes["live__sport-content-team"]}>
                  <span>{outcomes[1].desc}</span>
                </div>
                <div className={classes["live__sport-content-odds"]}>
                  <svg
                    aria-hidden="true"
                    className={cx(classes["svg-inline--fa"], classes["fa-arrow-up"], classes["fa-w-14"])}
                    data-fa-i2svg=""
                    data-icon="arrow-up"
                    data-prefix="fas"
                    focusable="false"
                    role="img"
                    viewBox="0 0 448 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"
                      fill="currentColor"
                    />
                  </svg>

                  <span>{outcomes[1].price}</span>
                </div>
              </div>
            )}
            <div
              className={cx(classes["live__sport-content-right"], classes["card__element"], {
                [classes["selected"]]: betslipOutcomeIds.includes(outcomes[outcomes.length - 1].id),
              })}
              onClick={() => toggleBetslipHandler(outcomes[outcomes.length - 1].id, eventId)}
            >
              <div className={classes["live__sport-content-team"]}>
                <span>{outcomes[outcomes.length - 1].desc}</span>
              </div>
              <div className={classes["live__sport-content-odds"]}>
                <svg
                  aria-hidden="true"
                  className={cx(classes["svg-inline--fa"], classes["fa-arrow-down"], classes["fa-w-14"])}
                  data-fa-i2svg=""
                  data-icon="arrow-down"
                  data-prefix="fas"
                  focusable="false"
                  role="img"
                  viewBox="0 0 448 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"
                    fill="currentColor"
                  />
                </svg>

                <span>{outcomes[outcomes.length - 1].price}</span>
              </div>
            </div>
          </div>
          <div className={classes["card__icons"]}>
            <div
              className={classes["card__icon"]}
              onClick={() => history.push(`/prematch/eventpath/${eventPathId}/event/${eventId}`)}
            >
              {`+${count > 1 ? count - 1 : 0}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SportSummary.propTypes = propTypes;

export default React.memo(SportSummary);
