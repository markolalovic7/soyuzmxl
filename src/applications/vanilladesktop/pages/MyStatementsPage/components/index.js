import NewsBanner from "applications/vanilladesktop/components/NewsBanner";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";

import MyStatementsTable from "./MyStatementsTable/components";

const MyStatementsPage = () => (
  <main className={classes["main"]}>
    <NewsBanner />
    <div className={classes["registration"]}>
      <div className={classes["registration__container"]}>
        <MyStatementsTable />
      </div>
    </div>
  </main>
);

export default MyStatementsPage;
