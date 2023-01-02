import { Animate } from "react-simple-animate";

import RightNavigation from "../../../components/Navigation/RightNavigation/RightNavigation";
import classes from "../../../scss/citywebstyle.module.scss";

const ThreeColumnLayout = (props) => (
  <Animate play end={{ opacity: 1 }} start={{ opacity: 0 }}>
    <main className={classes["main"]}>
      {props.children}
      <RightNavigation />
    </main>
  </Animate>
);

export default ThreeColumnLayout;
