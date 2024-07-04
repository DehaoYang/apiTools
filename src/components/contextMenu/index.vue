<template>
  <div
    v-show="visible"
    :style="{
      left: position.left + 'px',
      top: position.top + 'px',
      display: visible ? 'block' : 'none',
    }"
    class="context-menu"
  >
    <div
      v-for="(item, i) in menuItems"
      :key="i"
      class="menu-item"
      @click="item.action(rightClickItem)"
    >
      <Icon :name="item.icon || ''" :color="item.color"></Icon>
      <div class="menu-item-content">{{ item.name }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import Icon from "@/components/Icon/Icon.vue";

interface Props {
  show: boolean;
  menuItems: ContextMenuItem[];
  position: Position;
}

export interface ContextMenuItem {
  name: string;
  icon?: string;
  color: string;
  action: (rightClickItem: any) => void;
}
export interface Position {
  x: number;
  y: number;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:show"]);
const visible = ref(false);
const rightClickItem = ref(null);
const position = ref({
  top: 0,
  left: 0,
});
watch(
  () => props.show,
  (val) => {
    if (val) {
      openMenu({ a: 1 });
    }
  }
);
const menuPosition = computed(() => {
  return props.position;
});
const openMenu = (item: any) => {
  let menuCount = props.menuItems.length;
  let windowHeight = window.innerHeight;

  visible.value = true;
  position.value.top = Math.min(
    menuPosition.value.y,
    windowHeight - 40 - menuCount * 32
  );
  position.value.left = menuPosition.value.x;
  rightClickItem.value = item;
};

const closeMenu = () => {
  visible.value = false;
  emit("update:show", false);
};

watch(visible, () => {
  if (visible.value) {
    document.body.addEventListener("click", closeMenu);
    document.body.addEventListener("contextmenu", closeMenu);
  } else {
    document.body.removeEventListener("click", closeMenu);
    document.body.removeEventListener("contextmenu", closeMenu);
  }
});

defineExpose({ openMenu, closeMenu });
</script>
<style scoped lang="scss">
.context-menu {
  margin: 0;
  background: #fff;
  z-index: 999;
  position: absolute;
  list-style-type: none;
  padding: 4px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3);

  .menu-item {
    padding: 0 15px;
    height: 32px;
    width: 120px;
    color: rgb(29, 33, 41);
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .menu-item:hover {
    background: #edf7ee;
    border-radius: 4px;
  }
}
</style>
