import { defineStore } from "pinia";
import { deepCopy } from "@/utils/base/index";
import { SessionStorage } from "@/utils/webStore";
import { cloneDeep } from "lodash-es";

interface ActiveState {
  activeNode: any;
  previewNode: any;
  tabList: any;
}
const sessionStorage = new SessionStorage();
export const activeStore = defineStore("active", {
  state: (): ActiveState => {
    return {
      activeNode: {},
      previewNode: [], //优先将节点存入预览对象中
      tabList: [],
    };
  },
  getters: {
    openList: (state) => {
      return state.tabList.concat(state.previewNode);
    },
  },
  actions: {
    //添加tab
    addTab(treeNode: any) {
      const temp = cloneDeep(treeNode);
      const ifTab = this.tabList.findIndex((e: any) => {
        return e.id == treeNode.id;
      });
      if (ifTab === -1) {
        this.previewNode = [];
        this.tabList.push({
          id: treeNode.id,
          name: treeNode.name,
          leaf: treeNode.leaf,
        });
      }
    },
    //删除tab
    deleteTab(id: string) {
      const tabs = deepCopy(this.tabList);
      let flag = -1;
      tabs.forEach((tab: any, index: number) => {
        if (tab.id === id) {
          if (this.activeNode.id === id) {
            this.activeNode =
              tabs[index + 1] || tabs[index - 1] || this.previewNode[0] || {};
          }
          if (index < this.tabList.length) {
            flag = index;
          }
        }
      });
      if (flag !== -1) {
        this.tabList.splice(flag, 1);
      } else {
        if (this.activeNode.id === this.previewNode[0].id) {
          this.activeNode = tabs.length ? tabs[tabs.length - 1] : {};
        }
        this.previewNode = [];
      }
    },
    //当前活动tab
    activeTab(id: string) {
      const tabs = this.openList;
      tabs.forEach((tab: any, index: number) => {
        if (tab.id === id) {
          this.activeNode = tab;
        }
      });
    },
    //预览tab
    previewTab(data: any) {
      // console.log(data);
      const temp = JSON.parse(JSON.stringify(data));
      //单击判断是否在tablist中
      const flag = this.openList.findIndex((e: any) => {
        return e.url === temp.url;
      });
      if (flag === -1) {
        this.previewNode = [];
        temp.pre = true;
        this.previewNode.push(temp);
      }
    }
  },
});
