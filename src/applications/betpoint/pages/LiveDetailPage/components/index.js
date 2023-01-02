import { faChevronDown, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/betpoint/scss/betpoint.module.scss";
import cx from "classnames";
import * as PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router";

import { useGetMatchStatuses } from "../../../../../hooks/matchstatus-hooks";
import { makeGetBetslipOutcomeIds } from "../../../../../redux/reselect/betslip-selector";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../utils/betslip-utils";
import { useLiveData } from "../../../../common/hooks/useLiveData";

const Clock = ({ match }) => {
  const [min, setMin] = useState(match?.cMin);
  const [sec, setSec] = useState(match?.cSec);

  // Maintain clock times...
  const tickClocks = useCallback(() => {
    switch (match?.cType) {
      case "REGULAR":
        if (match?.cStatus === "STARTED") {
          if (sec < 59) {
            setSec(sec + 1);
          } else {
            setSec(0);
            setMin(min + 1);
          }
        }
        break;
      case "REVERSE":
        if (match?.cStatus === "STARTED") {
          if (sec > 0) {
            setSec(sec - 1);
          } else if (min > 0) {
            setSec(59);
            setMin(min - 1);
          }
        }
        break;
      default:
        break;
    }
  }, [sec, min, match?.cStatus, match?.cType]);

  useEffect(() => {
    const intervalId = setInterval(() => tickClocks(), 1000);

    return () => clearInterval(intervalId);
  }, [tickClocks]);

  let clock = "";

  switch (match?.cType) {
    case "NO_TIME":
      switch (match?.cStatus) {
        case "NOT_STARTED":
          clock = "About to Start";
          break;
        case "END_OF_EVENT":
          clock = "Ended";
          break;
        default:
          clock = match?.cStatus?.charAt(0)?.toUpperCase() + match?.cStatus?.slice(1)?.toLowerCase();
          break;
      }
      break;
    default:
      clock = `${`0${min}`.slice(-2)}:${`0${sec}`.slice(-2)}`;
      break;
  }

  return <div className={classes["scoreboard__time"]}>{clock}</div>;
};

Clock.propTypes = { match: PropTypes.object.isRequired };

const LiveDetailPage = () => {
  const { eventId: eventIdStr } = useParams();

  const eventId = Number(eventIdStr);

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const matchStatuses = useGetMatchStatuses(dispatch);

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));
  const eventLiveData = useSelector((state) => state.live.liveData[`event-${eventId}`]);

  // Subscribe to the the specific event live feed
  useLiveData(dispatch, eventId ? `event-${eventId}` : null);

  const cPeriod = eventLiveData?.cPeriod;

  const currentPeriod = useMemo(
    () => (matchStatuses ? matchStatuses.find((period) => period.abbreviation === cPeriod)?.description : ""),
    [cPeriod, matchStatuses],
  );

  const getMarketGroups = useCallback((markets) => {
    const marketGroupHash = {};

    markets.forEach((market) => {
      const key = `${market.mDesc} - ${market.pDesc}`;
      const desc = market.mDesc;
      const marketTypeGroup = market.mGroup;
      const period = market.pDesc;
      const periodAbrv = market.pAbrv;
      const ordinal = market.ordinal;
      const marketTO = {
        desc,
        id: market.mId,
        marketTypeGroup,
        open: market.mOpen,
        outcomes: market.sels.map((sel) => ({
          desc: sel.oDesc,
          dir: sel.dir,
          hidden: sel.hidden || !market.mOpen,
          id: sel.oId,
          price: sel.formattedPrice,
          priceId: sel.pId,
        })),
        period,
        periodAbrv,
      };

      marketGroupHash[key] = marketGroupHash[key]
        ? { ...marketGroupHash[key], markets: [...marketGroupHash[key].markets, marketTO] }
        : { desc, key, marketTypeGroup, markets: [marketTO], ordinal, period, periodAbrv };
    });

    return Object.values(marketGroupHash).sort((a, b) => a.ordinal - b.ordinal);
  }, []);

  const marketGroups = useMemo(
    () => (eventLiveData?.markets ? getMarketGroups(Object.values(eventLiveData?.markets)) : []),
    [eventLiveData?.markets],
  );

  const toggleBetslipHandler = (outcomeId, eventId) => {
    onToggleSelection(dispatch, location.pathname, outcomeId, eventId, false);
    onRefreshBetslipHandler(dispatch, location.pathname);
  };

  return (
    <div className={classes["content"]}>
      {eventLiveData && (
        <>
          <div className={classes["content__title"]}>
            <span>{eventLiveData.epDesc}</span>
          </div>
          <div className={classes["scoreboard"]}>
            <div className={classes["scoreboard__match"]}>
              <div className={classes["scoreboard__team"]}>{eventLiveData.opADesc}</div>
              <div className={classes["scoreboard__score"]}>
                {`${eventLiveData.hScore ? eventLiveData.hScore : 0} - ${
                  eventLiveData.aScore ? eventLiveData.aScore : 0
                }`}
              </div>
              <div className={classes["scoreboard__team"]}>{eventLiveData.opBDesc}</div>
            </div>
            <div className={classes["scoreboard__quarter"]}>
              <FontAwesomeIcon icon={eventLiveData.cStatus === "STARTED" ? faPlay : faPause} />
              <span>{currentPeriod}</span>
            </div>
            <Clock match={eventLiveData} />
          </div>
          {marketGroups.map((marketGroup) => (
            <div className={classes["card"]} key={marketGroup.key}>
              <div className={cx(classes["content__subtitle"], classes["card__subtitle"])}>
                <span>{marketGroup.key}</span>
                <div className={cx(classes["card__arrow"], classes["active"])}>
                  <FontAwesomeIcon icon={faChevronDown} />
                </div>
              </div>
              <div className={cx(classes["card__coeficients"], classes["open"])}>
                {marketGroup.markets.map((market) =>
                  market.outcomes.map((outcome) => (
                    <div
                      className={cx(classes["card__coeficient"], {
                        [classes["active"]]: betslipOutcomeIds.includes(outcome.id),
                      })}
                      key={outcome.id}
                      onClick={() => toggleBetslipHandler(outcome.id, eventLiveData.id)}
                    >
                      <div className={classes["card__team"]}>{outcome.desc}</div>
                      <div className={classes["card__chance"]}>
                        <div
                          className={cx(
                            classes["card__triangle"],
                            { [classes["card__triangle_red"]]: outcome.dir === "<" },
                            { [classes["card__triangle_green"]]: outcome.dir === ">" },
                          )}
                        />
                        {outcome.price}
                      </div>
                    </div>
                  )),
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default React.memo(LiveDetailPage);
