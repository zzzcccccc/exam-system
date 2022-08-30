
import Vue from 'vue'
import Vuex from 'vuex'
import storage from '../model/storage'

Vue.use(Vuex)

// 用Vuex.Store对象用来记录token
const store = new Vuex.Store({
  state: {
    // 存储token
    token: '',
    tokenFail: 401 // 可选
  },

  getters: {
    getToken (state) {
      return state.token || storage.get('token') || ''
    },
    getTokenFail (state) {
      return state.tokenFail
    }
  },

  mutations: {
    // 修改token，并将token存入localStorage
    setToken (state, token) {
      state.token = token
      storage.set('token', token)
      console.log('store、localstorage保存token成功！')
    },
    delToken (state) {
      state.token = ''
      storage.remove('token')
    },
    // 可选
    setUserInfo (state, userName) {
      state.userName = userName
    }
  },

  actions: {
    // removeToken: (context) => {
    // context.commit('setToken')
    // }
  }
})

export default store
