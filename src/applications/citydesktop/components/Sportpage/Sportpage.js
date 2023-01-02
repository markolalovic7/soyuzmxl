import { useParams } from "react-router";

import { useGAPageView } from "../../../../hooks/google-analytics-hooks";

import SportpageCentralContent from "./SportpageCentralContent/SportpageCentralContent";

const Sportpage = () => {
  const { sportCode } = useParams();

  useGAPageView("Sport Page");

  return <SportpageCentralContent sportCode={sportCode} />;
};

export default Sportpage;
