export const getEvents = (children) => {
  const events = [];
  if (children) {
    children.forEach((child) => {
      if (child.type === "p") {
        // dive deeper...
        events.push(...getEvents(Object.values(child.children)));
      } else if (child.type === "e" || child.type === "l") {
        events.push(child);
      }
    });
  }

  return events;
};
