import { useSelector } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { useLocation } from "react-router";
import { getCmsLayoutMobileSlimIFrame } from "redux/reselect/cms-layout-widgets";

const CentralIFrame = () => {
  const location = useLocation();
  const widget = useSelector((state) => getCmsLayoutMobileSlimIFrame(state, location));

  if (!widget) return null;

  const widgetData = widget.data;

  return (
    <div style={{ margin: "5px 5px 5px 5px" }}>
      <iframe height={widgetData?.height || 150} src={widgetData.link} title={widgetData.description} width="100%" />
    </div>
  );
};

export default CentralIFrame;
