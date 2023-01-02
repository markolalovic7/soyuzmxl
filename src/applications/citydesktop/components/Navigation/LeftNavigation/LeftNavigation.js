import { useTranslation } from "react-i18next";

import classes from "../../../scss/citywebstyle.module.scss";

import LeftNavigationHelpSection from "./LeftNavigationHelpSection/LeftNavigationHelpSection";
import LeftNavigationHighlights from "./LeftNavigationHighlights/LeftNavigationHighlights";
import LeftNavigationSearch from "./LeftNavigationSearch/LeftNavigationSearch";
import SportsTree from "./SportsTree/SportsTree";

const LeftNavigation = () => {
  const { t } = useTranslation();

  return (
    <section className={classes["left-panel"]}>
      <LeftNavigationSearch />

      <LeftNavigationHighlights />

      <SportsTree />

      <LeftNavigationHelpSection />
    </section>
  );
};

export default LeftNavigation;
