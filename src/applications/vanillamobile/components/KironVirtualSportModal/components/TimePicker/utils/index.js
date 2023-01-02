import padStart from "lodash.padstart";

import { DAY_MSEC, HOUR_MSEC } from "utils/date";

export function getListOfTimePoints({ timestampMax = DAY_MSEC, timestampMin = 0, timestampSelected }) {
  const intervalMsec = HOUR_MSEC;
  let timePoints = [];
  let timePointToAddMsec = timestampMin;

  if (timestampSelected < timePointToAddMsec) {
    timePoints = [timestampSelected];
  }

  while (timePointToAddMsec < timestampMax) {
    timePoints = [...timePoints, timePointToAddMsec];
    const timePointToAddMsecNext = timePointToAddMsec + intervalMsec;
    if (timestampSelected > timePointToAddMsec && timestampSelected < timePointToAddMsecNext) {
      timePoints = [...timePoints, timestampSelected];
    }
    timePointToAddMsec = timePointToAddMsecNext;
  }
  if (timestampSelected > timestampMax) {
    timePoints = [...timePoints, timestampSelected];
  }

  return timePoints;
}

export function formatToHoursAndMinutes(timestamp) {
  const hours = Math.floor(timestamp / HOUR_MSEC);
  const hoursPlusOne = Math.floor((timestamp + HOUR_MSEC) / HOUR_MSEC);

  const isAM = hours < 12 ? "AM" : "PM";

  return `${padStart(hours === 24 ? 0 : hours === 12 ? 12 : hours % 12, 2, "0")} - ${padStart(
    hoursPlusOne === 24 ? 0 : hoursPlusOne === 12 ? 12 : hoursPlusOne % 12,
    2,
    "0",
  )} ${isAM}`;
}
