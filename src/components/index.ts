import SvgIconVue from "./SvgIcon/SvgIcon.vue";
import Pagation from './pagation/Pagation.vue';
import Cactgory from './Cactgory/index.vue';

//引入elm的所有icon 全部注册成全局组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

//定义一个容器
const allComponent: { [key: string]: any } = { SvgIconVue, Pagation, Cactgory }

export default {
    install(app: any) {
        //使用 Object.keys方法 对容器进行遍历
        Object.keys(allComponent).forEach(key => {
            app.component(key, allComponent[key])
        })
        //将elm 提供的  所有icon注册成全局组件
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
        }
    }
}