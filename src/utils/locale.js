export function getLocale(locale) {
  return (
    {
      de: "de-DE",
      en: "en-GB",
      es: "es-ES",
      fr: "fr-FR",
      hi: "hi-IN",
      id: "in-ID",
      ja: "ja-JP",
      km: "km-KH",
      ko: "ko-KR",
      ms: "ms-MY",
      pt: "pt-PT",
      ru: "ru-RU",
      te: "te-IN",
      th: "th-TH",
      vi: "vi-VN",
      zh: "zh-CN",
    }[locale] ?? "en-GB"
  );
}
