import classes from "applications/citymobile/scss/citymobile.module.scss";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { getAuthLanguage, getAuthTimezoneOffset } from "redux/reselect/auth-selector";
import { getLocaleFullDateFormat } from "utils/date-format";

import { getBackgroundImageByCode } from "./utils";

const PrematchEventHeader = ({ a, b, code, epoch, league }) => {
  const locale = useSelector(getAuthLanguage);
  const timezoneOffset = useSelector(getAuthTimezoneOffset);

  const dateFormat = useMemo(() => getLocaleFullDateFormat(locale), [locale]);

  return (
    <div
      className={classes["event-match"]}
      style={{ background: `url(${getBackgroundImageByCode(code)}) 100%/cover no-repeat` }}
    >
      <div className={classes["event-match__container"]}>
        <div className={classes["event-match__title"]}>
          <span>
            {dayjs
              .unix(epoch / 1000)
              .utcOffset(timezoneOffset)
              .format(dateFormat)}
          </span>
          <span>{league}</span>
        </div>
        <div className={classes["event-match__teams"]}>
          <span className={classes["event-match__team"]}>{a}</span>
          <span className={classes["event-match__vs"]}>vs</span>
          <span className={classes["event-match__team"]}>{b}</span>
        </div>
      </div>
    </div>
  );
};

const propTypes = {
  a: PropTypes.string.isRequired,
  b: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  epoch: PropTypes.number.isRequired,
  league: PropTypes.string.isRequired,
};

PrematchEventHeader.propTypes = propTypes;

export default React.memo(PrematchEventHeader);
