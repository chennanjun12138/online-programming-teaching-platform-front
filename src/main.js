// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/assets/css/global.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import "element-plus/dist/index.css"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "bytemd/dist/index.css"

const app = createApp(App)
window.$message=ElMessage;

app.use(createPinia())
app.use(router)
app.use(ElementPlus, { size: 'default',locale: zhCn });

app.mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}