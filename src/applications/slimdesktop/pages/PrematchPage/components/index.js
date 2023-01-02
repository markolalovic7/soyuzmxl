import { useSelector } from "react-redux";
import { useLocation } from "react-router";

import { hasDesktopLeftColumn, hasDesktopRightColumn } from "../../../../../redux/reselect/cms-layout-widgets";
import SideColumn from "../../../components/SideColumn";
import classes from "../../../scss/slimdesktop.module.scss";

import CentralColumn from "./CentralColumn";

const PrematchPage = () => {
  const location = useLocation();
  const hasLeftColumn = useSelector((state) => hasDesktopLeftColumn(state, location));
  const hasRightColumn = useSelector((state) => hasDesktopRightColumn(state, location));

  return (
    <main className={classes["main"]}>
      <section className={classes["content"]}>
        {hasLeftColumn && <SideColumn left />}
        <CentralColumn />
        {hasRightColumn && <SideColumn right />}
      </section>
    </main>
  );
};

export default PrematchPage;
