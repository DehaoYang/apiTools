<script setup lang="ts">
import { useStore } from "@/store";
import { download, getNodeLeaf } from "@/utils/base";
import { computed, ref } from "vue";

const mainStore = useStore();
const leafList = getNodeLeaf(mainStore.treeNodes);
const devData = ref({
  incomplete: 0,
  developing: 0,
  complete: 0,
});
leafList.forEach((item: any) => {
  if (item.status === "1") {
    devData.value.incomplete++;
  }
  if (item.status === "2") {
    devData.value.developing++;
  }
  if (item.status === "3") {
    devData.value.complete++;
  }
});
const exportDisable = ref(Boolean(mainStore.downloadUrl));
const tipList = computed(() => {
  const intro = mainStore.instructions;
  if (intro) {
    return intro.split("<br>");
  }
  return [];
});
</script>

<template>
  <div class="card-row">
    <el-card shadow="never" class="statistic-card">
      <p class="card-title">项目统计</p>
      <div class="statistic-card-content">
        <div class="statistic-item">
          <p>
            {{
              mainStore.treeNodes
                .map((item: any) => item.count)
                .reduce((pre: number, cur: number) => pre + cur)
            }}
          </p>
          <p>接口数</p>
        </div>
        <div class="statistic-item">
          <p>{{ mainStore.treeNodes.length }}</p>
          <p>模块数</p>
        </div>
        <div class="statistic-item">
          <p style="color: #fa8c16">{{ devData.incomplete }}</p>
          <p>未完成</p>
        </div>
        <div class="statistic-item">
          <p style="color: #1890ff">{{ devData.developing }}</p>
          <p>开发中</p>
        </div>
        <div class="statistic-item">
          <p style="color: #4caf50">{{ devData.complete }}</p>
          <p>已完成</p>
        </div>
      </div>
    </el-card>
  </div>
  <div class="card-row">
    <el-card shadow="never" class="base-card">
      <p class="card-title">项目信息</p>
      <div class="base-card-content">
        <p><span>名称：</span>{{ mainStore.systemName }}</p>
        <p><span>协议：</span>{{ mainStore.scheme }}</p>
        <p><span>域名：</span>{{ mainStore.url.split(":")[0] }}</p>
        <p><span>端口：</span>{{ mainStore.url.split(":")[1] }}</p>
        <p><span>路径：</span>{{ mainStore.contextPath }}</p>
        <p><span>环境：</span>{{ mainStore.active }}</p>
      </div>
    </el-card>
    <el-card shadow="never" class="export-card">
      <p class="card-title">提示</p>
      <div class="export-card-content" style="overflow: auto">
        <div class="tip-text" v-if="tipList.length">
          <p v-for="(item, index) in tipList">{{ item }}</p>
        </div>
        <div class="no-tip-text" v-else>暂无提示</div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.card-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 20px 20px 0 20px;
}
.base-card {
  width: 70%;
  &-content {
    padding-left: 10px;
    //height: 300px;
    p {
      line-height: 35px;
    }
    span {
      margin-right: 10px;
    }
  }
}
.export-card {
  width: calc(30% - 20px);
  ::-webkit-scrollbar {
    width: 0 !important;
  }
  &-content {
    height: 250px;
    margin-top: 20px;
    padding: 0 10px 10px 10px;
    .tip-text {
      height: 20px;
      font-size: 15px;
      color: #8c8f97;
      p {
        margin-left: 8px;
      }
    }
    .no-tip-text {
      display: flex;
      justify-content: center;
      height: 20px;
      font-size: 15px;
      color: #8c8f97;
      margin-top: 100px;
    }
    .op-box {
      position: absolute;
      bottom: 16px;
    }
    .export-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 32px;
      font-size: 14px;
      color: #39b44b;
      background-color: #f2f8f3;
      cursor: pointer;
      user-select: none;
      border-radius: 4px 4px 4px 4px;
      span {
        margin-left: 4px;
      }
      &:hover {
        color: #aedfb5;
        background-color: #edf7ee;
      }
    }
    .export-btn-disabled {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 32px;
      font-size: 14px;
      color: #b9bcc1;
      background-color: #f6f6f7;
      cursor: not-allowed;
      user-select: none;
      border-radius: 4px 4px 4px 4px;
      span {
        margin-left: 4px;
      }
    }
  }
}
.card-title {
  color: #404653;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
.statistic-card {
  width: 100%;
  &-content {
    display: flex;
  }
  .statistic-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 10px;
    height: 100px;
    width: 200px;
    border: 1px solid #e4e7ed;
    border-radius: 6px;
    user-select: none;
    p {
      line-height: 30px;
    }
  }
}
</style>
