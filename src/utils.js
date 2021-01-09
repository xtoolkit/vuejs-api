import {isRef, unref} from 'vue';

export function getMethods(context) {
  const modules = {};
  const keys = context.keys();
  keys.forEach(key => {
    modules[
      key.replace(/^\//, '').replace(/^\.\//, '').replace(/\.js$/, '')
    ] = context(key).default;
  });
  return modules;
}

export function hotReload(hot, id, fn) {
  if (hot) {
    hot.accept(id, () => {
      fn();
    });
  }
}

export function unReactive(data) {
  let out;
  if (typeof isRef !== 'undefined' && isRef(data)) {
    out = unref(data);
  } else {
    out = data;
  }
  const type = typeof out;
  if (type === 'object' || Array.isArray(out)) {
    return JSON.parse(JSON.stringify(out));
  } else if (type === 'number') {
    return 0 + out;
  } else if (type === 'boolean') {
    return !!out;
  } else if (type === 'string') {
    return '' + out;
  }
  return false;
}

export function inArray(array, target) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === target) {
      return true;
    }
  }
  return false;
}

export function mergeObject(a, b) {
  for (const op in b) {
    const element = b[op];
    if (typeof a[op] === 'object') {
      mergeObject(a[op], b[op]);
    } else {
      a[op] = element;
    }
  }
}
