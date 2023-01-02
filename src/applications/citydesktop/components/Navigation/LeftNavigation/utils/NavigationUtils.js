function getFeaturedLeagues(cmsConfig) {
  const featuredLeagues = [];

  const viewLayouts = cmsConfig?.layouts?.DESKTOP_CITY_VIEW;
  if (viewLayouts) {
    // find the top level prematch config.
    const targetLayout = viewLayouts.find((layout) => layout.route === "PREMATCH" && !layout.eventPathId);
    if (targetLayout) {
      const widget = targetLayout.widgets.find(
        (w) => w.section === "LEFT_NAVIGATION_COLUMN" && w.cmsWidgetType === "FEATURED_LEAGUES" && w.enabled === true,
      );

      if (widget) {
        featuredLeagues.push(...widget.data.featuredLeagues);
      }
    }
  }

  return featuredLeagues;
}

export { getFeaturedLeagues };
