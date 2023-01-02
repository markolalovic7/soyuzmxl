import { useSelector } from "react-redux";

import { getCmsLayoutMobileVanillaDashboardiFrame } from "../../../../../../redux/reselect/cms-layout-widgets";

const HomeIFrame = () => {
  const widget = useSelector(getCmsLayoutMobileVanillaDashboardiFrame);

  if (!widget) return null;

  const widgetData = widget.data;

  return (
    <div style={{ margin: "5px 5px 5px 5px" }}>
      <iframe height={widgetData?.height || 150} src={widgetData.link} title={widgetData.description} width="100%" />
    </div>
  );
};

export default HomeIFrame;
