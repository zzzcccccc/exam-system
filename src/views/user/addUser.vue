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
        <el-select  :disabled="!gradeIdFlag" v-model="form.gradeId" filterable placeholder="请选择年级">
          <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学科：">
        <el-select :disabled="!subjectIdFlag" v-model="form.subjectId" filterable placeholder="请选择学科">
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
        <el-checkbox-group  :disabled="!classIdsFlag" v-model="form.classIds" >
          <el-checkbox v-for="item in classOptions"  @change="val => handleChecked(val,item.id)" :label="item.id"
          :key="item.id" name="type">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="角色：" prop="roleIds" >
        <el-checkbox-group v-model="form.roleIds">
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
      subjectOptions: [], // 学科下拉框
      classOptions: [], // 班级多选框数据
      roleOptions: [], // 角色多选框数据
      gradeIdFlag: true,
      subjectIdFlag: true,
      classIdsFlag: true,
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
        ],
        roleIds: [
          { required: true, message: '请选择角色', trigger: 'blur' }
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
    'form.gradeId' () {
      if (this.form.gradeId != null && this.form.gradeId != '') {
        // 获取学科
        this.$http.get('/subject/getSubjectByGradeId/' + this.form.gradeId).then(result => {
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
        this.$http.get('/class/getClassByGradeId/' + this.form.gradeId).then(result => {
          if (result.data.code === 0) {
            this.change_number_class++
            if (this.change_number_class > 1) {
              this.form.classIds = []
            }
            const res = result.data.data
            if (res == undefined || res.length <= 0) {
              this.classOptions = []
            } else {
              this.classOptions = res
            }
          }
        })
      } else {
        this.subjectOptions = []
        this.classOptions = []
      }
    }
  },
  created () {
    this.getAllGrade() // 年级列表
    this.getRoleList() // 所有角色列表
  },
  methods: {
    submitForm () {
      // 学生
      if (this.form.roleIds.length > 1) {
        if (this.form.roleIds.indexOf(1) > -1) {
          this.$notify({
            title: '警告',
            message: '学生和其他角色不能同时存在',
            type: 'warning'
          })
          return
        }
      }
      if (this.form.roleIds.indexOf(1) > -1) {
        if (this.form.classIds.length == 0) {
          this.$notify({
            title: '警告',
            message: '请选择班级',
            type: 'warning'
          })
          return
        } else if (this.form.classIds.length > 1) {
          this.$notify({
            title: '警告',
            message: '学生只能加入一个班级',
            type: 'warning'
          })
          return
        }
      }

      // 老师
      if (this.form.roleIds.indexOf(2) > -1) {
        if (this.form.classIds.length == 0) {
          this.$notify({
            title: '警告',
            message: '请选择班级',
            type: 'warning'
          })
          return
        }
        if (this.form.subjectId == null) {
          this.$notify({
            title: '警告',
            message: '请选择学科',
            type: 'warning'
          })
          return
        }
      }
      this.$refs.form.validate((valid) => { // 开启校验
        if (valid) {
          this.$http.post('user/addUser', this.form)
            .then(result => {
              if (result.data.code === 0) {
                this.$message.success(result.data.msg)
                this.$router.back()
              } else if (result.data.code === 1 || result.data.code === 503) {
                this.$message.error(result.data.msg)
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
        var index = this.form.classIds.indexOf(item)
        if (index == -1) {
          this.form.classIds.push(item)
        }
      } else {
        this.deleteItem(item, this.form.classIds)
      }
    },
    deleteItem (item, listClassIds) {
      var index = listClassIds.indexOf(item)
      if (index > -1) { // 大于0 代表存在，
        listClassIds.splice(index, 1)// 存在就删除
        this.form.classIds = listClassIds
      }
    },
    // 角色
    handleCheckedRole (val, item) {
      if (val) {
        var index = this.form.roleIds.indexOf(item)
        if (index == -1) {
          this.form.roleIds.push(item)
        }
      } else {
        this.deleteItemRole(item, this.form.roleIds)
      }
      // 管理员
      console.log(this.form.roleIds)
      if (this.form.roleIds.length == 1) {
        if (this.form.roleIds.indexOf(1) > -1) {
          this.form.gradeId = null
          this.form.subjectId = null
          this.form.classIds = []
          this.gradeIdFlag = true
          this.subjectIdFlag = false
          this.classIdsFlag = true
        }
        if (this.form.roleIds.indexOf(3) > -1) {
          this.form.gradeId = null
          this.form.subjectId = null
          this.form.classIds = []
          this.gradeIdFlag = false
          this.subjectIdFlag = false
          this.classIdsFlag = false
        }
      }
      if (this.form.roleIds.indexOf(2) > -1) {
        this.gradeIdFlag = true
        this.subjectIdFlag = true
        this.classIdsFlag = true
      }
    },
    deleteItemRole (item, listRoles) {
      var index = listRoles.indexOf(item)
      if (index > -1) { // 大于0 代表存在，
        listRoles.splice(index, 1)// 存在就删除
        this.form.roleIds = listRoles
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
