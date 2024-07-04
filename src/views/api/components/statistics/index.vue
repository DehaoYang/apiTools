<script setup lang="ts">
import { useStore } from "@/store";
import { getNodeLeaf, getTabData } from "@/utils/base";
import { cloneDeep } from "lodash-es";
import { computed, ref } from "vue";
import { activeStore } from "@/store/active";
import { devStatus } from "@/enum/common";
import FilterBox from "@/components/filterBox/index.vue";

const mainStore = useStore();
const props = defineProps({
  id: { type: String, default: "" },
});
const tableData = ref([]);
const tempTabData: any = ref({});
const rootCount = ref(0);
if (props.id) {
  tempTabData.value = getTabData(cloneDeep(mainStore.treeNodes), props.id);
  // 获取此节点下所有的接口
  tableData.value = getNodeLeaf(tempTabData.value.methodList);
} else {
  tableData.value = getNodeLeaf(mainStore.treeNodes);
  rootCount.value = mainStore.treeNodes
    .map((item: any) => item.count)
    .reduce((pre: number, cur: number) => pre + cur);
}
const filterList = ref(tableData.value);
// 筛选分组
const filterDefaultLists = ref({
  group: [],
  status_label: devStatus,
  status: [],
});
tableData.value.forEach((item: any) => {
  Object.keys(filterDefaultLists.value).forEach((key: string) => {
    if (
      filterDefaultLists.value[key].findIndex(
        (i: any) => i.key === item[key]
      ) === -1
    )
      filterDefaultLists.value[key].push({
        key: item[key],
        label:
          filterDefaultLists.value[key + "_label"]?.find(
            (e: any) => e.key === item[key]
          )?.value || item[key],
        checked: false,
      });
  });
});
const filterFn = (list: any[], key: string) => {
  filterDefaultLists.value[key] = list;
  let tempFilterList = cloneDeep(tableData.value);
  Object.keys(filterDefaultLists.value).forEach((filterKey: any) => {
    const filter = filterDefaultLists.value[filterKey]
      .map((item: any) => {
        if (item.checked) {
          return item.key;
        }
      })
      .filter((item: any) => item !== undefined);
    if (filter.length) {
      tempFilterList = tempFilterList.filter((item: any) => {
        if (filter.includes(item[filterKey])) {
          return item;
        }
      });
    }
  });
  filterList.value = tempFilterList;
};
const typeColorList = [
  { type: "POST", color: "#ed8936" },
  { type: "GET", color: "#40b480" },
];
const getTypeColor = (type: string) => {
  return (typeColorList.find((item) => (item.type = type)) || typeColorList[0])
    .color;
};
const statusStore: any = activeStore();
const clickToPage = (id: string, name: string) => {
  statusStore.activeNode = { id: id, name: name, leaf: true };
  statusStore.addTab({ id: id, name: name, leaf: true });
};
const statusColorList = ["#fa8c16", "#1890ff", "#4caf50"];
</script>

<template>
  <div class="statistics">
    <div class="statistics-table">
      <div class="statistics-table-header">
        <p class="statistics-table-header-title">
          {{
            (tempTabData.name || "根目录") +
            `(接口${tempTabData.count || rootCount}个)`
          }}
        </p>
      </div>
      <el-table
        row-key="id"
        :data="filterList"
        empty-text="暂无数据"
        height="calc(100% - 10px)"
        style="width: 100%"
      >
        <el-table-column prop="name" label="接口名称">
          <template #default="scope">
            <div
              class="table-item-name"
              @click="clickToPage(scope.row.id, scope.row.name)"
            >
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mappingType" label="请求类型">
          <template #default="scope">
            <div :style="{ color: getTypeColor(scope.row.mappingType) }">
              {{ scope.row.mappingType }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="接口路径" />
        <el-table-column prop="group" label="接口分组">
          <template #header>
            <div class="table-header-item">
              <div>接口分组</div>
              <FilterBox
                :default-list="filterDefaultLists['group']"
                @change-filter="(e) => filterFn(e, 'group')"
              ></FilterBox>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <div :style="{ color: statusColorList[scope.row.status - 1] }">
              {{
                devStatus.find((item: any) => item.key === scope.row.status)
                  ?.value
              }}
            </div>
          </template>
          <template #header>
            <div class="table-header-item">
              <div>状态</div>
              <FilterBox
                :default-list="filterDefaultLists['status']"
                @change-filter="(e) => filterFn(e, 'status')"
              ></FilterBox>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.statistics {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  &-table {
    width: 100%;
    max-height: 96%;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    padding: 10px 0 10px 0;
    overflow: hidden;
    &-header {
      display: flex;
      justify-content: space-between;
      width: 100%;
      border-bottom: 1px solid #ebeef5;
      &-title {
        color: #404653;
        font-weight: bold;
        font-size: 14px;
        padding-left: 10px;
        line-height: 30px;
      }
    }
  }
}
.table-item-name {
  cursor: pointer;
  &:hover {
    color: #6db978;
  }
}
.table-header-item {
  display: flex;
  align-items: center;
}
</style>
