<template>
  <el-table :data="tableData" :border="true" style="width: 100%" class="edittable" @cell-mouse-enter="mouseHover"
            @cell-mouse-leave="mouseHover">
    <el-table-column label="KEY">
      <template #default="{row, column, $index}">
        <div class="key-cell">
          <el-input v-model="row.keyName" placeholder="Key" @input="addItem($index)"/>
          <el-select v-model="row.formMode" class="mode-select" placeholder="Select">
            <el-option
                v-for="item in formModeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="VALUE">
      <template #default="{row, column, $index}">
        <el-upload
            v-if="row.formMode==='1'"
            ref="uploadRef"
            class="upload-demo"
            multiple
            :show-file-list="false"
            action=""
            :auto-upload="false"
            :on-change="(e:any)=>b(e,$index)"
        >
          <template #trigger>
            <el-button type="info" class="file-btn">
              <span v-if="row.formList.length!==1">{{
                  row.formList.length ? row.formList.length : ''
                }}select files</span>
              <span v-if="row.formList.length===1">{{ row.formList[0].name }}</span>
              <el-icon style="margin-left: 10px" v-if="row.formList.length" @click.stop="clearFile($index)">
                <Close/>
              </el-icon>
            </el-button>
          </template>
        </el-upload>
        <el-input v-else v-model="row.defaultValue" placeholder="Value" @input="addItem($index)"/>
      </template>
    </el-table-column>
    <el-table-column label="DESCRIPTION">
      <template #default="{row, column, $index}">
        <div class="last-box">
          <el-input v-model="row.name" placeholder="Description" @input="addItem($index)"/>
          <el-icon class="del-icon" :style="{display: row.del&&$index+1!==tableData.length?'block':'none'}"
                   @click="delRow($index)">
            <Delete/>
          </el-icon>
        </div>

      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import {Delete, Close} from "@element-plus/icons-vue"
import {ref} from "vue";
import type {UploadInstance} from 'element-plus'

const props = defineProps({
  data: {
    type: Array,
    default: []
  }
})
const tableData: any[] = props.data
tableData.push({
  keyName: '',
  defaultValue: '',
  name: '',
  formMode: '0',
  formList: []
})
const formModeOption = [
  {
    value: '0',
    label: 'Text',
  },
  {
    value: '1',
    label: 'File',
  }]
const tableData1 = ref([])
const mouseHover = (row: any) => {
  row.del = !row.del
}
const delRow = (index: number) => {
  tableData.splice(index, 1)
}
const addItem = (index: number) => {
  if (index + 1 == tableData.length)
    tableData.push(
        {
          key: '',
          value: '',
          description: '',
          del: false,
          formMode: '0',
          formList: [],
        },
    )
}
const uploadRef = ref<UploadInstance>()
const b = (UploadRequestOptions: any, index: number): any => {
  tableData[index]['formList'].push(UploadRequestOptions.raw)
}
const clearFile = (index: number) => {
  tableData[index].formList = []
}
</script>

<style lang="scss" scoped>
.edittable {
  :deep(.el-input) {
    .el-input__wrapper {
      box-shadow: none;
      background-color: inherit;
      padding: 0 6px;
    }

    .is-focus {
      box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
    }
  }

  :deep(.el-table__cell) {
    padding: 4px 0;
  }
}

.last-box {
  display: flex;
  align-items: center;

  .del-icon {
    margin-left: 20px;
    font-size: 20px;
    cursor: pointer;
  }
}

.key-cell {
  display: flex;

  :deep(.el-select) {
    .el-input__wrapper {
      box-shadow: none;
      background-color: inherit;
      padding: 0 6px;
    }

    .is-focus {
      border-radius: 3px;
      box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset !important;
    }
  }

  .mode-select {
    width: 80px;
  }
}

.file-btn {
  height: 16px;
  min-width: 100px;
}
</style>