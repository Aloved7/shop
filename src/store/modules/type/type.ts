//导入路由对象的js类型
import { RouteRecordRaw } from "vue-router"
import { CategoryObj } from "@/api/product/attr/type"

//定义小仓库的数据类型
export interface UserState {
    token: string | null
    menuRoutes: RouteRecordRaw[]
    avatar: string
    username: string
    buttons: string[]
}

//定义分类仓库state 对象的ts类型
export interface CategoryStore {
    c1Id: string | number,
    c2Id: string | number
    c3Id: string | number
    c1Arr: CategoryObj[]
    c2Arr: CategoryObj[]
    c3Arr: CategoryObj[]
}