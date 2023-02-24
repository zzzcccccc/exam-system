<template>
    <div>
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>题库管理</el-breadcrumb-item>
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
            <el-select v-model="queryInfo.paperType"  clearable @clear="listAllBlog()" placeholder="请选择题目类型">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
            <el-select v-model="queryInfo.subjectName"  clearable @clear="listAllBlog()"    @click.native="getAllSubject()" placeholder="请选择学科">
              <el-option
                v-for="item in subjectOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name"
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
        <el-table-column label="学科" prop="subjectName"
          :filters="filterList"
          :filter-method="filterHandler"
        >
        </el-table-column>
        <el-table-column label="年级" sortable prop="gradeName"></el-table-column>
        <el-table-column label="题型" prop="quesTypeId">
            <template  slot-scope="scope">
                <el-tag color="white"  size="medium">
                  {{ scope.row.quesTypeId  &lt; 3 ? scope.row.quesTypeId === 1 ?
                  '单选题' : '多选题'
                : scope.row.quesTypeId &lt; 5 ?
                scope.row.quesTypeId === 3 ?
                    '填空题' : '简答题'
                  : '判断题' }}
                </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="题目" prop="title" show-overflow-tooltip width="320px"></el-table-column>
        <el-table-column label="分数" prop="score" width="60px" ></el-table-column>
        <el-table-column label="难度" prop="difficult" width="60px"></el-table-column>
        <el-table-column label="创建时间" sortable prop="createTime" show-overflow-tooltip ></el-table-column>
        <el-table-column label="操作" width="180px">
            <template  slot-scope="scope">
            <el-button type="info" icon="el-icon-view" size="mini"></el-button>
            <el-button type="primary" icon="el-icon-edit" size="mini"  @click="editQues(scope.row)" ></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row)"></el-button>
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
  components: {
  },
  props: {
  },
  data () {
    return {
      total: 0,
      questList: [],
      queryInfo: {},
      gradeOptions: [], // 年级下拉框
      subjectOptions: [], // 科目下拉框
      subjectName: '',
      options: [
        {
          value: '1',
          label: '单选题'
        }, {
          value: '2',
          label: '多选题'
        }, {
          value: '3',
          label: '填空题'
        }, {
          value: '4',
          label: '简答题'
        }, {
          value: '5',
          label: '判断题'
        }],
      filterList: [{}]
    }
  },
  created () {
    this.listAllBlog()
  },
  methods: {
    listAllBlog () {
      this.$http.get('/vQuestion/getPage', {
        params: this.queryInfo
      }).then(result => {
        if (result.data.code === 0) {
          const res = result.data.data
          this.questList = res.records
          this.total = res.total

          // 这里是拿到tableData的所有sex性别属性，但是筛选的下拉框只有男/女 所有[...new Set()]去重复
          var aaa = [
            ...new Set(this.questList.map((item) => item.subjectName))
          ]
          // 这里可以用map，但我对reduce情有独钟。
          // 因为官网规定filters的是Array[{text,value}]这种格式，所有我们弄成官网需要的格式
          this.filterList = aaa.reduce((acc, item, index) => {
            acc.push({
              text: item,
              value: item
            })
            return acc
          }, [])
          // 这样我们就可以看筛选的下拉框了。还有配置下拉规则
        } else if (result.data.code === 1) {
          this.$message.error('查询失败')
        } else {
          this.$message.error(result.data.msg)
          this.$store.commit('delToken')
          this.$router.push('/')
        }
      })
    },
    editQues (row) {
      this.$router.push({ path: '/topic/editQues', query: { params: row } })
    },
    del (row) {
      // 弹框询问用户是否删除数据
      this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/vQuestion/del/' + row.id)
          .then(result => {
            if (result.data.code === 0) {
              this.$message.success(result.data.msg)
              // 重新获取用户列表数据
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
    getAllSubject () {
      this.$http.get('/subject/getAllSubject').then(result => {
        if (result.data.code === 0) {
          this.subjectOptions = result.data.data
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
