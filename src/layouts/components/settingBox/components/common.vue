<script setup lang="ts">
import Icon from "@/components/Icon/Icon.vue";
import { toolStore } from "@/store/tool";
const tool = toolStore();
</script>

<template>
  <div class="setting-item">
    <!--    <p class="setting-item-title">缓存</p>-->
    <div class="setting-item-main">
      <el-button
        type="danger"
        class="clear-cache-btn"
        @click="tool.clearCache()"
        >清除缓存</el-button
      >
      <!--      <Icon name="tips" size="16px"></Icon>-->
    </div>
  </div>
</template>

<style scoped lang="scss">
.setting-item {
  &-title {
    line-height: 30px;
  }
  &-main {
    display: flex;
    align-items: center;
    .clear-cache-btn {
      margin-right: 10px;
    }
  }
}
</style>
