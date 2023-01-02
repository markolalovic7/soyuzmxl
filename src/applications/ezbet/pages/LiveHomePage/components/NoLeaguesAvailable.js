import cx from "classnames";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { getHrefHome } from "../../../../../utils/route-href";

import classes from "applications/ezbet/scss/ezbet.module.scss";
import { useActiveSportsTreeData } from "../../../hooks/active-sports-tree-data-hooks";
import { isNotEmpty } from "../../../../../utils/lodash";

const NoLeaguesAvailable = ({ sportCode }) => {
  const history = useHistory();

  const { t } = useTranslation();

  // eslint-disable-next-line new-cap
  const [dateState, setDateState] = useState(new dayjs());

  const { activeSportsTreeData } = useActiveSportsTreeData(sportCode);

  useEffect(() => {
    // eslint-disable-next-line new-cap
    setInterval(() => setDateState(new dayjs()), 1000);
  }, []);

  return (
    <div className={cx(classes["no-matches-available"], classes["live-no-leagues-available"])}>
      <h3>
        {t("ez.current_time")}
        <span>{dateState.format("MM-DD HH:mm")}</span>
      </h3>
      <p>현재 진행중인 라이브 경기가 종료 되었습니다.</p>
      <p>아래 링크로 이동시 예정된 프리매치 경기 페이지를 바로 이용 하실 수 있습니다.</p>
      <button
        className={classes["primary"]}
        type="button"
        onClick={() =>
          isNotEmpty(activeSportsTreeData.filter((x) => x.code === sportCode))
            ? history.push(`/prematch/sport/${sportCode}`)
            : history.push(getHrefHome())
        }
      >
        프리매치 게임으로 이동 하기
      </button>
    </div>
  );
};

NoLeaguesAvailable.propTypes = {
  sportCode: PropTypes.string.isRequired,
};
export default React.memo(NoLeaguesAvailable);
