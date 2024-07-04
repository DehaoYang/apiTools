<template>
  <template v-if="data.type === 'objectRoot'">
    <span class="obj-node">Object</span>
  </template>
  <template v-else-if="data.type === 'arrayRoot'">
    <span class="obj-node">Array</span>
  </template>
  <template v-else>
    <div class="other-node">
      <span class="key-name" v-copyText="data.keyName" @click.stop>{{
        data.keyName
      }}</span>
      <span class="type-text">{{ data.type }}</span>
      <span
        class="required-status"
        v-if="data.required !== undefined && !hideRequire"
      >
        <el-icon v-if="data.required" color="#87ddbd">
          <CircleCheck />
        </el-icon>
        <span v-else class="circle-check"></span>
      </span>
      <span class="length-box" v-if="!hideLength">
        <div class="length-box-item" v-if="min">
          {{ min }}
        </div>
        <div class="length-box-item" v-if="max">
          {{ max }}
        </div>
      </span>
      <el-tooltip
        placement="top"
        trigger="click"
        transition="none"
        :hide-after="0"
        v-if="props.data.name && props.data.name.length >= 60"
      >
        <template #content>
          <div style="width: 300px">{{ props.data.name }}</div>
        </template>
        <span class="explanatory" @click.stop>{{ props.data.name }}</span>
      </el-tooltip>
      <span class="explanatory" @click.stop v-else>{{ props.data.name }}</span>
    </div>
  </template>
</template>

<script setup lang="ts">
import { CircleCheck } from "@element-plus/icons-vue";
import { computed } from "vue";
import { isEmpty, isNil } from "lodash";

const props = defineProps({
  data: {
    type: Object,
    default: {},
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
const max = computed(() => {
  if (!isNil(props.data.lengthMax)) {
    return ">" + props.data.lengthMax + "字符";
  }
  if (!isNil(props.data.max)) {
    return ">" + props.data.max.toString();
  }
  return "";
});
const min = computed(() => {
  if (!isNil(props.data.lengthMin)) {
    return "<" + props.data.lengthMin + "字符";
  }
  if (!isNil(props.data.min)) {
    return "<" + props.data.min.toString();
  }
  return "";
});
</script>

<style lang="scss" scoped>
.obj-node {
  color: #1890ff;
}

.item-node {
  color: #f97795;
}

span {
  display: block;
  font-size: 15px;
}

.key-name {
  min-width: 250px;
}

.other-node {
  display: flex;
  align-items: center;

  & > span {
    margin-right: 40px;
  }

  .type-text {
    color: #f97795;
    min-width: 100px;
  }
}

.circle-check {
  display: block;
  height: 14px;
  width: 14px;
  border: 1px solid #c9c9ca;
  border-radius: 7px;
}

.required-status {
  display: flex;
  align-items: center;
}

.explanatory {
  display: block;
  width: 800px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.length-box {
  display: flex;
  min-width: 150px;
  &-item {
    font-size: 10px;
    border: 1px solid #e7e4e4;
    border-radius: 2px;
    padding: 1px 4px;
    margin: 0 2px;
  }
}
</style>
