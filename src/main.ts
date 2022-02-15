import { createApp } from 'vue';
import main from './main.vue';
import index from './index.vue';
import {store, key} from './store';
// 会自动加载index.ts
import routers from './router';
//npm install element-plus --save | npm install @element-plus/icons
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//全局引入icon组件
import  {Edit,Download,Refresh,Share} from '@element-plus/icons-vue'
// npm i js-cookie 不是组件不能全局引入
// import Cookies from 'js-cookie'

const app = createApp(index)
app.use(store, key)
app.use(routers)
app.use(ElementPlus)
//使用icon组件
app.component("edit",Edit)
app.component("download",Download)
app.component("refresh",Refresh)
app.component("share",Share)
//把main.vue挂载进index.html里面的#app下
app.mount('#app')
