import request from "@/utils/request";
import { CategoryResponseData, AttrResponseData, Attr } from './type'


///admin/product/getCategory3/{category2Id}
enum API {
    C1_URL = '/admin/product/getCategory1',
    C2_URL = '/admin/product/getCategory2/',
    C3_URL = '/admin/product/getCategory3/',
    ATTR_URL = '/admin/product/attrInfoList/',
    //添加或者 修改已有属性的接口
    ADDORUPDATEARR_URL = '/admin/product/saveAttrInfo',
    //属性删除接口
    DELETE_URL = '/admin/product/deleteAttr/'
}

//一级分类的接口
export const reqC1 = () => {
    return request<any, CategoryResponseData>({
        url: API.C1_URL,
        method: 'get'
    })
}

//获取二级分类接口
export const reqC2 = (category1Id: number | string) => {
    return request.get<any, CategoryResponseData>(API.C2_URL + category1Id)
}

//获取三级分类
// export const reqC3 = (category2Id: number | string) => {
//     return request<any, CategoryResponseData>({
//         url: API.C3_URL + category2Id,
//         method: 'get'
//     })
// }
export const reqC3 = (category2Id: number | string) => {
    return request.get<any, CategoryResponseData>(API.C3_URL + category2Id)
}

//获取对应分类下的属性和属性值接口
export const reqArr = (categoryId1: number | string, categoryId2: number | string, categoryId3: number | string) => {
    return request<any, AttrResponseData>({
        url: API.ATTR_URL + `${categoryId1}/${categoryId2}/${categoryId3}`,
        method: 'get'
    })
}


//新增或者修改属性的接口
export const reqAddOrUpdate = (data: Attr) => {
    return request<any, any>({
        method: 'post',
        url: API.ADDORUPDATEARR_URL,
        data
    })
}

//删除已有属性的接口
export const reqRemoveArr = (attrId: number) => {
    return request<any, any>({
        method: 'delete',
        url: API.DELETE_URL + attrId,

    })

}