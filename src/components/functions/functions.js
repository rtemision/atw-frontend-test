const toStr = Object.prototype.toString;

/**
 * Checks whether a given object is function
 * @param {*} obj
 * @returns {Boolean}
 * @source https://github.com/bem/bem-core/blob/v4.2.0/common.blocks/functions/functions.vanilla.js
 */
export function isFunction(obj) {
  return toStr.call(obj) === '[object Function]';
}
