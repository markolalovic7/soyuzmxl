import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";

import LeftCompactColumn from "./LeftCompactColumn";
import RightCompactColumn from "./RightCompactColumn";

const CompactPrematchBody = () => (
  <div className={classes["content__cols"]}>
    <LeftCompactColumn />
    <RightCompactColumn />
  </div>
);

export default CompactPrematchBody;
