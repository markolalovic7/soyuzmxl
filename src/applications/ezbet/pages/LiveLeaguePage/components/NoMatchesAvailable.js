import cx from "classnames";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import classes from "applications/ezbet/scss/ezbet.module.scss";

const NoMatchesAvailable = ({ onClick, sportCode }) => {
  const history = useHistory();

  const { t } = useTranslation();

  // eslint-disable-next-line new-cap
  const [dateState, setDateState] = useState(new dayjs());
  useEffect(() => {
    // eslint-disable-next-line new-cap
    setInterval(() => setDateState(new dayjs()), 1000);
  }, []);

  return (
    <div className={cx(classes["no-matches-available"], classes["live-match-ended"])}>
      <h3>
        {t("ez.current_time")}
        <span>{dateState.format("MM-DD HH:mm")}</span>
      </h3>
      <p>현재 진행중인 라이브 경기가 종료 되었습니다.</p>
      <p>당신은 다른 리그의 라이브 경기를 보려면 아래 <br /> 링크로 갈 수 있다. 바로 이용 하실 수 있습니다.</p>
      <button className={classes["primary"]} type="button" onClick={onClick}>
        라이브 게임 리그 선택으로 이동
      </button>
    </div>
  );
};

NoMatchesAvailable.propTypes = {
  onClick: PropTypes.func.isRequired,
  sportCode: PropTypes.string.isRequired,
};
export default React.memo(NoMatchesAvailable);
