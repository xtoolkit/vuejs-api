import {ref, reactive} from 'vue';
import {unReactive} from '../../src/function/utils';

describe('unReactive data test', () => {
  it('object data from ref', () => {
    const wrap = {
      test: 'yes'
    };
    const data = ref(wrap);
    const removeReactivity = unReactive(data);
    expect(removeReactivity.test).toBe(wrap.test);
  });

  it('object data from reactive', () => {
    const wrap = {
      test: 'yes'
    };
    const data = reactive(wrap);
    const removeReactivity = unReactive(data);
    expect(removeReactivity.test).toBe(wrap.test);
  });

  it('number data', () => {
    expect(unReactive(ref(1))).toBe(1);
  });

  it('boolean data', () => {
    expect(unReactive(ref(true))).toBe(true);
  });

  it('string data', () => {
    expect(unReactive(ref('test'))).toBe('test');
  });

  it('undefinded data', () => {
    expect(unReactive(ref())).toBe(false);
  });
});
