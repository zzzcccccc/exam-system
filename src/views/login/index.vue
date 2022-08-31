<template>
    <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
        <div class="title-container">
            <h3 class="title">成绩管理系统</h3>
        </div>
        <el-form-item label="用户名" prop="userName">
            <el-input ref="userName" v-model="loginForm.userName" placeholder="用户名" name="userName" type="text" tabindex="1" auto-complete="on"/>
        </el-form-item>
       <el-form-item label="密码" prop="password">
            <el-input ref="password" v-model="loginForm.password" placeholder="密码" name="password" type="text" tabindex="1" auto-complete="on"/>
        </el-form-item>
        <el-form-item class="login_btn">
            <el-button type="primary" @click="submitForm('loginForm')">提交</el-button>
            <el-button @click="resetLoginForm('loginForm')">重置</el-button>
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
    if (this.loginForm.userName === '') {
      this.$refs.userName.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed () {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    submitForm () {
      // 登录
      // const data = { username: this.loginForm.username, password: this.loginForm.password }
      this.$http.get('/user/doLogin?userName=' + this.loginForm.userName + '&password=' + this.loginForm.password)
        .then(res => {
          if (res.data.code === 0) {
            this.$message.success(res.data.msg)
            this.$cookie.set('userName', this.loginForm.userName)
            this.$cookie.set('loginId', res.data.data.loginId)
            this.$router.push({ path: '/dashboard' })
            this.$store.commit('setToken', res.data.data.tokenValue)
            // localStorage.setItem('token', JSON.stringify(res.data.data.tokenValue))
            // 获取用户的权限标识
            this.$http.get('/menu/getPermissionList/' + res.data.data.loginId)
              .then(result => {
                if (result.data.code === 0) {
                  this.$store.commit('setPermission', result.data.data)
                } else {
                  this.$message.error(result.data.msg)
                }
              })
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(res => {
        // console.log(res)
        })
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
    background-image: url(../../assets/img/loginBj.jpg);
    background-size: 100%;
    opacity:0.8;/*透明度*/
}
.title-container {/*登录框的样式*/
    width: 100%;
    line-height: 70px;
    text-align: center;/*/*图像处理系统的位置*/
    font-size: 20px;/*图像处理系统的大小*/
    color: #fff;/*图像处理系统的颜色*/
    border-bottom: 1px solid ;/*分割线的颜色*/
}
.login-form {/*登录框的样式*/
    position: absolute;/*position 属性规定元素的定位类型；absolute生成绝对定位的因素*/
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -190px;
    border-radius: 15px;/*角边弧度*/
    background: rgba(127, 194, 228, 0.521);
    overflow: hidden;
}
.login-form {/*输入框的内边距*/
    padding: 30px 30px;
}
.login-btn {
    text-align: left;
}
.login-btn button {/*登录按钮样式*/
    width: 50%;
    height: 35px;
    margin-bottom: 5px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
/*我先把登录和取消两个按钮并排排列，还没实现*/
</style>
