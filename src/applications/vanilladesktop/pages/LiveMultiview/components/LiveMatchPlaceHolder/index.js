import { faArrowsAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";

import classes from "../../../../scss/vanilladesktop.module.scss";

const propTypes = {
  fakeEventId: PropTypes.number.isRequired,
  isDraggedOver: PropTypes.bool.isRequired,
  onDragEnterHandler: PropTypes.func.isRequired,
  onDragLeaveHandler: PropTypes.func.isRequired,
  onDragOverHandler: PropTypes.func.isRequired,
  onDropHandler: PropTypes.func.isRequired,
};
const LiveMatchPlaceHolder = ({
  fakeEventId,
  isDraggedOver,
  onDragEnterHandler,
  onDragLeaveHandler,
  onDragOverHandler,
  onDropHandler,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={classes["live-overview-spoilers"]}
      key={fakeEventId}
      style={{ border: isDraggedOver ? "1px dashed #c7255d" : "none", opacity: isDraggedOver ? 0.5 : 1 }}
      onDragEnter={(e) => onDragEnterHandler(e, fakeEventId)}
      onDragLeave={(e) => onDragLeaveHandler(e)}
      onDragOver={(e) => onDragOverHandler(e, fakeEventId)}
      onDrop={(e) => onDropHandler(e)}
    >
      <div className={classes["multi-card"]}>
        <div className={classes["multi-card__icon"]}>
          <FontAwesomeIcon icon={faArrowsAlt} />
        </div>
        <div className={classes["multi-card__text"]}>{t("multiview_click_or_drag")}</div>
        <div className={classes["multi-card__text"]}>{t("multiview_bet_on_message", { max_events: 8 })}</div>
      </div>
    </div>
  );
};

LiveMatchPlaceHolder.propTypes = propTypes;

export default React.memo(LiveMatchPlaceHolder);
