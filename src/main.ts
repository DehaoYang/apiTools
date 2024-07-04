import { createApp } from 'vue'
import '@/styles/index.scss';
import App from './App.vue'
import router from "./router";
import { createPinia } from 'pinia';
import { clickDown, copyText } from "@/utils/directive/index"
import { LocalStorage } from "@/utils/webStore/index";
import 'virtual:svg-icons-register'

const localStorage = new LocalStorage()
const pinia = createPinia();
//初始化缓存
if (!localStorage.get('EXIST')) {
    localStorage.set('EXIST', true)
    localStorage.set('MSGDIR',[])
    localStorage.set('MSG',[])
}
createApp(App).use(router).use(pinia).directive('clickDown', clickDown).directive('copyText', copyText).mount('#app')
