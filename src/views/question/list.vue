<template>
    <div>
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图区域 -->
      <el-card>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
        </el-row>
      </el-card>
      <!-- 商品table表格区域 -->
        <el-table :data="questList" tooltip-effect="dark"  border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="学科" prop="subjectName"></el-table-column>
        <el-table-column label="年级" prop="gradeName"></el-table-column>
        <el-table-column label="题型" prop="quesTypeId">
            <template  slot-scope="scope">
                <el-tag color="white"  size="medium" v-text="scope.row.quesTypeId < 3 ? scope.row.quesTypeId === 1 ?
              '单选题' : '多选题'
            : scope.row.quesTypeId < 5 ?
            scope.row.quesTypeId === 3 ?
                '填空题' : '简答题'
              : '判断题'">
                </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="题目" prop="title" show-overflow-tooltip width="320px"></el-table-column>
        <el-table-column label="分数" prop="score" width="60px" ></el-table-column>
        <el-table-column label="难度" prop="difficult" width="60px"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="180px">
            <template  slot-scope="scope">
            <el-button type="info" icon="el-icon-view" size="mini"></el-button>
            <el-button type="primary" icon="el-icon-edit" size="mini"  @click="editQues(scope.row)" ></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row)"></el-button>
            </template>
        </el-table-column>
        </el-table>
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
      questList: []
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
        //   this.total = res.total
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
            } else if (result.data.code === 1) {
              this.$message.error(result.data.msg)
            } else {
              this.$message.error(result.data.msg)
              this.$store.commit('delToken')
              this.$router.push('/')
            }
          })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    }
  }
}
</script>
<style lang="less" scoped>

</style>
