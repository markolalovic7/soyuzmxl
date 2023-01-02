import NewsBanner from "applications/vanilladesktop/components/NewsBanner";
import SportsScoresTablesMenu from "applications/vanilladesktop/components/SportsScoresTablesMenu";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";

import { getCmsConfigIframeMode } from "../../../../../redux/reselect/cms-selector";
import { setActiveMatchTracker } from "../../../../../redux/slices/liveSlice";
import LiveNavigation from "../../../components/LiveNavigation";
import RightColumn from "../../../components/RightColumn";

import LiveMatch from "./LiveMatch";

const LiveEventDetail = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { eventId } = useParams();

  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  const onSelectMatchHandler = (matchId) => {
    history.push(`/live/event/${matchId}`);
  };

  const eventLiveData = useSelector((state) => state.live.liveData[`event-${eventId}`]);

  const feedCode = eventLiveData?.feedCode;
  const hasMatchTracker = eventLiveData?.hasMatchTracker;
  const sportCode = eventLiveData?.sport;

  useEffect(() => {
    if (feedCode && hasMatchTracker) {
      dispatch(setActiveMatchTracker({ feedCode, sportCode }));
    } else {
      dispatch(setActiveMatchTracker(undefined));
    }

    return undefined;
  }, [feedCode, hasMatchTracker, sportCode]);

  return (
    <main className={classes["main"]}>
      <NewsBanner />
      <div className={classes["main__container"]}>
        <div className={classes["main__sports"]}>
          <div className={classes["main__views"]}>
            <LiveNavigation />
            <div className={classes["main__views-container"]}>
              <div className={cx(classes["left-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
                <div className={classes["left-section__content"]}>
                  <SportsScoresTablesMenu
                    activeEventId={eventId ? Number(eventId) : undefined}
                    onSelectMatch={onSelectMatchHandler}
                  />
                </div>
              </div>
              <div className={cx(classes["central-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
                {eventId && <LiveMatch eventId={Number(eventId)} />}
              </div>
            </div>
          </div>
          <RightColumn />
        </div>
      </div>
    </main>
  );
};

export default LiveEventDetail;
