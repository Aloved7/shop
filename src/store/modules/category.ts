//商品分类 全局组件存储
import { defineStore } from 'pinia'
//导入请求方法
import { reqC1, reqC2, reqC3 } from "@/api/product/attr";

import { CategoryResponseData } from '@/api/product/attr/type'
import { CategoryStore } from './type/type'

let useCategoryStore = defineStore('Category', {
    state: (): CategoryStore => {
        return {
            c1Arr: [], //一级分类数据
            c1Id: '', //一级分类的id
            //存储一级分类下的 二级分类数据
            c2Arr: [],
            c2Id: '',
            c3Arr: [],
            c3Id: ''
        }
    },
    actions: {
        //获取一级分类
        async getC1() {
            let res: CategoryResponseData = await reqC1()
            // console.log(res);
            if (res.code === 200) {
                this.c1Arr = res.data
            }
        },
        //获取二级数据
        async getC2() {
            let res: CategoryResponseData = await reqC2(this.c1Id)
            // console.log(res);
            if (res.code === 200) {
                this.c2Arr = res.data
            }

        },
        //获取三类分级数据
        async getC3() {
            let { data }: CategoryResponseData = await reqC3(this.c2Id)  //在定义函数的时候只给了number 所以必须会去更改为联合类型
            // console.log(data);
            this.c3Arr = data
        }
    },
    getters: {

    }
})

export default useCategoryStore