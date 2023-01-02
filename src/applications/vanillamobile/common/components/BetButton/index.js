import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";

import StatsButton from "../StatsButton";

import { getAuthLanguage } from "redux/reselect/auth-selector";
import { openLinkInNewWindow } from "utils/misc";

const propTypes = {
  feedCode: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

const defaultProps = {};

const BetButton = ({ feedCode, url }) => {
  const language = useSelector(getAuthLanguage);

  return <StatsButton onClick={() => openLinkInNewWindow(`${url}/${language}/match/${feedCode}`)} />;
};

BetButton.propTypes = propTypes;
BetButton.defaultProps = defaultProps;

export default React.memo(BetButton);
