import {
  MENU_ITEM_TYPE_EXTERNAL_LINK,
  MENU_ITEM_TYPE_INTERNAL_LINK,
  MENU_ITEM_TYPE_INTERNAL_NAMED_COMPONENT,
} from "constants/navigation-drawer";
import { getRouteByInternalComponent } from "utils/navigation-drawer";

export function getNavigationMenuLink(navigationData) {
  const { component, link, type, url } = navigationData;

  return {
    [MENU_ITEM_TYPE_EXTERNAL_LINK]: url,
    [MENU_ITEM_TYPE_INTERNAL_LINK]: link,
    [MENU_ITEM_TYPE_INTERNAL_NAMED_COMPONENT]: getRouteByInternalComponent(component),
  }[type];
}
