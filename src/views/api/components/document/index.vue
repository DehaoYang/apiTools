<template>
  <div class="document">
    <div class="document-content">
      <div class="header">
        <div class="title">{{ activeNode.name }}</div>
      </div>
      <div class="tag-url">
        <RequestTag :type="activeNode.mappingType"></RequestTag>
        <div class="url-text" v-copyText="activeNode.url">
          {{ activeNode.url }}
        </div>
        <div
          class="url-status"
          :style="{ color: statusColorList[activeNode.status - 1] }"
        >
          {{
            devStatus.find((item: any) => item.key === activeNode.status)?.value
          }}
        </div>
      </div>
      <div class="desc" v-if="activeNode.desc">
        <p class="title">接口描述</p>
        {{ activeNode.desc }}
      </div>
      <div class="request-params">
        <template v-if="activeNode.paramType !== 'BODY'">
          <p class="title">请求参数</p>
          <el-table
            :data="ParamsData"
            :border="true"
            empty-text="没有发现Params"
          >
            <el-table-column prop="keyName" label="参数名" width="180" />
            <el-table-column prop="type" label="类型" width="180" />
            <el-table-column label="必填" width="180">
              <template #default="{ row, column, $index }">
                {{ row.required ? "是" : "否" }}
              </template>
            </el-table-column>
            >
            <el-table-column prop="name" label="说明" />
          </el-table>
        </template>
        <template v-else>
          <p class="subheading">Body参数</p>
          <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="数据结构" name="first">
              <div style="width: 100%; overflow: auto">
                <DataStructureTable
                  :data="activeNode.paramList"
                  :type="activeNode.type"
                ></DataStructureTable>
              </div>
            </el-tab-pane>
            <el-tab-pane label="示例值" name="second">
              <SampleArea
                :data="activeNode.paramList"
                :type="activeNode.type"
              ></SampleArea>
            </el-tab-pane>
          </el-tabs>
        </template>
        <template v-if="activeNode.responseList">
          <p class="subheading">返回响应</p>
          <el-tabs v-model="resActive" type="card">
            <el-tab-pane label="响应参数" name="first">
              <DataStructureTable
                :data="activeNode.responseList"
                :hide-length="true"
                :hide-require="true"
              ></DataStructureTable>
            </el-tab-pane>
            <el-tab-pane label="响应示例" name="second">
              <SampleArea
                :data="activeNode.responseList"
                :type="activeNode.type"
              ></SampleArea>
            </el-tab-pane>
          </el-tabs>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { activeStore } from "@/store/active";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import RequestTag from "./components/request-tag/index.vue";
import DataStructure from "./components/dataStructure/index.vue";
import DataStructureTable from "./components/dataStructureTable/index.vue";
import ResStructure from "./components/resStructure/index.vue";
import SampleArea from "./components/sampleArea/index.vue";
import { devStatus } from "@/enum/common";
const props = defineProps({
  tabData: {
    type: Object,
    default: {},
  },
});
const store = activeStore();
const activeNode = computed(() => {
  return props.tabData;
});

const activeName = ref("first");
const resActive = ref("first");
const selectBodyParams = (data: any[]) => {
  return data.filter((e: any) => {
    return e.paramType == "PARAM";
  });
};
const ParamsData = activeNode.value.paramList;
const statusColorList = ["#fa8c16", "#1890ff", "#4caf50"];
</script>

<style lang="scss" scoped>
.document {
  height: calc(100% - 39px);
  width: 100%;
  padding: 20px;
  overflow: auto;
  .document-content {
    //width: 96%;
  }
}

.title {
  font-size: 10px;
  line-height: 40px;
}

.subheading {
  font-size: 12px;
  line-height: 30px;
}

.header {
  height: 30px;
  margin-bottom: 20px;
  min-height: 30px;

  .title {
    font-size: 17px;
  }
}

.tag-url {
  display: flex;
  margin-bottom: 16px;
  align-items: center;
  min-height: 20px;

  .url-text {
    margin-left: 16px;
    font-size: 14px;
    letter-spacing: 0.08em;
  }
  .url-status {
    margin-left: 20px;
    font-size: 14px;
  }
}
.desc {
  margin-bottom: 20px;
}
.request-params {
  margin-bottom: 20px;
}
</style>
