import classes from "applications/citydesktop/scss/citywebstyle.module.scss";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { getAuthLanguage } from "redux/reselect/auth-selector";
import { getLocaleFullDateFormat } from "utils/date-format";

import { getBackgroundImageByCode } from "./utils";

const propTypes = {
  match: PropTypes.object.isRequired,
};

const PrematchEventDetailPageHeader = ({ match }) => {
  const locale = useSelector(getAuthLanguage);
  const dateFormat = useMemo(() => getLocaleFullDateFormat(locale), [locale]);

  return (
    <div className={classes["content__container"]}>
      <div
        className={classes["event-match"]}
        style={{ background: `url(${getBackgroundImageByCode(match.code)}) 100%/cover no-repeat` }}
      >
        <div className={classes["event-match__container"]}>
          <div className={`${classes["event-match__team"]} ${classes["event-match__team_first"]}`}>
            <span>{match.a}</span>
          </div>
          <div className={classes["event-match__date"]}>
            <span className={classes["event-match__day"]}>{dayjs.unix(match.epoch / 1000).format(dateFormat)}</span>
            <span className={classes["event-match__league"]}>
              {`${match.path["League"]} - ${match.path["Country/Region"]}`}
            </span>
          </div>
          <div className={`${classes["event-match__team"]} ${classes["event-match__team_second"]}`}>
            <span>{match.b}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

PrematchEventDetailPageHeader.propTypes = propTypes;

export default React.memo(PrematchEventDetailPageHeader);
