<template>
    <div>
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>卷库管理</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图区域 -->
      <el-card>
        <el-row :gutter="20">
          <el-col :span="5">
            <el-input  v-model="queryInfo.headline" placeholder="请输入内容" clearable @clear="listAllBlog()">
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-select v-model="queryInfo.gradeId"  clearable @clear="listAllBlog()"    @click.native="getAllGrade()" placeholder="请选择年级">
              <el-option
                v-for="item in gradeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="queryInfo.subjectId"  clearable @clear="listAllBlog()" placeholder="请选择学科">
              <el-option
                v-for="item in subjectOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-button  icon="el-icon-search" @click="listAllBlog()"></el-button>
          </el-col>
        </el-row>
      </el-card>
      <!-- table表格区域 -->
        <el-table :data="questList" tooltip-effect="dark"  border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="试卷标题" prop="headline" show-overflow-tooltip></el-table-column>
        <el-table-column  v-if="role.indexOf('student') > -1" label="答卷状态" align="center"  width="100px" prop="answerState" >
          <template  slot-scope="scope">
           <el-tag :type="(scope.row.answerState == '1' ? 'success' :  'danger')">
                {{ scope.row.answerState == '1' ? '已完成' : '未完成'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="role.indexOf('student') > -1" label="批改状态" align="center" width="100px" prop="correctState"  >
          <template  slot-scope="scope">
           <el-tag :type="(scope.row.correctState == '1' ? 'success' :  'danger')">
                {{ scope.row.correctState == '1' ? '已批改' : '未批改'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="role.indexOf('student') > -1" label="总分"  width="100px"  prop="grade" ></el-table-column>
        <el-table-column v-if="role.indexOf('teacher') > -1" label="创建人" prop="realName" show-overflow-tooltip width="130px"></el-table-column>
        <el-table-column label="截止时间" sortable prop="deadline" width="180px" show-overflow-tooltip ></el-table-column>
        <el-table-column label="创建时间" sortable prop="createTime" width="180px" show-overflow-tooltip ></el-table-column>
        <el-table-column v-if="role.indexOf('teacher') > -1"  prop="answered" label="已批改" width="100px">
        <template slot-scope="scope">
          <a style="color: #2a82e4; text-decoration: underline" @click="dialog(scope.row.id, 1, '已批改名单')">{{ scope.row.answered }}人</a>
        </template>
        </el-table-column>
        <el-table-column  v-if="role.indexOf('teacher') > -1"  prop="uncorrected" label="未批改" width="100px">
          <template slot-scope="scope">
            <a style="color: #11ce66; text-decoration: underline" @click="dialog(scope.row.id, 0, '未批改名单')">{{ scope.row.uncorrected }}人</a>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center" >
            <template  slot-scope="scope">
            <el-button  v-if="role.indexOf('student') > -1"  @click="toAnswer(scope.row)" size="mini" plain>答卷</el-button>
            <el-button  v-if="role.indexOf('teacher') > -1" type="primary" icon="el-icon-edit" size="mini"  @click="editQues(scope.row,'edit')" ></el-button>
            <el-button  v-if="role.indexOf('teacher') > -1" type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row)"></el-button>
            </template>
        </el-table-column>
        </el-table>
          <!-- 分页区域-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.current" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </template>

<script>
export default {
  data () {
    return {
      userId: this.$cookie.get('loginId'),
      role: this.$cookie.get('role'),
      total: 0,
      questList: [],
      queryInfo: {
        userId: this.$cookie.get('loginId'),
        role: this.$cookie.get('role')
      },
      gradeOptions: [], // 年级下拉框
      subjectOptions: [], // 科目下拉框
      subjectName: ''
    }
  },
  watch: {
    'queryInfo.gradeId' () {
      // 获取学科
      this.$http.get('/subject/getSubjectByGradeId/' + this.queryInfo.gradeId).then(result => {
        if (result.data.code === 0) {
          this.subjectId = null
          const res = result.data.data
          if (res == undefined || res.length <= 0) {
            this.subjectOptions = []
          } else {
            this.subjectOptions = res
          }
        } else {
          this.$store.commit('delToken')
          this.$router.push('/')
        }
      })
    }
  },
  created () {
    this.listAllBlog()
  },
  methods: {
    listAllBlog () {
      this.$http.get('/paper/getPage', {
        params: this.queryInfo
      }).then(result => {
        if (result.data.code === 0) {
          const res = result.data.data
          this.questList = res.records
          this.total = res.total
        } else if (result.data.code === 1) {
          this.$message.error('查询失败')
        } else {
          this.$message.error(result.data.msg)
          this.$store.commit('delToken')
          this.$router.push('/')
        }
      })
    },
    dialog (examId, correct, title) {
      this.$refs.nameList.passData(examId, correct, title)
    },
    editQues (row, type) {
      this.$router.push({ path: '/paper/edit', query: { params: row, type: type } })
    },
    toAnswer (row) {
      this.$router.push({ path: '/paper/do', query: { params: row } })
    },
    del (row) {
      // 弹框询问用户是否删除数据
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/paper/del/' + row.id)
          .then(result => {
            if (result.data.code === 0) {
              this.$message.success(result.data.msg)
              this.listAllBlog()
            } else if (result.data.code === 1 || result.data.code === 503) {
              this.$message.error(result.data.msg)
              this.listAllBlog()
            } else {
              this.$message.error(result.data.msg)
              this.$store.commit('delToken')
              this.$router.push('/')
            }
          })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    getAllGrade () {
      this.$http.get('/subject/getAllGrade').then(result => {
        if (result.data.code === 0) {
          this.gradeOptions = result.data.data
        } else {
          this.$message.error('查询失败')
        }
      })
    },
    filterHandler (value, row, column) {
      const property = column.property
      console.log(property)
      return row[property] === value
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
    }
  }
}
</script>
<style lang="less" scoped>

</style>
