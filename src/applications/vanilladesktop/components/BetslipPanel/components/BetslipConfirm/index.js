import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import * as PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { getCmsConfigIframeMode } from "../../../../../../redux/reselect/cms-selector";
import { getGlobalTotalStake } from "../../../../../../utils/betslip-utils";
import classes from "../../../../scss/vanilladesktop.module.scss";

const BetslipConfirm = ({
  allOutcomesValid,
  betslipData,
  data,
  hasOutcomes,
  loggedIn,
  minMaxLimitBreached,
  onClick,
  s,
  s1,
  submitInProgress,
}) => {
  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  const onEmbeddedLoginNotificationHandler = () => {
    if (isApplicationEmbedded) {
      window.parent.postMessage(
        {
          action: "app.iframe_effects",
          code: "LOGIN",
        },
        "*",
      );
    }
  };

  return (
    <div className={cx(classes["betslip__confirm"], classes["betslip-popup-activator1"])}>
      {loggedIn && (
        <button
          disabled={
            !allOutcomesValid ||
            !hasOutcomes ||
            getGlobalTotalStake(betslipData) <= 0 ||
            minMaxLimitBreached ||
            betslipData?.model?.outcomes?.length > parseInt(data?.maxSelections, 10) ||
            submitInProgress
          }
          type="button"
          onClick={onClick}
        >
          {submitInProgress ? (
            <div className={classes["spinner-container"]}>
              <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} />
            </div>
          ) : (
            s
          )}
        </button>
      )}
      {!loggedIn && (
        <button type="button" onClick={onEmbeddedLoginNotificationHandler}>
          {s1}
        </button>
      )}
    </div>
  );
};

BetslipConfirm.propTypes = {
  allOutcomesValid: PropTypes.bool.isRequired,
  betslipData: PropTypes.any.isRequired,
  data: PropTypes.any.isRequired,
  hasOutcomes: PropTypes.bool.isRequired,
  loggedIn: PropTypes.any.isRequired,
  minMaxLimitBreached: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  s: PropTypes.any.isRequired,
  s1: PropTypes.any.isRequired,
  submitInProgress: PropTypes.any.isRequired,
};

export default BetslipConfirm;
