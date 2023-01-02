import cx from "classnames";
import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

import { hasDesktopLeftColumn, hasDesktopRightColumn } from "../../../../../redux/reselect/cms-layout-widgets";
import SportNavigationHeader from "../../../components/SportNavigationHeader";
import classes from "../../../scss/slimdesktop.module.scss";

import ResultsContent from "./ResultsContent";

const ResultsPage = () => {
  const location = useLocation();
  const hasLeftColumn = useSelector((state) => hasDesktopLeftColumn(state, location));
  const hasRightColumn = useSelector((state) => hasDesktopRightColumn(state, location));

  return (
    <main className={classes["main"]}>
      <section className={classes["content"]}>
        <div className={cx(classes["content__main"], { [classes["content__main_no-scroll"]]: false })}>
          <SportNavigationHeader />
          <ResultsContent />
        </div>
      </section>
    </main>
  );
};

export default React.memo(ResultsPage);
