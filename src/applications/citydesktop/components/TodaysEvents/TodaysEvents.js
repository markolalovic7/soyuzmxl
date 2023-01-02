import { useGAPageView } from "../../../../hooks/google-analytics-hooks";

import TodaysEventsCentralContent from "./TodaysEventsCentralContent/TodaysEventsCentralContent";

const TodaysEvents = () => {
  useGAPageView("Today's Events");

  return <TodaysEventsCentralContent />;
};

export default TodaysEvents;
