import request from '@/utils/request' // 引入你封装好的 axios 实例

export function executeSql(data) {
    return request({
        url: '/execute/executeSql', // 对应后端的 RequestMapping + PostMapping
        method: 'post',
        data // { sql: "..." }
    })
}