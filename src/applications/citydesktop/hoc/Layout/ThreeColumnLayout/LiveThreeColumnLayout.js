import { Animate } from "react-simple-animate";

import LiveLeftNavigation from "../../../components/Navigation/LiveLeftNavigation";
import RightNavigation from "../../../components/Navigation/RightNavigation/RightNavigation";
import classes from "../../../scss/citywebstyle.module.scss";

const ThreeColumnLayout = (props) => (
  <Animate play end={{ opacity: 1 }} start={{ opacity: 0 }}>
    <main className={classes["main"]}>
      <LiveLeftNavigation />
      {props.children}
      <RightNavigation />
    </main>
  </Animate>
);

export default ThreeColumnLayout;
