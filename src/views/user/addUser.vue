<template>
  <div class="app-container">
  <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/user/teacherInfo' }">用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户新增</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="form" ref="form" label-width="100px" :rules="rules">
      <el-form-item label="用户名："  prop="userName" required>
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password" required>
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名：" prop="realName"  required>
        <el-input v-model="form.realName"></el-input>
      </el-form-item>
      <el-form-item label="年龄：" prop="age">
        <el-input v-model="form.age"></el-input>
      </el-form-item>
      <el-form-item label="性别：">
        <el-select v-model="form.sex" placeholder="性别" clearable>
          <el-option v-for="item in sexEnum" :key="item.key" :value="item.key" :label="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出生日期：">
        <el-date-picker v-model="form.birthDay" value-format="yyyy-MM-dd"  placeholder="选择日期"/>
      </el-form-item>
      <el-form-item label="手机：">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="状态：" required>
        <el-select v-model="form.status" placeholder="状态">
          <el-option v-for="item in statusEnum" :key="item.key" :value="item.key" :label="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="restForm">重置</el-button>
        <el-button @click="getBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      form: {
        id: null,
        userName: '',
        password: '',
        realName: '',
        status: 1,
        age: null,
        sex: null,
        birthDay: '',
        phone: '',
        roleId: this.$route.query.index
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在6~15个字符', trigger: 'blur' }
        ],
        age: [
          { pattern: /^[0-9]*$/, message: '年龄必须是数字' }
        ]
      },
      sexEnum: [
        {
          key: 1,
          value: '男'
        }, {
          key: 2,
          value: '女'
        }
      ],
      statusEnum: [
        {
          key: 1,
          value: '启用'
        }, {
          key: 2,
          value: '禁用'
        }
      ]
    }
  },
  methods: {
    submitForm () {
      this.$refs.form.validate((valid) => { // 开启校验
        if (valid) {
          this.$http.post('user/addUser', this.form)
            .then(result => {
              if (result.data.code === 0) {
                this.$message.success(result.data.msg)
                this.$router.back()
              } else {
                this.$message.error(result.data.msg)
              }
            })
        } else {
          return false
        }
      })
    },
    restForm () {
      this.form = {
        id: null,
        userName: '',
        password: '',
        realName: '',
        roleId: this.$route.query.index,
        status: 1,
        age: '',
        sex: '',
        birthDay: null,
        phone: null
      }
    },
    getBack () {
      this.$router.back()
    }
  }
}
</script>
<style scoped>

</style>
