//自定义指令必须使用 app.derective 所以 这个文件必须再入口引入 然后调用方法 传入app
//先引入大仓库
import pinia from "@/store";
///用户小仓库
import userStore from "@/store/modules/user";
//获取用户仓库
let user = userStore(pinia)

export const hasButton = (app: any) => {

    //全局自定义指令 实现 按钮权限
    app.directive('has', {
        //代表全局自定义指令的组件 或者dom 挂载完毕后执行一次 调用的时候可以获取值
        mounted(el: any, options: any) {
            if (!user.buttons.includes(options.value)) {
                //如果没有 获取父节点 并删除这个子节点
                el.parentNode.removeChild(el)
            }

        }
    })
}