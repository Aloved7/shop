//定义获取菜单数据接口
export interface ResponseData {
    code: number
    message: string
    ok: boolean
}

//定义全部菜单
export interface Permisstion {
    "id"?: number,
    "createTime": string,
    "updateTime": string,
    "pid": number,
    "name": string,
    "code": null,
    "toCode": null,
    "type": number,
    "status": null,
    "level": number,
    "children"?: PermisstionList,
    "select": boolean
}
export type PermisstionList = Permisstion[];
//菜单返回的数据类型
export interface PermissionResponseData extends ResponseData {
    data: PermisstionList[]
}

//添加与修改菜单携带的数据
export interface MenuParams {
    id?: number
    code: string  //权限
    level: number
    name: string //菜单名字
    pid: number //对应已有菜单的id

}