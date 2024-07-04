<template>
  <div class="operation">
    <div class="url-message">
      <el-input v-model="url" disabled>
        <template #prepend>
          <RequestIcon :type="activeNode.mappingType"></RequestIcon>
        </template>
      </el-input>
      <el-button
        type="primary"
        class="send-btn"
        auto-insert-space
        @click="send"
        :loading="sending"
        >发送</el-button
      >
      <el-button plain class="save-btn" auto-insert-space @click="save">
        保存
      </el-button>
      <el-dropdown>
        <el-button class="other-tool-btn">
          <el-icon>
            <ArrowDown />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu class="other-tool-menu">
            <el-dropdown-item @click="clearCache">清除缓存</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="split-content" ref="splitArea">
      <Split v-model="splitVertical" mode="vertical">
        <template #top>
          <div style="height: 100%; overflow: hidden">
            <el-tabs v-model="activeName" class="setting-tabs" :key="refresh">
              <el-tab-pane label="Params" name="first">
                <EditTable :data="requestForm.paramData"></EditTable>
              </el-tab-pane>
              <el-tab-pane label="Body" name="second">
                <el-radio-group v-model="radio1" class="select-radio">
                  <el-radio label="1" size="large">json</el-radio>
                  <el-radio label="2" size="large">form-data</el-radio>
                </el-radio-group>
                <div style="height: 98%">
                  <!--json-->
                  <div v-show="radio1 === '1'" style="height: 100%">
                    <EditCode
                      :text="requestForm.bodyParams"
                      lang="json"
                      @changeText="(e) => changeText(e, 'body')"
                    >
                    </EditCode>
                  </div>
                  <!--formData-->
                  <EditFormTable
                    v-show="radio1 === '2'"
                    :data="requestForm.formData"
                  ></EditFormTable>
                </div>
              </el-tab-pane>
              <el-tab-pane label="Headers" name="third">
                <EditTable :data="requestForm.headerData"></EditTable>
              </el-tab-pane>
              <el-tab-pane label="后置操作" name="fifth">
                <EditCode
                  :text="requestForm.afterJs"
                  lang="javascript"
                  @changeText="(e) => changeText(e, 'afterJs')"
                >
                </EditCode>
              </el-tab-pane>
            </el-tabs>
          </div>
        </template>
        <template #bottom>
          <div style="height: 100%; overflow: hidden">
            <ResponseBox
              :data="responseData"
              :flod="isFold"
              :sending="sending"
              @flod="foldFn"
              @cancel="toCancel"
              @changeRequestType="changeRequestType"
            ></ResponseBox>
          </div>
        </template>
      </Split>
    </div>
  </div>
</template>

<script setup lang="ts">
import { activeStore } from "@/store/active";
import { useStore } from "@/store";
import { toolStore } from "@/store/tool";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
  watch
} from 'vue';
import Split from "@/components/split/split.vue";
import ResponseBox from "./components/response-box/index.vue";
import EditTable from "@/components/edit-table/index.vue";
import EditFormTable from "@/components/edit-form-table/index.vue";
import EditCode from "@/components/edit-code/index.vue";
import request from "@/utils/request/axios";
import { envStore } from "@/store/user";
import { isJSON } from "@/utils/base";
import { ElMessage } from "element-plus";
import "element-plus/theme-chalk/el-message.css";
import { list2obj } from "@/utils/base";
import { cloneDeep, debounce } from "lodash-es";
import { LocalStorage } from "@/utils/webStore";
import RequestIcon from "./components/requestIcon.vue";
import { ElLoading } from "element-plus";
import { throttle } from "lodash";
import axios from "axios";
import { ArrowDown } from "@element-plus/icons-vue";

const props = defineProps({
  active: {
    type: String,
    default: "first",
  },
  tabData: {
    type: Object,
    default: {},
  },
});
// 窗口改变大小计算收起框百分比
const foldPercent = ref(0.0);
const splitArea = ref<any>(null);
const resizeDebounce = debounce(() => {
  nextTick(() => {
    foldPercent.value =
      Math.round((1 - 40 / splitArea.value.offsetHeight) * 100) / 100;
  });
}, 500);
addEventListener("resize", resizeDebounce);
onUnmounted(() => {
  //移除监听事件
  removeEventListener("resize", resizeDebounce);
});
// 每次切换tab初始化高度
watch(
  () => props.active,
  (val) => {
    if (val === "second") {
      resizeDebounce();
    }
  }
);
const splitVertical = ref(0.6);
watch(splitVertical, (val) => {
  if (val > 0.85) {
    splitVertical.value = foldPercent.value;
    isFold.value = true;
  } else {
    isFold.value = false;
  }
});
const cancel = ref(null);
let CancelToken = axios.CancelToken;
let source = CancelToken.source();
//取消请求
const toCancel = () => {
  source.cancel();
  CancelToken = axios.CancelToken;
  source = CancelToken.source();
};
const sending = ref(false);
const radio1 = ref("1");
const localStorage = new LocalStorage();
const envPattern = /\{\{[^\}]+\}\}/;
const statusStore = activeStore();
const activeNode=computed(()=>{
  return props.tabData
})
const baseStore = useStore();
const tool = toolStore();
const zh = envStore();
let responseData = ref({});
let url = baseStore.baseUrl + activeNode.value.url;
const activeName = ref("first");
let isFold = ref(false);
let keyboardLock = true;
const foldFn = (e: boolean) => {
  splitVertical.value = isFold.value ? 0.6 : 0.92;
  isFold.value = e;
};
const saveEvent = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key == "s" && props.active === "second") {
    if (keyboardLock && props.tabData.id === activeNode.value.url) {
      keyboardLock = false;
      save();
      setTimeout(() => {
        keyboardLock = true;
      }, 800);
    }
  }
};
onMounted(() => {
  addEventListener("keydown", saveEvent);
});
onUnmounted(() => {
  removeEventListener("keydown", saveEvent);
});
const changeText = (text: string, key: string) => {
  switch (key) {
    case "body":
      requestForm.value.bodyParams = text;
      break;
    case "afterJs":
      requestForm.value.afterJs = text;
      break;
  }
};
//匹配元素返回下标
const getIndex = (list: any[], key: string): number => {
  if (list) {
    return list.findIndex((e) => {
      return e == key;
    });
  }
  return -1;
};
const requestForm = ref<RequestForm>({
  paramData: [],
  bodyParams: "",
  formData: [],
  headerData: [],
  afterJs: "",
});
let msgdir: any[] = [];
let msg: any[] = [];
let index = -1;
let copyData: any[] = [];
const refresh = ref(0);
//初始化缓存
const initSave = () => {
  msgdir = localStorage.get("MSGDIR");
  msg = localStorage.get("MSG");
  index = getIndex(msgdir, activeNode.value.url);
  copyData = cloneDeep(activeNode.value.paramList);
  if (activeNode.value.paramType === "BODY") {
    activeName.value = "second";
  }
  if (activeNode.value.paramType === "FORMDATA") {
    activeName.value = "second";
    radio1.value = "2";
  }
  if (index !== -1) {
    const msgItem = msg[index];
    requestForm.value.paramData = msgItem.params;
    requestForm.value.bodyParams = msgItem.body;
    requestForm.value.headerData = msgItem.headers;
    requestForm.value.afterJs = msgItem.afterJs;
  } else {
    if (activeNode.value.paramType === "BODY") {
      if (activeNode.value.type === "Object") {
        requestForm.value.bodyParams = JSON.stringify(
          list2obj(copyData, "keyName", "defaultValue")
        );
      } else {
        requestForm.value.bodyParams = JSON.stringify([
          copyData[0].items.paramList
            ? list2obj(copyData[0].items.paramList, "keyName", "defaultValue")
            : copyData[0].items.defaultValue,
        ]);
      }
      requestForm.value.paramData = [];
      requestForm.value.formData = [];
    } else if (activeNode.value.paramType === "FORMDATA") {
      requestForm.value.formData = copyData;
      requestForm.value.formData.forEach((e: any) => {
        e.formList = [];
        e.formMode = "0";
      });
      requestForm.value.bodyParams = "";
      requestForm.value.paramData = [];
    } else {
      requestForm.value.paramData = copyData;
      requestForm.value.bodyParams = "";
      requestForm.value.formData = [];
    }
    //headers
    const { header }: any = baseStore;
    requestForm.value.headerData = [];
    for (let key in header) {
      requestForm.value.headerData.push({
        keyName: key,
        defaultValue: header[key],
      });
    }
    //后置操作
    requestForm.value.afterJs = activeNode.value.afterJs;
  }
  refresh.value++;
};
//过滤空value
const noValue = (data: any[]) => {
  return data.filter((e: any) => {
    return e.keyName != false;
  });
};
const requestType = ref("json");
const changeRequestType = (e: string) => {
  requestType.value = e;
};
initSave();
const save = throttle(
  () => {
    if (index === -1) {
      msgdir.push(activeNode.value.url);
      localStorage.set("MSGDIR", msgdir);
      msg.push({
        params: noValue(requestForm.value.paramData),
        body: requestForm.value.bodyParams,
        headers: noValue(requestForm.value.headerData),
        afterJs: requestForm.value.afterJs,
      });
    } else {
      msg[index] = {
        params: noValue(requestForm.value.paramData),
        body: requestForm.value.bodyParams,
        headers: noValue(requestForm.value.headerData),
        afterJs: requestForm.value.afterJs,
      };
    }
    localStorage.set("MSG", msg);
    index = getIndex(msgdir, activeNode.value.url);
    ElMessage({
      message: "保存成功",
      type: "success",
      duration: 500,
    });
  },
  1500,
  {
    trailing: false,
  }
);

const send = () => {
  //发送请求之前先判断是否有缓存有缓存则优先使用缓存数据
  const config: any = {};
  config.headers = {};
  config.baseURL = baseStore.contextPath;
  config.url = activeNode.value.url;
  config.method = activeNode.value.mappingType;
  //整合请求Params
  config.params = list2obj(
    requestForm.value.paramData,
    "keyName",
    "defaultValue"
  );

  //整合请求Header
  const envHeader = list2obj(
    requestForm.value.headerData,
    "keyName",
    "defaultValue"
  );
  for (let key in envHeader) {
    if (envPattern.test(envHeader[key])) {
      const evnstr = envHeader[key].match(envPattern)[0].slice(2, -2);
      config.headers[key] = zh.environment[evnstr]
        ? zh.environment[evnstr]
        : "";
    } else {
      config.headers[key] = envHeader[key];
    }
  }
  if (requestType.value === "file") {
    config.responseType = "blob";
  }

  //整合请求Body
  if (radio1.value === "1") {
    if (isJSON(requestForm.value.bodyParams)) {
      config.data = JSON.parse(requestForm.value.bodyParams);
    } else if (requestForm.value.bodyParams === "") {
      config.data = "";
    } else {
      ElMessage({
        message: "Body格式有误",
        type: "warning",
      });
      return;
    }
  } else {
    const formdata = new FormData();
    const form = noValue(requestForm.value.formData);
    form.forEach((formItem: any) => {
      if (formItem.formMode === "0") {
        formdata.append(formItem["keyName"], formItem["defaultValue"]);
      } else {
        formItem.formList.forEach((file: File) => {
          formdata.append(formItem["keyName"], file, file.name);
        });
      }
    });
    config.data = formdata;
    config.headers["Content-Type"] = "application/x-www-form-urlencoded";
  }
  sending.value = true;
  config.cancelToken = source.token;
  request(config)
    .then((res: any) => {
      sending.value = false;
      responseData.value = res;
      //执行字符串中的代码
      try {
        eval(requestForm.value.afterJs);
      } catch (error) {
        ElMessage({
          message: "后置操作有误",
          type: "error",
        });
      }
    })
    .catch((err) => {
      responseData.value = err;
      sending.value = false;
    });
};

//清除缓存
const clearCache = () => {
  const msgdir = localStorage.get("MSGDIR");
  const msg = localStorage.get("MSG");
  let index = -1;
  for (let i = 0; i < msgdir.length; i++) {
    if (msgdir[i] === activeStore().activeNode.url) {
      index = i;
      break;
    }
  }
  if (index !== -1) {
    msgdir.splice(index, 1);
    msg.splice(index, 1);
    localStorage.set("MSGDIR", msgdir);
    localStorage.set("MSG", msg);
    initSave();
    ElMessage({
      message: "清除成功",
      type: "success",
      duration: 800,
    });
  } else {
    ElMessage({
      message: "暂无缓存",
      type: "success",
      duration: 800,
    });
  }
};
</script>

<style lang="scss" scoped>
.operation {
  height: calc(100% - 39px);
  width: 100%;

  .split-content {
    height: calc(100% - 84px);
  }
}

.setting-tabs > {
  :deep(.el-tabs__content) {
    min-height: 300px;
    //margin-top: 15px;
    padding: 12px;
  }

  :deep(.el-tabs__header) {
    .el-tabs__item {
      width: 100px;
      text-align: center;
    }
  }
}

.setting-tabs {
  padding: 0 20px;
  height: 99%;

  :deep(.CodeMirror-scroll) {
    min-height: 200px;
  }

  :deep(.el-tabs__content) {
    height: calc(100% - #{50px});
  }
}

.select-radio {
  :deep(.el-radio) {
    height: 0;
    margin-right: 20px;
  }

  :deep(.is-checked) {
    .el-radio__input.is-checked .el-radio__inner {
      border: none;
      background-color: #bfbfbf;
    }

    .el-radio__label {
      color: #606266;
    }

    .el-radio__inner::after {
      height: 8px;
      width: 8px;
      background-color: #39b44b;
    }
  }
}

.url-message > {
  :deep(.el-input) {
    .el-input__inner {
      color: #5d5d61;
      -webkit-text-fill-color: #5d5d61;
      cursor: pointer;
      height: 40px;
      font-size: 15px;
    }
  }

  :deep(.is-disabled) {
    cursor: pointer;
  }

  :deep(.el-dropdown) {
    .el-button-group {
      display: flex;

      .el-button {
        margin: 0;
      }
    }
  }
}

.url-message {
  display: flex;
  padding: 20px;
  border-bottom: 2px solid #e4e7ed;

  .send-btn {
    width: 80px;
    height: 40px;
    background-color: #39b44b;
    border: none;
    margin-left: 50px;
    font-size: 16px;

    &:hover {
      background-color: #aedfb5;
    }
  }

  .save-btn {
    width: 100px;
    height: 40px;
    margin-left: 30px;
    font-size: 16px;
    color: #39b44b;
    border: 1px solid #39b44b;
    border-right: 0;
    border-radius: 4px 0 0 4px;

    &:hover {
      color: rgba(#39b44b, 0.5);
      border-color: rgba(#39b44b, 0.5);
    }
  }

  .other-tool-btn {
    width: 20px;
    height: 40px;
    margin: 0;
    border-radius: 0 5px 5px 0;
    color: #39b44b;
    border: 1px solid #39b44b;
    padding: 0;

    &:hover {
      color: rgba(#39b44b, 0.5);
      border-color: rgba(#39b44b, 0.5);
    }
  }
}

.other-tool-menu {
  color: #1b1b1c;

  :deep(.el-dropdown-menu__item) {
    &:hover {
      color: #1b1b1c;
      background-color: #eaf4eb;
    }
  }
}
</style>
