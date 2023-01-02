import { useGAPageView } from "../../../../hooks/google-analytics-hooks";

import HomepageCentralContent from "./HomepageCentralContent/HomepageCentralContent";

const Homepage = () => {
  useGAPageView("Home");

  return <HomepageCentralContent />;
};

export default Homepage;
