import { useParams } from "react-router";

import { useGAPageView } from "../../../../hooks/google-analytics-hooks";

import LeaguepageCentralContent from "./LeaguepageCentralContent/LeaguepageCentralContent";

const Leaguepage = () => {
  const { eventPathId, sportCode } = useParams();

  useGAPageView("League Page");

  return (
    <LeaguepageCentralContent
      eventPathId={eventPathId && !Number.isNaN(eventPathId) ? parseInt(eventPathId, 10) : null}
      sportCode={sportCode}
    />
  );
};

export default Leaguepage;
