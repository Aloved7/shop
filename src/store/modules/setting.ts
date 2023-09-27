//这个仓库用来共享 面包屑自适应放大缩小的数据
import { defineStore } from 'pinia'

const useLayoutSettingStore = defineStore('SettingStore', {
    state: () => {
        return {
            fold: false,
            refsh:false, //控制组件的刷新效果
        }
    }
})

export default useLayoutSettingStore