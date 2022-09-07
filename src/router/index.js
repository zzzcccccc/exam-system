import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../layout/layout.vue'
import Index from '../views/login/index.vue'
import Profile from '../profile/info.vue'
import Welcome from '../components/welcome.vue'
import AddUser from '../views/user/addUser.vue'
import EditUser from '../views/user/editUser.vue'
import UserInfo from '../views/user/userInfo.vue'
import RoleIndex from '../views/system/roleIndex.vue'
import PermissionIndex from '../views/system/permissionIndex.vue'
import PermissionDemo from '../views/system/perListAddTest.vue'
import MenuInfo from '../views/menu/menuInfo.vue'
import SubjectInfo from '../views/subject/subjectInfo.vue'
import ClassInfo from '../views/class/classInfo.vue'
import store from '../store'
import storage from '../model/storage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index
  },
  {
    path: '/profile/info',
    component: Layout,
    children: [
      {
        path: '/profile/info',
        component: Profile
      }
    ]

  },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      }
    ]
  },
  // 用户管理
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: '/user/addUser',
        component: AddUser
      },
      {
        path: '/user/editUser',
        component: EditUser
      },
      {
        path: '/user/userInfo',
        component: UserInfo
      }
    ]
  },
  // 角色、权限管理
  {
    path: '/system',
    component: Layout,
    children: [
      {
        path: '/system/roleIndex',
        component: RoleIndex
      },
      {
        path: '/system/permissionIndex',
        component: PermissionIndex
      },
      {
        path: '/system/permissionDemo',
        component: PermissionDemo
      }
    ]
  },
  // 目录管理
  {
    path: '/menu',
    component: Layout,
    children: [
      {
        path: '/menu/menuInfo',
        component: MenuInfo
      }
    ]
  },
  // 学科管理
  {
    path: '/subject',
    component: Layout,
    children: [
      {
        path: '/subject/list',
        component: SubjectInfo
      }
    ]
  },
  // 班级管理
  {
    path: '/class',
    component: Layout,
    children: [
      {
        path: '/class/list',
        component: ClassInfo
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 设置路由守卫，在进页面之前，判断有token，才进入页面，否则返回登录页面
if (storage.get('token')) {
  console.log('设置路由守卫，在进页面之前，判断有token，才进入页面，否则返回登录页面')
  store.commit('setToken', storage.get('token'))
}
router.beforeEach((to, from, next) => {
  // 判断要去的路由有没有requiresAuth
  // to.matched.some(r => r.meta.requireAuth) or to.meta.requiresAuth
  if (to.matched.some(r => r.meta.requireAuth)) {
    console.log(4444)
    if (store.state.token) {
      console.log(1111)
      next() // 有token,进行request请求，后台还会验证token
    } else {
      console.log(2222)
      next({
        path: '/',
        // 将刚刚要去的路由path（却无权限）作为参数，方便登录成功后直接跳转到该路由，这要进一步在登陆页面判断
        query: { redirect: to.fullPath }
      })
    }
  } else {
    console.log(3333)
    next() // 如果无需token,那么随它去吧
  }
})

export default router
