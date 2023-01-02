import ArrowUpSVG from "applications/citymobile/img/icons/arrow-up.svg";
import classes from "applications/citymobile/scss/citymobile.module.scss";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const propTypes = {
  isButtonShown: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const ArrowUpTopButton = ({ isButtonShown, onClick }) => {
  const { t } = useTranslation();

  return (
    <a className={`${classes["top"]} ${isButtonShown && classes["active"]}`} href="#top" onClick={onClick}>
      <span className={classes["top__arrow"]}>
        <img alt="arrow-top" src={ArrowUpSVG} />
      </span>
      <span className={classes["top__text"]}>{t("top")}</span>
    </a>
  );
};

ArrowUpTopButton.propTypes = propTypes;

export default ArrowUpTopButton;
