<template>
  <div class="data-structure">
    <el-tree
      :data="treeData"
      :props="defaultProps"
      empty-text="没有发现Body"
      default-expand-all
    >
      <template #default="{ node, data }">
        <StructureNode style="width: 100%" :data="data"></StructureNode>
      </template>
    </el-tree>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, watch, ref } from "vue";
import StructureNode from "@/components/structureNode/index.vue";

const props = defineProps({
  data: {
    type: Array,
    default: [],
  },
  type: {
    type: String,
    default: "Object",
  },
});
const defaultProps = {
  children: "paramList",
};

interface Tree {
  children?: Tree[];
  type?: string;
  name?: string;
  keyName?: string;
  defaultValue?: string;
  lengthMin?: number;
  lengthMax?: number;
  required?: boolean;
}

const formatTree = (list: any[]) => {
  list.forEach((element) => {
    if (element.items) {
      element.items.keyName = "item";
      // element.items.type = "item"
      element.paramList = [element.items];
    }
    if (element.paramList) {
      formatTree(element.paramList);
    }
  });
};
const tempList = JSON.parse(JSON.stringify(props.data));
// formatTree(tempList);
const treeData = ref<any[]>([]);
if (props.type === "Object") {
  treeData.value = tempList.length
    ? [{ type: "objectRoot", paramList: tempList, count: tempList.length }]
    : [];
} else {
  treeData.value = tempList.length
    ? [{ type: "arrayRoot", paramList: tempList[0].paramList }]
    : [];
}
</script>

<style lang="scss" scoped>
.data-structure {
  //width: 3000px;
  min-height: 200px;
  border: 1px solid #f2f2f2;
  padding: 10px;
}
</style>
