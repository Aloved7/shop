export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

//定义sku 的类型
//平台属性的定义
export interface Attr {
    id?: number | string
    attrId: string | number //平台属性id
    valueId: string | number //属性值id
    valueName?: string
}
//销售属性的定义
export interface Sale {
    id?: number | string
    saleAttrName?: string
    saleAttrId: string | number //属性值id
    saleAttrValueUd: string | number
}
//定义sku类型
export interface SkuData {
    category3Id?: string | number
    spuid?: string | number
    tmId?: string | number //品牌id
    skuName?: string //sku的名字
    price?: string | number //sku的价格
    weight?: string | number //sku的重量
    skuDesc?: string //sku的描述
    skuDefaultImg?: string //默认图片
    skuAttrValueList?: Attr[],  //平台属性的收集
    skuSaleAttrValueList?: Sale[] //销售属性
    isSale?: number | string  //后来的补的 控制上架与下架
    id?: number | string
}

//获取展示数据返回接口的类型
export interface SkuResponseData extends ResponseData {
    data: {
        records: SkuData[]
        total: number
        size: number
        current: number
        optimizeCountSql: boolean
        hitCount: boolean
        countId: null
        maxLimit: null
        searchCount: boolean
        pages: number
    }

}

//定义获取SKu商品详情返回数据的类型
export interface SkuInfoData extends ResponseData {
    data: SkuData
}