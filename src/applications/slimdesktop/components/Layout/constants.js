import ChineseIcon from "assets/svgs/CN.svg";
import GermanIcon from "assets/svgs/DE.svg";
import SpanishIcon from "assets/svgs/ES.svg";
import FrenchIcon from "assets/svgs/FR.svg";
import EnglishIcon from "assets/svgs/GB.svg";
import IndonesianIcon from "assets/svgs/ID.svg";
import TeluguIcon from "assets/svgs/IN.svg";
import HindiIcon from "assets/svgs/IN.svg";
import JapaneseIcon from "assets/svgs/JP.svg";
import KhmerIcon from "assets/svgs/KH.svg";
import KoreanIcon from "assets/svgs/KR.svg";
import MalayIcon from "assets/svgs/MY.svg";
import PortugueseIcon from "assets/svgs/PT.svg";
import RussianIcon from "assets/svgs/RU.svg";
import ThaiIcon from "assets/svgs/TH.svg";
import VietnameseIcon from "assets/svgs/VI.svg";

export const LANGUAGE_OPTIONS = [
  {
    label: "Deutsch",
    renderIcon: () => <img alt="language" src={GermanIcon} />,
    value: "de",
  },
  {
    label: "English",
    renderIcon: () => <img alt="language" src={EnglishIcon} />,
    value: "en",
  },
  {
    label: "Español",
    renderIcon: () => <img alt="language" src={SpanishIcon} />,
    value: "es",
  },
  {
    label: "Français",
    renderIcon: () => <img alt="language" src={FrenchIcon} />,
    value: "fr",
  },
  {
    label: "Bahasa Indonesia",
    renderIcon: () => <img alt="language" src={IndonesianIcon} />,
    value: "id",
  },
  {
    label: "日本語",
    renderIcon: () => <img alt="language" src={JapaneseIcon} />,
    value: "ja",
  },
  {
    label: "한국어",
    renderIcon: () => <img alt="language" src={KoreanIcon} />,
    value: "ko",
  },
  {
    label: "Malay",
    renderIcon: () => <img alt="language" src={MalayIcon} />,
    value: "ms",
  },
  {
    label: "Português",
    renderIcon: () => <img alt="language" src={PortugueseIcon} />,
    value: "pt",
  },
  {
    label: "Pусский язык",
    renderIcon: () => <img alt="language" src={RussianIcon} />,
    value: "ru",
  },
  {
    label: "ภาษาไทย",
    renderIcon: () => <img alt="language" src={ThaiIcon} />,
    value: "th",
  },
  {
    label: "Tiếng Việt",
    renderIcon: () => <img alt="language" src={VietnameseIcon} />,
    value: "vi",
  },
  {
    label: "简体中文",
    renderIcon: () => <img alt="language" src={ChineseIcon} />,
    value: "zh",
  },
  {
    label: "हिन्दी",
    renderIcon: () => <img alt="language" src={HindiIcon} />,
    value: "hi",
  },
  {
    label: "తెలుగు",
    renderIcon: () => <img alt="language" src={TeluguIcon} />,
    value: "te",
  },
  {
    label: "ខ្មែរ",
    renderIcon: () => <img alt="language" src={KhmerIcon} />,
    value: "km",
  },
];

export const THEMES_OPTIONS = [
  "LUCKY_RED_THEME",
  "DARK_NIGHT_THEME",
  "KOREAN_THEME",
  "INDIGO_HORIZON_THEME",
  "LIGHT_AIRY_THEME",
  "LIME_CHARCOAL_THEME",
  "MOSS_ROCK_THEME",
  "ORANGE_LAGOON_THEME",
  "YELLOW_GREEN_THEME",
  "COFFEE_BLONDE_THEME",
  "ONETWO_DARK_THEME",
  "ONETWO_LUCKYRED_THEME",
];

export const PRICE_FORMAT_OPTIONS = [
  {
    label: "Decimal",
    value: "EURO",
  },
  {
    label: "UK",
    value: "UK",
  },
  {
    label: "US",
    value: "US",
  },
  {
    label: "Chinese",
    value: "CHINESE",
  },
  {
    label: "Indonesian",
    value: "INDO",
  },
  {
    label: "Malaysian",
    value: "MALAY",
  },
];

const ACCOUNT_OPTIONS = [
  {
    label: "Profile",
    translationKey: "edit_profile",
    value: "profile",
  },
  {
    label: "Security",
    translationKey: "forms.password_and_security",
    value: "password_and_security",
  },
  { label: "Deposit", translationKey: "deposit", value: "deposit" },
  {
    label: "My Bets",
    translationKey: "my_bets",
    value: "my_bets",
  },
  {
    label: "My Statements",
    translationKey: "my_statements",
    value: "my_statements",
  },
  {
    label: "Logout",
    translationKey: "logout",
    value: "logout",
  },
];

export const getAccountOptions = (t) =>
  ACCOUNT_OPTIONS.map((option) => ({
    label: t(option.translationKey),
    value: option.value,
  }));

const IFRAME_ACCOUNT_OPTIONS = [
  {
    label: "My Bets",
    translationKey: "my_bets",
    value: "my_bets",
  },
];

export const getIFrameAccountOptions = (t) =>
  IFRAME_ACCOUNT_OPTIONS.map((option) => ({
    label: t(option.translationKey),
    value: option.value,
  }));
