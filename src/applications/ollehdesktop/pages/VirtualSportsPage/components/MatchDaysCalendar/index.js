import classes from "applications/ollehdesktop/scss/ollehdesktop.module.scss";
import cx from "classnames";
import { useState } from "react";

// Demo
const MatchDaysCalendar = () => {
  const [selectedDay, setSelectedDay] = useState(5);

  return (
    <div className={classes["virtual__details-range"]}>
      {Array.from(Array(30)).map((_, index) => (
        <button
          className={cx({ [classes["active"]]: selectedDay === index })}
          key={index}
          type="button"
          onClick={() => setSelectedDay(index)}
        >
          <span>{index + 1}</span>
        </button>
      ))}
    </div>
  );
};

export default MatchDaysCalendar;
