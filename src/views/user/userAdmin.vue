<!-- DEMO 1.0 第一版-->
<template>
<div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20"
        ><!-- gutter是指定每个分栏的间隔 -->
        <!-- 分栏一共占24格，给搜索框7格，添加按钮4格 -->
        <el-col :span="7">
          <!-- 搜索与添加区域 clearable清空输入框-->
          <el-input placeholder="请输入用户名"  v-model="queryInfo.userName" clearable @clear="listAllBlog()">
            <el-button slot="append" icon="el-icon-search" @click="listAllBlog()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUser()">添加用户</el-button>
        </el-col>
      </el-row>
      <br/>
      <!-- 带边框、斑马纹  v-loading="listLoading" 预加载-->
      <el-table  v-loading="listLoading"  :data="list" border stripe>
        <el-table-column type="index" label="序号"  align="center"/>
        <el-table-column prop="userName" label="用户名"/>
        <el-table-column prop="realName" label="真实姓名" />
        <el-table-column prop="sex" label="性别" width="50px;"  :formatter="sexFormatter" />
        <el-table-column prop="phone" label="手机号"/>
        <el-table-column prop="createTime" label="创建时间"/>
        <el-table-column label="状态" prop="status" width="70px">
          <template  slot-scope="scope">
           <el-tag :type="(scope.row.status == '1' ? 'success' :  'danger')">
                {{ scope.row.status == '1' ? '启用' : '禁用'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
                <!-- 放置修改、删除和分配角色按钮 -->
                <el-tooltip effect="dark" content="分配角色" placement="top">
                  <el-button type="warning" icon="el-icon-setting" size="mini"  @click="showRole(scope.row)" ></el-button>
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
    <el-dialog title="分配角色" :visible.sync="setRightDialogVisible" width="50%" >
      <template>
        <!-- :label是传回的值  -->
        <el-checkbox-group v-model="chooseRoleNames">
          <el-checkbox v-for="item in tableData"  @change="val => handleChecked(val,item.id)" :label="item.id"
          :key="item.id" name="type">{{ item.roleName }}</el-checkbox>
        </el-checkbox-group>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tokenFail: this.$store.state.tokenFail,
      queryInfo: {
        current: 1,
        size: 10,
        userName: '',
        roleId: 3
      },
      list: [],
      listLoading: true,
      total: 0,
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      chooseRoleNames: [], // 用户对应的角色名的数组(不支持Object）
      tableData: [], // 角色列表
      roles: [], // lable的值
      listRoles: [],
      userId: 0,
      editRolesDto: {
        userId: 0,
        roleIds: []
      }
    }
  },
  created () {
    this.listAllBlog()
  },
  methods: {
    listAllBlog () {
      this.listLoading = true
      this.$http.get('/user/getUserPage', {
        params: this.queryInfo
      }).then(result => {
        // this.list = result.data;
        if (result.data.code === 0) {
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
      this.getUsersList()// 带着新的分页请求获取数据
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.current = newPage// 重新指定当前页
      this.getUsersList()// 带着新的分页请求获取数据
    },
    addUser () {
      this.$router.push({ path: '/user/addUser', query: { index: '2' } })
    },
    editUser (row) {
      this.$router.push({ path: '/user/editUser', query: { index: '2', id: row.id } })
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
    },
    showRole (row) {
      this.userId = row.id
      this.$http.get('/system/getAllRole')
        .then(result => {
          if (result.data.code === 0) {
            this.tableData = result.data.data
          } else {
            this.$message.error('获取角色数据失败！')
          }
        })
      this.$http.get('/system/getUseRoleByUserId/' + this.userId)
        .then(result => {
          if (result.data.code === 0) {
            this.chooseRoleNames = result.data.data
            this.roles = result.data.data // 这句不加角色只可保存一个，加上一人可有多哥角色
            this.setRightDialogVisible = true
          } else {
            this.$message.error('获取角色数据失败！')
          }
        })
    },
    handleChecked (val, item) {
      if (val) {
        this.roles.push(item)
      } else {
        this.deleteItem(item, this.roles)
      }
    },
    deleteItem (item, listRoles) {
      var index = listRoles.indexOf(item)
      if (index > -1) { // 大于0 代表存在，
        listRoles.splice(index, 1)// 存在就删除
        this.roles = listRoles
      }
    },
    editRoles () {
      this.editRolesDto.userId = this.userId
      this.editRolesDto.roleIds = this.roles
      this.$http.put('/system/editUsrRole', this.editRolesDto)
        .then(result => {
          if (result.data.code === 0) {
            this.setRightDialogVisible = false
            this.$message.success('分配成功')
            // 重新获取用户列表数据
            this.listAllBlog()
          } else {
            this.setRightDialogVisible = false
            this.$message.success('分配失败')
            this.listAllBlog()
          }
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
