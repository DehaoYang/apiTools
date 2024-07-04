<template>
  <div class="data-structure">
    <el-table
      :data="treeData"
      row-key="id"
      border
      default-expand-all
      :tree-props="{ children: 'paramList' }"
    >
      <el-table-column
        width="350px"
        prop="keyName"
        label="字段名"
        header-align="center"
        :resizable="false"
      >
        <template #default="scope">
          <span v-copyText="scope.row.keyName">
            {{ scope.row.keyName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        width="80"
        prop="type"
        label="类型"
        header-align="center"
        :resizable="false"
      >
        <template #default="scope">
          <p
            :style="{
              'text-align': 'center',
              color: typeColor[scope.row.type],
            }"
          >
            {{ scope.row.type }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        prop="required"
        label="是否必填"
        header-align="center"
        :resizable="false"
        v-if="!hideRequire"
      >
        <template #default="scope">
          <p style="text-align: center">
            {{ scope.row.required ? "是" : "否" }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        width="200"
        prop="max"
        label="长度"
        :resizable="false"
        header-align="center"
        v-if="!hideLength"
      >
        <template #default="scope">
          <div class="length-box">
            <template v-if="getEqual(scope.row)">
              <div class="length-box-item" v-if="getMin(scope.row)">
                {{ getEqual(scope.row) }}
              </div>
            </template>
            <template v-else>
              <div
                class="length-box-item"
                v-if="getMin(scope.row) && scope.row.lengthMin"
              >
                {{ getMin(scope.row) }}
              </div>
              <div class="length-box-item" v-if="getMax(scope.row)">
                {{ getMax(scope.row) }}
              </div>
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="注释"
        :resizable="false"
        header-align="center"
      />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, watch, ref, computed } from "vue";
import StructureNode from "@/components/structureNode/index.vue";
import { Select, CloseBold } from "@element-plus/icons-vue";
import { cloneDeep } from "lodash-es";
import { isNil } from "lodash";

const props = defineProps({
  data: {
    type: Array,
    default: [],
  },
  type: {
    type: String,
    default: "Object",
  },
  hideLength: {
    type: Boolean,
    default: false,
  },
  hideRequire: {
    type: Boolean,
    default: false,
  },
});

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

const formatTree = (list: any[], fk: string) => {
  const tempList = cloneDeep(list);
  return tempList.map((element) => {
    element.id = fk + element.keyName;
    if (element.items) {
      element.items.keyName = "item";
      element.paramList = [element.items];
    }
    if (element.paramList) {
      element.paramList = formatTree(element.paramList, element.id);
    }
    return element;
  });
};
const defaultProps = {
  children: "paramList",
};
const typeColor = {
  Object: "#1890ff",
  String: "#43a047",
  Number: "#eb2f96",
  Boolean: "#fa8c16",
  Array: "#9373ee",
};
const tempList = cloneDeep(props.data);
const treeData = ref<any[]>(formatTree(tempList, ""));
const getMin = (item: any) => {
  if (!isNil(item.lengthMin)) {
    return ">=" + item.lengthMin + "字符";
  }
  if (!isNil(item.min)) {
    return ">=" + item.min.toString();
  }
  return "";
};
const getMax = (item: any) => {
  if (!isNil(item.lengthMax)) {
    return "<=" + item.lengthMax + "字符";
  }
  if (!isNil(item.max)) {
    return "<=" + item.max.toString();
  }
  return "";
};
const getEqual = (item: any) => {
  if (
    !isNil(item.lengthMax) &&
    !isNil(item.lengthMin) &&
    item.lengthMax === item.lengthMin
  ) {
    return "=" + item.lengthMax + "字符";
  }
  if (!isNil(item.max) && !isNil(item.min) && item.max === item.min) {
    return "=" + item.max;
  }
  return "";
};
</script>

<style lang="scss" scoped>
.data-structure {
  min-height: 200px;
  border: 1px solid #f2f2f2;
  padding: 10px;
}
.length-box {
  display: flex;
  justify-content: center;
  height: 24px;
  &-item {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 50px;
    font-size: 10px;
    border: 1px solid #e7e4e4;
    border-radius: 4px;
    padding: 0px 8px;
    margin: 0 2px;
  }
}
</style>
