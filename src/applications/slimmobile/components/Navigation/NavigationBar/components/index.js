import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropsTypes from "prop-types";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

import { makeGetBetslipOutcomes } from "../../../../../../redux/reselect/betslip-selector";
import BetslipPanel from "../../BetslipPanel";
import classes from "../styles/index.module.scss";

import NavigationMenuLinks from "./NavigationMenuLinks";

const propTypes = {
  accountPanelToggleHandler: PropsTypes.func.isRequired,
  backdropClickHandler: PropsTypes.func.isRequired,
  betslipDrawerCloseHandler: PropsTypes.func.isRequired,
  betslipDrawerToggleHandler: PropsTypes.func.isRequired,
  showBetslip: PropsTypes.bool.isRequired,
};

const NavigationBar = ({
  accountPanelToggleHandler,
  backdropClickHandler,
  betslipDrawerCloseHandler,
  betslipDrawerToggleHandler,
  showBetslip,
}) => {
  const location = useLocation();
  const getBetslipOutcomes = useMemo(makeGetBetslipOutcomes, []);
  const betslipOutcomes = useSelector((state) => getBetslipOutcomes(state, location.pathname));

  return (
    <>
      <div className={classes["navigation-menu-wrapper"]}>
        <NavigationMenuLinks />
        <div
          className={`${classes["navigation-betslip-icon-wrapper"]} ${showBetslip ? classes["active"] : ""}`}
          onClick={betslipDrawerToggleHandler}
        >
          <span>
            <FontAwesomeIcon icon={faFolderOpen} />
          </span>
          {!showBetslip && <span className={classes["betslip-icon-count"]}>{betslipOutcomes.length}</span>}
        </div>
      </div>
      <BetslipPanel
        accountPanelToggleHandler={accountPanelToggleHandler}
        backdropClickHandler={backdropClickHandler}
        betslipDrawerCloseHandler={betslipDrawerCloseHandler}
        betslipDrawerToggleClicked={betslipDrawerToggleHandler}
        open={showBetslip}
      />
    </>
  );
};

NavigationBar.propTypes = propTypes;

export default NavigationBar;
