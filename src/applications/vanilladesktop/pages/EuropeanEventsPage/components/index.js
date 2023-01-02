import LeftColumnMenus from "applications/vanilladesktop/components/LeftColumnMenus";
import NewsBanner from "applications/vanilladesktop/components/NewsBanner";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";

import { hasDesktopLeftColumn, hasDesktopRightColumn } from "../../../../../redux/reselect/cms-layout-widgets";
import RightColumn from "../../../components/RightColumn";

import CentralColumn from "./CentralColumn";

const EuropeanEventsPage = () => {
  const { eventId, eventPathId } = useParams();

  const eventIdInt = eventId ? parseInt(eventId, 10) : undefined;
  const eventPathIdInt = eventPathId ? parseInt(eventPathId, 10) : undefined;

  const location = useLocation();
  const hasLeftColumn = useSelector((state) => hasDesktopLeftColumn(state, location));
  const hasRightColumn = useSelector((state) => hasDesktopRightColumn(state, location));

  return (
    <main className={classes["main"]}>
      <NewsBanner />
      <div className={classes["main__container"]}>
        <div className={classes["main__sports"]}>
          {hasLeftColumn && <LeftColumnMenus />}
          <CentralColumn eventId={eventIdInt} eventPathId={eventPathIdInt} />
          {hasRightColumn && <RightColumn />}
        </div>
      </div>
    </main>
  );
};

export default EuropeanEventsPage;
