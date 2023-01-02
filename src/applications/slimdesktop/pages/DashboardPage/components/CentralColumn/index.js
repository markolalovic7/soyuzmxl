import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import cx from "classnames";
import groupBy from "lodash.groupby";
import React, { useMemo } from "react";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "lodash.isempty";

import { getLiveEuropeanDashboardData } from "../../../../../../redux/reselect/live-selector";
import { getSportsSelector } from "../../../../../../redux/reselect/sport-selector";
import { useLiveData } from "../../../../../common/hooks/useLiveData";
import { getSortedLiveMatches } from "../../../../../vanillamobile/components/LivePage/utils";

import LiveDashboardColumn from "./components/LiveDashboardColumn";
import MainCarousel from "./components/MainCarousel";
import PrematchDashboardColumn from "./components/PrematchDashboardColumn";

const CentralColumn = () => {
  const dispatch = useDispatch();

  // Subscribe to the european dashboard live feed
  useLiveData(dispatch, "european-dashboard");

  const liveDataEuropeanDashboard = useSelector(getLiveEuropeanDashboardData);

  const sports = useSelector(getSportsSelector);

  const { matches, sportData } = useMemo(() => {
    if (liveDataEuropeanDashboard) {
      const liveSports = Object.keys(liveDataEuropeanDashboard).filter(
        (sport) => !isEmpty(liveDataEuropeanDashboard[sport]),
      );
      if (liveSports.length > 0) {
        const allMatches = [];
        Object.values(liveDataEuropeanDashboard).forEach((x) => {
          Object.values(x).forEach((y) => allMatches.push(y));
        });
        const matches = getSortedLiveMatches(allMatches);

        const sportDataGroup = groupBy(matches, (match) => match.sport);

        const sportData = {};
        Object.entries(sportDataGroup).forEach((entry) => {
          const matchesPerLeague = groupBy(entry[1], (match) => match.epDesc);
          sportData[entry[0]] = matchesPerLeague;
        });

        return { matches, sportData };
      }
    }

    return { matches: [], sportData: {} };
  }, [liveDataEuropeanDashboard, sports]);

  return (
    <div className={cx(classes["content__main"], classes["content__main_special"])}>
      <MainCarousel />

      <div className={classes["content__cols"]}>
        <PrematchDashboardColumn />
        <LiveDashboardColumn sportData={sportData} sports={sports} />
      </div>
    </div>
  );
};

export default React.memo(CentralColumn);
