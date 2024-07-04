<script setup lang="ts">
import Operation from "@/views/api/components/operation/index.vue";
import Document from "@/views/api/components/document/index.vue";
import { computed, ref } from "vue";
import { getTabData, tabDataSort } from "@/utils/base";
import { useStore } from "@/store";
const mainStore = useStore();
const props = defineProps({
  id: { type: String, default: "" },
});
const tempTabData: any = getTabData(mainStore.treeNodes, props.id);
tempTabData.paramList = tabDataSort(tempTabData.paramList || []);
tempTabData.responseList = tabDataSort(tempTabData.responseList || []);
const tabData = ref(tempTabData);
const activeTab = ref("first");
</script>

<template>
  <el-tabs v-model="activeTab" class="demo-tabs">
    <el-tab-pane label="文档" name="first">
      <Document :tabData="tabData"></Document>
    </el-tab-pane>
    <el-tab-pane label="运行" name="second">
      <Operation :tabData="tabData" :active="activeTab"></Operation>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped lang="scss">
$main-color: #aedfb5;
.demo-tabs {
  height: 100%;

  :deep(.el-tabs__header) {
    margin: 0;
    .is-active {
      color: $main-color;
    }

    .el-tabs__item:hover {
      color: $main-color;
    }

    .el-tabs__active-bar {
      background-color: $main-color;
    }
  }
}

.demo-tabs > {
  :deep(.el-tabs__content) {
    height: 100%;

    > .el-tab-pane {
      height: 100%;
      display: flex;
      justify-content: center;
      overflow: auto;
    }
  }

  :deep(.el-tabs__header) {
    .el-tabs__item {
      width: 100px;
      text-align: center;
    }
  }
}
</style>
