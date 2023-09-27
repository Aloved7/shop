//封装读取本地存储的方法
export const SET_ITEM = (token: string) => {
    localStorage.setItem('TOKEN', token)
}

export const GET_ITEM = () => {
    return localStorage.getItem('TOKEN')
}

export const REMVE_ITEM = () => {
    return localStorage.removeItem('TOKEN')
}