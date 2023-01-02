import { useGAPageView } from "../../../../../hooks/google-analytics-hooks";

import HomePageSlider from "./HomePageSlider";
import HomePageSportsContent from "./HomePageSportsContent";

const HomePage = () => {
  useGAPageView("Home");

  return (
    <>
      <HomePageSlider />

      <HomePageSportsContent />
    </>
  );
};

export default HomePage;
