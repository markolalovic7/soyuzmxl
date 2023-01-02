import { useParams } from "react-router";

import { useGAPageView } from "../../../../hooks/google-analytics-hooks";

import CountrypageCentralContent from "./CountrypageCentralContent/CountrypageCentralContent";

const Countrypage = () => {
  const { eventPathId, sportCode } = useParams();

  useGAPageView("Country Page");

  return <CountrypageCentralContent eventPathId={eventPathId} sportCode={sportCode} />;
};

export default Countrypage;
