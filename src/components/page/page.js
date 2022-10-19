import { DomElement } from '@/components/dom-element';
import { BemEntityMixin } from '@/components/bem-entity';

export class Page extends BemEntityMixin(DomElement) {

  static instances = {};
  static bemEntityName = 'page';

  get body() {
    return this._body || (this._body = this.getElemNode('body'));
  }

  constructor(domElem) {
    super(domElem);
  }
}
