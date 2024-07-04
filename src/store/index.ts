import { defineStore } from "pinia";
import { treeForeach } from "@/utils/base/index";
import { cloneDeep, debounce } from "lodash-es";
import { nanoid } from "nanoid";
import { LocalStorage } from "@/utils/webStore";

const localStorage = new LocalStorage();
const createMenuTree = (
  treedata: any[],
  uri: string = "",
  group = ""
): any[] => {
  const statusList = localStorage.get("apiStatus") || [];
  treedata.sort((a, b) => {
    return a.order - b.order;
  });
  treedata.forEach((node: any) => {
    node.id = nanoid();
    if (node.methodList) {
      createMenuTree(
        node.methodList,
        uri + (node.uri || ""),
        group + "/" + (node.name || "")
      );
      try {
        node.count = node.methodList
          .map((item: any) => item.count)
          .reduce((pre: number, cur: number) => pre + cur);
      } catch (err) {
        console.log(node);
        node.count = 0;
      }
    } else {
      node.url = uri + node.uri;
      node.count = 1;
      node.status =
        statusList.find((item: any) => item.url === node.url)?.status || "1";
      node.leaf = true;
      node.group = group;
    }
  });
  return treedata;
};
// 改变接口开发状态
const changeLeafStatus = (
  treedata: any[],
  url: string,
  status: string
): any[] => {
  treedata.forEach((node: any) => {
    if (node.methodList) {
      changeLeafStatus(node.methodList, url, status);
    } else {
      if (node.url === url) {
        node.status = status;
      }
    }
  });
  return treedata;
};
export const useStore = defineStore("main", {
  state: () => {
    return {
      scheme: "", //协议
      url: "", //域名
      port: "", //端口
      contextPath: "", //环境路径
      active: "", //开发环境
      treeNodes: [], //树节点以及树节点所带信息
      header: {},
      title: "",
      systemName: "",
      downloadUrl: "", //文档下载地址
      instructions: "", //提示信息
    };
  },
  getters: {
    baseUrl: (state) =>
      `${state.scheme}://${state.url}${state.port ? ":" + state.port : ""}${
        state.contextPath
      }`,
  },
  actions: {
    //初始化数据
    initData() {
      const data = window.init;
      this.scheme = data.scheme;
      // this.url = data.url
      this.url = window.location.host;
      // this.port = data.port
      this.port = "";
      this.contextPath = data.contextPath;
      this.active = data.active;
      this.header = data.enviroment.header;
      this.title = data.title;
      this.systemName = data.systemName;
      this.downloadUrl = data?.extraParams?.downloadUrl || "";
      this.instructions = data?.extraParams?.instructions || "";
      const treeNodes: any[] = [];
      const tempData = cloneDeep(data.apis);
      // @ts-ignore
      this.treeNodes = createMenuTree(tempData);
    },
    // 改变开发状态
    changeDevStatus(url: string, status: string) {
      const statusList = localStorage.get("apiStatus") || [];
      let needAdd = true;
      for (let i = 0; i < statusList.length; i++) {
        const item = statusList[i];
        if (item.url === url) {
          item.status = status;
          needAdd = false;
          break;
        }
      }
      if (needAdd) {
        statusList.push({
          url,
          status,
        });
      }
      localStorage.set("apiStatus", statusList);
      // @ts-ignore
      this.treeNodes = changeLeafStatus(this.treeNodes, url, status);
    },
  },
});
