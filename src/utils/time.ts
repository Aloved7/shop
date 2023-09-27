//获取时间函数
export const getTime = () => {
    let h = new Date().getHours();
    let msg = ''
    if (h <= 9) {
        msg = '早上'
    } else if (h <= 12) {
        msg = '中午'
    } else if (h <= 18) {
        msg = '下午'
    } else {
        msg = '晚上'
    }
    return msg
}