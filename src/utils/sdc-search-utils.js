export const recursivePathSearch = (obj, pathId) => {
  let match = null;
  if (obj) {
    const childMatch = obj.find((item) => parseInt(item.id) === pathId);
    if (childMatch) {
      match = childMatch;
    } else {
      for (let i = 0; i < obj.length; i++) {
        const result = recursivePathSearch(obj[i].path, pathId);
        if (result) {
          match = result;
          break;
        }
      }
    }
  }

  return match;
};
