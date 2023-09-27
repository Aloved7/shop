//创建路由实例
import { createRouter, createWebHistory } from "vue-router";
import { constantRoute } from "./router";

//创建路由表
let router = createRouter({
    //路由模式
    history: createWebHistory(),
    routes: constantRoute,
    //路由滚动行为
    scrollBehavior() {
        return {
            left: 0,
            top: 0
        }
    }
})

export default router;