import request from "@/utils/request";
import { PermissionResponseData, MenuParams } from './type'

enum API {
    //获取全部菜单的地址
    ALLPERMISSION_URL = '/admin/acl/permission',
    //给某一级菜单新增
    ADDMENU_URL = '/admin/acl/permission/save',
    //更新已有菜单
    UPDATE_URL = '/admin/acl/permission/update',
    //删除已有菜单
    DELETE_URL = '/admin/acl/permission/remove/'
}

//获取全部菜单接口
export const reqAllPermission = () => {
    return request<any, PermissionResponseData>({
        method: 'get',
        url: API.ALLPERMISSION_URL
    })
}

//添加或者更新
export const reqAddOrUpdateMenu = (data: MenuParams) => {
    if (data.id) {
        return request.put<any>(API.UPDATE_URL, data)
    } else {
        return request.post<any>(API.ADDMENU_URL, data)
    }
}

//删除菜单接口
export const reqDeleteMenu = (id: number) => request.delete<any,any>(API.DELETE_URL + id)