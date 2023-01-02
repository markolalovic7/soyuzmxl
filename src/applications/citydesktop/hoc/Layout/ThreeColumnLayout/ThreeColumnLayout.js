import { Animate } from "react-simple-animate";

import LeftNavigation from "../../../components/Navigation/LeftNavigation/LeftNavigation";
import RightNavigation from "../../../components/Navigation/RightNavigation/RightNavigation";
import classes from "../../../scss/citywebstyle.module.scss";

const ThreeColumnLayout = (props) => (
  <Animate play end={{ opacity: 1 }} start={{ opacity: 0 }}>
    <main className={classes["main"]}>
      <LeftNavigation />
      {props.children}
      <RightNavigation />
    </main>
  </Animate>
);

export default ThreeColumnLayout;
