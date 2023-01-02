const getHighlightCode = (cmsConfig) => {
  const viewLayouts = cmsConfig?.layouts?.DESKTOP_CITY_VIEW;
  if (viewLayouts) {
    // find the top level prematch config.
    const targetLayout = viewLayouts.find((layout) => layout.route === "PREMATCH" && !layout.eventPathId);
    if (targetLayout) {
      const widget = targetLayout.widgets.find(
        (w) => w.section === "CENTER_NAVIGATION_COLUMN" && w.cmsWidgetType === "FEATURED_LEAGUES" && w.enabled === true,
      );

      if (widget) {
        return widget.data.featuredLeagues.map((l) => `p${l.eventPathId}`).join(",");
      }
    }
  }

  return null;
};

const getHighlightEventPathIds = (cmsConfig, sportCode) => {
  const viewLayouts = cmsConfig?.layouts?.DESKTOP_CITY_VIEW;
  if (viewLayouts) {
    // find the top level prematch config.
    const targetLayout = viewLayouts.find((layout) => layout.route === "PREMATCH" && !layout.eventPathId);
    if (targetLayout) {
      const widget = targetLayout.widgets.find(
        (w) => w.section === "CENTER_NAVIGATION_COLUMN" && w.cmsWidgetType === "FEATURED_LEAGUES" && w.enabled === true,
      );

      if (widget) {
        return widget.data.featuredLeagues
          .filter((l) => l.sportCode === sportCode)
          .map((l) => parseInt(l.eventPathId, 10));
      }
    }
  }

  return [];
};

export { getHighlightCode, getHighlightEventPathIds };
