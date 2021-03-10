import fastClick from 'fastclick';
import { isIOS } from '@/utils/is';

fastClick.prototype.focus = function (targetElement: any): void {
  var length;
  // 兼容处理:在iOS7中，有一些元素（如date、datetime、month等）在setSelectionRange会出现TypeError
  // 这是因为这些元素并没有selectionStart和selectionEnd的整型数字属性，所以一旦引用就会报错，因此排除这些属性才使用setSelectionRange方法
  if (isIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month' && targetElement.type !== 'email') {
    length = targetElement.value.length;
    targetElement.setSelectionRange(length, length);
    /* 修复bug ios 11.3不弹出键盘，这里加上聚焦代码，让其强制聚焦弹出键盘 */
    targetElement.focus();
  } else {
    targetElement.focus();
  }
};

fastClick.prototype.needsClick = function (target: any): boolean {
  while (target.tagName !== 'BODY') {
    // 放在本地插件库, 请将includes换成indexOf判断
    if (target.className.indexOf('needsclick') > -1) return true;
    if (target.parentNode !== null) {
      target = target.parentNode;
    }
  }

  switch (target.nodeName.toLowerCase()) {
    // Don't send a synthetic click to disabled inputs (issue #62)
    case 'button':
    case 'select':
    case 'textarea':
      if (target.disabled) {
        return true;
      }
      break;
    case 'input':
      // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
      if ((isIOS && target.type === 'file') || target.disabled) {
        return true;
      }
      break;
    case 'label':
    case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
    case 'video':
      return true;
  }
  return (/\bneedsclick\b/).test(target.className);
};
fastClick.attach(document.body);
