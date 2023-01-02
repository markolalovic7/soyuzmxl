import ComplexSportLabels from "applications/citydesktop/components/Common/ComplexSportLabels/index.js";
import MatchSummaryContentHolder from "applications/citydesktop/components/Common/MatchSummaryContentHolder/index.js";
import complexCouponSportCodes from "applications/citydesktop/components/Common/utils/complexCouponSportCodes.js";
import classes from "applications/citydesktop/scss/citywebstyle.module.scss";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getAuthLanguage, getAuthTimezoneOffset } from "redux/reselect/auth-selector";
import dayjs from "services/dayjs";
import { getLocaleWeekdayMonthDayNumber } from "utils/date-format";

import { isNotEmpty } from "../../../../../../../../utils/lodash";

const GameOddsSportsContentHolder = (props) => {
  const { t } = useTranslation();

  const timezoneOffset = useSelector(getAuthTimezoneOffset);

  const locale = useSelector(getAuthLanguage);
  const dateFormat = useMemo(() => getLocaleWeekdayMonthDayNumber(locale), [locale]);

  return isNotEmpty(props.dates) ? (
    props.dates.map((date) => {
      const dateDescription = dayjs().utcOffset(timezoneOffset).add(date.offset, "day").format(dateFormat);
      const complexDisplayMode = complexCouponSportCodes.includes(props.sportCode);

      return (
        <div className={classes["sports-item"]} key={dateDescription}>
          <div className={classes["sports-spoilers"]} key={dateDescription}>
            <div className={classes["sports-spoiler"]}>
              <h3
                className={`${classes["sports-title"]} ${complexDisplayMode ? classes["sports-title_labels"] : ""}`}
                style={{ marginBottom: 0 }}
              >
                <span>
                  {dateDescription} ({date.events.length})
                </span>
                <ComplexSportLabels enabled={complexDisplayMode} />
              </h3>
              <div className={classes["sports-spoiler__wrapper"]}>
                <div className={`${classes["sports-spoiler__body"]}  ${classes["open"]}`}>
                  {date.events.map((match) => (
                    <MatchSummaryContentHolder key={match.eventId} match={match} sportCode={match.code} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    })
  ) : (
    <div style={{ textAlign: "center" }}>{t("no_events_found")}</div>
  );
};

export default React.memo(GameOddsSportsContentHolder);
