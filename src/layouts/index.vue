<template>
  <el-container class="layout">
    <el-header class="layout-header" height="50px">
      <div class="header-left">
        <img :src="logo" alt="杭州展鸿科技有限公司" class="logo" />
        <span class="project-name"
          >{{ mainStore.systemName }}({{ mainStore.active }})</span
        >
      </div>
      <div class="header-right"></div>
    </el-header>
    <div class="main-content">
      <div class="function-box">
        <div class="function-box-top">
          <div
            class="function-box-top-item"
            v-for="item in toolTab"
            :key="item.name"
            @mouseenter="changeColor(item.name, 1)"
            @mouseleave="changeColor(item.name, 0)"
            @click="chooseTab(item.name)"
          >
            <Icon :name="item.name" :color="item.color" size="30px"></Icon>
            <p :style="{ color: item.color, userSelect: 'none' }">
              {{ item.label }}
            </p>
          </div>
        </div>
        <div class="function-box-bottom">
          <div
            class="function-box-bottom-item"
            @click="exportDoc"
            v-if="mainStore.downloadUrl"
          >
            <Icon name="export_doc" color="#727781" size="26px"></Icon>
          </div>
          <div
            class="function-box-bottom-item"
            @click="settingDialogShow = true"
          >
            <Icon :name="'setting'" color="#727781" size="25px"></Icon>
          </div>
        </div>
      </div>
      <div style="width: calc(100% - 80px)">
        <router-view />
      </div>
    </div>
  </el-container>
  <SettingBox v-model:show="settingDialogShow"></SettingBox>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "@/store/index";
import "@/styles/layouts/layouts.scss";
import Logo from "@/assets/images/logo.png";
import { Icon } from "@/components/Icon";
import SettingBox from "@/layouts/components/settingBox/settingBox.vue";
import router from "@/router";
import { download } from "@/utils/base";

const logo = ref(Logo);
const toolTab = ref([
  { name: "home", color: "#727781", label: "首页", active: false },
  { name: "api", color: "#727781", label: "接口管理", active: false },
  // { name: "var", color: "#727781", label: "变量管理", active: false },
]);
const settingDialogShow = ref(false);
const changeColor = (name: string, type: number) => {
  toolTab.value.forEach((item) => {
    if (item.name === name && !item.active) {
      item.color = type ? "#aedfb5" : "#727781";
    }
  });
};
const chooseTab = (name: string) => {
  router.push({
    name,
  });
  toolTab.value.forEach((item) => {
    item.active = item.name === name ? true : false;
    item.color = item.name === name ? "#aedfb5" : "#727781";
  });
};
addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.altKey && e.key === "t") {
    settingDialogShow.value = true;
  }
});
const exportDoc = () => {
  if (mainStore.downloadUrl) {
    const url =
      mainStore.scheme +
      "://" +
      mainStore.url +
      mainStore.contextPath +
      mainStore.downloadUrl;
    const fileName = mainStore.title + ".docx";
    download(url, fileName);
  }
};
const mainStore = useStore();
mainStore.initData();
chooseTab("home");
</script>
<style lang="scss" scoped>
.main-content {
  display: flex;
  height: 100%;
}
.function-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 80px;
  background-color: #f9fafb;
  border-right: 1px solid #f2f2f3;
  &-top {
    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 10px;
      border-radius: 6px;
      height: 60px;
      width: 60px;
      font-size: 12px;
      color: #767b84;
      cursor: pointer;
      &:hover {
        background-color: #f0f1f3;
      }
    }
  }

  &-bottom {
    &-item {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      height: 35px;
      width: 35px;
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        background-color: #f0f1f3;
      }
    }
  }
}
.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  //cursor: pointer;

  .header-left {
    display: flex;
    align-items: center;
    user-select: none;

    .project-name {
      margin-top: 2px;
      color: #767875;
      font-size: 16px;
      font-style: italic;
      font-weight: bolder;
    }

    .logo {
      height: 36px;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
  }
}
</style>
