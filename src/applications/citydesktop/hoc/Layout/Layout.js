import Header from "../../components/Navigation/Header/Header";
import classes from "../../scss/citywebstyle.module.scss";

const Layout = ({ children }) => (
  <div className={classes["wrapper"]}>
    <Header />

    <main style={{ overflow: "hidden" }}>{children}</main>
  </div>
);

export default Layout;
