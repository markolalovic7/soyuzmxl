import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const propTypes = {
  desc: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
};

const UpcomingMatchesDescription = ({ desc, startTime }) => {
  const { t } = useTranslation();

  return (
    <div className={classes["virtual-matches"]}>
      <div className={classes["virtual-matches__labels"]}>
        <div className={classes["virtual-matches__title"]}>{`${desc} - ${startTime}`}</div>
        <div className={classes["virtual-matches__win"]}>
          <span>{t("winner")}</span>
          <FontAwesomeIcon icon={faQuestionCircle} />
        </div>
        <div className={classes["virtual-matches__top"]}>
          <span>{t("top_3")}</span>
          <FontAwesomeIcon icon={faQuestionCircle} />
        </div>
      </div>
    </div>
  );
};

UpcomingMatchesDescription.propTypes = propTypes;

export default UpcomingMatchesDescription;
