import { TAB_FEATURED, TAB_LIVE, TAB_NEXT } from "../constants";

export function getHomeTabTranslated(tab, t) {
  return {
    [TAB_FEATURED]: t(`vanilla_sports_tabs.featured_matches`),
    [TAB_LIVE]: t(`vanilla_sports_tabs.live_sports`),
    [TAB_NEXT]: t(`vanilla_sports_tabs.next_matches`),
  }[tab];
}

// TODO: refactor in future.
export const getFeaturedSearchCode = (viewLayouts, sportCode) => {
  if (viewLayouts) {
    // find the top level prematch config.
    const targetLayout = viewLayouts.find((layout) => layout.route === "DASHBOARD");
    if (targetLayout) {
      const widget = targetLayout.widgets.find(
        (w) => w.section === "FEATURED_LEAGUES" && w.cmsWidgetType === "FEATURED_LEAGUES" && w.enabled === true,
      );

      if (widget) {
        const leagueCodes = widget.data.featuredLeagues
          .filter((l) => l.sportCode === sportCode)
          .map((l) => `p${l.eventPathId}`);
        if (leagueCodes.length > 0) {
          return leagueCodes.join(",");
        }
      }
    }
  }

  return `s${sportCode}`; // Fallback - search all...
};
