//属性接口分类 数据定义
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

//定义分类对象 每一级分类的对象 有id 和详细信息
export interface CategoryObj {
    id: number | string
    name: string
    category1Id?: number
    category2Id?: number
}

//相应的分类接口返回的数据类型
export interface CategoryResponseData extends ResponseData {
    data: CategoryObj[]
}



//属性和属性值对应 ts

//属性值对象的ts类型   每一个三级列表带来得数据  -- 在属性值里  res.data.属性对象
export interface ArrValue {
    id?: number
    valueName: string
    attrId?: number
    flag?: boolean  //控制编辑模式和查看模式的切换
}
//存储每一个属性值得ts类型  每个商品
export type AttrValueList = ArrValue[]


//属性对象得ts类型  每一个三级分类选项带来得数据 属性名称  res.data
export interface Attr {
    id?: number
    attrName: string
    categoryId: number | string
    categoryLevel: number
    attrValueList: AttrValueList
}

//存储每一个属性对象得数组得ts类型 每个分类对应得数据
export type AttrList = Attr[]


//接口返回得数据类型  res
export interface AttrResponseData extends ResponseData {
    data: Attr[]
}