import { useParams } from "react-router";

import { useGAPageView } from "../../../../../hooks/google-analytics-hooks";

import SportsSectionContent from "./SportsSectionContent";

const SportsPage = () => {
  const { sportCode } = useParams();

  useGAPageView("Sport Page");

  return <SportsSectionContent sportCode={sportCode} />;
};

export default SportsPage;
