import classes from "../../../../../scss/citymobile.module.scss";
import SportsContainer from "../../../../SportsContainer";

const TodayPageSportsContent = () => (
  <div className={classes["sport"]}>
    <SportsContainer liveModeOn prematchModeOn sportSelectorModeOn prematchDateToIndex={0} />
  </div>
);

export default TodayPageSportsContent;
