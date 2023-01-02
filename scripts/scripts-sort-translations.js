/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
import shell from "shelljs";
import fs from "fs";

const translationFolderRoute = "./public/locales";

function getTranslationPaths() {
  const translationsFolders = fs.readdirSync("./public/locales");

  return translationsFolders.map(
    (translationFolder) => `${translationFolderRoute}/${translationFolder}/translation.json`,
  );
}

function sortKeys(translationObject) {
  if (typeof translationObject !== "object" || !translationObject) {
    return translationObject;
  }

  return Object.keys(translationObject)
    .sort()
    .reduce(
      (acc, value) => ({
        ...acc,
        [value]: sortKeys(translationObject[value]),
      }),
      {},
    );
}

function sortTranslation(file) {
  const translationRaw = fs.readFileSync(file, "utf-8");
  try {
    const translation = JSON.parse(translationRaw);
    const translationSorted = sortKeys(translation);
    fs.writeFileSync(file, JSON.stringify(translationSorted));
    shell.echo(`✅ Sorted ${file} successfully`);
    shell.exec(`prettier --write ${file}`, { silent: true });
  } catch (error) {
    shell.echo(`❌ Failed to read ${file}...`);
  }
}

shell.echo("🏁 Sorting translations started...");
getTranslationPaths().forEach((translationPath) => {
  sortTranslation(translationPath);
});
shell.echo("🏁 Sorting translations finished...");
