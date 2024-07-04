<template>
  <div class="responed-box">
    <div class="header">
      <span class="header-text">返回响应</span>
      <div class="tool-area">
        <div class="obj-input">
          <el-input
            v-model="imgObj"
            size="small"
            v-if="toolMode === '2' && !isflod"
            :spellcheck="false"
          />
          <el-input
            v-model="customFileName"
            size="small"
            placeholder="自定义文件名"
            v-if="toolMode === '3' && !isflod"
            :spellcheck="false"
          />
        </div>
        <div class="tool-select">
          <el-select
            v-model="toolMode"
            size="small"
            v-if="!isflod"
            @change="changeBox"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <el-icon
          style="cursor: pointer"
          :class="{ 'arrow-down': isflod }"
          @click="fold"
        >
          <ArrowDown />
        </el-icon>
      </div>
    </div>
    <div class="content">
      <template v-if="!responsedText || sending || needSend">
        <div class="no-data">
          <img
            src="@/assets/images/rocket.png"
            alt=""
            :class="{ 'no-data-img': true, 'img-move': sending }"
          />
          <div :class="{ line: sending }"></div>
          <div :class="{ line: sending, line1: sending }"></div>
          <div :class="{ line: sending, line2: sending }"></div>
          <el-button type="info" v-if="sending" @click="cancelReq"
            >取消请求</el-button
          >
          <span v-else>点击"发送"按钮获取返回结果</span>
        </div>
      </template>
      <template v-else>
        <!--        json-->
        <EditCode
          :text="responsedText"
          lang="json"
          :readOnly="true"
          v-if="toolMode === '1'"
        ></EditCode>
        <!--        base64预览-->
        <div class="img-area" v-if="toolMode === '2'">
          <div class="no-img" v-if="!imgUrl">
            <img src="@/assets/images/no_img.png" alt="填充图片" />
            <p>图片悄悄溜走啦</p>
          </div>

          <img :src="imgUrl" alt="路径错误" v-else />
        </div>
        <!--        文件流预览-->
        <div class="img-area" v-if="toolMode === '3'">
          <div v-if="fileUrl.url && fileUrl.type">
            <div class="preview-area" v-if="fileUrl.type === 'pdf'">
              <img
                src="@/assets/images/file_preview.png"
                @click="previewFile(fileUrl.url)"
              />
              <p>{{ fileUrl.name }}</p>
            </div>
            <div
              class="preview-area"
              v-else-if="imgSupportType.includes(fileUrl.type)"
            >
              <img
                :src="fileUrl.url"
                alt=""
                @click="previewFile(fileUrl.url)"
                style="width: 350px"
              />
            </div>

            <div class="preview-area" v-else>
              <img
                src="@/assets/images/file_download.png"
                @click="download(fileUrl.url, fileUrl.name)"
              />
              <p>{{ fileUrl.name }}</p>
            </div>
          </div>
          <div class="no-img" v-else>
            <img src="@/assets/images/file-unknown.png" alt="" />
            <p>{{ errorLog }}</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import EditCode from "@/components/edit-code/index.vue";
import { ArrowDown } from "@element-plus/icons-vue";
import { ref, watch } from "vue";
import { download } from "@/utils/base";

const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
  flod: {
    type: Boolean,
    default: false,
  },
  sending: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["flod", "cancel", "changeRequestType"]);
let responsedText = ref("");
const toolMode = ref("1");
const imgObj = ref("data.image");
const customFileName = ref("");
const errorLog = ref("文件消失不见啦");
const imgUrl = ref("");
const fileUrl = ref({ url: "", type: "", name: "" });
const needSend = ref(true); // 需要发送请求
const options = [
  {
    value: "1",
    label: "JSON",
  },
  {
    value: "2",
    label: "IMG",
  },
  {
    value: "3",
    label: "FILE",
  },
];
watch(
  () => props.data,
  (response) => {
    needSend.value = false;
    fileUrl.value = { url: "", type: "", name: "" };
    imgUrl.value = "";
    if (response.status === 200) {
      responsedText.value = JSON.stringify(response.data);
      if (toolMode.value === "2") {
        showImg();
      }
      if (toolMode.value === "3") {
        showFile(response);
      }
    } else {
      responsedText.value = response.message;
    }
  }
);
watch(
  () => props.flod,
  (val) => {
    isflod.value = val;
  }
);
let isflod = ref(false);
const fold = () => {
  isflod.value = !isflod.value;
  emit("flod", isflod.value);
};
const cancelReq = () => {
  emit("cancel");
};
const showImg = () => {
  try {
    const imgCode = eval("JSON.parse(responsedText.value)." + imgObj.value);
    imgUrl.value = imgCode ? "data:image/jpg;base64," + imgCode : "";
  } catch {}
};
const imgSupportType = ["png", "jpg", "jpeg", "webp"];
const showFile = (response: any) => {
  let fileName = "";
  // 判断有无自定义文件名
  if (!customFileName.value) {
    const contentDisposition = response.headers["content-disposition"];
    if (!contentDisposition) {
      errorLog.value = '错误原因:响应头中无"content-disposition"';
      return;
    }
    let splitTag = "";
    //判断content-disposition中是否带有filename=或filename*=
    contentDisposition.indexOf("filename=") !== -1 && (splitTag = "filename=");
    contentDisposition.indexOf("filename*=") !== -1 &&
      (splitTag = "filename*=utf-8''");
    fileName = response.headers["content-disposition"]
      ?.split(";")[1]
      ?.split(splitTag)[1];
  } else {
    fileName = customFileName.value;
  }
  const compositionList = fileName.split(".");
  //文件名只有一个扩展名的情况
  if (compositionList.length < 2) {
    fileName = "preview." + fileName;
  }
  // 获取文件扩展名
  let fileType = compositionList[compositionList.length - 1];
  fileUrl.value.type = fileType;
  fileUrl.value.name = decodeURI(fileName);
  if (imgSupportType.includes(fileType)) {
    const blob = new Blob([response.data], { type: "image/" + fileType });
    fileUrl.value.url = window.URL.createObjectURL(blob);
  } else {
    const blob = new Blob([response.data], {
      type: "application/" + fileType,
    });
    fileUrl.value.url = window.URL.createObjectURL(blob);
  }
};
const changeBox = (val: string) => {
  let requestFile = "json";
  if (val === "2" && responsedText.value) {
    showImg();
  }
  if (val === "3") {
    needSend.value = true;
    requestFile = "file";
  }
  emit("changeRequestType", requestFile);
};
const previewFile = (url: string) => {
  open(url);
};
</script>

<style scoped lang="scss">
.header {
  height: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f2f4f7;
  padding: 20px 15px;

  .arrow-down {
    transform: rotate(180deg);
  }

  .header-text {
    font-weight: bold;
    font-size: 18px;
    color: #5b5b5d;
  }
}

.content {
  height: calc(100% - #{24px});

  .no-data {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    color: #5b5b5d;
    margin-top: 20px;

    .line {
      position: absolute;
      width: 120px;
      height: 1.5px;
      background-color: #9b9b9b;
      top: 20px;
      left: calc(50% - #{120px});
      /* 开始时隐藏线条 */
      //opacity: 0;
      animation: forlines 1s ease 0s infinite;
    }

    .line1 {
      left: calc(50% - #{30px});
      animation: forlines 0.6s ease 0s infinite;
    }

    .line2 {
      left: calc(50% + #{60px});
      animation: forlines 0.7s ease 0s infinite;
    }

    /* 给线条设置上下移动和透明度变换的动画 */
    @keyframes forlines {
      0% {
        /* 将它旋转45度后，此时坐标轴同样会旋转45度旋转后将他上下移动 */
        transform: rotate(-45deg) translateX(150px);
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        transform: rotate(-45deg) translateX(-150px);
        opacity: 0;
      }
    }

    .no-data-img {
      height: 100px;
      width: 100px;
      user-select: none;
    }
    .img-move {
      animation: move 0.7s linear 0s infinite alternate;
    }

    @keyframes move {
      from {
        transform: translate(-20px, -20px);
      }

      to {
        transform: translate(20px, 20px);
      }
    }
  }
}
.tool-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 250px;
  .tool-select {
    width: 100px;
  }
  .obj-input {
    width: 100px;
  }
}
.responed-box {
  border-top: 3px solid #dfdfdf;
  height: calc(100% - 18px);
  padding: 0 10px;
}
.img-area {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: auto;
  .no-img {
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 100px;
    }
  }
  .preview-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 150px;
      cursor: pointer;
    }
    p {
      text-align: center;
    }
  }
}
</style>
