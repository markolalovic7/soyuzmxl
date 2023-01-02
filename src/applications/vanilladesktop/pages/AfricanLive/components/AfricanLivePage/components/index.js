import NewsBanner from "applications/vanilladesktop/components/NewsBanner";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import React from "react";
import { useParams } from "react-router";

import RightColumn from "../../../../../components/RightColumn";

import AfricanLiveLeftColumn from "./AfricanLiveLeftColumn";
import CentralColumn from "./CentralColumn";

const AfricanLivePage = () => {
  const { sportCode } = useParams();

  return (
    <main className={cx(classes["main"], classes["continental-page"], classes["continental-sports-page"])}>
      <NewsBanner />
      <div className={classes["main__container"]}>
        <div className={classes["main__sports"]}>
          <AfricanLiveLeftColumn sportCode={sportCode} />
          <CentralColumn sportCode={sportCode} />
          <RightColumn />
        </div>
      </div>
    </main>
  );
};

export default React.memo(AfricanLivePage);
