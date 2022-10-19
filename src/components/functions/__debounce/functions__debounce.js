/**
 * Debounces given function
 *
 * There are two `debounce` modes, depending on the value of `invokeAsap`:
 * 1. The original function is called when the delay expires after the last call attempt.
 * 2. The original function is first called as soon as the decorated function is called.
 *    After this, the behavior is the same as in the first mode.

 * @see https://en.bem.info/libraries/classic/bem-core/4.2.0/desktop/functions/#elems-debounce
 * @source https://github.com/bem/bem-core/blob/v4.2.0/common.blocks/functions/__debounce/functions__debounce.vanilla.js
 * @param {Function} fn function to debounce
 * @param {Number} timeout debounce interval
 * @param {Boolean} [invokeAsap=false] invoke before first interval
 * @param {Object} [ctx] context of function invocation
 * @returns {Function} debounced function
 */
export function debounce(fn, timeout, invokeAsap, ctx) {
  let context = ctx;
  let invAsap;

  if (arguments.length === 3 && typeof invokeAsap !== 'boolean') {
    context = invokeAsap;
    invAsap = false;
  }

  let timer;

  // eslint-disable-next-line func-names
  return function () {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;

    if (!context) context = this;

    if (invAsap && !timer) fn.apply(context, args);

    global.clearTimeout(timer);

    timer = global.setTimeout(() => {
      if (!invAsap) fn.apply(context, args);
      timer = null;
    }, timeout);
  };
}
