import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 1. 引入 Element Plus
import ElementPlus from 'element-plus'
// 2. 引入 Element Plus 的所有 CSS 样式
import 'element-plus/dist/index.css'
// (可选) 引入中文语言包，否则默认是英文
import zhCn from 'element-plus/es/locale/lang/zh-cn'


const app = createApp(App)

app.use(createPinia())
app.use(router)

// 3. 使用 Element Plus 插件
app.use(ElementPlus, {
  locale: zhCn, // 配置语言为中文
})


app.mount('#app')
