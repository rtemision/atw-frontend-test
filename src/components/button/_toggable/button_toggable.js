import { domReady } from '@/components/dom-ready';
import { Button } from '../button';

export class ButtonToggable extends Button {
  /** @override */
  _onModChange({ detail }) {
    // eslint-disable-next-line prefer-rest-params
    super._onModChange.apply(this, arguments);

    if (detail.modName === 'checked') {
      const { modVal } = detail;
      this.domElem.setAttribute('aria-pressed', modVal);
      this._emit('checked-change', { val: !!modVal });
    }
  }

  /** @override */
  _onClick(...args) {
    super._onClick.apply(this, args);

    if (this.getMod('mode') === 'radio' && this.hasMod('checked')) return;

    this.toggleMod('checked');
  }
}
domReady.then(() => {
  document.querySelectorAll(`.${Button.bemEntityName}_toggable`)
    .forEach((el) => new ButtonToggable(el));
});
