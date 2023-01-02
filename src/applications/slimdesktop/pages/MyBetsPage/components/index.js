import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import cx from "classnames";

import MyBetsTable from "./MyBetsTable";

const MyBetsPage = () => (
  <main className={classes["main"]}>
    <section className={cx(classes["content"], classes["content_form"])}>
      <div className={classes["registration"]} style={{ width: "100%" }}>
        <div className={classes["registration__container"]} style={{ width: "100%" }}>
          <MyBetsTable />
        </div>
      </div>
    </section>
  </main>
);

export default MyBetsPage;
