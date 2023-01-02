import cx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { useHistory } from "react-router";

import SportIcon from "applications/ezbet/components/SportIcon/SportIcon";
import classes from "applications/ezbet/scss/ezbet.module.scss";

const DesktopLiveHeader = ({ eventCount, eventPathDesc, eventPathId, sportCode }) => {
  const history = useHistory();

  return (
    <section className={cx(classes["filter-wrapper"], classes["filter-wrapper-double-left"])}>
      <div className={classes["left"]}>
        <i
          className={classes["icon-double-left2"]}
          onClick={() => history.push(`/live/sport/${sportCode}/eventpath/${eventPathId}`)}
        />
        <div className={cx(classes["sport-iconx-active"])}>
          <SportIcon code={sportCode} />
        </div>
        <div className={classes["flex-center"]}>
          <p>{eventPathDesc && eventPathDesc}</p>
          &nbsp;
          <span className={classes["league-name-count"]}>{eventCount ? `( ${eventCount} )` : ""}</span>
        </div>
      </div>

      {/* <div className={classes["right"]}> */}
      {/*  <IconLiveSVG /> */}
      {/* </div> */}
    </section>
  );
};

DesktopLiveHeader.propTypes = {
  eventCount: PropTypes.number.isRequired,
  eventPathDesc: PropTypes.string.isRequired,
  eventPathId: PropTypes.number.isRequired,
  sportCode: PropTypes.string.isRequired,
};

export default React.memo(DesktopLiveHeader);
