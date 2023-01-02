// import cx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import classes from "../../../../scss/ezbet.module.scss";

const NoMarketsAvailable = ({ eventPathId, sportCode }) => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <div className={classes["live-no-markets-available"]}>
      <p>시장 유형이 곧 제공될 것입니다. 나중에 다시 시도해 주십시오.</p>
      <button
        className={classes["primary"]}
        type="button"
        onClick={() => history.push(`/live/sport/${sportCode}/eventpath/${eventPathId}`)}
      >
        진행 중인 라이브 경기로 이동
      </button>
    </div>
  );
};

NoMarketsAvailable.propTypes = {
  eventPathId: PropTypes.number.isRequired,
  sportCode: PropTypes.string.isRequired,
};

export default React.memo(NoMarketsAvailable);
