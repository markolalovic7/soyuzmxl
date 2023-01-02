import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import PropTypes from "prop-types";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { getMultiviewEventIds } from "../../../../../../redux/reselect/live-selector";
import { getSportsSelector } from "../../../../../../redux/reselect/sport-selector";
import { setActiveMatchTracker, setMultiViewEventIds } from "../../../../../../redux/slices/liveSlice";
import { useLiveData } from "../../../../../common/hooks/useLiveData";
import MatchDropdownPanel from "../../../../components/MatchDropdownPanel";
import classes from "../../../../scss/vanilladesktop.module.scss";
import MatchScoresSection from "../../../LiveOverview/components/MatchRow/components/MatchScoresSection";
import MatchStatusSection from "../../../LiveOverview/components/MatchRow/components/MatchStatusSection";

const LiveMatch = ({
  eventId,
  isDraggedOver,
  onDragEnterHandler,
  onDragLeaveHandler,
  onDragOverHandler,
  onDropHandler,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const sports = useSelector(getSportsSelector);
  const multiViewEventIdsStr = useSelector(getMultiviewEventIds);
  const multiViewEventIds =
    multiViewEventIdsStr.length > 0 ? multiViewEventIdsStr.split(",").map((x) => Number(x)) : [];

  const eventLiveData = useSelector((state) => state.live.liveData[`event-${eventId}`]);

  // Subscribe to the the specific event live feed
  useLiveData(dispatch, eventId ? `event-${eventId}` : null);

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

  if (!eventLiveData) return null;

  const onRemoveFromMultiView = (eventId) => {
    dispatch(setMultiViewEventIds({ multiViewEventIds: multiViewEventIds.filter((x) => x !== eventId) }));
  };

  const hPeriodScores = eventLiveData ? eventLiveData.pScores.map((periodScore) => periodScore.hScore) : [];
  const aPeriodScores = eventLiveData ? eventLiveData.pScores.map((periodScore) => periodScore.aScore) : [];

  return (
    <div
      className={classes["live-overview-spoilers"]}
      style={{ border: isDraggedOver ? "1px dashed #c7255d" : "none", opacity: isDraggedOver ? 0.5 : 1 }}
      onDragEnter={(e) => onDragEnterHandler(e, eventLiveData?.eventId)}
      onDragLeave={(e) => onDragLeaveHandler(e)}
      onDragOver={(e) => onDragOverHandler(e, eventLiveData?.eventId)}
      onDrop={(e) => onDropHandler(e)}
    >
      <div className={classes["live-overview-spoilers__content"]}>
        <div
          className={cx(
            classes["live-overview-spoiler"],
            classes["live-overview-spoiler_cric"],
            classes[`live-overview-spoiler_${eventLiveData.sport.toLowerCase()}`],
          )}
        >
          <div className={cx(classes["live-overview-spoiler__content"], classes["spoiler"])}>
            <span className={classes["live-overview-spoiler__icon"]}>
              <i className={cx(classes["qicon-default"], classes[`qicon-${eventLiveData.sport.toLowerCase()}`])} />
            </span>
            <h3 className={classes["live-overview-spoiler__title"]}>
              {sports ? sports[eventLiveData.sport].description : ""}
            </h3>
            <div className={classes["live-overview-spoiler__icons"]}>
              <div
                className={cx(classes["live-overview-spoiler__icon"], {
                  [classes["disabled"]]: !eventLiveData.hasMatchTracker,
                })}
                onClick={() =>
                  dispatch(
                    setActiveMatchTracker({
                      feedCode: eventLiveData.feedCode,
                      sportCode: eventLiveData.sport,
                    }),
                  )
                }
              >
                <i className={classes["qicon-match-tracker"]} />
              </div>
              <div
                className={cx(classes["live-overview-spoiler__icon"], classes["live-overview-spoiler__icon_link"])}
                onClick={() => history.push(`/live/event/${eventLiveData.eventId}`)}
              >
                <i className={classes["qicon-event-detail"]} />
              </div>
              <div
                className={cx(classes["live-overview-spoiler__icon"], classes["live-overview-spoiler__icon_close"])}
                onClick={() => onRemoveFromMultiView(eventId)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </div>
            </div>
          </div>
        </div>
        <div className={classes["live-overview-item__card"]}>
          <MatchStatusSection
            cMin={eventLiveData.cMin}
            cPeriod={eventLiveData.cPeriod}
            cSec={eventLiveData.cSec}
            cStatus={eventLiveData.cStatus}
            cType={eventLiveData.cType}
            statusDisplay={false}
          />
          <MatchScoresSection
            aPeriodScores={aPeriodScores}
            aScore={eventLiveData.aScore}
            hPeriodScores={hPeriodScores}
            hScore={eventLiveData.hScore}
            opADesc={eventLiveData.opADesc}
            opBDesc={eventLiveData.opBDesc}
          />
        </div>
        <div className={classes["match-spoilers"]}>
          {marketGroups?.map((marketGroup, index) => (
            <MatchDropdownPanel
              autoExpand={index < 10}
              eventId={eventId}
              key={marketGroup.key}
              label={marketGroup.key}
              markets={marketGroup.markets}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const propTypes = {
  eventId: PropTypes.number.isRequired,
  isDraggedOver: PropTypes.bool.isRequired,
  onDragEnterHandler: PropTypes.func.isRequired,
  onDragLeaveHandler: PropTypes.func.isRequired,
  onDragOverHandler: PropTypes.func.isRequired,
  onDropHandler: PropTypes.func.isRequired,
};
LiveMatch.propTypes = propTypes;

export default React.memo(LiveMatch);
