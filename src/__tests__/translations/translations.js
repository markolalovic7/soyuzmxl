import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";

import translationsDE from "../../../public/locales/de/translation.json";
import translationsEN from "../../../public/locales/en/translation.json";
import translationsES from "../../../public/locales/es/translation.json";
import translationsFR from "../../../public/locales/fr/translation.json";
import translationsHI from "../../../public/locales/hi/translation.json";
import translationsIN from "../../../public/locales/id/translation.json";
import translationsJA from "../../../public/locales/ja/translation.json";
import translationsKM from "../../../public/locales/km/translation.json";
import translationsKO from "../../../public/locales/ko/translation.json";
import translationsMS from "../../../public/locales/ms/translation.json";
import translationsPT from "../../../public/locales/pt/translation.json";
import translationsRU from "../../../public/locales/ru/translation.json";
import translationsTE from "../../../public/locales/te/translation.json";
import translationsTH from "../../../public/locales/th/translation.json";
import translationsVI from "../../../public/locales/vi/translation.json";
import translationsZH from "../../../public/locales/zh/translation.json";

import { getTranslationKeys } from "./utils";

describe(path.relative(process.cwd(), __filename), () => {
  it("EN and KO translation must have the same keys list", () => {
    expect(getTranslationKeys(translationsEN)).to.eql(getTranslationKeys(translationsKO));
  });
  it("EN and DE translation must have the same keys list", () => {
    expect(getTranslationKeys(translationsEN)).to.eql(getTranslationKeys(translationsDE));
  });
  it("EN and ES translation must have the same keys list", () => {
    expect(getTranslationKeys(translationsEN)).to.eql(getTranslationKeys(translationsES));
  });
  it("EN and FR translation must have the same keys list", () => {
    expect(getTranslationKeys(translationsEN)).to.eql(getTranslationKeys(translationsFR));
  });
  it("EN and IN translation must have the same keys list", () => {
    expect(getTranslationKeys(translationsEN)).to.eql(getTranslationKeys(translationsIN));
  });
  it("EN and JA translation must have the same keys list", () => {
    expect(getTranslationKeys(translationsEN)).to.eql(getTranslationKeys(translationsJA));
  });
  it("EN and MS translation must have the same keys list", () => {
    expect(getTranslationKeys(translationsEN)).to.eql(getTranslationKeys(translationsMS));
  });
  it("EN and PT translation must have the same keys list", () => {
    expect(getTranslationKeys(translationsEN)).to.eql(getTranslationKeys(translationsPT));
  });
  it("EN and RU translation must have the same keys list", () => {
    expect(getTranslationKeys(translationsEN)).to.eql(getTranslationKeys(translationsRU));
  });
  it("EN and TH translation must have the same keys list", () => {
    expect(getTranslationKeys(translationsEN)).to.eql(getTranslationKeys(translationsTH));
  });
  it("EN and VI translation must have the same keys list", () => {
    expect(getTranslationKeys(translationsEN)).to.eql(getTranslationKeys(translationsVI));
  });
  it("EN and ZH translation must have the same keys list", () => {
    expect(getTranslationKeys(translationsEN)).to.eql(getTranslationKeys(translationsZH));
  });
  it("EN and HI translation must have the same keys list", () => {
    expect(getTranslationKeys(translationsEN)).to.eql(getTranslationKeys(translationsHI));
  });
  it("EN and TE translation must have the same keys list", () => {
    expect(getTranslationKeys(translationsEN)).to.eql(getTranslationKeys(translationsTE));
  });
  it("EN and KM translation must have the same keys list", () => {
    expect(getTranslationKeys(translationsEN)).to.eql(getTranslationKeys(translationsKM));
  });
});
