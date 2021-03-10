<template>
<!-- 为了项目开发的组件，应用于设置菜单→客服与分组模块→ 远离是循环调用【SelectItem】组件-->
  <div class="selectGroup">
    <SelectItem
      :class="[activeIndex===i?'checked':'']"
      v-for="(btn, i) in data"
      :key="i"
      :name="btn.name || btn"
      :value="btn.value"
      :index="i"
      :editIcon="editIcon"
      :delIcon="delIcon"
      @onClick="onClick"
      @onEdit="onEdit"
      @onDel="onDel"
      :iconDisabled="iconDisabledIndex!==i"
    >
    </SelectItem>
  </div>
</template>

<script>

export default {
  components: {
  },
  props: {
    // 绑定的数据
    data: {
      type: Array
    },
    // 不需要展示操作按钮的控件的下标
    iconDisabledIndex: {
      type: Number | String
    },
    // 是否添加编辑按钮
    editIcon: {
        type: Boolean,
        default: false
    },
    // 是否添加删除按钮
    delIcon: {
        type: Boolean,
        default: false
    }
  },
  data() {
    return {
      activeIndex: 0
    };
  },
  // API
  methods: {
    // 点击事件
    onClick(key, type) {
      this.activeIndex = key;
      this.$emit("onClick", key, type);
    },
    // 编辑事件
    onEdit(key, type) {
      this.$emit('onEdit', key, type)
    },
    // 删除事件
    onDel(key, type) {
      this.$emit('onDel', key, type)
    }
  }
};
</script>
