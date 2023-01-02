import cx from "classnames";
import * as dayjs from "dayjs";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { getAuthLanguage } from "../../../../../redux/reselect/auth-selector";
import { hasDesktopLeftColumn, hasDesktopRightColumn } from "../../../../../redux/reselect/cms-layout-widgets";
import { getSportsTree } from "../../../../../redux/slices/sportsTreeSlice";
import NewsBanner from "../../../components/NewsBanner";
import RightColumn from "../../../components/RightColumn";
import classes from "../../../scss/vanilladesktop.module.scss";

import AsianCentralColumn from "./AsianCentralColumn";
import LeftColumnMenus from "./LeftColumnMenus";

const todayEndDate = `${dayjs()
  .set("hour", 23)
  .set("minute", 59)
  .set("second", 59)
  .set("millisecond", 999)
  .toDate()
  .toISOString()
  .slice(0, -1)}+00:00`;

const earlierStartDate = `${dayjs()
  .add(1, "day")
  .set("hour", 0)
  .set("minute", 0)
  .set("second", 0)
  .set("millisecond", 0)
  .toDate()
  .toISOString()
  .slice(0, -1)}+00:00`;

const AsianSportsPage = () => {
  const dispatch = useDispatch();
  const language = useSelector(getAuthLanguage);
  const location = useLocation();
  const hasLeftColumn = useSelector((state) => hasDesktopLeftColumn(state, location));
  const hasRightColumn = useSelector((state) => hasDesktopRightColumn(state, location));

  useEffect(() => {
    dispatch(getSportsTree({ cacheKey: "TODAY", standard: false, toDate: todayEndDate }));
    dispatch(getSportsTree({ cacheKey: "EARLIER", fromDate: earlierStartDate, standard: false }));

    const interval = setInterval(() => {
      // Refresh periodically
      dispatch(getSportsTree({ cacheKey: "TODAY", standard: false, toDate: todayEndDate }));
      dispatch(getSportsTree({ cacheKey: "EARLIER", fromDate: earlierStartDate, standard: false }));
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch, language]);

  return (
    <main className={cx(classes["main"], classes["continental-page"], classes["continental-sports-page"])}>
      <NewsBanner />
      <div className={classes["main__container"]}>
        <div className={classes["main__sports"]}>
          {hasLeftColumn && <LeftColumnMenus />}
          <AsianCentralColumn />
          {hasRightColumn && <RightColumn />}
        </div>
      </div>
    </main>
  );
};
export default AsianSportsPage;
