import NewsBanner from "applications/vanilladesktop/components/NewsBanner";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";

import MyBetsTable from "./MyBetsTable";

const MyBetsPage = () => (
  <main className={classes["main"]}>
    <NewsBanner />
    <div className={classes["registration"]}>
      <div className={classes["registration__container"]}>
        <MyBetsTable />
      </div>
    </div>
  </main>
);

export default MyBetsPage;
