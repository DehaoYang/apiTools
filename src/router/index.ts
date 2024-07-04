import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  createWebHashHistory,
} from "vue-router";
import Layout from "@/layouts/index.vue";
import Api from "@/views/api/index.vue";
import Home from "@/views/home/index.vue";
const history = createWebHashHistory();
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
    component: Layout,
    children: [
      {
        path: "/home",
        name: "home",
        component: Home,
      },
      {
        path: "/api",
        name: "api",
        component: Api,
      },
      // {
      //   path: "/var",
      //   name: "var",
      //   component: () => import("@/views/var/index.vue"),
      // }
    ],
  },
  {
    path: "/error",
    name: "error",
    component: () => import("@/views/error/index.vue"),
  },
];
const router = createRouter({
  history,
  routes,
});
export default router;
