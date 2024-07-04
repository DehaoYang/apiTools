<template>
  <Split v-model="splitHorizontal" :max="0.5">
    <template #left>
      <el-aside class="aside">
        <div class="tree-area">
          <Tree></Tree>
        </div>
      </el-aside>
    </template>
    <template #right>
      <el-container style="height: 100%">
        <el-main class="content">
          <template v-if="statusStore.openList.length">
            <Tab></Tab>
          </template>
          <template v-else>
            <Welcome></Welcome>
          </template>
        </el-main>
      </el-container>
    </template>
  </Split>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Tab from "./components/card-tab/index.vue";
import { envStore } from "@/store/user";
import { activeStore } from "@/store/active";
import Tree from "./components/aside/index";
import Welcome from "./components/welcome/index.vue";

const statusStore = activeStore();
const props = defineProps({
  page: {
    type: String,
    default: "",
  },
});
const splitHorizontal = ref(0.15);
watch(
  () => splitHorizontal.value,
  (val) => {
    if (val < 0.05) {
      splitHorizontal.value = 0;
    }
  }
);
</script>

<style lang="scss" scoped>
$main-color: #aedfb5;

.aside {
  overflow: hidden;
  width: 100%;
  height: 100%;
  background: #fcfcfd;
}
.tree-area {
  height: 100%;
  width: 100%;

  :deep(.el-tree-node__content) {
    &:hover {
      background-color: rgba($color: #aedfb5, $alpha: 0.2);
      border-radius: 4px;
    }
  }
}
//.tree > {
//  :deep(.el-tree) {
//    .el-tree-node.is-current > .el-tree-node__content {
//      background-color: rgba($color: #aedfb5, $alpha: 0.2);
//      border-radius: 4px;
//    }
//  }
//}
</style>
