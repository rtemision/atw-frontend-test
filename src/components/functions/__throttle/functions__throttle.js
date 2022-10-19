/**
 * Throttle given function
 *
 * @see https://en.bem.info/libraries/classic/bem-core/4.2.0/desktop/functions/#elems-throttle
 * @source https://github.com/bem/bem-core/blob/v4.2.0/common.blocks/functions/__throttle/functions__throttle.vanilla.js
 * @param {Function} fn function to throttle
 * @param {Number} timeout throttle interval
 * @param {Boolean} [invokeAsap=true] invoke before first interval
 * @param {Object} [ctx] context of function invocation
 * @returns {Function} throttled function
 */
export function throttle(fn, timeout, invokeAsap, ctx) {
  const typeofInvokeAsap = typeof invokeAsap;
  let context = ctx;
  let invAsap;

  if (typeofInvokeAsap === 'undefined') {
    invAsap = true;
  } else if (arguments.length === 3 && typeofInvokeAsap !== 'boolean') {
    context = invokeAsap;
    invAsap = true;
  }

  let timer;
  let args;
  let needInvoke;

  const wrapper = () => {
    if (needInvoke) {
      fn.apply(context, args);
      needInvoke = false;
      timer = global.setTimeout(wrapper, timeout);
    } else {
      timer = null;
    }
  };

  // eslint-disable-next-line func-names
  return function () {
    // eslint-disable-next-line prefer-rest-params
    args = arguments;
    if (!context) (context = this);
    needInvoke = true;

    if (!timer) {
      if (invAsap) {
        wrapper();
      } else {
        timer = global.setTimeout(wrapper, timeout);
      }
    }
  };
}
