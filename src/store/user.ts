import { defineStore } from "pinia";
import { LocalStorage } from "@/utils/webStore";

interface EnvState {
  environment: any;
  developer: any;
}
const localStorage = new LocalStorage();
export const envStore = defineStore("env", {
  state: (): EnvState => {
    return {
      environment: localStorage.get("env") || {},
      developer: false,
    };
  },
  getters: {},
  actions: {
    //添加环境变量
    add(key: string, value: string) {
      this.environment[key] = value;
      localStorage.set("env", this.environment);
    },
    //改变开发者模式
    changeDeveloper() {
      this.developer = !this.developer;
    },
  },
});
