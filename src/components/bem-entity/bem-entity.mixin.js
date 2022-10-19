import { dedupeMixin } from '@open-wc/dedupe-mixin';

/**
 * Mixin for BEM modifiers staff: `getMod()`, `hasMod()`, `setMod()`, `delMod()`, `toggleMod()`
 * Dispatching CustomEvent: `_emit()`
 * Search element's nodes: `getElemNode()`, `getElemsNode()`
 *
 * based on i-bem
 * @see https://en.bem.info/technologies/classic/i-bem/states/
 * @see https://github.com/bem/bem-core/blob/v4/common.blocks/i-bem/i-bem.vanilla.js
 * @see https://github.com/bem/bem-core/blob/v4/common.blocks/i-bem-dom/i-bem-dom.js
 */

const MOD_DELIM = '_';
const ELEM_DELIM = '__';
const NAME_PATTERN = '[a-zA-Z0-9-]+';

const BemEntityMixinImplementation = (Base) => class BemEntity extends Base {
  constructor(...args) {
    super(...args);
    this._modCache = {};
  }

  /**
   * Get domNode of element
   * @param {String} name elem name
   * @returns {domNode}
   */
  getElemNode(name) {
    return this.domElem.querySelector(`.${this.constructor.bemEntityName}${ELEM_DELIM}${name}`);
  }

  /**
   * Get NodeList of elements
   * @param {String} name elem name
   * @returns {NodeList}
   */
  getElemsNode(name) {
    return this.domElem.querySelectorAll(`.${this.constructor.bemEntityName}${ELEM_DELIM}${name}`);
  }

  /**
   * @see https://github.com/bem/bem-core/blob/88d5f569564073a5418caa573fbb5740bc977871/common.blocks/i-bem-dom/i-bem-dom.js#L700
   */
  _extractModVal(modName) {
    const domNode = this.domElem;
    let matches;

    if (domNode) {
      matches = domNode.className
        .match(this._buildModValRE(modName));
    }

    return matches ? matches[2] || true : '';
  }

  /**
   * Builds a regular expression for extracting modifier values from a DOM element of an entity
   * @private
   * @param {String} modName Modifier name
   * @returns {RegExp}
   * @see https://github.com/bem/bem-core/blob/88d5f569564073a5418caa573fbb5740bc977871/common.blocks/i-bem-dom/i-bem-dom.js#L824
   */
  _buildModValRE(modName) {
    return new RegExp(`(\\s|^)${this._buildModClassNamePrefix(modName)}(?:${MOD_DELIM}(${NAME_PATTERN}))?(?=\\s|$)`);
  }

  /**
   * Builds a prefix for the CSS class of a DOM element of the entity, based on modifier name
   * @private
   * @param {String} modName Modifier name
   * @returns {String}
   */
  _buildModClassNamePrefix(modName) {
    return this.bemEntityName + MOD_DELIM + modName;
  }

  /**
   * @param {String} modName
   * @return {String} modVal
   */
  getMod(modName) {
    const modCache = this._modCache;
    // eslint-disable-next-line no-return-assign
    return modName in modCache
      ? modCache[modName] || ''
      : modCache[modName] = this._extractModVal(modName);
  }

  /**
   * @param {String} modName
   */
  delMod(modName) {
    return this.setMod(modName, false);
  }

  /**
   * Sets the modifier for a BEM entity
   * @param {String} modName Modifier name
   * @param {String|Boolean} [modVal=true] Modifier value. If not of type String or Boolean,
   * it is casted to String
   * @see https://github.com/bem/bem-core/blob/v4/common.blocks/i-bem/i-bem.vanilla.js#L271
   */
  setMod(modName, modVal) {
    const typeModVal = typeof modVal;
    const { bemEntityName } = this;
    const curModVal = this.getMod(modName);
    let modClasName = bemEntityName + MOD_DELIM + modName;
    let formatedModVal = modVal;

    if (typeModVal === 'undefined') {
      formatedModVal = true;
    } else if (typeModVal === 'boolean') {
      if (formatedModVal === false) formatedModVal = '';
    } else {
      formatedModVal = formatedModVal.toString();
      if (formatedModVal !== '') modClasName += MOD_DELIM + formatedModVal;
    }

    // eslint-disable-next-line eqeqeq
    if (curModVal == formatedModVal) return this;

    if (curModVal) {
      const curModValIsBool = typeof curModVal === 'boolean';

      if (formatedModVal === '') {
        if (!curModValIsBool) modClasName += MOD_DELIM + curModVal;
      } else {
        this.domElem.classList.remove(
          bemEntityName + MOD_DELIM + modName + (curModValIsBool
            ? ''
            : MOD_DELIM + curModVal)
        );
      }
    }

    this.domElem.classList[
      formatedModVal ? 'add' : 'remove'
    ](modClasName);

    this._modCache[modName] = formatedModVal;

    this._emit('mod-change', {
      modName,
      modVal: formatedModVal,
      oldModVal: curModVal
    });

    return this;
  }

  /**
   * Checks whether a BEM entity has a modifier
   * @param {String} modName Modifier name
   * @param {String|Boolean} [modVal] Modifier value. If not of type String or Boolean,
   * it is casted to String
   * @returns {Boolean}
   * @see https://github.com/bem/bem-core/blob/v4/common.blocks/i-bem/i-bem.vanilla.js#L245
   */
  hasMod(modName, modVal) {
    const typeModVal = typeof modVal;
    let className = `${this.bemEntityName}_${modName}`;
    let formatedModVal = modVal;

    if (typeModVal === 'undefined') {
      formatedModVal = true;
    } else if (typeModVal === 'boolean') {
      if (formatedModVal === false) formatedModVal = '';
    } else {
      formatedModVal = formatedModVal.toString();
      className += `_${formatedModVal}`;
    }

    return this.domElem.classList.contains(className);
  }

  /**
   * Toggle mod
   * @param {String} modName
   */
  toggleMod(modName) {
    this.setMod(modName, !this.hasMod(modName));
  }

  /**
   * Generate and dispath custom event
   * @param {String} name
   * @param {Any} detail
   * @param {Object} props
   */
  _emit(name, detail, props) {
    this.domElem.dispatchEvent(
      new CustomEvent(name, {
        bubbles: true,
        cancelable: true,
        detail: {
          target: this,
          ...detail
        },
        ...props
      })
    );

    return this;
  }
};

export const BemEntityMixin = dedupeMixin(BemEntityMixinImplementation);
