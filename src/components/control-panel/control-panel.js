import { domReady } from '@/components/dom-ready';
import { DomElement } from '@/components/dom-element';
import { BemEntityMixin } from '@/components/bem-entity';
import { ButtonToggable } from '@/components/button';

export class ControlPanel extends BemEntityMixin(DomElement) {

  static instances = {};
  static bemEntityName = 'control-panel';

  get _buttons() {
    return this.__buttons ||
      (this.__buttons = Array.from(this.getElemsNode('button')).map(el => {
        return ButtonToggable.getInstance(el);
      }));
  }

  constructor(domElem) {
    super(domElem);

    this.features = {}

    domElem.addEventListener('checked-change', this._onCheckedChange.bind(this));

    this._loadFeaturesFromButtons();
  }

  _loadFeaturesFromButtons() {
    const features = this.features;

    this._buttons.forEach(button => {
      features[button.params.feature] = button.getMod('checked');
    });
  }

  _getButtonFeature(feature) {
    return this._buttons.find(button => button.params.feature === feature);
  }

  /**
   * @param {CustomEvent} event
   * @param {Button} detail.target button instance
   * @param {Object} detail.target.params params object
   * @param {String} detail.target.params.feature feature
   */
  _onCheckedChange({ detail }) {
    const features = this.features;
    const feature = detail.target.params.feature;
    const val = detail.val;

    if (features[feature] !== val) {
      features[feature] = val;
      this._emit('feature-change', { name: feature, enabled: val });
    }
  }
}

domReady.then(() => {
  document.querySelectorAll(`.${ControlPanel.bemEntityName}`)
    .forEach(el => new ControlPanel(el));
});
