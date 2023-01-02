import { useParams } from "react-router";

import { useGAPageView } from "../../../../../hooks/google-analytics-hooks";

import LeagueSectionContent from "./LeagueSectionContent";

const LeaguePage = () => {
  const { eventPathId, sportCode } = useParams();

  useGAPageView("League Page");

  return <LeagueSectionContent eventPathId={parseInt(eventPathId, 10)} sportCode={sportCode} />;
};

export default LeaguePage;
