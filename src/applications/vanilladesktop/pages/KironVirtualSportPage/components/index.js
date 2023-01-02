import NewsBanner from "applications/vanilladesktop/components/NewsBanner";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import { useParams } from "react-router";

import RightColumn from "../../../components/RightColumn";

import CentralColumn from "./CentralColumn";
import LeftColumn from "./LeftColumn";

const KironVirtualSportPage = () => {
  const { feedCode } = useParams();

  return (
    <main className={classes["main"]}>
      <NewsBanner />
      <div className={classes["main__container"]}>
        <div className={classes["main__sports"]}>
          <LeftColumn feedCode={feedCode} />
          <CentralColumn feedCode={feedCode} />
          <RightColumn />
        </div>
      </div>
    </main>
  );
};

export default KironVirtualSportPage;
