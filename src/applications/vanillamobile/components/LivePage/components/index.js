import { useSelector } from "react-redux";

import {
  APPLICATION_TYPE_MOBILE_ASIAN,
  APPLICATION_TYPE_MOBILE_VANILLA,
} from "../../../../../constants/application-types";
import { getAuthMobileView } from "../../../../../redux/reselect/auth-selector";

import LiveAsianPage from "./LiveAsianPage";
import LiveEuropeanPage from "./LiveEuropeanPage";

const LivePage = () => {
  const view = useSelector(getAuthMobileView);

  if (view === APPLICATION_TYPE_MOBILE_VANILLA) {
    return <LiveEuropeanPage />;
  }

  if (view === APPLICATION_TYPE_MOBILE_ASIAN) {
    return <LiveAsianPage />;
  }

  return null;
};

export default LivePage;
