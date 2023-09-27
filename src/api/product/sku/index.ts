import request from "@/utils/request";
import { SkuResponseData, SkuInfoData } from './type'

enum API {
    //获取已有商品的数据 负责展示
    SKU_URL = '/admin/product/list/',
    //上架与下架
    SALE_URL = '/admin/product/onSale/',
    //下架的接口
    CANCALSALE_URL = '/admin/product/cancelSale/',
    //获取商品详情的接口
    SKUINFO_URL = '/admin/product/getSkuInfo/',
    //删除已有的上坪
    DELETE_URL = '/admin/product/deleteSku/'
}

//展示商品的接口
export const reqSkuList = (page: number, limit: number) => {
    return request<any, SkuResponseData>({
        method: 'get',
        url: API.SKU_URL + `${page}/${limit}`
    })
}

//已有商品上架方法
export const reqSaleSku = (skuId: number) => {
    return request<any, any>({
        method: 'get',
        url: API.SALE_URL + skuId
    })
}

//商家商品下架方法
export const reqCancalSaleSku = (skuId: number) => {
    return request<any, any>({
        method: 'get',
        url: API.CANCALSALE_URL + skuId

    })
}

//获取商品详情接口
export const reqSkuInfo = (skuId: number) => {
    return request<any, SkuInfoData>({
        method: 'get',
        url: API.SKUINFO_URL + skuId
    })
}

//删除接口
export const deleteSku = (skuId: number) => {
    return request<any, any>({
        method: 'delete',
        url: API.DELETE_URL + skuId
    })
}