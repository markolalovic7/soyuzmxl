import { useSelector } from "react-redux";
import { useParams } from "react-router";

import { useGAPageView } from "../../../../../hooks/google-analytics-hooks";
import { getAuthLanguage } from "../../../../../redux/reselect/auth-selector";

import LiveEventDetailPageCentralContent from "./LiveEventDetailPageCentralContent/LiveEventDetailPageCentralContent";

const LiveEventDetailPage = () => {
  const { eventId } = useParams();

  const language = useSelector(getAuthLanguage);

  useGAPageView("Live Event Detail");

  return <LiveEventDetailPageCentralContent eventId={eventId} />;
};

export default LiveEventDetailPage;
