import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/all.css' // 全局css 页面撑满
import TreeTable from 'vue-table-with-tree-grid'
// 配置cookie
import cookie from 'vue-cookie'

Vue.prototype.$cookie = cookie // 配置时候prototype.$这里的名字自己定义不是固定是cookie
Vue.prototype.$confirm = ElementUI.confirm
Vue.use(ElementUI)
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false
Vue.prototype.$http = axios
// 配置请求超时时间
axios.defaults.timeout = 5000 // 单位是毫秒
// 允许携带cookie
axios.defaults.withCredentials = true
axios.defaults.baseURL = '/api'
axios.defaults.headers.post['Content-Type'] = 'application/json'
// axios请求拦截
axios.interceptors.request.use(config => {
  // 为请求头对象，添加Token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
