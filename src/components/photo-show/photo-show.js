import { domReady } from '@/components/dom-ready';
import { DomElement } from '@/components/dom-element';
import { BemEntityMixin } from '@/components/bem-entity';
import { throttle } from '@/components/functions/__throttle';
import { resizeObserver } from '@/components/resize-observer';
import anime from 'animejs/lib/anime.es.js';

const areaFraction = .05;

const getDistance = (a, b) => Math.abs(a - b);

const coordsIsEmpty = (coords) => {
  const values = Object.values(coords);
  return values.length ?
    Object.values(coords).indexOf(-1) >= 0 :
    false;
};

export class PhotoShow extends BemEntityMixin(DomElement) {

  static instances = {};
  static bemEntityName = 'photo-show';

  constructor(domElem) {
    super(domElem);

    const bemEntityName = this.bemEntityName;

    this._items = domElem.querySelectorAll(`.${bemEntityName}__item`);
    this._images = domElem.querySelectorAll(`.${bemEntityName}__img`);
    this._length = this._items.length;
    this._animations = new Map();
    this._index = 0;
    this._zIndex = 1;
    this._areaSize = { width: 0, height: 0, max: 0 };
    this._lastPointerPos = { x: -1, y: -1 };
    this._lastPointerAnimPos = { x: -1, y: -1 };

    resizeObserver.add(domElem, throttle(this._onResize, 1000, this));

    ['mousemove', 'touchmove'].forEach(e => {
      domElem.addEventListener(e, throttle(this._onPointerMove, 50, this));
    });
  }

  _onResize(entry) {
    const { width, height } = entry.contentRect;
    const areaSize = this._areaSize;

    areaSize.width = width;
    areaSize.height = height;
    areaSize.max = width > height ? width : height;
  }

  _onPointerMove(e) {
    const event = (e.touches || [])[0] || e;
    const x1 = event.pageX;
    const y1 = event.pageY;
    const lastPointerPos = this._lastPointerPos;

    if (!coordsIsEmpty(lastPointerPos)) {
      const lastPointerAnimPos = this._lastPointerAnimPos;
      const lastPointerAnimPosIsEmpty = coordsIsEmpty(lastPointerAnimPos);
      const x0 = lastPointerPos.x;
      const y0 = lastPointerPos.y;
      const minDistance = areaFraction * this._areaSize.max;

      let hypot = 0;

      lastPointerAnimPosIsEmpty ||
        (hypot = Math.hypot(
          getDistance(x1, lastPointerAnimPos.x),
          getDistance(y1, lastPointerAnimPos.y)
        ));

      if (lastPointerAnimPosIsEmpty || minDistance < hypot) {
        this._animate({ x0, y0, x1, y1 });
        lastPointerAnimPos.x = x1;
        lastPointerAnimPos.y = y1;
      }
    }

    lastPointerPos.x = x1;
    lastPointerPos.y = y1;
  }

  /**
   *
   * @param {Object} data
   * @param {Number} data.x0 x coord from
   * @param {Number} data.y0 y coord from
   * @param {Number} data.x1 x coord to
   * @param {Number} data.y1 y coord to
   */
  _animate({ x0, y0, x1, y1 }) {
    const index = this._index;
    const item = this._items[index];
    const itemImg = this._images[index];
    const itemStyle = item.style;
    const animations = this._animations;

    animations.has(item) && anime.remove(item);
    animations.has(itemImg) && anime.remove(itemImg);

    itemStyle.zIndex = this._zIndex++;
    itemStyle.visibility = 'visible';

    anime.timeline({
      easing: 'easeOutExpo',
      duration: 300,
      begin: () => {
        animations.set(item, true);
        animations.set(itemImg, true);

        if (++this._index >= this._length) {
          this._index = 0;
        }
      },
      complete: () => {
        animations.delete(itemImg);

        anime({
          targets: item,
          easing: 'easeInCubic',
          opacity: 0,
          translateY: this._areaSize.height,
          duration: 500,
          delay: 500,
          complete: () => {
            itemStyle.visibility = '';
            animations.delete(item);
          }
        });
      }
    })
      .add({
        targets: item,
        opacity: [0, 1],
        translateX: [x0, x1],
        translateY: [y0, y1]
      })
      .add({
        targets: itemImg,
        scale: [0, 1],
        easing: 'easeOutSine'
      });
  }
}

domReady.then(() => {
  document.querySelectorAll(`.${PhotoShow.bemEntityName}`)
    .forEach(el => new PhotoShow(el));
});
