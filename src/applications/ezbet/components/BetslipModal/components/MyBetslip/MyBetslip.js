import cx from "classnames";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import classes from "../../../../scss/ezbet.module.scss";

import BetSettingsDropdown from "./components/BetSettingsDropdown";
import MultipleTab from "./components/MultipleTab";
import SingleTab from "./components/SingleTab";

const MyBetslip = ({
  activeTab,
  deleteSelectionConfirmationPanel,
  setActiveTab,
  setOpenDeleteSelectionConfirmationPanel,
  setStakePanelStatus,
}) => {
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [dirtyChoice, setDirtyChoice] = useState(undefined);
  const isLoggedIn = useSelector((state) => state.auth.loggedIn);

  return (
    <div
      data-scroll-lock-scrollable
      className={cx(classes["full-page-modal-body"], classes["regular-screen"], classes["relative"])}
    >
      {isLoggedIn && (
        <BetSettingsDropdown
          dirtyChoice={dirtyChoice}
          open={isSettingsDropdownOpen}
          setDirtyChoice={setDirtyChoice}
          setOpen={setIsSettingsDropdownOpen}
        />
      )}
      {isSettingsDropdownOpen && (
        <div
          className={classes["overlay"]}
          style={{ display: "block" }}
          onClick={() => {
            setIsSettingsDropdownOpen(false);
            setDirtyChoice(undefined);
          }}
        />
      )}
      {activeTab === "SINGLE" && (
        <SingleTab
          deleteSelectionConfirmationPanel={deleteSelectionConfirmationPanel}
          isLoggedIn={isLoggedIn}
          setOpenDeleteSelectionConfirmationPanel={setOpenDeleteSelectionConfirmationPanel}
          setStakePanelStatus={setStakePanelStatus}
        />
      )}
      {activeTab === "MULTIPLE" && (
        <MultipleTab
          deleteSelectionConfirmationPanel={deleteSelectionConfirmationPanel}
          isLoggedIn={isLoggedIn}
          setActiveTab={setActiveTab}
          setOpenDeleteSelectionConfirmationPanel={setOpenDeleteSelectionConfirmationPanel}
          setStakePanelStatus={setStakePanelStatus}
        />
      )}
    </div>
  );
};

MyBetslip.propTypes = {
  activeTab: PropTypes.string.isRequired,
  deleteSelectionConfirmationPanel: PropTypes.bool.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  setOpenDeleteSelectionConfirmationPanel: PropTypes.func.isRequired,
  setStakePanelStatus: PropTypes.func.isRequired,
};

export default React.memo(MyBetslip);
