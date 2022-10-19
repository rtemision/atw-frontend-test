import { domReady } from '@/components/dom-ready';
import { Page } from '@/components/page';
import { Cursor } from '@/components/cursor/cursor';
import { PhotoShow } from '@/components/photo-show';

export class App {
  get _page() {
    return this.__page || (this.__page = Page.getInstance(document.documentElement));
  }

  get _cursor() {
    return this.__cursor
      || (this.__cursor = Cursor.getInstance(this._page.body.querySelector('.cursor')));
  }

  get _photoShow() {
    return this.__photoShow
      || (this.__photoShow = PhotoShow.getInstance(this._page.body.querySelector('.photo-show')));
  }

  constructor() {
    this._page.body.addEventListener('feature-change', this._onFeatureChange.bind(this));
  }

  /**
   * @param {CustomEvent} event
   * @param {Object} event.detail
   * @param {String} name feature
   * @param {Boolean} enabled
   */
  _onFeatureChange({ detail }) {
    switch (detail.name) {
      case 'custom-cursor': {
        this._page.setMod('cursor', detail.enabled ? 'custom' : false);
        break;
      }
      case 'cursor-tracker': {
        this._cursor.setMod('enabled', detail.enabled);
        break;
      }
      case 'cursor-photos': {
        this._photoShow.setMod('enabled', detail.enabled);
        break;
      }
      default: {
        break;
      }
    }
  }
}

domReady.then(() => {
  // eslint-disable-next-line no-new
  new App();
});
