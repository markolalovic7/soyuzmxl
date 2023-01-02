export const sortEventPaths = (a, b) => `${a.desc}`.localeCompare(b.desc);

export const sortEvents = (a, b) => `${a.startSecs}`.localeCompare(b.startSecs);
