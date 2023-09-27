import request from "@/utils/request";
import { SkuInfoDat, SkuData, HasSouResponseData, AllTardeMark, SpuHasImg, SaleAttrResponseData, spuData, HasSaleAttrResponseData } from './type'

enum API {
    //获取已有的spu数据
    HASSPU_URL = '/admin/product/',
    //获取全部已有品牌的数据
    ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
    //获取某一个品牌下的售卖商品的图片数据
    IMAGE_URL = '/admin/product/spuImageList/',
    //获取某一个SPU下面全部的售卖属性接口
    SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
    //获取整个项目全部的销售属性[颜色 版本 尺码]
    ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
    //增加一个新的接口
    ADDSPU_URL = '/admin/product/saveSpuInfo',
    //修改已有接口
    UPDATE_RUL = '/admin/product/updateSpuInfo',
    //添加sku
    ADDSKU_URL = '/admin/product/saveSkuInfo',
    //查看某一个已有spu下的sku
    SKUINFO_URL = '/admin/product/findBySpuId/',
    //删除已有SPU
    REMOVE_URL = '/admin/product/deleteSpu/'
}

//获取某一个三级分类下的已有spu分类
export const reqHasSpu = (page: number, limit: number, category3Id: string | number) => {
    return request<any, HasSouResponseData>({
        method: 'get',
        url: API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`
    })
}

//获取全部已有品牌的接口
export const reqAllTrademark = () => {
    return request<any, AllTardeMark>({
        method: 'get',
        url: API.ALLTRADEMARK_URL
    })
}

//获取某一个已有spu下的图片数据
export const reqSpuImageList = (squId: number) => {
    return request<any, SpuHasImg>({
        method: 'get',
        url: API.IMAGE_URL + squId
    })
}

//获取某一个spu 全部的销售属性
export const reqSpuHasSaleAttr = (spuId: number) => {
    return request<any, SaleAttrResponseData>({
        method: 'get',
        url: API.SPUHASSALEATTR_URL + spuId
    })
}

//获取全部的销售属性
export const reqAllSaleAttr = () => {
    return request<any, HasSaleAttrResponseData>({
        method: 'get',
        url: API.ALLSALEATTR_URL
    })
}

//添加新的spu
//更新已有spu接口  data就是已有或者新增的spu对象
export const reqAddOrUpdateSpu = (data: spuData) => {
    if (data.id) {
        //修改
        return request<any, any>({
            method: 'post',
            url: API.UPDATE_RUL,
            data
        })
    } else {
        //添加
        return request<any, any>({
            method: 'post',
            url: API.ADDSPU_URL,
            data
        })
    }
}

//添加sku请求方法
export const reqAddSku = (data: SkuData) => {
    return request<any, any>({
        method: 'post',
        url: API.ADDSKU_URL,
        data
    })
}

//查看某一个spu下的sku
export const reqSkuList = (spuId: string | number) => {
    return request<any, SkuInfoDat>({
        method: 'get',
        url: API.SKUINFO_URL + spuId
    })
}

//删除已有spu
export const reqRemoveSpu = (spuId: string | number) => {
    return request<any, any>({
        method: 'delete',
        url: API.REMOVE_URL + spuId
    })
}