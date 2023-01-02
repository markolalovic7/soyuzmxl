import NewsBanner from "applications/vanilladesktop/components/NewsBanner";
import SportsScoresTablesMenu from "applications/vanilladesktop/pages/LiveMultiview/components/SportsScoresTablesMenu";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams} from "react-router";

import {getCmsConfigIframeMode} from "../../../../../redux/reselect/cms-selector";
import {getMultiviewEventIds} from "../../../../../redux/reselect/live-selector";
import {setMultiViewEventIds} from "../../../../../redux/slices/liveSlice";
import LiveNavigation from "../../../components/LiveNavigation";
import RightColumn from "../../../components/RightColumn";

import LiveMatch from "./LiveMatch";
import LiveMatchPlaceHolder from "./LiveMatchPlaceHolder";

/**
 * https://medium.com/@samip.sharma963/simple-react-drag-and-drop-without-using-external-or-third-party-libraries-bf6a779746d5
 * @returns {JSX.Element}
 * @constructor
 */

const LiveMultiview = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { eventId } = useParams();

  const [draggedEventId, setDraggedEventId] = useState(); // event being dragged
  const [draggedOverEventId, setDraggedOverEventId] = useState(); // event zone over where we hover over
  const [inTheDropZoneCounter, setInTheDropZoneCounter] = useState(0); // https://stackoverflow.com/a/21002544

  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  // const liveEuropeanData = useSelector(getLiveEuropeanDashboardData);

  const multiViewEventIdsStr = useSelector(getMultiviewEventIds);
  const multiViewEventIds =
    multiViewEventIdsStr.length > 0 ? multiViewEventIdsStr.split(",").map((x) => Number(x)) : [];
  // const eventIds =
  //   liveEuropeanData && Object.entries(liveEuropeanData).length > 0
  //     ? Object.values(Object.values(liveEuropeanData)[0]).map((match) => match.eventId)
  //     : [];

  useEffect(() => {
    if (inTheDropZoneCounter <= 0) {
      setDraggedOverEventId(undefined);
    }

    return undefined;
  }, [inTheDropZoneCounter]);

  const onDragStartHandler = (e, eventId) => {
    setDraggedEventId(eventId);
    // console.log("start");
  };

  const onDragEnterHandler = (e, dropZoneEventId) => {
    //
    e.preventDefault();
    // console.log("enter");
    setDraggedOverEventId(dropZoneEventId);

    setInTheDropZoneCounter((prevState) => prevState + 1);
  };

  const onDragLeaveHandler = (e) => {
    //
    e.preventDefault();
    // console.log("leave");
    setInTheDropZoneCounter((prevState) => Math.max(prevState - 1, 0));
  };

  const onDragOverHandler = (e, dropZoneEventId) => {
    e.stopPropagation(); // DO NOT Remove this - onDrop does not work otherwise - The default action for dragOver is "Reset the current drag operation to none". So unless you cancel it the drop doesn't work.
    e.preventDefault(); // DO NOT Remove this - onDrop does not work otherwise (beats me) - The default action for dragOver is "Reset the current drag operation to none". So unless you cancel it the drop doesn't work.

    // console.log("over");
  };

  const onDropHandler = (e) => {
    // console.log("drop");
    if (multiViewEventIds.length < 8)
      dispatch(setMultiViewEventIds({ multiViewEventIds: [...new Set([...multiViewEventIds, draggedEventId])] }));

    setDraggedEventId(undefined);
    setDraggedOverEventId(undefined);
    setInTheDropZoneCounter(0);
  };

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
                    onDragStart={onDragStartHandler}
                  />
                </div>
              </div>
              <div className={cx(classes["central-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
                <div className={classes["central-section__content"]}>
                  <div
                    className={cx(
                      classes["central-section__container"],
                      classes["central-section__container_multiview"],
                    )}
                  >
                    {multiViewEventIds?.map((eventId) => (
                      <LiveMatch
                        eventId={Number(eventId)}
                        isDraggedOver={draggedOverEventId === Number(eventId)}
                        key={eventId}
                        onDragEnterHandler={onDragEnterHandler}
                        onDragLeaveHandler={onDragLeaveHandler}
                        onDragOverHandler={onDragOverHandler}
                        onDropHandler={onDropHandler}
                      />
                    ))}
                    {multiViewEventIds?.length <= 8 &&
                      Array(2 - (multiViewEventIds.length % 2))
                        .fill(0)
                        .map((x, index) => (
                          <LiveMatchPlaceHolder
                            fakeEventId={index}
                            isDraggedOver={draggedOverEventId === index}
                            key={index}
                            onDragEnterHandler={onDragEnterHandler}
                            onDragLeaveHandler={onDragLeaveHandler}
                            onDragOverHandler={onDragOverHandler}
                            onDropHandler={onDropHandler}
                          />
                        ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <RightColumn />
        </div>
      </div>
    </main>
  );
};

export default React.memo(LiveMultiview);
