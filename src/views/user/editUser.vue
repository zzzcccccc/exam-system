<template>
  <div class="app-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/user/userInfo' }">用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户编辑</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="form" ref="form" label-width="100px" :rules="rules">
      <el-form-item label="用户名："  prop="userName" required>
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password" required>
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名：" prop="realName"   required>
        <el-input v-model="form.realName"></el-input>
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
      <el-form-item label="学科：">
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
        <el-checkbox-group v-model="chooseClassIds">
          <el-checkbox v-for="item in classOptions"  @change="val => handleChecked(val,item.id)" :label="item.id"
          :key="item.id" name="type">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="角色：" prop="chooseRoleIds">
        <el-checkbox-group v-model="chooseRoleIds">
          <el-checkbox v-for="item in roleOptions"  @change="val => handleCheckedRole(val,item.id)" :label="item.id"
          :key="item.id" name="type">{{ item.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态：" prop="staus">
        <el-select v-model="form.status" placeholder="状态">
          <el-option v-for="item in statusEnum" :key="item.key" :value="item.key" :label="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button  @click="restForm">重置</el-button>
        <el-button @click="getBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default ({
  data () {
    return {
      tokenFail: this.$store.state.tokenFail,
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
        subjectId: null,
        gradeId: null,
        classIds: [],
        roleIds: []
      },
      options: [], // 年级下拉框
      gradeId: null,
      subjectOptions: [],
      change_number: 0,
      classOptions: [],
      change_number_class: 0,
      roleOptions: [],
      classIds: [],
      roleIds: [],
      chooseClassIds: [],
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
          this.change_number++
          if (this.change_number > 1) {
            this.form.subjectId = null
          }
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
          this.change_number_class++
          if (this.change_number_class > 1) {
            this.classIds = []
          }
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
    this.getRoleList()
    this.getUseRoleByUserId()
    this.$http.get('user/getInfoById/' + this.$route.query.id)
      .then(result => {
        if (result.data.code === 0) {
          const res = result.data.data
          this.gradeId = res.gradeId
          this.chooseClassIds = res.classIdArray
          this.classIds = res.classIdArray
          this.form = res
        }
      })
  },
  methods: {
    submitForm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.gradeId = this.gradeId
          this.form.classIds = this.classIds
          this.form.roleIds = this.roleIds
          this.$http.put('user/editUser', this.form)
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
    getRoleList () {
      this.$http.get('/system/getAllRole')
        .then(result => {
          if (result.data.code === 0) {
            this.roleOptions = result.data.data
          }
        })
    },
    getUseRoleByUserId () {
      this.$http.get('/system/getUseRoleByUserId/' + this.$route.query.id)
        .then(result => {
          if (result.data.code === 0) {
            this.chooseRoleIds = result.data.data
            this.roleIds = result.data.data // 这句不加角色只可保存一个，加上一人可有多哥角色
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
        status: null,
        age: '',
        sex: null,
        birthDay: null,
        phone: null
      }
    },
    getBack () {
      this.$router.back()
    }
  }
})
</script>
