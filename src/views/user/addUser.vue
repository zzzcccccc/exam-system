<template>
  <div class="app-container">
  <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/user/userInfo' }">用户列表</el-breadcrumb-item>
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
      <el-form-item label="年级：">
        <el-select v-model="gradeId" filterable placeholder="请选择年级">
          <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="role.indexOf('teacher') > -1" label="学科：">
        <el-select v-model="form.subjectId" filterable placeholder="请选择学科">
          <el-option
          v-for="item in subjectOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item  label="班级：">
        <!-- :label是传回的值  -->
        <el-checkbox-group v-model="chooseClassIds" >
          <el-checkbox v-for="item in classOptions"  @change="val => handleChecked(val,item.id)" :label="item.id"
          :key="item.id" name="type">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="角色：" prop="roleIds" >
        <el-checkbox-group v-model="chooseRoleIds">
          <el-checkbox v-for="item in roleOptions"  @change="val => handleCheckedRole(val,item.id)" :label="item.id"
          :key="item.id" name="type">{{ item.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
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
      tokenFail: this.$store.state.tokenFail,
      role: this.$store.getters.getRole,
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
        subjectId: null,
        gradeId: null,
        classIds: [],
        roleIds: []
      },
      options: [], // 年级下拉框
      gradeId: null, // 年级id
      subjectOptions: [], // 学科下拉框
      classOptions: [], // 班级多选框数据
      roleOptions: [], // 角色多选框数据
      // 当前操作后选中的
      classIds: [],
      roleIds: [],
      chooseClassIds: [],
      chooseRoleIds: [],
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
  watch: {
    gradeId () {
      // 获取学科
      this.$http.get('/subject/getSubjectByGradeId/' + this.gradeId).then(result => {
        if (result.data.code === 0) {
          this.form.subjectId = null
          const res = result.data.data
          if (res == undefined || res.length <= 0) {
            this.subjectOptions = []
          } else {
            this.subjectOptions = res
          }
        }
      })
      // 获取班级
      this.$http.get('/class/getClassByGradeId/' + this.gradeId).then(result => {
        if (result.data.code === 0) {
          this.form.classIds = []
          const res = result.data.data
          if (res == undefined || res.length <= 0) {
            this.classOptions = []
          } else {
            this.classOptions = res
          }
        }
      })
    }
  },
  created () {
    this.getAllGrade() // 年级列表
    this.getRoleList() // 所有角色列表
  },
  methods: {
    submitForm () {
      this.isSubmit = true
      if (this.chooseRoleIds === null || this.chooseRoleIds == '') {
        this.isSubmit = false
        this.message = '请选择角色！'
      }
      if (!this.isSubmit) {
        this.$notify({
          title: '警告',
          message: this.message,
          type: 'warning'
        })
        return
      }

      this.$refs.form.validate((valid) => { // 开启校验
        if (valid) {
          this.form.gradeId = this.gradeId
          this.form.classIds = this.classIds
          this.form.roleIds = this.roleIds
          this.$http.post('user/addUser', this.form)
            .then(result => {
              if (result.data.code === 0) {
                this.$message.success(result.data.msg)
                this.$router.back()
              } else if (result.data.code === this.tokenFail) {
                this.$message.error(result.data.msg)
                this.$store.commit('delToken')
                this.$router.push('/')
              } else {
                this.$message.error(result.data.msg)
              }
            })
        } else {
          return false
        }
      })
    },
    getRoleList () {
      this.$http.get('/system/getAllRole')
        .then(result => {
          if (result.data.code === 0) {
            this.roleOptions = result.data.data
          } else {
            this.$message.error('获取角色数据失败！')
          }
        })
    },
    getAllGrade () {
      this.$http.get('/subject/getAllGrade').then(result => {
        if (result.data.code === 0) {
          this.options = result.data.data
        } else {
          this.$message.error(result.data.msg)
          this.$store.commit('delToken')
          this.$router.push('/')
        }
      })
    },
    handleChecked (val, item) {
      if (val) {
        this.classIds.push(item)
      } else {
        this.deleteItem(item, this.classIds)
      }
    },
    deleteItem (item, listClassIds) {
      var index = listClassIds.indexOf(item)
      if (index > -1) { // 大于0 代表存在，
        listClassIds.splice(index, 1)// 存在就删除
        this.classIds = listClassIds
      }
    },
    // 角色
    handleCheckedRole (val, item) {
      if (val) {
        this.roleIds.push(item)
      } else {
        this.deleteItemRole(item, this.roleIds)
      }
    },
    deleteItemRole (item, listRoles) {
      var index = listRoles.indexOf(item)
      if (index > -1) { // 大于0 代表存在，
        listRoles.splice(index, 1)// 存在就删除
        this.roleIds = listRoles
      }
    },
    restForm () {
      this.form = {
        id: null,
        userName: '',
        password: '',
        realName: '',
        status: 1,
        age: null,
        sex: null,
        birthDay: '',
        phone: '',
        subjectId: null,
        gradeId: null,
        classIds: [],
        roleIds: []
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
