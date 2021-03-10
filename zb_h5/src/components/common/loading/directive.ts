import loadingComp from '@/components/common/loading/index.vue';
import { DirectiveBinding } from 'vue/types/options';
import { getStyle, setStyle, removeStyle } from '@/utils/dom';
import Vue from 'vue';

function afterLeave(instance: any, callback: Function, speed = 300, once = false): void {
  if (!instance || !callback) throw new Error('instance & callback is required');
  let called = false;
  const afterLeaveCallback = function (): void {
    if (called) return;
    called = true;
    if (callback) {
      callback.apply(null, arguments);
    }
  };
  if (once) {
    instance.$once('after-leave', afterLeaveCallback);
  } else {
    instance.$on('after-leave', afterLeaveCallback);
  }
  setTimeout((): void => {
    afterLeaveCallback();
  }, speed + 100);
}
let Loading = Vue.extend(loadingComp);
const toggleLoading = (el: HTMLElement, binding: DirectiveBinding): void => {
  let anyEl = el as any, loadingInstance = anyEl._loadingInstance;
  if (binding.value) {
    if (anyEl.domVisible && loadingInstance.hiding === true) {
      loadingInstance.visible = true;
      loadingInstance.hiding = false;
      return;
    }
    el.appendChild(loadingInstance.$el);
    Vue.nextTick((): void => {
      if (loadingInstance.hiding) {
        loadingInstance.$emit('after-leave');
      } else {
        loadingInstance.visible = true;
      }
      let result = ['relative', 'absolute', 'fixed'].filter((value: string): boolean => {
        return getStyle(el, 'position') === value;
      });
      if (result.length === 0) {
        (el as any)._addPosition = true;
        setStyle(el, 'position', 'relative');
      }
    });
    anyEl.domInserted = true;
    anyEl.domVisible = true;
  } else {
    afterLeave(loadingInstance, (): void => {
      if (!loadingInstance.hiding) return;
      anyEl.domVisible = false;
      loadingInstance.hiding = false;
      if ((el as any)._addPosition === true) {
        removeStyle(el, 'position');
      }
    }, 300, true);
    loadingInstance.visible = false;
    loadingInstance.hiding = true;
  }
};
// loading指令
Vue.directive('loading', {
  bind(el: HTMLElement, binding): void {
    if (binding.oldValue && binding.oldValue.value === binding.value) return;
    let loadingInstance = new Loading({
      data: {
        visible: true
      },
      el: document.createElement('div')
    });
    (el as any)._loadingInstance = loadingInstance;
    binding.value && toggleLoading(el, binding);
  },
  update(el: HTMLElement, binding): void {
    if (binding.oldValue !== binding.value) {
      toggleLoading(el, binding);
    }
  },
  unbind(el: HTMLElement): void {
    let anyEl = (el as any);
    anyEl._addPosition = false;
    anyEl._loadingInstance.visible = false;
    Vue.nextTick((): void => {
      anyEl._loadingInstance.$destroy();
      anyEl._loadingInstance = null;
    });
    setStyle(el, 'position', 'none');
  }
});
