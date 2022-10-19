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

  if (typeofInvokeAsap === 'undefined') {
    invokeAsap = true;
  } else if (arguments.length === 3 && typeofInvokeAsap !== 'boolean') {
    ctx = invokeAsap;
    invokeAsap = true;
  }

  let timer, args, needInvoke;

  let wrapper = function() {
    if (needInvoke) {
      fn.apply(ctx, args);
      needInvoke = false;
      timer = global.setTimeout(wrapper, timeout);
    } else {
      timer = null;
    }
  };

  return function() {
    args = arguments;
    ctx || (ctx = this);
    needInvoke = true;

    if (!timer) {
      invokeAsap?
        wrapper() :
        timer = global.setTimeout(wrapper, timeout);
    }
  };
}
