import setting from "./setting"; //引入的是全局的logo以及标题配置

//路由鉴权认证
import router from "./router";  //导入路由表
import nprogress from 'nprogress' //导入进度条组件
import 'nprogress/nprogress.css' //引入进度条 样式
import userStore from "./store/modules/user";//利用仓库内的token 来进行判断
import pinia from "./store";
//如果像获取小仓库的数据 必须现有大仓库 但是在外部是没有大仓库的 同步代码是拿不到数据的
let useStore = userStore(pinia)

nprogress.configure({ showSpinner: false }) //取消 路由切换时的小球

//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
    //控制 项目标题
    document.title = `${setting.title}-${to.meta.title}`
    //访问路由之前会被调用
    nprogress.start()
    //获取token 先判断是不是登录
    let token = useStore.token
    let username = useStore.username
    if (token) {
        //登录成功
        if (to.path === '/login') {
            //登录成功 访问login 跳转到首页
            next({ path: '/' })
        } else {
            if (username) {
                //如果有用户数据就放行
                next()
            } else {
                //没有用户数据就去请求 然后放行
                try {
                    await useStore.userInfo()
                    //但是 如果是异步路由 信息可能收集到了 但是异步路由还没有加载完毕 所以出现空白效果
                    next({ ...to }) //等加载完毕后再跳转
                    // next()
                } catch (err) {
                    //token 过期或者失效 需要退出登录且清除相关数据 跳转到登录页
                    await useStore.loginOut()
                    next({ path: '/login', query: { redirect: to.path } })
                }
            }

        }
    } else {
        //登录失败
        if (to.path === '/login') {
            next();//如果登录失败 要访问login 可以进行访问
        } else {
            //由于 没有token 无法登录 需将想去但是没有去的地方带给login
            next({ path: '/login', query: { redirect: to.path } })
        }
    }
    next()
})

//全局后置守卫
router.afterEach((to: any, from: any) => {
    nprogress.done()
})

//进度条插件  nprogress