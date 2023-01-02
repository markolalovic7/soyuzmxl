// Note: sort `widgets` by `ordinal`.
export function compareWidgets(widgetLeft, widgetRight) {
  if (widgetLeft.ordinal > widgetRight.ordinal) {
    return 1;
  }
  if (widgetLeft.ordinal < widgetRight.ordinal) {
    return -1;
  }

  return widgetLeft;
}

export function getSortedWidgets(widgets = []) {
  return [...widgets].sort(compareWidgets);
}
