export const reactiveToStatic = v => JSON.parse(JSON.stringify(v));

export const fixContext = (options, currect, over = {}) => {
  options.forEach(item => {
    if (typeof currect[item] === 'undefined') {
      currect[item] = over[item] || {};
    }
  });
};

export const merge = (target, over) => {
  for (const i in over) {
    const isList = ['hook'].includes(i);
    const item = over[i];
    if (typeof target[i] === 'undefined') {
      target[i] = {};
    }
    for (const key in item) {
      const element = item[key];
      if (isList) {
        if (Array.isArray(target[i][key])) {
          target[i][key].push(element);
        } else {
          console.log('test');
          target[i][key] = [
            element,
            typeof target[i][key] !== 'undefined' ? target[i][key] : undefined
          ];
        }
      } else {
        target[i][key] = element;
      }
    }
  }
};
