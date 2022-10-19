import { domReady } from '@/components/dom-ready';
import { Button } from '../button';

export class ButtonToggable extends Button {

  constructor(domElem) {
    super(domElem);
  }

  /** @override */
  _onModChange({ detail }) {
    super._onModChange.apply(this, arguments);

    if (detail.modName === 'checked') {
      const modVal = detail.modVal;
      this.domElem.setAttribute('aria-pressed', modVal);
      this._emit('checked-change', { val: !!modVal });
    }
  }

  /** @override */
  _onClick() {
    super._onClick.apply(this, arguments);

    if (this.getMod('mode') === 'radio' && this.hasMod('checked')) return;

    this.toggleMod('checked');
  }
}
domReady.then(() => {
  document.querySelectorAll(`.${Button.bemEntityName}_toggable`)
    .forEach(el => new ButtonToggable(el));
});
