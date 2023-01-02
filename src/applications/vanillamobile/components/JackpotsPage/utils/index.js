export function getJackpotItemCurrency(currencyStakeMap, currencyCode) {
  const currency = Object.values(currencyStakeMap).find(
    (currencyToFind) => currencyToFind.currencyCode === currencyCode,
  );

  return currency;
}
