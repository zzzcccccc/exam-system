<template>
    <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
        <div class="title-container">
            <h3 class="title">EXAM 管理系统</h3>
        </div>
        <el-form-item prop="userName">
          <span slot="label">
            <span style="color: white;font-size:15px">用户名</span>
          </span>
          <el-input ref="userName" v-model="loginForm.userName" placeholder="用户名" name="userName" type="text" tabindex="1" auto-complete="on"/>
        </el-form-item>
        <el-form-item prop="password">
          <span slot="label">
            <span style="color: white;font-size:15px">密码</span>
          </span>
          <el-input ref="password" v-model="loginForm.password" placeholder="密码" name="password" type="text" tabindex="1" auto-complete="on"/>
        </el-form-item>
        <el-form-item class="login_btn">
            <el-button type="primary"  @keyup.enter="keyDown" @click="submitForm('loginForm')">登录</el-button>
            <el-button type="goon" @click="resetLoginForm('loginForm')">重置</el-button>
        </el-form-item>
    </el-form>
    </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        userName: '',
        password: ''
      },
      loginRules: {
        userName: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false
    }
  },
  created () {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted () {
    // 监听
    if (this.loginForm.userName === '') {
      this.$refs.userName.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    window.addEventListener('keydown', this.keyDown) // 回车登录操作
  },
  destroyed () {
    // 销毁事件
    // window.removeEventListener('storage', this.afterQRScan)
    window.removeEventListener('keydown', this.keyDown, false)
  },
  methods: {
    submitForm () {
      // 登录
      // const data = { username: this.loginForm.username, password: this.loginForm.password }
      this.$http.get('/user/doLogin?userName=' + this.loginForm.userName + '&password=' + this.loginForm.password)
        .then(res => {
          if (res.data.code === 0) {
            var loginId = res.data.data.loginId
            this.$message.success(res.data.msg)
            this.$cookie.set('userName', this.loginForm.userName)
            this.$cookie.set('loginId', loginId)
            this.$router.push({ path: '/dashboard' })
            this.$store.commit('setToken', res.data.data.tokenValue)
            // localStorage.setItem('token', JSON.stringify(res.data.data.tokenValue))
            // 获取用户的权限标识
            this.$http.get('/menu/getPermissionList/' + loginId)
              .then(result => {
                if (result.data.code === 0) {
                  this.$store.commit('setPermission', result.data.data)
                }
              })
              // 获取用户的角色
            this.$http.get('/menu/getRoleList/' + loginId)
              .then(result => {
                if (result.data.code === 0) {
                  this.$store.commit('setRole', result.data.data)
                  this.$cookie.set('role', result.data.data)
                }
              })
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(res => {
        // console.log(res)
        })
    },
    keyDown (e) {
      // 如果是回车则执行登录方法
      if (e.keyCode == 13) {
        // 需要执行的登录方法
        this.submitForm()
      }
    },
    // 点击重置按钮 重置表单
    resetLoginForm () {
      this.$refs.loginForm.resetFields()
    }
  }
}
</script>

<style scoped>
.login-container {/*整个大的界面样式*/
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/20230316092256.jpg);
    background-size: 100%;
    opacity:0.8;/*透明度*/
}
.title-container {/*登录框的样式*/
    width: 100%;
    line-height: 50px;
    text-align: center;/*/*图像处理系统的位置*/
    font-size: 25px;/*图像处理系统的大小*/
    color: #fff;/*图像处理系统的颜色*/
    border-bottom: 1px solid ;/*分割线的颜色*/
}
.login-form {/*登录框的样式*/
    position: absolute;/*position 属性规定元素的定位类型；absolute生成绝对定位的因素*/
    left: 50%;
    top: 50%;
    width: 300px;
    margin: -190px 0 0 -190px;
    border-radius: 10px;/*角边弧度*/
    background: rgb(79, 97, 119);
    /* 为其整体设置接近透明的效果*/
    background-color: rgba(255,255,255,0.1);
    /* 设置box-shadow使其有立体感 */
    box-shadow: 5px 5px 0 0  rgba(0,0,0,0.2);
    overflow: hidden
}
.login-form {/*输入框的内边距*/
    padding: 30px 30px;
}
.login_btn {
    text-align: left;
}
 .el-button--primary {/*登录按钮样式*/
    color: white;
    font-weight: bold;
    background-color:#409eff;
    border-color: #409eff;
    width: 50%;
    height: 50%;
    margin-bottom: 10px;
  }
  /* .el-button--primary:hover {
    color: rgb(246, 241, 248);
    background-color: rgb(198, 139, 223);
    border-color: rgb(198, 139, 223);
  } */
</style>
