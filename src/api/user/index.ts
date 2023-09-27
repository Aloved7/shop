//管理 用户相关的接口
import request from "@/utils/request";
//引入类型
import { loginFormData, loginResponseData, userInfoResponseData } from './type'


enum API {
    LOGIN_URL = '/admin/acl/index/login',
    USERINFO_URL = '/admin/acl/index/info',
    LOGIN_OUT = '/admin/acl/index/logout'
}


//返回请求方法
export const Login = (data: loginFormData) => {
    //<限制函数调用返回值>
    return request<any, loginResponseData>({
        url: API.LOGIN_URL,
        method: 'post',
        data
    })
}

//获取用户信息接口
export const getUserInfo = () => {
    return request<any, userInfoResponseData>({
        url: API.USERINFO_URL,
        method: 'get'
    })
}

//退出登录
export const logOut = () => {
    return request<any, any>({
        url: API.LOGIN_OUT,
        method: 'post'
    })
}