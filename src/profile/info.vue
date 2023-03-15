<template>
  <div>
       <el-form :model="form" ref="form" label-width="100px" :rules="rules">
      <el-form-item label="用户名："  prop="userName">
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名：" prop="realName">
        <el-input disabled v-model="form.realName"></el-input>
      </el-form-item>
      <el-form-item label="年龄：">
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
      <el-form-item label="状态：" prop="status" >
        <el-select disabled v-model="form.status" placeholder="状态">
          <el-option v-for="item in statusEnum" :key="item.key" :value="item.key" :label="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="getBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default ({
  data () {
    return {
      loginId: this.$cookie.get('loginId'),
      form: {
        id: null,
        userName: '',
        password: '',
        realName: '',
        status: null,
        age: null,
        sex: null,
        birthDay: '',
        phone: '',
        role: this.$route.query.index
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
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
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
  created () {
    this.$http.get('user/getInfoById/' + this.loginId)
      .then(result => {
        if (result.data.code === 0) {
          this.form = result.data.data
        }
      })
  },
  methods: {
    submitForm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$http.put('user/editUser', this.form)
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
    getBack () {
      this.$router.back()
    }
  }
})
</script>
