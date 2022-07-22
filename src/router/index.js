import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../layout/layout.vue'
import Index from '../views/login/index.vue'
import Profile from '../profile/info.vue'
import Welcome from '../components/welcome.vue'
import UserTeacher from '../views/user/userTeacher.vue'
import AddUser from '../views/user/addUser.vue'
import EditUser from '../views/user/editUser.vue'
import UserStudent from '../views/user/userStudent.vue'
import UserAdmin from '../views/user/userAdmin.vue'
import RoleIndex from '../views/system/roleIndex.vue'
import PermissionIndex from '../views/system/permissionIndex.vue'
import PermissionDemo from '../views/system/perListAddTest.vue'
import MenuInfo from '../views/menu/menuInfo.vue'

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
        path: '/user/teacherInfo',
        component: UserTeacher
      },
      {
        path: '/user/addUser',
        component: AddUser
      },
      {
        path: '/user/editUser',
        component: EditUser
      },
      {
        path: '/user/studentInfo',
        component: UserStudent
      },
      {
        path: '/user/adminInfo',
        component: UserAdmin
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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
