
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;
/**
 * 获取css属性值
 * @param name css 变量名
 */
export const getCSSVariable = (name: string): string => {
  let body = window.getComputedStyle(document.body);
  return body.getPropertyValue(name).trim();
};
const camelCase = function(name: string): string {
  return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset): string {
    return offset ? letter.toUpperCase() : letter;
  }).replace(MOZ_HACK_REGEXP, 'Moz$1');
};
/**
 * 获取元素上的属性值
 * @param element 元素
 * @param styleName 属性
 */
export function getStyle (element: HTMLElement, styleName: string): string | number | null {
  if (!element || !styleName) return null;
  styleName = camelCase(styleName);
  if (styleName === 'float') {
    styleName = 'cssFloat';
  }
  let prop = styleName as keyof CSSStyleDeclaration;
  try {
    var computed = window.getComputedStyle(element, '');
    return element.style[prop] || computed ? computed[prop] : null;
  } catch (e) {
    return element.style[prop];
  }
}
/**
 * 移除style指定属性
 * @param element 元素
 * @param styleName 属性名
 */
export function removeStyle(element: HTMLElement, styleName: string): void {
  if (!element || !styleName) return;
  styleName = camelCase(styleName);
  let prop = styleName as keyof CSSStyleDeclaration;
  if (prop in element.style) {
    (element.style as any)[prop] = '';
  }
}

/**
 * 设置属性上的style
 * @param element 元素
 * @param styleName 属性
 * @param value 属性值
 */
export function setStyle(element: HTMLElement, styleName: string | CSSStyleDeclaration, value?: any): void {
  if (!element || !styleName) return;
  if (typeof styleName === 'object') {
    for (var prop in styleName) {
      let propName = prop as keyof CSSStyleDeclaration;
      if (styleName.hasOwnProperty(prop)) {
        setStyle(element, prop, styleName[propName]);
      }
    }
  } else {
    styleName = camelCase(styleName);
    (element.style as any)[styleName] = value;
  }
}
/**
 * 判断指定元素是否开启滚动
 * @param el 指定dom元素
 * @param vertical true: 是否垂直滚动, false: 横向滚动, 不传则判断两个
 */
export const isScroll = (el: HTMLElement, vertical?: boolean): boolean => {
  const determinedDirection = vertical !== null || vertical !== undefined;
  const overflow = determinedDirection
    ? vertical
      ? getStyle(el, 'overflow-y')
      : getStyle(el, 'overflow-x')
    : getStyle(el, 'overflow');
  if (overflow) {
    return /(scroll|auto)/.test(overflow.toString());
  }
  return false;
};
