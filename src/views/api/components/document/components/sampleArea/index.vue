<template>
  <div class="sample-area">
    <EditCode :text="bodyParams" lang="json" :readOnly="true"></EditCode>
    <div class="operation">
      <div class="copy-bar">
        <el-icon>
          <DocumentCopy />
        </el-icon>
        <span @click="copy(true)">OBJ</span>
        <span @click="copy(false)">JSON</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { list2obj, copyText, deepCopy } from "@/utils/base/index";
import useClipboard from "vue-clipboard3";
import { DocumentCopy } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import "element-plus/theme-chalk/el-message.css";

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
const { toClipboard } = useClipboard();

const copyData = deepCopy(props.data);
let bodyParams = ref("{}");
if (props.type === "Object") {
  bodyParams.value = JSON.stringify(
    list2obj(copyData, "keyName", "defaultValue")
  );
} else {
  bodyParams.value = JSON.stringify([
    copyData[0].items.paramList
      ? list2obj(copyData[0].items.paramList, "keyName", "defaultValue")
      : copyData[0].items.defaultValue,
  ]);
}

const copy = (flag: boolean) => {
  const text = flag
    ? bodyParams.value
        .replace(/""/g, "$")
        .replace(/"/g, "")
        .replace(/\$/g, '""')
    : bodyParams.value;
  toClipboard(text).then(() => {
    ElMessage({
      message: `复制为${flag ? "OBJ" : "JSON"}`,
      type: "success",
      duration: 800,
    });
  });
};
</script>

<style lang="scss" scoped>
.sample-area {
  position: relative;
  min-height: 200px;
  border: 1px solid #f2f2f2;
  padding: 10px 10px 10px 10px;
}

.operation {
  position: absolute;
  right: 16px;
  top: 16px;

  .copy-bar {
    display: flex;
    align-items: center;
    width: 120px;
    overflow: hidden;
    cursor: pointer;
  }

  span {
    margin-left: 15px;
    font-size: 12px;
    font-weight: bolder;

    &:hover {
      color: #aedfb5;
    }
  }
}
</style>
