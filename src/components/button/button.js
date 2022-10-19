import { DomElement } from '@/components/dom-element';
import { BemEntityMixin } from '@/components/bem-entity';

export class Button extends BemEntityMixin(DomElement) {
  static instances = {};

  static bemEntityName = 'button';

  constructor(domElem) {
    super(domElem);
    if (this.hasMod('disabled')) this._setDisabledAttrs(true);
    domElem.addEventListener('mod-change', this._onModChange.bind(this));
    domElem.addEventListener('click', this._onClick.bind(this));
  }

  /** @overridable */
  // eslint-disable-next-line class-methods-use-this
  _onClick() {}

  /**
   * On bem mod change
   * @param {CustomEvent} event
   * @param {Object} event.detail
   * @param {String} event.detail.modName
   * @param {String|Boolean} event.detail.modVal
   * @param {String|Boolean} event.detail.oldModVal
   */
  _onModChange({ detail }) {
    if (detail.modName === 'disabled') this._setDisabledAttrs(detail.modVal);
  }

  /**
   * @param {Boolean} val
   */
  _setDisabledAttrs(val) {
    const { domElem } = this;

    if (domElem.tagName.toLowerCase() === 'button') domElem.disabled = val;

    domElem.setAttribute('aria-disabled', String(val));
  }
}
