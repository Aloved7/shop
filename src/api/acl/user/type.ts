//用户管理接口的类型定义
export interface ResponseData {
    code: number
    message: string
    ok: boolean
}

//一个账号信息的ts类型
export interface User {
    id?: number
    createTime?: string
    updateTime?: string
    username: string
    roleName?: string
    password: string
    phone?: null
    name?: string
}

//data中的records 
export type Records = User[]

//获取已有全部账号信息返回类型
export interface UserReponseData extends ResponseData {
    data: {
        records: Records
        size: number //每次请求多少条
        total: number //总条数
        current: number //第几页
        pages: number //一共多少页
    }
}

//每个职位的ts类型
export interface RoleData {
    id?: number | string
    createTime?: string
    roleName: string  //角色名称
    remark?: null
}

//全部职位列表类型
export type AllRole = RoleData[]
//接口返回数据类型
export interface AllRoleResponseData extends ResponseData {
    data: {
        assignRoles: AllRole
        allRolesList: AllRole
    }
}

//给用户分配角色接口携带参数 类型
export interface SetRoleData {
    userId: number | string
    roleIdList: number[]
}