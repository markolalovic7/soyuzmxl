import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import classes from "../../../../scss/vanilladesktop.module.scss";

const BetslipRemoveAll = ({ onClick }) => {
  const { t } = useTranslation();

  const submitInProgress = useSelector((state) => state.betslip.submitInProgress);

  return (
    <span
      className={classes["betslip__remove"]}
      style={{ pointerEvents: submitInProgress ? "none" : "auto" }}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faTrash} />
      <span>{t("betslip_panel.remove_all")}</span>
    </span>
  );
};

BetslipRemoveAll.propTypes = { onClick: PropTypes.func.isRequired };

export default BetslipRemoveAll;
