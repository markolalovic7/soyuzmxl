import cx from "classnames";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import classes from "applications/ezbet/scss/ezbet.module.scss";
import { getAuthLanguage } from "redux/reselect/auth-selector";
import { getLocaleDateDayNumberMonth, getLocaleEZDateDayNumberMonth } from "utils/date-format";

// const TODAY_KEY = "TODAY";
const TOMORROW_KEY = "TOMORROW";
const AFTER_TOMORROW_KEY = "AFTER_TOMORROW";

const today = dayjs().set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0);
const tomorrow = dayjs().add(1, "day").set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0);
const twoDaysFromNow = dayjs().add(2, "day").set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0);
const threeDaysFromNow = dayjs().add(3, "day").set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0);

// const range1 = { from: today, key: TODAY_KEY, ordinal: 1, to: tomorrow };
const range2 = { from: tomorrow, key: TOMORROW_KEY, ordinal: 2, to: twoDaysFromNow };
const range3 = {
  from: twoDaysFromNow,
  key: AFTER_TOMORROW_KEY,
  ordinal: 3,
  to: threeDaysFromNow,
};

const NoMatchesAvailable = ({ leagueCount, onGoBack, selectedDateRange, setSelectedDateRange }) => {
  const locale = useSelector(getAuthLanguage);
  const dateFormat = React.useMemo(() => getLocaleDateDayNumberMonth(locale), [locale]);
  const dateFormatButton = React.useMemo(() => getLocaleEZDateDayNumberMonth(locale), [locale]);

  const { t } = useTranslation();

  return selectedDateRange.key === "TODAY" ? (
    <div className={cx(classes["no-matches-available"], classes[`${selectedDateRange.key}`])}>
      <h3>
        {t("ez.current_time")}
        <span>{dayjs(new Date()).format("MM-DD HH:mm")}</span>
      </h3>
      <p>{t("ez.no_matches_for_today")}</p>
      <button className={classes["primary"]} type="button" onClick={() => setSelectedDateRange(range2)}>
        {tomorrow.format(dateFormatButton)}
        <br />
        {t("ez.upcoming_games")}
      </button>
    </div>
  ) : selectedDateRange.key === "TOMORROW" ? (
    <div className={cx(classes["no-matches-available"], classes[`${selectedDateRange.key}`])}>
      <h3>
        {t("ez.current_time")}
        <span>{dayjs(new Date()).format("MM-DD HH:mm")} </span>
      </h3>
      <p>
        {tomorrow.format("MM-DD")} {t("ez.canceled_or_closed")}
        {t("ez.when_you_go_to_the_link_below")}
        {twoDaysFromNow.format("MM-DD")}
        {t("ez.scheduled_matches_page")}
        <span>{t("ez.you_can_use_it_right_away")}</span>
      </p>
      <button className={classes["primary"]} type="button" onClick={() => setSelectedDateRange(range3)}>
        {twoDaysFromNow.format(dateFormatButton)}
        <br />
        {t("ez.upcoming_games")}
      </button>
    </div>
  ) : selectedDateRange.key === "AFTER_TOMORROW" ? (
    <div className={cx(classes["no-matches-available"], classes[`${selectedDateRange.key}`])}>
      <h3>
        {t("ez.current_time")}
        <span>{dayjs(new Date()).format("MM-DD HH:mm")}</span>
      </h3>
      <p>
        <span style={{ whiteSpace: "nowrap" }}>
          {twoDaysFromNow.format("MM-DD")} {t("ez.canceled_or_closed")} <br /> {t("ez.three_match_schedule")}
        </span>
      </p>
      <button className={classes["primary"]} type="button" onClick={onGoBack}>
        {leagueCount > 1 && t("ez.other_leagues")}
        {leagueCount <= 1 && t("ez.select_different_country")}
      </button>
    </div>
  ) : null;
};

NoMatchesAvailable.propTypes = {
  leagueCount: PropTypes.number.isRequired,
  onGoBack: PropTypes.func.isRequired,
  selectedDateRange: PropTypes.object.isRequired,
  setSelectedDateRange: PropTypes.func.isRequired,
};
export default React.memo(NoMatchesAvailable);
