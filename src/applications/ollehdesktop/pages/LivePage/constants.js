import AustraliaFlag from "applications/ollehdesktop/img/flags/australia.svg";
import AustriaFlag from "applications/ollehdesktop/img/flags/austria.svg";
import AzerbaijanFlag from "applications/ollehdesktop/img/flags/azerbaijan.svg";
import BelarusFlag from "applications/ollehdesktop/img/flags/belarus.svg";
import BelgiumFlag from "applications/ollehdesktop/img/flags/belgium.svg";

// should be translation keys
export const NAVIGATION_TABS = [
  { code: "ALL", translationKey: "all" },
  { code: "MATCH", translationKey: "match" },
  { code: "HANDICAP", translationKey: "handicap" },
  { code: "OVER_UNDER", translationKey: "over_under" },
  { code: "ODD_EVEN", translationKey: "odd_even" },
  { code: "PERIODS", translationKey: "periods" },
  { code: "OTHERS", translationKey: "others" },
];

// demo
export const SIDE_BAR_SPORTS = [
  { bgClassName: "soccer", count: 581, label: "Football" },
  { bgClassName: "basketball", count: 37, label: "Basketball" },
  { bgClassName: "volleyball", count: 23, label: "Ice Hockey" },
  { bgClassName: "volleyball", count: 17, label: "Volleyball" },
  { bgClassName: "baseball", count: 3, label: "Baseball" },
  { bgClassName: "tennis", count: 274, label: "Tennis" },
  { bgClassName: "tabletennis", count: 74, label: "Table tennis" },
  { bgClassName: "amfootball", count: 67, label: "American football" },
  { bgClassName: "handball", count: 17, label: "handball" },
  { bgClassName: "darts", count: 42, label: "Darts" },
  { bgClassName: "amfootball", count: 5, label: "Rugby" },
  { bgClassName: "boxing", count: 8, label: "Snooker" },
  { bgClassName: "boxing", count: 15, label: "Boxing" },
  { bgClassName: "curling", count: 15, label: "Curling" },
];

// demo
export const COUNTRIES_AND_THEIR_MATCHES_DEMO = [
  {
    countryName: "Austria",
    flag: AustriaFlag,
    matches: [
      {
        id: "austr1",
        part: "1 half",
        result: "0:3",
        teamLeft: "Grazer AK 1902",
        teamRight: "FC Wacker Innsbruck",
        time: "21:25",
      },
    ],
  },
  {
    countryName: "Belgium",
    flag: BelgiumFlag,
    matches: [
      {
        id: "belg1",
        part: "1 half",
        result: "0:3",
        teamLeft: "Grazer AK 1902",
        teamRight: "FC Wacker Innsbruck",
        time: "21:25",
      },
      {
        id: "belg2",
        part: "1 half",
        result: "0:1",
        teamLeft: "CA Barra Da Tijuca RJ",
        teamRight: "Perolas Negras RJ",
        time: "21:20",
      },
      {
        id: "belg3",
        part: "1 half",
        result: "1:1",
        teamLeft: "Barcelona EC RJ",
        teamRight: "7 de Abril",
        time: "19:20",
      },
      {
        id: "belg4",
        part: "1 half",
        result: "1:1",
        teamLeft: "Ceac/Araruama RJ",
        teamRight: "Ceres Futebol Clube de Football",
        time: "19:20",
      },
    ],
  },
  {
    countryName: "Australia",
    flag: AustraliaFlag,
    matches: [
      {
        id: "belg4",
        part: "1 half",
        result: "1:1",
        teamLeft: "Ceac/Araruama RJ",
        teamRight: "Ceres Futebol Clube de Football",
        time: "19:20",
      },
    ],
  },
  {
    countryName: "Azerbaijan",
    flag: AzerbaijanFlag,
    matches: [
      {
        id: "belg4",
        part: "1 half",
        result: "1:1",
        teamLeft: "Ceac/Araruama RJ",
        teamRight: "Ceres Futebol Clube de Football",
        time: "19:20",
      },
    ],
  },
  {
    countryName: "Belarus",
    flag: BelarusFlag,
    matches: [
      {
        id: "belg4",
        part: "1 half",
        result: "1:1",
        teamLeft: "Ceac/Araruama RJ",
        teamRight: "Ceres Futebol Clube de Football",
        time: "19:20",
      },
    ],
  },
];
