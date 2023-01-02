export const getTranslationKeys = (translations) => {
  let keys = [];
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in translations) {
    keys.push(key);
    if (typeof translations[key] === "object") {
      const subkeys = getTranslationKeys(translations[key]);
      keys = keys.concat(subkeys.map((subkey) => `${key}.${subkey}`));
    }
  }

  return keys.sort();
};
