import {isRef, unref} from 'vue';

export const unReactive = function (data) {
  let out = isRef(data) ? unref(data) : data;
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
};
