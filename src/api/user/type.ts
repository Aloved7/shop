//定义用户相关数据类型

//用户登录接口
export interface loginFormData {
    username: string,
    password: string
}

//服务器返回数据公共类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}


//登录接口返回数据
export interface loginResponseData extends ResponseData {
    data: string
}

//用户信息返回数据类型
export interface userInfoResponseData extends ResponseData {
    data: {
        routes: string[],
        buttons: string[],
        roles: string[]
        name: string,
        avatar: string
    }
}
