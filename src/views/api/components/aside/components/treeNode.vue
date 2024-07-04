<template>
  <span class="custom-tree-node">
    <RequestIcon
      v-if="props.data.leaf"
      :type="props.data.mappingType"
    ></RequestIcon>
    <el-icon v-else class="icon">
      <FolderOpened />
    </el-icon>
    <div class="label-content">
      <span class="label-text">{{ props.data.name }}</span>
      <span v-if="!props.data.leaf" class="label-text-count">{{
        `(${props.data.count})`
      }}</span>
      <Icon
        v-if="props.data.leaf"
        name="point"
        size="15"
        :color="statusColorList[props.data.status - 1]"
      ></Icon>
    </div>
  </span>
</template>

<script setup lang="ts">
import { FolderOpened } from "@element-plus/icons-vue";
import { onMounted, watch } from "vue";
import RequestIcon from "./requestIcon.vue";
import Icon from "@/components/Icon/Icon.vue";
const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
});
const statusColorList = ["#fa8c16", "#1890ff", "#4caf50"];
</script>

<style scoped lang="scss">
.custom-tree-node {
  display: flex;
  align-items: center;
  user-select: none;

  .icon {
    margin-right: 2px;
    font-size: 18px;
  }
  .label-content {
    display: flex;
    align-items: center;
    .label-tool {
      display: none;
      margin-left: 20px;
    }
    &:hover .label-tool {
      display: block;
    }
  }
  .label-text {
    color: #5d5d61;
    user-select: none;
  }
  .label-text-count {
    font-size: 12px;
    margin-left: 6px;
    color: #9b9b9b;
  }
}
</style>
