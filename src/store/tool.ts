import { defineStore } from "pinia";
import { LocalStorage } from "@/utils/webStore/index";
import { ElMessage } from "element-plus";
import { activeStore } from "./active";

// const statusStore = activeStore();
const localStorage = new LocalStorage();

export const toolStore = defineStore("tool", {
    state: () => {
        return {
            reflesh: true,
        };
    },
    getters: {},
    actions: {
        //初始化数据
        clearCache() {
            this.goHome()
            localStorage.set('EXIST', true)
            localStorage.set('MSGDIR', [])
            localStorage.set('MSG', [])
            ElMessage({
                message: "清除成功",
                type: "success",
                duration: 800,
            });
        },
        goHome() {
            activeStore().tabList = [];
            activeStore().previewNode = [];
        },
    },
});
