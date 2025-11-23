import axios from 'axios'
import { ElMessage } from 'element-plus' // 示例使用 element-plus
import router from '@/router'

// 创建 axios 实例
const service = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // 基础URL
    timeout: 15000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }

        // 可以在这里添加加载动画
        return config
    },
    error => {
        // 对请求错误做些什么
        console.error('请求错误：', error)
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        const res = response.data

        // 根据后端返回的状态码进行处理
        if (res.code !== 200) {
            ElMessage.error(res.message || '请求失败')

            // 401: 未授权，跳转登录页
            if (res.code === 401) {
                localStorage.removeItem('token')
                router.push('/login')
            }

            return Promise.reject(new Error(res.message || '请求失败'))
        }

        return res
    },
    error => {
        // 对响应错误做点什么
        console.error('响应错误：', error)

        let message = '网络错误'
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    message = '请求参数错误'
                    break
                case 401:
                    message = '未授权，请重新登录'
                    localStorage.removeItem('token')
                    router.push('/login')
                    break
                case 403:
                    message = '拒绝访问'
                    break
                case 404:
                    message = '请求地址不存在'
                    break
                case 500:
                    message = '服务器内部错误'
                    break
                default:
                    message = error.response.data.message || '请求失败'
            }
        }

        ElMessage.error(message)
        return Promise.reject(error)
    }
)

export default service
