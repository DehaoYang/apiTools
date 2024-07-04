<template>
    <el-table :data="tableData" :border="true" style="width: 100%" class="edittable" @cell-mouse-enter="mouseHover"
        @cell-mouse-leave="mouseHover">
        <el-table-column label="KEY">
            <template #default="{row, column, $index}">
                <el-input v-model="row.keyName" placeholder="Key" @input="addItem($index)" />
            </template>
        </el-table-column>
        <el-table-column label="VALUE">
            <template #default="{row, column, $index}">
                <el-input v-model="row.defaultValue" placeholder="Value" @input="addItem($index)" />
            </template>
        </el-table-column>
        <el-table-column label="DESCRIPTION">
            <template #default="{row, column, $index}">
                <div class="last-box">
                    <el-input v-model="row.name" placeholder="Description" @input="addItem($index)" />
                    <el-icon class="del-icon" :style="{display: row.del&&$index+1!==tableData.length?'block':'none'}"
                        @click="delRow($index)">
                        <Delete />
                    </el-icon>
                </div>

            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import { Delete } from "@element-plus/icons-vue"
import { ref } from "vue";
const props = defineProps({
    data: {
        type: Array,
        default: []
    }
})
const tableData = props.data
tableData.push({
    keyName: '',
    defaultValue: '',
    name: '',
})
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
                keyName: '',
                value: '',
                description: '',
                del: false
            },
        )
}
</script>

<style lang="scss" scoped>
.edittable {
    :deep(.el-input) {
        .el-input__wrapper {
            box-shadow: none;
            background-color: inherit;
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
</style>