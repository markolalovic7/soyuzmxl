const recursiveItemSearch = (obj, pathId) => {
  let match = null;
  if (obj) {
    const childMatch = obj.find((item) => parseInt(item.id, 10) === pathId);
    if (childMatch) {
      match = childMatch;
    } else {
      for (let i = 0; i < obj.length; i++) {
        const result = recursiveItemSearch(obj[i].path, pathId);
        if (result) {
          match = result;
          if (obj[i].code) {
            match = { code: obj[i].code, ...match };
          }
          break;
        }
      }
    }
  }

  return match;
};

export { recursiveItemSearch };
