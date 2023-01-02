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
            match = { code: obj[i].code, parentDesc: obj[i].desc, parentId: obj[i].id, ...match };
          }
          if (!match.parentId) {
            match = { parentDesc: obj[i].desc, parentId: obj[i].id, ...match };
          }
          break;
        }
      }
    }
  }

  return match;
};

const recursiveSportCodeItemSearch = (obj, pathId, sportCode) => {
  if (obj) {
    const childMatch = obj.find((item) => Number(item.id) === pathId);
    if (childMatch) {
      return childMatch.code || sportCode;
    }

    for (let i = 0; i < obj.length; i++) {
      const result = recursiveSportCodeItemSearch(obj[i].path, pathId, obj[i].code || sportCode);

      if (result) return result;
    }
  }

  return undefined;
};

export { recursiveItemSearch, recursiveSportCodeItemSearch };
