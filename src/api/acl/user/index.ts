import request from "@/utils/request";
import { User, UserReponseData, AllRoleResponseData, SetRoleData } from './type'

//枚举地址
enum API {
    //获取已有全部账号信息
    ALLUSER_URL = '/admin/acl/user/',
    //添加和更新用户
    ADDUSER_URL = '/admin/acl/user/save',
    UPDATEUSER_URL = '/admin/acl/user/update',
    //获取全部职位和当前职位
    ALLROLE_URL = '/admin/acl/user/toAssign/',
    //给已有用户分配角色
    SETROLE_URL = '/admin/acl/user/doAssignRole',
    //删除某一个账号
    DELETEUSER_URL = '/admin/acl/user/remove/',
    //批量删除
    DELETEALLUSER_URL = '/admin/acl/user/batchRemove'
}

//获取已有账号信息方法 以及搜索接口
export const getUserInfo = (page: number, limit: number, username: string) => {
    return request<any, UserReponseData>({
        method: 'get',
        url: API.ALLUSER_URL + `${page}/${limit}/?username=${username}`
    })
    //直接添加的写法适用于 参数路由 查询字符串 还得？变量=值
}

//添加和更新用户的接口
export const reqAddOrUpdateUser = (data: User) => {
    if (data.id) {
        //更新
        return request<any, any>({
            method: 'put',
            url: API.UPDATEUSER_URL,
            data
        })
    } else {
        //添加
        return request<any, any>({
            method: 'post',
            url: API.ADDUSER_URL,
            data
        })
    }
}

//获取全部职位 以及用户当前职位
export const reqAllRole = (userId: number | string) => {
    return request<any, AllRoleResponseData>({
        method: 'get',
        url: API.ALLROLE_URL + userId
    })
}

//已有用户分配角色
export const reqSetUserRole = (data: SetRoleData) => {
    return request({
        method: 'post',
        url: API.SETROLE_URL,
        data
    })
}

//删除某一个账号信息
export const reqRemoveUser = (userId: number) => {
    return request({
        method: 'delete',
        url: API.DELETEUSER_URL + userId
    })
}

//批量删除接口
export const selectUser = (idList: number[]) => {
    return request.delete(API.DELETEALLUSER_URL, { data: idList })
}