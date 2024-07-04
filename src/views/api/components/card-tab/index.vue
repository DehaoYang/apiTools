<template>
  <el-tabs
    v-model="statusStore.activeNode.id"
    type="border-card"
    class="tabs"
    :hit="true"
  >
    <el-tab-pane
      v-for="item in statusStore.openList"
      :key="item.id"
      :name="item.id"
    >
      <template #label>
        <span
          :title="item.name"
          class="custom-tabs-label"
          @click="statusStore.activeTab(item.id)"
        >
          <span class="line"></span>
          <span
            class="label-text"
            :style="{ 'font-style': !!item.pre ? 'italic' : 'normal' }"
            >{{ item.name }}</span
          >
          <el-icon
            class="close-icon"
            @click.stop="statusStore.deleteTab(item.id)"
          >
            <Close />
          </el-icon>
        </span>
      </template>
      <Content :id="item.id" v-if="item.leaf"></Content>
      <Statistics :id="item.id" v-else></Statistics>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { Close } from "@element-plus/icons-vue";
import { useStore } from "@/store/index";
import { activeStore } from "@/store/active";
import Content from "../content/index.vue";
import Statistics from "../statistics/index.vue";
import { ref } from "vue";

const statusStore: any = activeStore();
const store = useStore();
</script>

<style lang="scss" scoped>
$main-color: #aedfb5;
.tabs > {
  :deep(.el-tabs__content) {
    height: calc(100% - #{40px});
    padding: 0;

    .el-tab-pane {
      height: 100%;
    }
  }
}

.tabs > {
  :deep(.el-tabs__header) {
    height: 40px;
    .el-tabs__item {
      border-radius: 10px 10px 0 0;
      padding: 0;

      &:last-child {
        padding-right: 0 !important;
      }

      &:nth-child(2) {
        padding: 0 !important;
      }

      &:first-child {
        .line {
          border: none;
        }
      }
    }

    .is-active {
      .label-text {
        color: #000000;
      }

      .line {
        // display: none;
        border: none;
      }

      + .el-tabs__item {
        // background-color: red;
        .line {
          // display: none;
          border: none;
        }
      }
    }
  }
}

.tabs {
  height: 100%;

  .custom-tabs-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 200px;
    color: #9b9b9b;

    .label-text {
      font-size: 12px;
      margin-left: 30px;
      margin-right: 12px;
      overflow: hidden;
      user-select: none;
    }

    &:hover {
      .close-icon {
        opacity: 1;
      }
    }

    .close-icon {
      font-size: 14px;
      opacity: 0;
      margin-right: 8px;
      font-weight: bolder;
    }

    .line {
      height: 20px;
      border-right: 1px solid black;
      opacity: 0.4;
      transform: scale(0.5, 1);
    }
  }

  .label-text-active {
    color: #1b1b1c;
  }
}
</style>
