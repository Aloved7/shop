//定义 已有商品的接口数据

//公共接口
export interface ResponseData {
    code: number //状态码
    message: string //返回的信息
    ok: string
}

//已有品牌数据类型
export interface Trademark {
    id?: number //可能是新增 可能是没有
    tmName: string
    logoUrl: string
}

//包含全部品牌的数据类型 是返回数据中的records的数据类型 
export type Records = Trademark[];

//获取已有品牌的数据类型 是res对象的数据类型定义
export interface TrademarkResponseData extends ResponseData {
    data: {
        records: Records,
        total: number //总数
        size: number //一页有几个数据
        current: number //当前第几页
        searchCount: boolean
        pages: number // 一共多少页
    }

}