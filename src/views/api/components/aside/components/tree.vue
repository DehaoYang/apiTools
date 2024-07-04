<template>
  <div class="tree-header">
    <el-input
      v-model="filterText"
      class="filter-text"
      :spellcheck="false"
      clearable
    >
      <template #prefix>
        <el-icon :size="16" color="#737983"><Search /></el-icon>
      </template>
    </el-input>
    <div class="tool-btn" @click="changeExpand">
      <img :src="close" v-if="expand" />
      <img :src="open" v-else />
    </div>
  </div>
  <div class="tree-box" @click="fn">
    <el-tree
      style="background: #fcfcfd"
      :props="defaultProps"
      :data="data"
      :default-expanded-keys="[statusStore.activeNode.url || '']"
      :current-node-key="statusStore.activeNode.url || ''"
      highlight-current
      ref="tree"
      node-key="url"
      :filter-node-method="filterNode"
      empty-text="这个项目没有接口"
      :default-expand-all="expand"
      :key="expand"
      @node-contextmenu="rightClick"
      @node-click="fn"
    >
      <template #default="{ node, data }">
        <TreeNode
          :data="data"
          v-clickDown="{
            clickFun: handleNodeClick,
            clickFunType: data,
            dblclickFu: addCountPage,
            dblclickFuType: data,
          }"
        >
        </TreeNode>
      </template>
    </el-tree>
  </div>
  <context-menu
    v-model:show="showContextMenu"
    ref="contextMenu"
    :menu-items="menuItems"
    :position="position"
  />
</template>

<script setup lang="ts">
const contextMenu = ref<any>(null);
const fn = () => {
  contextMenu.value.closeMenu();
};
import { onMounted, ref, watch } from "vue";
import TreeNode from "./treeNode.vue";
import { useStore } from "@/store/index";
import { activeStore } from "@/store/active";
import { Search, Plus } from "@element-plus/icons-vue";
import open from "@/assets/images/arrow_open.png";
import close from "@/assets/images/arrow_close.png";
import ContextMenu, {
  ContextMenuItem,
  Position,
} from "@/components/contextMenu/index.vue";

const mainStore = useStore();
const statusStore: any = activeStore();
interface Tree {
  id: string;
  type?: string;
  name: string;
  uri?: string;
  url?: string;
  leaf?: boolean;
  children?: Tree[];
}

let data = ref<any>([]);
data.value = mainStore.treeNodes;

const expand = ref(false);
const changeExpand = () => {
  statusStore.activeNode = "";
  expand.value = !expand.value;
};

const tree: any = ref(null);
const filterText = ref("");
watch(filterText, (val) => {
  tree.value!.filter(val);
});
//单击显示
const handleNodeClick = (data: Tree) => {
  //单击节点只预览不添加tab
  // if (data.leaf) {
  //   statusStore.activeNode = data;
  //   statusStore.previewTab(data);
  // }
  dbNodeClick(data);
};
const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.name.includes(value) || data.url?.includes(value);
};
//双击添加tab
const dbNodeClick = (data: Tree) => {
  if (data.leaf) {
    statusStore.activeNode = { id: data.id, name: data.name, leaf: data.leaf };
    statusStore.addTab(data);
  }
};
// 双击添加统计页
const addCountPage = (data: Tree) => {
  statusStore.activeNode = { id: data.id, name: data.name, leaf: data.leaf };
  statusStore.addTab(data);
};
onMounted(() => {
  tree.value.setCurrentKey(statusStore.activeNode.url || "");
});
const defaultProps = {
  children: "methodList",
  label: "name",
};
const clickMenuData = ref<any>({});
const position = ref<Position>({ x: 0, y: 0 });
const rightClick = (e: MouseEvent, data: any) => {
  if (data.leaf) {
    position.value.x = e.pageX - 80;
    position.value.y = e.pageY - 50;
    showContextMenu.value = true;
  }
  clickMenuData.value = data;
};
const showContextMenu = ref(false);
const menuItems = ref<ContextMenuItem[]>([
  {
    name: "未完成",
    icon: "point",
    color: "#fa8c16",
    action: () => {
      mainStore.changeDevStatus(clickMenuData.value.url, "1");
    },
  },
  {
    name: "开发中",
    icon: "point",
    color: "#1890ff",
    action: () => {
      mainStore.changeDevStatus(clickMenuData.value.url, "2");
    },
  },
  {
    name: "已完成",
    icon: "point",
    color: "#4caf50",
    action: () => {
      mainStore.changeDevStatus(clickMenuData.value.url, "3");
    },
  },
]);
</script>

<style scoped lang="scss">
.tree-header {
  display: flex;
  justify-content: center;
  height: 50px;
  padding: 0 10px;
  margin-top: 10px;
  .filter-text {
    height: 32px;
  }
  :deep(.el-input__wrapper).is-focus {
    box-shadow: none;
  }
  :deep(.el-input__wrapper):hover {
    box-shadow: 0 0 0 1px #aedfb5 inset !important;
  }
  :deep(.el-input__wrapper) {
    background-color: #f2f4f7;
    box-shadow: none;
  }
  .tool-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    width: 32px;
    background-color: #f2f4f7;
    border-radius: 4px;
    margin-left: 2px;
    cursor: pointer;
    img {
      height: 15px;
    }
    &:hover {
      background-color: #c3e1c8;
    }
  }
}
.tree-box {
  height: calc(100% - 60px);
  overflow: hidden;
  &:hover {
    overflow: auto;
  }
  :deep(.el-tree-node) {
    .is-current > .el-tree-node__content {
      background-color: rgba($color: #aedfb5, $alpha: 0.2);
    }
  }
  :deep(.el-tree--highlight-current)
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: rgba($color: #aedfb5, $alpha: 0.2);
  }
}
</style>
