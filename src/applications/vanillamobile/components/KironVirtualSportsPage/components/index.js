import cx from "classnames";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import KironVirtualSportModal from "../../KironVirtualSportModal";
import classes from "../styles/index.module.scss";
import { getAPIFeedCode } from "../utils";

import KironRacingContainer from "./KironRacingContainer";

import PrematchContainer from "applications/vanillamobile/common/components/PrematchContainer";
import StatsButton from "applications/vanillamobile/common/components/StatsButton";
import Modal from "components/Modal";
import { getCmsConfigKironVirtualVideoByFeedCode } from "redux/reselect/cms-selector";
import { getKironFeedCodeTranslated } from "utils/kiron-virtual-sport";
import { getSportCode, isKironGameEvent, isKironRankEvent } from "utils/kiron-virtual-utils";

const propTypes = {};
const defaultProps = {};

const KironVirtualSportsPage = () => {
  const { feedCode } = useParams();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const videoURL = useSelector((state) => getCmsConfigKironVirtualVideoByFeedCode(state, feedCode));

  const onKironVirtualSportModalOpen = () => {
    setIsModalOpen(true);
  };

  const renderKironVirtualSportModal = () => {
    const onKironVirtualSportModalClose = () => {
      setIsModalOpen(false);
    };

    return (
      <Modal open={isModalOpen} onClose={onKironVirtualSportModalClose}>
        <KironVirtualSportModal feedCode={feedCode} onClose={onKironVirtualSportModalClose} />
      </Modal>
    );
  };

  return (
    <div className={classes["virtual-sports"]}>
      <div className={classes["virtual-sports__nav_bar_wrapper"]}>
        <div className={classes["virtual-sports__title"]}>
          <span className={classes["virtual-sports__icon"]}>
            <i className={cx(classes["qicon-default"], classes[`qicon-${getSportCode(feedCode).toLowerCase()}`])} />
          </span>
          <span className={classes["virtual-sports__text"]}>{getKironFeedCodeTranslated(feedCode, t)}</span>
          <StatsButton onClick={onKironVirtualSportModalOpen} />
          <div
            className={`${classes["bet__icon"]} ${classes[isVideo ? "active" : "none"]}`}
            onClick={() => setIsVideo(() => !isVideo)}
          >
            <i className={classes["qicon-video-camera"]} />
          </div>
        </div>
        {isVideo && videoURL && (
          <div className={classes["virtual-sports__iframe_video_wrapper"]}>
            <iframe frameBorder="0" height="100%" src={videoURL} title={feedCode} width="100%" />
          </div>
        )}
      </div>
      <div className={classes["bets"]}>
        {/* Review if this would work for prematch and live */}

        {isKironGameEvent(feedCode) && (
          <PrematchContainer virtual eventType="ALL" searchCode={getAPIFeedCode(feedCode)} />
        )}
        {isKironRankEvent(feedCode) && (
          <div style={{ marginTop: "10px" }}>
            <KironRacingContainer virtual eventType="ALL" searchCode={getAPIFeedCode(feedCode)} />
          </div>
        )}
      </div>
      {renderKironVirtualSportModal()}
    </div>
  );
};

KironVirtualSportsPage.propTypes = propTypes;
KironVirtualSportsPage.defaultProps = defaultProps;

export default KironVirtualSportsPage;
