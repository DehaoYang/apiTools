<script setup lang="ts">
import { computed, ref } from "vue";
import Icon from "@/components/Icon/Icon.vue";
import Common from "@/layouts/components/settingBox/components/common.vue";
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:show"]);
const showDialog = computed({
  get() {
    return props.show;
  },
  set(value) {
    emit("update:show", value);
  },
});
const menuList = ref([
  {
    name: "common",
    label: "通用",
    color: "#727781",
    bg: "#ffffff",
    active: false,
  },
]);
const activeItem = ref<any>({});
const changeColor = (name: string, type: number) => {
  menuList.value.forEach((item) => {
    if (item.name === name && !item.active) {
      item.color = type ? "#aedfb5" : "#727781";
    }
  });
};
const chooseTab = (name: string) => {
  menuList.value.forEach((item) => {
    if (item.name === name) {
      activeItem.value = item;
    }
    item.active = item.name === name ? true : false;
    item.color = item.name === name ? "#aedfb5" : "#727781";
    item.bg = item.name === name ? "#edf7ee" : "#ffffff";
  });
};
chooseTab("common");
</script>

<template>
  <el-dialog v-model="showDialog" title="设置">
    <div class="setting-content">
      <div class="setting-content-menu">
        <div
          class="setting-content-menu-item"
          v-for="item in menuList"
          :key="item.name"
          :style="{ backgroundColor: item.bg }"
          @mouseenter="changeColor(item.name, 1)"
          @mouseleave="changeColor(item.name, 0)"
          @click="chooseTab(item.name)"
        >
          <Icon :name="item.name" :color="item.color"></Icon>
          <span :style="{ color: item.color }">{{ item.label }}</span>
        </div>
      </div>
      <div class="setting-content-main">
        <p class='setting-content-main-title'>{{ activeItem.label }}</p>
        <Common></Common>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.setting-content {
  display: flex;
  height: 50vh;
  width: 100%;
  overflow: hidden;
  &-menu {
    width: 30%;
    border-right: 1px solid #ebecf0;
    padding: 20px;
    &-item {
      display: flex;
      align-items: center;
      height: 40px;
      border-radius: 6px;
      cursor: pointer;
      padding: 0 6px;
      span {
        color: #000000;
        margin-left: 10px;
      }
      &:hover {
        background-color: #edf7ee;
      }
    }
  }
  &-main{
    padding: 10px;
    &-title{
      font-weight: bold;
      font-size: 16px;
      line-height: 32px;
    }
  }
}
</style>
