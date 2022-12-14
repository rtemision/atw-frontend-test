import { domReady } from '@/components/dom-ready';
import { DomElement } from '@/components/dom-element';
import { BemEntityMixin } from '@/components/bem-entity';
import { ButtonToggable } from '@/components/button';
import Cookies from 'js-cookie';
import isMobile from 'is-mobile';

const cookieName = 'features';
const cookieSettings = {
  expires: 7,
  path: '/',
  sameSite: 'lax'
};

export class ControlPanel extends BemEntityMixin(DomElement) {
  static instances = {};

  static bemEntityName = 'control-panel';

  get _buttons() {
    return this.__buttons
      || (this.__buttons = Array.from(this.getElemsNode('button')).map((el) => ButtonToggable.getInstance(el)));
  }

  constructor(domElem) {
    super(domElem);

    this.features = {};

    domElem.addEventListener('checked-change', this._onCheckedChange.bind(this));

    this._loadFeaturesFromButtons();

    /**
     * Since there is no server, * the values of the settings
     * obtained from the state of the buttons (`checked` mod) may not be valid.
     *
     * So we change the state of the buttons
     * according to what is stored in the cookies
     */
    this._loadFeaturesFromCookies();

    if (isMobile()) this._disableFeaturesOnMobile();
  }

  _loadFeaturesFromButtons() {
    const { features } = this;

    this._buttons.forEach((button) => {
      features[button.params.feature] = button.getMod('checked');
    });
  }

  _loadFeaturesFromCookies() {
    const cookie = Cookies.get(cookieName);

    if (!cookie) return;

    const cookieFeatures = JSON.parse(cookie);
    const { features } = this;

    Object.entries(features).forEach((entry) => {
      const [key, value] = entry;
      const cookieVal = cookieFeatures[key];

      if (typeof cookieVal !== 'undefined' && value !== cookieVal) {
        const button = this._getButtonFeature(key);
        if (button) button.setMod('checked', cookieVal);
      }
    });
  }

  _disableFeaturesOnMobile() {
    this._buttons.forEach((button) => {
      if (!button.params.mobile) {
        button
          .delMod('checked')
          .setMod('disabled');
      }
    });
  }

  _getButtonFeature(feature) {
    return this._buttons.find((button) => button.params.feature === feature);
  }

  /**
   * @param {CustomEvent} event
   * @param {Button} detail.target button instance
   * @param {Object} detail.target.params params object
   * @param {String} detail.target.params.feature feature
   */
  _onCheckedChange({ detail }) {
    const { features } = this;
    const { feature } = detail.target.params;
    const { val } = detail;

    if (features[feature] !== val) {
      features[feature] = val;
      Cookies.set(cookieName, JSON.stringify(features), cookieSettings);
      this._emit('feature-change', { name: feature, enabled: val });
    }
  }
}

domReady.then(() => {
  document.querySelectorAll(`.${ControlPanel.bemEntityName}`)
    .forEach((el) => new ControlPanel(el));
});
