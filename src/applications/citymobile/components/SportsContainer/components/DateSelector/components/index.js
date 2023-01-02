import dayjs from "dayjs";
import * as PropTypes from "prop-types";
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { getAuthLanguage } from "redux/reselect/auth-selector";
import { getLocaleDateDayNumberMonth } from "utils/date-format";

import classes from "../../../../../scss/citymobile.module.scss";

const DateSelector = ({ activeDateIndex, setActiveDateIndex, sportCode }) => {
  const locale = useSelector(getAuthLanguage);
  const dateFormat = useMemo(() => getLocaleDateDayNumberMonth(locale), [locale]);

  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData);

  const criterias = sportsTreeData?.ept?.find((s) => s.code === sportCode)?.criterias;

  const indexes = criterias
    ? Object.keys(criterias)
        .map((c) => {
          if (c.length >= 2) {
            if (Number.isNaN(parseInt(c.substring(1, c.length), 10))) {
              return null;
            }
          }
          const i = parseInt(c.substring(1, c.length), 10);

          return i;
        })
        .filter((i) => i !== null)
    : [];

  useEffect(() => {
    if (indexes.length > 0) {
      if (!activeDateIndex) {
        // if nothing selected...
        // init the date selection to the first one...
        setActiveDateIndex(indexes[0]);
      } else if (!indexes.includes(activeDateIndex)) {
        // If the date selection is not valid (likely if we navigate from one page to another and the state needs re-setting)
        setActiveDateIndex(indexes[0]);
      }
    }
  }, [activeDateIndex, indexes, setActiveDateIndex]);

  return (
    <div className={classes["links"]}>
      {indexes &&
        indexes.map((i) => {
          const date = dayjs().add(i, "day");

          return (
            <div
              className={`${classes["links__item"]} ${activeDateIndex === i ? classes["links__item_active"] : ""}`}
              key={i}
              onClick={() => setActiveDateIndex(i)}
            >
              <span>{date.format(dateFormat)}</span>
            </div>
          );
        })}
    </div>
  );
};

const propTypes = {
  activeDateIndex: PropTypes.number,
  setActiveDateIndex: PropTypes.func.isRequired,
  sportCode: PropTypes.string.isRequired,
};

const defaultProps = {
  activeDateIndex: undefined,
};

DateSelector.propTypes = propTypes;
DateSelector.defaultProps = defaultProps;

export default React.memo(DateSelector);
