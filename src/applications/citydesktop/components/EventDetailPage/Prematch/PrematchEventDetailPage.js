import { useParams } from "react-router";

import { useGAPageView } from "../../../../../hooks/google-analytics-hooks";

import PrematchEventDetailPageCentralContent from "./PrematchEventDetailPageCentralContent/PrematchEventDetailPageCentralContent";

const PrematchEventDetailPage = () => {
  const { eventId } = useParams();

  useGAPageView("Prematch Event Detail");

  return (
    <PrematchEventDetailPageCentralContent eventId={eventId && !Number.isNaN(eventId) ? parseInt(eventId, 10) : null} />
  );
};

export default PrematchEventDetailPage;
