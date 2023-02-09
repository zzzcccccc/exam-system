<template>
<div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>定时任务管理</el-breadcrumb-item>
      <el-breadcrumb-item>定时任务</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
     <el-card>
      <el-row :gutter="20"
        ><!-- gutter是指定每个分栏的间隔 -->
        <!-- 分栏一共占24格，给搜索框7格，添加按钮4格 -->
        <el-col :span="4">
          <!-- 搜索与添加区域 clearable清空输入框-->
          <el-input placeholder="请输入学科名称"  v-model="queryInfo.name" clearable @clear="getPageSubject()">
          </el-input>
        </el-col>
        <el-col :span="4">
            <el-select v-model="queryInfo.gradeId" filterable placeholder="请选择年级"  clearable @clear="getPageSubject()">
                <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-search" @click="getPageSubject()">搜索</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="success" icon="el-icon-plus"   @click="addShow()">新增</el-button>
        </el-col>
      </el-row>
      <br/>
      <el-table  :data="list" border stripe :header-cell-style="{background:'#eef1f6','text-align':'left'}" >
        <el-table-column type="index" label="序号"  width="55"  align="center"/>
        <el-table-column prop="title" label="标题"/>
        <el-table-column prop="cron" label="cron表达式" />
        <el-table-column prop="remark" label="描述"/>
        <el-table-column prop="classPath" label="请求地址"/>
        <el-table-column  prop="stauts"  label="启用/停止">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.stauts"
              active-color="#00A854"
              inactive-color="#F04134"
              active-value= 0
              inactive-value= 1
              @change=changSwitch(scope.row)>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="任务类型"/>
        <el-table-column prop="lastExecutionTime" label="上次执行时间" />
        <el-table-column prop="latelyExecutionTime" label="最近执行时间" />
        <el-table-column prop="createTime" label="创建时间"/>
        <el-table-column label="操作" width="120px">
            <template slot-scope="scope">
                <!-- 放置修改、删除按钮 -->
                <el-tooltip effect="dark" content="修改" placement="top">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editShow(scope.row)"></el-button>
                </el-tooltip>
                 <el-tooltip effect="dark" content="删除" placement="top">
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row)"></el-button>
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
    <el-dialog title="新增" :visible.sync="addDialogVisible" width="50%" >
      <el-form :model="subjectInfo" ref="subjectInfo"  :rules="rules"  label-width="100px" >
        <el-form-item label="标题:" prop="name">
          <el-input v-model="subjectInfo.title" ></el-input>
        </el-form-item>
        <el-form-item label="cron表达式:" prop="name">
          <el-input v-model="subjectInfo.cron" ></el-input>
        </el-form-item>
        <el-form-item label="描述:" prop="name">
          <el-input v-model="subjectInfo.name" ></el-input>
        </el-form-item>
        <el-form-item label="请求地址:" prop="name">
          <el-input v-model="subjectInfo.name" ></el-input>
        </el-form-item>
        <el-form-item label="启用/停止:" prop="gradeId">
          <el-input v-model="subjectInfo.staus" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add(subjectInfo)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="editDialogVisible" width="50%" >
      <el-form :model="subjectInfo" ref="subjectInfo"  :rules="rules"  label-width="100px" >
        <el-form-item label="学科名称:" prop="name">
          <el-input v-model="subjectInfo.name" ></el-input>
        </el-form-item>
        <el-form-item label="年级:" prop="gradeId">
          <el-select v-model="subjectInfo.gradeId" filterable placeholder="请选择年级">
                <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit(subjectInfo)">确 定</el-button>
      </span>
    </el-dialog>
</div>
</template>
<script>
export default {
  data () {
    return {
      tokenFail: this.$store.state.tokenFail,
      total: 0,
      queryInfo: {
        current: 1,
        size: 10,
        name: '',
        gradeName: ''
      },
      list: [],
      options: [], // 年级下拉框
      addDialogVisible: false,
      editDialogVisible: false,
      subjectInfo: { },
      chooseGradeIds: [], // 用户对应的角色名的数组(不支持Object）
      roles: [], // lable的值
      listRoles: [],
      rules: {
        name: [
          { required: true, message: '请输入学科名称', trigger: 'blur' }
        ],
        gradeId: [
          { required: true, message: '请选择年级', trigger: 'blur' }
        ]
      },
      addBatchRules: {
        name: [
          { required: true, message: '请输入学科名称', trigger: 'blur' }
        ],
        chooseGradeIds: [
          { required: true, message: '请选择年级', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getPageSubject()
    this.getAllGrade() // 年级列表
  },
  methods: {
    getPageSubject () {
      this.$http.get('/cron/getPage', {
        params: this.queryInfo
      }).then(result => {
        if (result.data.code === 0) {
          const res = result.data.data
          this.list = res.records
          this.total = res.total
        } else if (result.data.code === this.tokenFail) {
          this.$message.error(result.data.msg)
          this.$store.commit('delToken')
          this.$router.push('/')
        } else {
          this.$message.error('查询失败')
        }
      })
    },
    // 分页 ===监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.size = newSize// 重新指定每页数据量
      this.getPageSubject()// 带着新的分页请求获取数据
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.current = newPage// 重新指定当前页
      this.getPageSubject()// 带着新的分页请求获取数据
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
    addShow () {
      this.subjectInfo = {}
      this.addDialogVisible = true
    },
    editShow (row) {
      this.subjectInfo = row
      this.editDialogVisible = true
    },
    add (subjectInfo) {
      this.$refs.subjectInfo.validate((valid) => { // 开启校验
        if (valid) { // 如果校验通过，请求接口，允许提交表单
          this.$http.post('cron/add', subjectInfo)
            .then(result => {
              if (result.data.code === 0) {
                this.$message.success(result.data.msg)
                this.getPageSubject()
                this.addDialogVisible = false
              } else if (result.data.code === this.tokenFail) {
                this.$message.error(result.data.msg)
                this.$store.commit('delToken')
                this.$router.push('/')
              } else {
                this.$message.error(result.data.msg)
              }
            })
        } else { // 校验不通过
          return false
        }
      })
      this.addDialogVisible = false
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
    edit (subjectInfo) {
      this.$refs.subjectInfo.validate((valid) => { // 开启校验
        if (valid) { // 如果校验通过，请求接口，允许提交表单
          this.$http.put('subject/edit', subjectInfo)
            .then(result => {
              if (result.data.code === 0) {
                this.$message.success(result.data.msg)
                this.getPageSubject()
                this.editDialogVisible = false
              } else if (result.data.code === this.tokenFail) {
                this.$message.error(result.data.msg)
                this.$store.commit('delToken')
                this.$router.push('/')
              } else {
                this.$message.error(result.data.msg)
              }
            })
        } else { // 校验不通过
          return false
        }
      })
      this.editDialogVisible = false
    },
    del (row) {
      // 弹框询问用户是否删除数据
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/subject/del/' + row.id)
          .then(result => {
            if (result.data.code === 0) {
              this.$message.success(result.data.msg)
              // 重新获取用户列表数据
              this.getPageSubject()
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
