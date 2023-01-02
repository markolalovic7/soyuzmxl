import NewsBanner from "applications/vanilladesktop/components/NewsBanner";
import SportsScoresTablesMenu from "applications/vanilladesktop/components/SportsScoresTablesMenu/components";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";

import { getCmsConfigIframeMode } from "../../../../../redux/reselect/cms-selector";
import RightColumn from "../../../components/RightColumn";

import CompactLiveMatch from "./CompactLiveMatch";

const CompactLiveEventPage = () => {
  const history = useHistory();
  const { eventId } = useParams();

  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  const onSelectMatchHandler = (matchId) => {
    history.push(`/live/event/${matchId}`);
  };

  return (
    <main className={classes["main"]}>
      <NewsBanner />
      <div className={classes["main__container"]}>
        <div className={classes["main__sports"]}>
          <div className={cx(classes["left-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
            <div className={classes["left-section__content"]}>
              <SportsScoresTablesMenu
                activeEventId={eventId ? Number(eventId) : undefined}
                onSelectMatch={onSelectMatchHandler}
              />
            </div>
          </div>

          <div
            className={cx(classes["central-section"], classes["central-section_compact"], {
              [classes["iframe"]]: isApplicationEmbedded,
            })}
          >
            {eventId && <CompactLiveMatch eventId={Number(eventId)} />}
          </div>
          <RightColumn />
        </div>
      </div>
    </main>
  );
};

export default CompactLiveEventPage;
