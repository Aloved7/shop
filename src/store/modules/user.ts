//创建用户小仓库
import { defineStore } from 'pinia'
import { Login, getUserInfo, logOut } from '@/api/user'
import { loginFormData, loginResponseData, userInfoResponseData } from '@/api/user/type'
//导入路由
import router from '@/router'
import { constantRoute, asyncRoute, anyRoute } from '@/router/router'
//小仓库类型定义
import { UserState } from './type/type'
//引入操作本地存储的工具
import { SET_ITEM, GET_ITEM, REMVE_ITEM } from '@/utils/token'
//引入深拷贝  由于是js文件 所以忽略ts检查
//@ts-ignore 
import cloneDeep from 'lodash/cloneDeep'


//过滤异步路由组件
function filterAsyncRoute(asyncRoute: any, routes: any) {
    return asyncRoute.filter((item: any) => {
        if (routes.includes(item.name)) {
            if (item.children && item.children > 0) {
                //由于这里是直接赋值 也就是说 children 会保留上一次用户的权限信息 
                //导致下一个用户获取的信息不准确 使用深拷贝解决
                item.children = filterAsyncRoute(item.children, routes)
            }
            return true
        }
    })
}


let userStore = defineStore('User', {
    state: (): UserState => {
        return {
            token: GET_ITEM(),
            menuRoutes: constantRoute, //存储生成菜单的路由数组
            username: '',
            avatar: '',
            buttons: []  //存储当前用户包含的按钮权限
        }
    },
    actions: {
        //用户登录方法
        async userLogin(data: loginFormData) {
            // console.log(data);
            let res: loginResponseData = await Login(data)
            // console.log(res);
            if (res.code === 200) {
                //做类型断言 如果不做断言会报错 说不能将undefined 复制给token 即token是字符串
                this.token = (res.data as string)
                // localStorage.setItem('token', (res.data.token as string))
                SET_ITEM((res.data as string))
                return 'ok'
            } else {
                return Promise.reject(new Error(res.data))
            }

        },
        //获取用户信息
        async userInfo() {
            //获取用户信息存储到仓库中
            let res: userInfoResponseData = await getUserInfo()
            // console.log(res);
            if (res.code === 200) {
                this.username = res.data.name
                this.avatar = res.data.avatar
                this.buttons = res.data.buttons
                //返回一个成功标识 用于路由守卫只获取一次数据
                //会获取用户信息成功 筛选权限路由
                let userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute), res.data.routes)
                //表单展示的路由菜单
                this.menuRoutes = [anyRoute, ...constantRoute, ...userAsyncRoute,];
                //动态添加到路由表 将过滤后的权限路由和任意路由进行注册
                [...userAsyncRoute, anyRoute].forEach((item: any) => {
                    router.addRoute(item)
                })
                return 'ok'
            } else {
                return Promise.reject(new Error(res.message))
            }
        },
        //退出登录
        async loginOut() {
            let res: any = await logOut()
            // console.log(res);
            if (res.code === 200) {
                //退出成功
                //清除用户数据
                this.token = ''
                this.username = ''
                this.avatar = ''
                REMVE_ITEM()
                return 'ok'//返回退出成功标识
            } else {
                return Promise.reject(new Error(res.message))
            }


        }
    },
    getters: {

    }
})

export default userStore