// Note: sort `featuredLeagues` by `ordinal`.
function compareFeaturedLeagues(featuredLeagueLeft, featuredLeagueRight) {
  if (featuredLeagueLeft.ordinal > featuredLeagueRight.ordinal) {
    return 1;
  }
  if (featuredLeagueLeft.ordinal < featuredLeagueRight.ordinal) {
    return -1;
  }

  return featuredLeagueLeft;
}

export function getSortedFeaturedLeagues(featuredLeagues = []) {
  return [...featuredLeagues].sort(compareFeaturedLeagues);
}
