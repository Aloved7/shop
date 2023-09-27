import request from "@/utils/request";
import { TrademarkResponseData, Trademark } from './type'

//品牌管理接口地址
enum API {
    TARDEMARKL_RUL = '/admin/product/baseTrademark/',
    //添加品牌
    ADDTRADEMARK_RUL = '/admin/product/baseTrademark/save',
    //修改已有品牌 必须带上id
    UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
    //删除已有品牌
    DELETE_URL = '/admin/product/baseTrademark/remove/'
}

//获取已有品牌的请求方法
// page  获取第几页的数据
//limit 请求多少条
export const reqHasTrademark = (page: number, limit: number) => {
    return request<any, TrademarkResponseData>({
        url: API.TARDEMARKL_RUL + `${page}/${limit}`,
        method: 'get'
    })
}

//添加和删除 由id进行判断    数据是每个品牌对象
export const reqAddOrUpdateTrademark = (data: Trademark) => {
    if (data.id) {
        //修改已有品牌
        return request<any>({
            url: API.UPDATETRADEMARK_URL,
            method: 'put',
            data
        })
    } else {
        //新增品牌
        return request<any>({
            url: API.ADDTRADEMARK_RUL,
            method: 'post',
            data
        })
    }
}

//删除某一个已有品牌数据
export const reqDeleteTrademark = (id: number) => {
    return request.delete<any, any>(API.DELETE_URL + id)
}
// export const reqDeletedTrademark = (id: number) => {
//     return request.delete<any>(API.DELETE_URL + id)
// }