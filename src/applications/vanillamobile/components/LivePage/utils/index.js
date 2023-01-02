// Sort `liveMatches` by `epDesc` and `opADesc`
function compareLiveMatches(liveMatchLeft, liveMatchRight) {
  if (liveMatchLeft.epDesc > liveMatchRight.epDesc) {
    return 1;
  }
  if (liveMatchLeft.epDesc < liveMatchRight.epDesc) {
    return -1;
  }
  if (liveMatchLeft.opADesc > liveMatchRight.opADesc) {
    return 1;
  }
  if (liveMatchLeft.opADesc < liveMatchRight.opADesc) {
    return -1;
  }

  return 0;
}

export function getSortedLiveMatches(liveMatches = []) {
  return [...liveMatches].sort(compareLiveMatches);
}
