//判断是否为json格式
import { useStore } from "@/store";

export const isJSON = (str: any) => {
  if (typeof str == "string") {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == "object" && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
};
//清除特殊字符（/\u00A0/）
export const clearSpace = (str: string) => {
  return str.replace(/\u00A0/g, "");
};

//深拷贝
export const deepCopy = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};

//构造示例值树（双递归，入口为list2obj）
const obj2list = (obj: any, key: string, value: string): any[] => {
  if (obj.paramList) {
    return [list2obj(obj.paramList, key, value)];
  } else if (obj.items) {
    return [obj2list(obj.items, key, value)];
  } else {
    return [obj[value] || (obj.type === "Number" ? 0 : "")];
  }
};
export const list2obj = (list: any[], key: string, value: string) => {
  const res = {};
  list.forEach((e: any) => {
    if (e.type === "Object" && e.paramList) {
      if (e[key]) res[e[key]] = list2obj(e.paramList, key, value);
    } else if (e.type === "Array" && e.items) {
      if (e[key]) res[e[key]] = obj2list(e.items, key, value);
    } else {
      if (e[key]) {
        res[e[key]] = e[value] || (e.type === "Number" ? 0 : "");
      }
    }
  });
  return res;
};
//复制文字到剪切板
export const copyText = (str: string) => {
  return navigator.clipboard.writeText(str);
};

//广度优先遍历
export const treeForeach = (
  tree: any,
  key: string,
  callback: (arg: any) => void
) => {
  let node,
    list = [...tree];
  while ((node = list.shift())) {
    callback(node);
    node[key] && list.push(...node[key]);
  }
};

//判断参数是否为object
export const isObject = (obj: any) => {
  return Object.prototype.toString.call(obj) === "[object Object]";
};
export const download = (url: string, fileName: string) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = decodeURI(fileName);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a); // 下载完移除元素
};
// 获取tab的数据
export const getTabData = (treeNodes: any, id: string) => {
  let needNode = null;
  treeNodes.forEach((item: any) => {
    if (item.id === id) {
      needNode = item;
    }
    if (item.methodList) {
      const res = getTabData(item.methodList, id);
      if (res) {
        needNode = res;
      }
    }
  });
  return needNode;
};
// 将参数按照数据内的order进行排序
export const tabDataSort = (dataList: any) => {
  dataList.sort((a: any, b: any) => {
    return a.order - b.order;
  });
  dataList.forEach((data: any) => {
    if (data.paramList) {
      tabDataSort(data.paramList || []);
    }
    if (data.item) {
      if (data.item.paramList) {
        tabDataSort(data.item.paramList || []);
      }
    }
  });
  return dataList;
};
// 获取树下所有叶子节点
export const getNodeLeaf = (dataList: any) => {
  let leafList: any = [];
  dataList.forEach((node: any) => {
    if (node.leaf) {
      leafList.push({
        id: node.id,
        name: node.name,
        mappingType: node.mappingType,
        url: node.url,
        group: node.group,
        status: node.status,
      });
    }
    if (node.methodList) {
      leafList = leafList.concat(getNodeLeaf(node.methodList));
    }
  });
  return leafList;
};
