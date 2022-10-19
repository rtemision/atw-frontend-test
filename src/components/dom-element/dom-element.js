import { nanoid } from 'nanoid';

const idAttrRegexp = /_{1,}/g;
const paramsAttr = 'data-params';

const idAttrNormalize = (name) => name.replace(idAttrRegexp, '-');

export class DomElement {
  static getInstance(domElem) {
    if (!domElem) throw new Error('No domNode argument');
    const { constructor } = this.prototype;
    const { instances } = constructor;
    const instance = instances[domElem.getAttribute(idAttrNormalize(`data-${constructor.bemEntityName}-id`))];
    return instance || new constructor(domElem);
  }

  static getInstanceCollection(domCollection) {
    return Array.prototype.map.call(domCollection, (domElem) => this.getInstance(domElem));
  }

  constructor(domElem) {
    const { constructor } = this;
    const { bemEntityName } = this.constructor;
    this.bemEntityName = bemEntityName;
    const id = nanoid();
    this.domElem = domElem;
    this.params = JSON.parse(domElem.getAttribute(paramsAttr) || '{}')[bemEntityName] || {};
    domElem.setAttribute(idAttrNormalize(`data-${bemEntityName}-id`), id);
    constructor.instances[id] = this;
  }
}
