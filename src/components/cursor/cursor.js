import { domReady } from '@/components/dom-ready';
import { DomElement } from '@/components/dom-element';
import { BemEntityMixin } from '@/components/bem-entity';
import { throttle } from '@/components/functions/__throttle';

export class Cursor extends BemEntityMixin(DomElement) {
  static instances = {};

  static bemEntityName = 'cursor';

  constructor(domElem) {
    super(domElem);
    this.throttledMouseMove = throttle(this._onMouseMove, 100, this);
    if (this.hasMod('enabled')) this._start();
    domElem.addEventListener('mod-change', this._onModChange.bind(this));
  }

  _start() {
    document.body.addEventListener('mousemove', this.throttledMouseMove);
  }

  _stop() {
    document.body.removeEventListener('mousemove', this.throttledMouseMove);
    this.delMod('visible');
  }

  _onModChange({ detail }) {
    if (detail.modName === 'enabled') {
      if (detail.modVal) {
        this._start();
      } else {
        this._stop();
      }
    }
  }

  _onMouseMove(e) {
    const event = (e.touches || [])[0] || e;
    if (!this.hasMod('visible')) this.setMod('visible');
    window.requestAnimationFrame(() => {
      this.domElem.style.transform = `translate3d(${event.pageX}px, ${event.pageY}px, 0)`;
    });
  }
}

domReady.then(() => {
  // eslint-disable-next-line no-new
  new Cursor(document.querySelector(`.${Cursor.bemEntityName}`));
});
