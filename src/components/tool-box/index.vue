<template>
  <div class="tool-box" @click.stop ref="toolBox" v-if="show">
    <!--      <p class="title">工具箱</p>-->
    <div class="app-content">
      <div class="app-item">
        <div class="app-icon" @click="tool.clearCache()">
          <el-icon>
            <BrushFilled/>
          </el-icon>
        </div>
        <p class="app-text">清除缓存</p>
      </div>
      <div class="app-item">
        <div class="app-icon" @click="tool.goHome()">
          <el-icon>
            <HomeFilled/>
          </el-icon>
        </div>
        <p class="app-text">返回首页</p>
      </div>
      <div class="app-item">
        <div class="app-icon">
          <el-icon>
            <Tools/>
          </el-icon>
        </div>
        <p class="app-text">设置</p>
      </div>
      <div class="app-item">
        <div class="app-icon">
          <el-icon>
            <Opportunity/>
          </el-icon>
        </div>
        <p class="app-text">提示</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BrushFilled,
  HomeFilled,
  Opportunity,
  Tools
} from "@element-plus/icons-vue";
import {toolStore} from "@/store/tool";
import {createElementVNode, ref, watch} from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
const tool = toolStore();
</script>

<style lang="scss" scoped>
.tool-box {
  position: absolute;
  right: 0;
  top: 50px;
  height: calc(100% - 50px);
  //border-radius: 10px 0 0 10px;
  background-color: rgba($color: #000000, $alpha: 0.4);
  z-index: 99999;
}

.title {
  font-size: 18px;
  letter-spacing: 0.1em;
  text-align: center;
  line-height: 40px;
  user-select: none;
}

.app-content {
  //display: grid;
  //grid-template-columns: repeat(3, 100px);
  //justify-items: center;
  //grid-auto-rows: 90px;
  //height: 85%;
  //width: 100%;
  //margin-top: 20px;
  //overflow: auto;
  //overflow-x: hidden;
  // background-color: aqua;
  padding: 0 10px 0 10px;

  .app-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    margin-top: 20px;

    .app-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      width: 40px;
      border-radius: 6px;
      background-color: rgba($color: #ffffff, $alpha: 0.8);
      cursor: pointer;
      font-size: 22px;
      color: #6db978;

      &:hover {
        background-color: rgba($color: #ffffff, $alpha: 0.4);
      }
    }

    .app-text {
      line-height: 36px;
      font-size: 14px;
      color: #ffffff;
      user-select: none;
    }
  }

}
</style>
