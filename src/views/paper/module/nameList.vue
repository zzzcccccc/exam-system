<template>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="handleClose"
      :visible="dialogVisible"
      :title="title"
      width="700px"
    >
      <el-button
        v-if="correct === 2"
        type="primary"
        style="background-color: #7948ea; border-color: #7948ea; color: #fff"
        icon="el-icon-bell"
        @click="remind(data)"
      >一键提醒</el-button>
      <br>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="loading"
        :data="data"
        style="width: 100%;"
      >
        <el-table-column prop="realName" label="姓名" />
        <el-table-column prop="className" label="班级" />
        <el-table-column v-if="correct === 1" prop="grade" label="成绩">
          <template slot-scope="scope">
            <span style="color: #d43030">{{ scope.row.grade }}分</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="correct === 0"
              type="primary"
              size="mini"
              @click="toCorrect(scope.row.userId,'edit')"
            >
              批改
            </el-button>
            <el-button
              v-else
              type="primary"
              size="mini"
              style="background-color: #7948ea; border-color: #7948ea; color: #fff"
              @click="remind(scope.row)"
            >
              提醒
            </el-button>
            <el-button
              v-if="correct === 1"
              size="mini"
              @click="toCorrect(scope.row.userId,'view')"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <el-pagination
        :page-size.sync="pageData.size"
        :total="pageData.total"
        :current-page.sync="pageData.current"
        style="margin-top: 8px;"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChangeHandler($event)"
        @current-change="pageChangeHandler"
      />
    </el-dialog>
  </template>

<script>
// import crudList from '@/api/exam/list'

export default {
  data () {
    return {
      dialogVisible: false,
      paperId: 0,
      correct: -1,
      title: '',
      userId: null,
      data: [],
      loading: false,
      pageData: {
        current: 0,
        total: 0,
        size: 10
      }
    }
  },
  methods: {
    handleClose () {
      this.dialogVisible = false
      this.pageData.current = 0
      this.pageData.size = 10
    },
    passData (paperId, correct, title, userId) {
      this.paperId = paperId
      this.correct = correct
      this.title = title
      this.userId = userId
      this.dialogVisible = true
      this.listSelect()
    },

    listSelect () {
      this.loading = true
      this.pageData.correctState = this.correct
      this.pageData.paperId = this.paperId
      this.pageData.userId = this.userId
      this.$http.get('/paper/answer/getPageToAnswerInfo', {
        params: this.pageData
      }).then(result => {
        if (result.data.code === 0) {
          const res = result.data.data
          this.data = res.records
          this.pageData.total = res.total
          this.loading = false
        } else {
          this.loading = false
        }
      })
    },
    sizeChangeHandler (e) {
      this.pageData.size = e
      this.pageData.current = 0
      this.listSelect()
    },
    pageChangeHandler (e) {
      this.pageData.current = e
      this.listSelect()
    },
    toCorrect (userId, type) {
      this.$router.push({
        path: '/paper/correct',
        query: {
          paperId: this.paperId,
          userId: userId,
          type: type
        }
      })
    },
    remind (data) {
    //   let userId
    //   if (data[0] === undefined) {
    //     userId = data.userId
    //   } else {
    //     userId = null
    //   }
    //   const params = {
    //     type: 2,
    //     typeId: this.paperId,
    //     url: this.$frontUrl + '/answerOnline',
    //     userId: userId
    //   }
    //   crudList.remind(params).then(() => {
    //     this.$message.success('提醒成功~')
    //   })
    }
  }
}
</script>

  <style scoped>

  </style>
