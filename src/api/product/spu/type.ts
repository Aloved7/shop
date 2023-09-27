//spu 数据类型约束


//定义服务器返回数据类型
export interface ResponseDate {
    code: number
    message: string
    ok: string
}

//已有spu数据类型定义  同时也是 修改或者添加的类型
export interface spuData {
    id?: number | string
    spuName: string
    description: string
    category3Id: string | number
    tmId: number | string  //每个品牌的id
    spuSaleAttrList: null | SaleAttr[] //每个品牌的销售属性
    spuImageList: null | SpuImg[]  //已有spu照片的数据
}

//返回数据res 内的data中的records数据类型
export type Records = spuData[]

//定义返回res中data的数据类型
export interface HasSouResponseData extends ResponseDate {
    data: {
        records: Records
        total: number //总条数
        size: number //每页取多少数据
        current: number // 当前页码
        pages: number //多少页
        searchCount: boolean
    }
}

//所有品牌数据的类型
export interface Trademark {
    id: number
    tmName: string
    logoUrl: string
}

//品牌接口返回的数据
export interface AllTardeMark extends ResponseDate {
    data: Trademark[]
}


//商品图片的类型
export interface SpuImg {
    id?: number
    imgName?: string
    imgUrl?: string
    createTime?: string
    updateTime?: string
    spuId?: number | string
    name?: string
    url?: string

}

//图片接口返回的数据类型
export interface SpuHasImg extends ResponseDate {
    data: SpuImg[]
}


//已有的spu下的销售属性 spuSaleAttrValueList
export interface SaleAttrValue {
    id?: number
    createTime?: null
    updateTime?: null
    spuId?: string | number
    baseSaleAttrId: number | string
    saleAttrValueName: string
    saleAttrName?: string
    isChecked?: null
}

//存储已有销售属性的类型
export type spuSaleAttrValueList = SaleAttrValue[]


//销售属性对象的ts类型
export interface SaleAttr {
    id?: number
    createTime?: null
    updateTime?: null
    spuId?: string | number
    baseSaleAttrId: number | string
    saleAttrValueName?: string
    saleAttrName: string //对应的属性名字
    spuSaleAttrValueList: spuSaleAttrValueList
    flag?: boolean
    saleAttrValue?: string
}

//销售属性接口返回的数据类型
export interface SaleAttrResponseData extends ResponseDate {
    data: SaleAttr[]
}

//全部销售属性返回类型
export interface HasSale {
    id: number
    name: string
}

//全部销售属性接口返回的数据类型
export interface HasSaleAttrResponseData extends ResponseDate {
    data: HasSale[]
}


//平台属性的定义
export interface Attr {
    attrId: string | number //平台属性id
    valueId: string | number //属性值id
}
//销售属性的定义
export interface Sale {
    saleAttrId: string | number //属性值id
    saleAttrValueUd: string | number
}



//定义sku类型
export interface SkuData {
    category3Id: string | number
    spuid: string | number
    tmId: string | number //品牌id
    skuName: string //sku的名字
    price: string | number //sku的价格
    weight: string | number //sku的重量
    skuDesc: string //sku的描述
    skuDefaultImg: string //默认图片
    skuAttrValueList?: Attr[],  //平台属性的收集
    skuSaleAttrValueList?: Sale[] //销售属性
}

//某一个spu下sku的接口类型
export interface SkuInfoDat extends ResponseDate{
    data:SkuData[]
}