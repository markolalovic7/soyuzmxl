// Note: sort `sportsTrees` by `code` and `sportsOrder' array.
export function compareSportsTree(sportsTreeLeft, sportsTreeRight, sportsOrder) {
  let sportOrderLeftIndex = sportsOrder.indexOf(sportsTreeLeft.code);
  let sportOrderRightIndex = sportsOrder.indexOf(sportsTreeRight.code);

  if (sportOrderLeftIndex === -1) {
    sportOrderLeftIndex = sportsOrder.length;
  }
  if (sportOrderRightIndex === -1) {
    sportOrderRightIndex = sportsOrder.length;
  }
  if (sportOrderLeftIndex < sportOrderRightIndex) {
    return -1;
  }
  if (sportOrderLeftIndex > sportOrderRightIndex) {
    return 1;
  }

  return sportOrderLeftIndex - sportOrderRightIndex;
}

export function getSortedSportTreesBySportsOrder(sportsTree = [], sportsOrder = []) {
  return [...sportsTree].sort((sportTreeLeft, sportTreeRight) =>
    compareSportsTree(sportTreeLeft, sportTreeRight, sportsOrder),
  );
}
