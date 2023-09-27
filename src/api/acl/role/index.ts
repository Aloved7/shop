import request from "@/utils/request";
import { RoleResponseData, RoleData, MenuResponseData } from './type'

enum API {
    //获取全部职位
    ALLROLE_URL = '/admin/acl/role/',
    //新增和更新
    ADDROLE_URL = '/admin/acl/role/save',
    UPDATEROLE_URL = '/admin/acl/role/update',
    //分配权限地址 获取全部菜单 根据职位id获取
    ALLPERMISSTION_URL = '/admin/acl/permission/toAssign/',
    //给相应的职位分配权限
    SETPERMISSTION_URL = '/admin/acl/permission/doAssign/?',
    //删除已有职位
    REMOVEROLE_URL = '/admin/acl/role/remove/'
}


//获取全部职位相关数据接口
export const reqAllRoleList = (page: number, limit: number, roleName: string) => {
    return request<any, RoleResponseData>({
        method: 'get',
        url: API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`
    })
}

//添加和更新接口
export const reqAddOrUpdateRole = (data: RoleData) => {
    if (data.id) {
        //更新
        return request<any, any>({
            method: 'put',
            url: API.UPDATEROLE_URL,
            data
        })
    } else {
        //添加
        return request<any, any>({
            method: 'post',
            url: API.ADDROLE_URL,
            data
        })
    }

}

//获取菜单与按钮权限接口
export const reqAllMenuList = (id: number) => {
    return request<any, MenuResponseData>({
        method: 'get',
        url: API.ALLPERMISSTION_URL + id
    })
}

//给相应职位添加属性
// export const reqSetPermission = (roleId: number, permissionId: number[]) => {
//     return request.post(API.SETPERMISSTION_URL + `roleId=${roleId}&permissionId=${permissionId}`);
// }

export const reqSetPermission = (roleId: number, permissionId: number[]) => {
    return request({
        method: 'post',
        url: API.SETPERMISSTION_URL + `roleId=${roleId}&permissionId=${permissionId}`
    })
}

//删除职位
export const reqRemoveRole = (roleId: number) => {
    return request<any, any>({
        method: 'delete',
        url: API.REMOVEROLE_URL + roleId
    })
}