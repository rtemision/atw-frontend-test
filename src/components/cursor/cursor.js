import { domReady } from '@/components/dom-ready';
import { DomElement } from '@/components/dom-element';
import { BemEntityMixin } from '@/components/bem-entity';
import { throttle } from '@/components/functions/__throttle';

export class Cursor extends BemEntityMixin(DomElement) {

  static instances = {};
  static bemEntityName = 'cursor';

  constructor(domElem) {
    super(domElem);
    document.body.addEventListener('mousemove', throttle(this._onMouseMove, 100, this));
  }

  _onMouseMove(e) {
    const event = (e.touches || [])[0] || e;
    this.hasMod('visible') || this.setMod('visible');
    window.requestAnimationFrame(() => {
      this.domElem.style.transform = `translate3d(${event.pageX}px, ${event.pageY}px, 0)`;
    });
  }
}

domReady.then(() => {
  new Cursor(document.querySelector(`.${Cursor.bemEntityName}`));
});
