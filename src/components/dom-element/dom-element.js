import { nanoid } from 'nanoid'

const idAttrRegexp = /_{1,}/g;
const paramsAttr = 'data-params';

const idAttrNormalize = (name) => {
  return name.replace(idAttrRegexp, '-');
}

export class DomElement {

  static getInstance(domElem) {
    if (!domElem) throw 'No domNode argument';
    const constructor = this.prototype.constructor;
    const instances = constructor.instances;
    const instance = instances[domElem.getAttribute(idAttrNormalize(`data-${constructor.bemEntityName}-id`))];
    return instance || new constructor(domElem);
  }

  static getInstanceCollection(domCollection) {
    return Array.prototype.map.call(domCollection, (domElem) => {
      return this.getInstance(domElem);
    });
  };

  constructor(domElem) {
    const constructor = this.constructor;
    const bemEntityName = this.bemEntityName = this.constructor.bemEntityName;
    const id = nanoid();
    this.domElem = domElem;
    this.params = JSON.parse(domElem.getAttribute(paramsAttr) || '{}')[bemEntityName] || {};
    domElem.setAttribute(idAttrNormalize(`data-${bemEntityName}-id`), id);
    constructor.instances[id] = this;
  }
}
