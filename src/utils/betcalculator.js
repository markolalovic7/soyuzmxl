export const getValidatedFloatValue = (value) => {
  if (!value) {
    return "";
  }

  // not valid if input starts from two zeros:
  // not valid: "00"
  if (/^[0]{2}?$/.test(value)) {
    return null;
  }

  // valid if user adds dot after the number
  // valid: "N", "N.", "N.0", where N is a number
  if (/^(\d+(\.)+[0]?)$/.test(value)) {
    return value;
  }

  // valid for the number with hundredths
  // valid: "N", "N.N", "N.NN"
  if (/^(\d+(\.\d{0,2})?|\.?\d{1,2})$/.test(value)) {
    return parseFloat(value);
  }

  return null;
};

export const getLocaleFormattedNumber = (number) => {
  try {
    return (Math.round(Number(number) * 1e2) / 1e2).toLocaleString();
  } catch {
    return "N/A";
  }
};
