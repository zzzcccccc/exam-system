
<template>
    <el-container class="homeContainer">
        <!-- 头部区 -->
        <el-header>
         <div class="menu-name">
           <span>EXAM-SYSTEM</span>
         </div>
        <div class="right-menu">
          <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
            <div class="avatar-wrapper">
              <span style="color:white;font-weight: bold;">{{username}}</span>
              <i class="el-icon-caret-bottom" />
            </div>
            <el-dropdown-menu slot="dropdown">
              <router-link to="/profile/install/">
                <el-dropdown-item>账号设置</el-dropdown-item>
              </router-link>
              <router-link to="/profile/info/">
                <el-dropdown-item>个人信息</el-dropdown-item>
              </router-link>
              <router-link to="/dashboard">
                <el-dropdown-item>主页</el-dropdown-item>
              </router-link>
              <el-dropdown-item  @click.native="logout"  divided>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        </el-header>
        <!-- 页面主体区域 -->
         <el-container>
         <!-- 侧边栏 -->
         <el-aside :width="isCollapse ? '64px' : '180px'">
             <!-- 折叠条 -->
            <div class="toggle-button"  @click="toggleCollapse()" >| | |</div>
            <el-menu background-color="#333744" text-color="#fff"
            active-text-color="#409BFF" :unique-opened="true"
            :collapse="isCollapse" :collapse-transition="false"
            :router="true" :default-active="activePath">
               <!-- 一级菜单 -->
               <el-submenu :index="item.menuId+''" v-for="item in menuList" :key="item.menuId">
               <!-- 一级菜单的模板区域 -->
               <template slot="title">
                   <!-- 图标 -->
                  <i :class= item.icon></i>
                  <!-- 菜单名称 -->
                  <span>{{item.name}}</span>
               </template>
          <span v-for="subItem in item.children" :key="subItem.menuId">
            <span v-if="subItem.children ==undefined || subItem.children.length <= 0">
              <el-menu-item :index="'/'+subItem.path"
                @click="saveNavState('/'+subItem.path)">
                  <template slot="title">
                    <i :class=subItem.icon></i>
                    <span slot="title">{{subItem.name}}</span>
                  </template>
              </el-menu-item>
            </span>
            <span v-else>
              <el-submenu :index="'/'+subItem.path">
                <!-- 二级菜单的模板区域 -->
                <template slot="title">
                    <i :class= subItem.icon></i>
                    <span>{{subItem.name}}</span>
                </template>
                <el-menu-item :index="'/'+subItem.path+'/'+thrItem.path" v-for="thrItem in subItem.children" :key="thrItem.menuId"
                  @click="saveNavState('/'+subItem.path+'/'+thrItem.path)">
                  <template slot="title">
                    <i :class=thrItem.icon></i>
                    <span slot="title">{{thrItem.name}}</span>
                  </template>
                </el-menu-item>
              </el-submenu>
            </span>
          </span>
        </el-submenu>
        </el-menu>
        </el-aside>
         <!-- 右侧内容主体 -->
         <el-main>
            <!-- 路由占位符 -->
            <router-view></router-view>
         </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
  data () {
    return {
      tokenFail: this.$store.state.tokenFail,
      // 左侧菜单数据
      menuList: [],
      loginId: this.$cookie.get('loginId'),
      isCollapse: false,
      activePath: '', // 被激活的菜单
      username: this.$cookie.get('userName'),
      roleIds: []
    }
  },
  created () {
    this.getUseRoleByUserId(this.loginId)
  },
  methods: {
    logout () {
      // window.sessionStorage.clear()
      this.$http.get('/user/logOut/' + this.loginId)
        .then(result => {
          if (result.data.code === 0 || result.data.code === this.tokenFail) {
            this.$message.success('操作成功！')
            this.$store.commit('delToken')
            this.$router.push('/')
          } else {
            this.$message.error('操作失败！')
          }
        })
    },
    // 根据用户ID获取权限id
    async getUseRoleByUserId (loginId) {
      const { data: res } = await this.$http.get('/system/getUseRoleByUserId/' + loginId)
      if (res.code !== 0) {
        return this.$message.success(res.msg)
      } else {
        this.roleIds = res.data
        // 获取所有的菜单
        const { data: res1 } = await this.$http.get('/menu/getAllByRole/' + this.roleIds)
        if (res1.code == 0) {
          this.menuList = res1.data
        } else if (res1.code == this.tokenFail) {
          this.$store.commit('delToken')
          this.$router.push('/')
          return this.$message.error(res1.msg)
        } else {
          return this.$message.error(res1.msg)
        }
      }
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存菜单的index值（保持菜单的激活状态）
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}

</script>
<style lang="less" scoped>
   .homeContainer{
      height: 100%;
   }
   .el-header{
     background-color: #333744;
     display: flex; //设置显示为flex布局
     justify-content: space-between;//设置为flex左右布局
     padding-left: 0;//左内边距为0（Logo贴左边）
     align-items: center;//元素上下居中（防止右边按钮贴上下边）
     color: rgb(255, 255, 255);
     font-size: 20px;
     > div {//内嵌的div样式
         display: flex;
         align-items: center;//Logo和文字上下居中
         span {
             margin-left: 15px;//文字左侧设置间距，防止与Logo紧贴
         }
      }
   }
   .el-aside{
      background-color: #333744;
      .el-menu{
         border-right: none;
      }
   }
   .el-main{
      background-color:white;
   }
   .toggle-button{
      //background-color: #3d445a;//背景色(浅灰)
      font-size: 15px;//字体大小10像素
      line-height: 25px;//行高24像素
      color: #fff;//字体颜色白色
      text-align: center;//字体居中
      letter-spacing: 0.2em;//字体之间的距离
      cursor: pointer;//鼠标的形状（手形）
   }
   .menu-name{
    color: #fff;//字体颜色白色
    text-align: center;//字体居中
    margin-left : 20px;//左间距
    font-weight: bold; //加粗
    letter-spacing: 0.2em;//字体之间的距离
    font-size: 15px;//字体大小10像素
   }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
          color: #fff;
        }
      }
    }
  }
</style>
