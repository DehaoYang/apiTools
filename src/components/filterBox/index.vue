<script setup lang="ts">
import { computed, ref } from "vue";
import { ClickOutside as vClickOutside } from "element-plus";

const props = defineProps({
  defaultList: {
    type: Array,
    default: [],
  },
});
const emit = defineEmits(["changeFilter"]);
const showFilter = ref(false);
const filterList = computed(() => {
  return props.defaultList;
});
const filterFn = () => {
  emit("changeFilter", filterList.value);
  showFilterFn();
};
const outsideFn = () => {
  if (showFilter.value) {
    filterFn();
  }
};
const showFilterFn = () => {
  showFilter.value = !showFilter.value;
};
const changeCheck = (e: boolean, key: string) => {
  filterList.value.forEach((item: any) => {
    if (item.key === key) {
      item.checked = e;
    }
  });
};
const resetFilter = () => {
  filterList.value.forEach((item: any) => {
    item.checked = false;
  });
  filterFn();
};
</script>

<template>
  <el-popover
    placement="bottom"
    :width="300"
    :hide-after="0"
    :visible="showFilter"
    transition
  >
    <template #reference>
      <div
        :class="['triangle', showFilter ? 't-top' : 't-bottom']"
        @click="showFilterFn"
      ></div>
    </template>
    <div class="filter-box" v-click-outside="outsideFn">
      <div class="key-table">
        <div class="key-table-item" v-for="item in filterList">
          <el-checkbox
            v-model="item.checked"
            :label="item.label"
            @change="(e) => changeCheck(e, item.key)"
          />
        </div>
      </div>
      <div class="op-box">
        <button @click="filterFn">确认</button>
        <button @click="resetFilter">重置</button>
      </div>
    </div>
  </el-popover>
</template>

<style scoped lang="scss">
.triangle {
  width: 0;
  height: 0;
  margin-left: 8px;
  cursor: pointer;
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
}
.t-top {
  border-bottom: 6px solid #909399;
}
.t-bottom {
  border-top: 6px solid #909399;
}
.filter-box {
  .key-table {
    height: 200px;
    border: 1px solid #eaeaea;
    overflow: auto;
    .key-table-item {
      display: flex;
      align-items: center;
      cursor: pointer;
      height: 30px;
      padding-left: 10px;
      //background-color: #6db978;
      &:hover {
        background-color: #edf7ee;
      }
    }
  }
  .op-box {
    display: flex;
    justify-content: right;
    button {
      background-color: #ffffff;
      border: 1px solid #eaeaea;
      border-radius: 2px;
      cursor: pointer;
      margin: 4px;
      &:hover {
        background-color: #f5f7fa;
      }
    }
    :last-child {
      margin-right: 0;
    }
  }
}
</style>
