import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/all.css' // 全局css 页面撑满
import TreeTable from 'vue-table-with-tree-grid'
import store from './store'
import cookie from 'vue-cookie' // 配置cookie

Vue.prototype.$cookie = cookie // 配置时候prototype.$这里的名字自己定义不是固定是cookie
Vue.prototype.$confirm = ElementUI.confirm
Vue.use(ElementUI)
Vue.component('tree-table', TreeTable)
Vue.prototype.$store = store
Vue.config.productionTip = false
Vue.prototype.$http = axios

// 配置请求超时时间
axios.defaults.timeout = 5000 // 单位是毫秒
// 允许携带cookie
axios.defaults.withCredentials = true
axios.defaults.baseURL = '/api'
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 添加请求拦截器，若token存在则在请求头中加token，不存在也继续请求
axios.interceptors.request.use(
  config => {
    // 每次发送请求之前都检测vuex是否存有token,放在请求头发送给服务器
    // token是根据后端自定义字段
    config.headers.token = store.getters.getToken
    return config
  },
  error => {
    console.log('在request拦截器显示错误：', error.response)
    return Promise.reject(error)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          store.commit('delToken')
          router.replace({
            path: '/',
            query: { redirect: router.currentRoute.fullPath }// 登录成功后跳入浏览的当前页面
          })
          break
      }
    }
    return Promise.reject(error.response.data)
  })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
