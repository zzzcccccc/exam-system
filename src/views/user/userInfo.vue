<template>
<div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20"
        ><!-- gutter是指定每个分栏的间隔 -->
        <!-- 分栏一共占24格，给搜索框7格，添加按钮4格 -->
        <el-col :span="4">
          <!-- 搜索与添加区域 clearable清空输入框-->
          <el-input placeholder="请输入用户名"  v-model="queryInfo.userName" clearable @clear="listAllBlog()">
            <!-- <el-button slot="append" icon="el-icon-search" @click="listAllBlog()"></el-button> -->
          </el-input>
        </el-col>
        <el-col :span="4">
            <el-select v-model="gradeId" filterable placeholder="请选择年级"  clearable @clear="listAllBlog()">
                <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
        </el-col>
        <el-col :span="4">
            <el-select v-model="queryInfo.classId" filterable placeholder="请选择班级"  clearable @clear="listAllBlog()">
                <el-option
                v-for="item in classOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
        </el-col>
        <el-col :span="4">
            <el-select v-model="queryInfo.roleId" filterable placeholder="请选择角色"  clearable @clear="listAllBlog()">
                <el-option
                v-for="item in roleOptions"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
                </el-option>
            </el-select>
        </el-col>
        <el-col :span="3">
          <el-button  type="primary" icon="el-icon-search" @click="listAllBlog()" >搜索</el-button>
        </el-col>
        <el-col :span="4">
          <el-button   icon="el-icon-plus" type="success" @click="addUser()" >新增</el-button>
        </el-col>
      </el-row>
      <br/>
      <!-- 带边框、斑马纹  v-loading="listLoading" 预加载-->
      <el-table  v-loading="listLoading"  :data="list" border stripe>
        <el-table-column type="index" label="序号"  align="center" width="49px"/>
        <el-table-column prop="userName" label="用户名"/>
        <el-table-column prop="realName" label="真实姓名" />
        <el-table-column prop="sex" label="性别"  width="50px" :formatter="sexFormatter" />
        <el-table-column prop="phone" label="手机号"/>
        <el-table-column prop="gradeName" label="年级"/>
        <el-table-column prop="createTime" label="创建时间"/>
        <el-table-column label="状态"  width="70px" prop="status">
          <template  slot-scope="scope">
           <el-tag :type="(scope.row.status == '1' ? 'success' :  'danger')">
                {{ scope.row.status == '1' ? '启用' : '禁用'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="173px">
            <template slot-scope="scope">
                <!-- 放置修改、删除按钮 -->
                <el-tooltip effect="dark" content="查看" placement="top">
                    <el-button  type="info" icon="el-icon-view" size="mini" @click="showInfo(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="修改" placement="top">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row)"></el-button>
                </el-tooltip>
                 <el-tooltip effect="dark" content="删除" placement="top">
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUser(scope.row)"></el-button>
                </el-tooltip>
            </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.current" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="详情" :visible.sync="setRightDialogVisible" width="50%" >
      <el-form :model="cateForm" label-width="100px">
        <el-form-item label="年级：" >
            <el-input v-model="cateForm.gradeName" style="width: 100%;outline: none;height: 100%" disabled></el-input>
        </el-form-item>
        <el-form-item label="学科：" >
            <el-input v-model="cateForm.subjectName" style="width: 100%;outline: none;height: 100%" disabled></el-input>
        </el-form-item>
        <el-form-item label="班级：" >
          <el-checkbox-group v-model="classIds">
            <el-checkbox v-for="item in classOptions"  :label="item.id" style="width: 100%;outline: none;height: 100%" disabled
            :key="item.id" name="type">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="角色：">
          <el-checkbox-group v-model="chooseRoleNames" style="width: 100%;outline: none;height: 100%" disabled>
            <el-checkbox v-for="item in tableData" :label="item.id"
            :key="item.id" name="type">{{ item.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tokenFail: this.$store.state.tokenFail,
      permission: this.$store.getters.getPermission,
      queryInfo: {
        current: 1,
        size: 10,
        userName: ''
      },
      cateForm: {},
      list: [],
      listLoading: true,
      total: 0,
      options: [], // 年级下拉框
      classOptions: [], // 班级下拉框
      roleOptions: [], // 角色下拉框
      gradeId: null,
      setRightDialogVisible: false,
      classIds: [],
      tableData: [],
      chooseRoleNames: [] // 用户对应的角色名的数组(不支持Object）
    }
  },
  watch: {
    gradeId () {
      if (this.gradeId == '' || this.gradeId == undefined) {
        this.classOptions = []
      } else {
      // 获取班级
        this.$http.get('/class/getClassByGradeId/' + this.gradeId).then(result => {
          if (result.data.code === 0) {
            const res = result.data.data
            if (res == undefined || res.length <= 0) {
              this.classOptions = []
            } else {
              this.classOptions = res
            }
          } else {
            this.$message.error('查询失败')
          }
        })
      }
    }
  },
  created () {
    this.listAllBlog()
    this.getAllGrade()
    this.getRoleList()
  },
  methods: {
    listAllBlog () {
      this.listLoading = true
      this.queryInfo.gradeId = this.gradeId
      this.$http.get('/user/getUserPage', {
        params: this.queryInfo
      }).then(result => {
        // this.list = result.data;
        if (result.data.code === 0) {
          console.log(111)
          const res = result.data.data
          this.list = res.records
          this.total = res.total
          this.listLoading = false
        } else if (result.data.code === this.tokenFail) {
          this.$message.error(result.data.msg)
          this.$store.commit('delToken')
          this.$router.push('/')
        } else {
          this.$message.error('查询失败')
        }
      })
    },
    getAllGrade () {
      this.$http.get('/subject/getAllGrade').then(result => {
        if (result.data.code === 0) {
          this.options = result.data.data
        } else {
          this.$message.error('查询失败')
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
    showInfo (row) {
      this.cateForm = row
      this.userId = row.id
      this.classIds = row.classIdArray
      this.$http.get('/system/getAllRole')
        .then(result => {
          if (result.data.code === 0) {
            this.tableData = result.data.data
          }
        })
      this.$http.get('/system/getUseRoleByUserId/' + this.userId)
        .then(result => {
          if (result.data.code === 0) {
            this.chooseRoleNames = result.data.data
          }
        })

      // 获取班级
      this.$http.get('/class/getClassByGradeId/' + row.gradeId).then(result => {
        if (result.data.code === 0) {
          const res = result.data.data
          if (res == undefined || res.length <= 0) {
            this.classOptions = []
          } else {
            this.classOptions = res
          }
        }
      })
      this.setRightDialogVisible = true
    },
    sexFormatter (row) {
      const sex = row.sex
      if (sex === 1) {
        return '男'
      } else if (sex === 2) {
        return '女'
      }
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.size = newSize// 重新指定每页数据量
      this.listAllBlog()// 带着新的分页请求获取数据
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.current = newPage// 重新指定当前页
      this.listAllBlog()// 带着新的分页请求获取数据
    },
    addUser () {
      // this.$router.push({ path: '/user/addUser', query: { index: '2' } })
      this.$router.push({ path: '/user/addUser' })
    },
    editUser (row) {
      this.$router.push({ path: '/user/editUser', query: { id: row.id } })
    },
    delUser (row) {
      // 弹框询问用户是否删除数据
      this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/user/del/' + row.id)
          .then(result => {
            if (result.data.code === 0) {
              this.$message.success(result.data.msg)
              // 重新获取用户列表数据
              this.listAllBlog()
            } else if (result.data.code === this.tokenFail) {
              this.$message.error(result.data.msg)
              this.$store.commit('delToken')
              this.$router.push('/')
            } else {
              this.$message.error(result.data.msg)
            }
          })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    }
  }
}
</script>

<style scoped>
.text {
  font-size: 14px;
}
.item {
  padding: 18px 0;
}
</style>
