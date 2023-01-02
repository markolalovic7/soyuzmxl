import Spinner from "applications/common/components/Spinner";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { useLiveData } from "../../../../../../common/hooks/useLiveData";
import classes from "../../../../../scss/citywebstyle.module.scss";
import { addLiveContentBySport } from "../../../../Common/utils/dataAggregatorUtils";
import HomepageSportsContentHolder from "../../../../Homepage/HomepageCentralContent/HomepageSportsContent/HomepageSportsContentHolder/HomepageSportsContentHolder";

const combineContent = (sport, activeCentralContentTab, liveData) => {
  // Always add prematch first, and live on top

  const content = [];
  addLiveContentBySport(content, liveData, sport);

  return content;
};

const isCouponReadyToShow = (activeCentralContentTab, subscribed) => {
  if (subscribed) {
    return true;
  }

  return false;
};

const InPlaySportsContent = (props) => {
  // Subscribe to live data...
  const dispatch = useDispatch();
  const europeanDashboardLiveData = useSelector((state) => state.live.liveData["european-dashboard"]);

  // Subscribe to the european dashboard live feed
  useLiveData(dispatch, "european-dashboard");

  const combinedContent = combineContent(
    props.activeCarouselSport,
    props.activeCentralContentTab,
    europeanDashboardLiveData,
  );

  const isReady = isCouponReadyToShow(props.activeCentralContentTab, europeanDashboardLiveData);

  return isReady ? (
    <HomepageSportsContentHolder overviewPageMode leagues={combinedContent} />
  ) : (
    <div className={classes["homepage-spinner"]}>
      <Spinner className={classes.loader} />
    </div>
  );
};

export default React.memo(InPlaySportsContent);
