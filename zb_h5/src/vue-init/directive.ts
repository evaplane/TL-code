import Vue from 'vue';
import { on, off, once } from '@/utils/event';
import '@/components/common/loading/directive';
import store from '@/store/store';

const hoverEventHandle = function (this: HTMLElement): void {
  let className = (this as any).hoverClass || 'hover-active';
  window.setTimeout((): void => {
    this.classList.remove(className);
  }, 500);
  this.classList.add(className);
  once(document, 'touchend', (): void => {
    this.classList.remove(className);
  });
};
// touch悬停某个元素处理
Vue.directive('hover', {
  bind(el: HTMLElement, binding): void {
    if (!el) return;
    (el as any).hoverClass = binding.arg;
    el.classList.add('hover');
    on(el, 'touchstart', hoverEventHandle);
  },
  unbind(el: HTMLElement): void {
    if (!el) return;
    off(el, 'touchstart', hoverEventHandle);
  }
});
// img 默认图及loading 处理
Vue.directive('img', (el: HTMLElement, binding): void => {
  if (!el) return;
  if (binding.oldValue && binding.oldValue.src === binding.value.src) return;
  let img = new Image();
  let { src, err, loading } = binding.value;
  img.src = src;
  if (loading) {
    (el as HTMLImageElement).src = loading;
  }
  img.onload = (): void => { (el as HTMLImageElement).src = src; };
  img.onerror = (): void => { (el as HTMLImageElement).src = err; };
});
// 背景 默认图及loading 处理
Vue.directive('bg', (el: HTMLElement, binding): void => {
  if (!el) return;
  if (binding.oldValue && binding.oldValue.src === binding.value.src) return;
  let img = new Image();
  let { src, err, loading } = binding.value;
  img.src = src;
  if (loading) {
    (el as HTMLDivElement).style.backgroundImage = `url(${loading})`;
  }
  img.onload = (): void => { (el as HTMLDivElement).style.backgroundImage = `url(${src})`; };
  img.onerror = (): void => { (el as HTMLDivElement).style.backgroundImage = `url(${err})`; };
});
// img 默认图变div及loading 处理
Vue.directive('img-default', (el: HTMLElement, binding): void => {
  if (!el) return;
  if (binding.oldValue && binding.oldValue.src === binding.value.src) return;
  let img = new Image();
  let { src, loading, head } = binding.value;
  img.src = src;
  if (loading) {
    (el as HTMLImageElement).src = loading;
  }
  img.onload = (): void => { (el as HTMLImageElement).src = src; };
  img.onerror = (): void => {
    let oDiv = document.createElement('div');
    oDiv.classList.add('van-image');
    if (head) {
      oDiv.classList.add('default-avatar-placeholder');
    } else {
      oDiv.classList.add('default-figure-placeholder');
    }
    el.after(oDiv);
    el.remove();
  };
});
// 弹出设置窗
Vue.directive('setting', {
  bind(el: HTMLElement): void {
    el.onclick = (): void => {
      store.dispatch('updateSettingVisible', true);
    };
  },
  unbind(el: HTMLElement): void {
    el.onclick = null;
  }
});
// 币种icon图标
Vue.directive('icon', {
  bind(el: HTMLElement, binding): void {
    if (!el) return;
    let img = new Image();
    let src = binding.value;
    img.src = src;
    img.onload = (): void => { (el as HTMLImageElement).src = src; };
    img.onerror = (): void => {
      let div = document.createElement('div');
      div.classList.add('null');
      var txt = document.createTextNode((el as any).alt);
      div.appendChild(txt);
      el.after(div);
      el.remove();
    };
  }
});
// 币种icon图标
Vue.directive('price', {
  bind(el: HTMLElement, binding): void {
    let { value } = binding.value;
    el.innerHTML = `${value || '0'}`;
  },
  update(el, binding): void {
    let { enable, value } = binding.value;
    el.innerHTML = !enable ? '******' : value;
  }
});
