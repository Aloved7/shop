import { createApp } from 'vue'
import App from '@/App.vue'
//引入仓库
import pinia from './store'

//引入暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'

//引入全局样式
import './style/index.less'

//注册所有图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


//引入自定义插件对象 自动注册全局组件 引入功能组件下的index
import gloalComponent from '@/components'

//路由表
import router from './router'

//导入svg配置文件
import 'virtual:svg-icons-register'


const app = createApp(App)
//使用 自动注册全局组件
app.use(gloalComponent)
app.use(router)
//引入路由鉴权
import './permisstion'
//注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(pinia)

//引入 权限按钮文件
import { hasButton } from './directive/has'
hasButton(app)

// 忽略特定警告
app.config.warnHandler = () => { };
app.mount('#app')



