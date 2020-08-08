import Api from './lib/Api';
import mixin from './helper/mixin';

function getMethods(context) {
  const modules = context
    .keys()
    .map(key => ({
      key,
      name: key.replace(/^\//, '').replace(/^\.\//, '').replace(/\.js$/, '')
    }))
    .reduce(
      (modules, {key, name}) => ({
        ...modules,
        [name]: context(key).default
      }),
      {}
    );
  return modules;
}

export function install(Vue, options = {}) {
  let src = null;
  if (typeof options.src !== 'undefined') {
    src = options.src;
    delete options.src;
  }

  const api = new Api(options);
  Vue.prototype.$api = api;

  Vue.mixin(mixin);
  Vue.config.optionMergeStrategies.api = function (parent, child) {
    if (!parent) return child;
    if (!child) return parent;
  };

  if (src === null) {
    return false;
  }

  if (typeof src === 'object') {
    api.updateMethods(src);
    return false;
  }

  if (typeof src !== 'function') {
    return false;
  }

  api.updateMethods(getMethods(src));
  if (module.hot) {
    module.hot.accept(src.id, () => {
      window.location.reload();
    });
  }
}

export function gql() {
  var tagArgs = arguments;
  return tagArgs[0].reduce(function (accumulator, string, index) {
    accumulator += string;
    if (index + 1 in tagArgs) accumulator += tagArgs[index + 1];
    return accumulator;
  }, '');
}

export {Api};

export default install;
