<!-- eslint-disable vue/no-parsing-error -->
<template>
    <div class="app-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>卷库管理</el-breadcrumb-item>
        <el-breadcrumb-item>创编</el-breadcrumb-item>
      </el-breadcrumb>
      <div>
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          class="form"
        >
        <h4 class="card-label">设置任务</h4>
        <div class="card-panel">
          <div class="settings-wrap" style="width: 18%">
            <span class="content-label">选择年级</span>
            <el-form-item prop="gradeId">
              <!--  添加multiple 属性可选择多个-->
              <el-select
                v-model="form.gradeId"
                filterable
                allow-create
                default-first-option
                placeholder="请选择年级"
              >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
              </el-select>
            </el-form-item>
          </div>
            <div  class="settings-wrap" style="width: 18%">
              <span class="content-label">选择学科</span>
              <el-form-item prop="subjectId">
                <el-select
                  v-model="form.subjectId"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择学科"
                >
                  <el-option
                    v-for="item in subjectOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="settings-wrap"  style="width: 18%" >
                <span class="content-label">选择班级</span>
                <el-select
                  clearable
                  v-model="form.classIds"
                  multiple
                  collapse-tags
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择班级"
                >
                  <el-option
                    v-for="item in classOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
            </div>
            <div class="settings-wrap" style="width: 18%">
              <span class="content-label">截止时间</span>
              <el-form-item prop="deadline">
                <el-date-picker
                  v-model="form.deadline"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </div>
          </div>
          <h4 class="card-label">试卷标题</h4>
          <div class="card-panel">
            <div class="settings-wrap" style="width: 100%">
              <el-form-item prop="headline">
                <el-input
                  v-model="form.headline"
                  type="text"
                  placeholder="请输入试卷标题（1-25个字）"
                  maxlength="25"
                  show-word-limit
                />
              </el-form-item>
              <div class="settings-wrap-else" style="width: 100%">
                <questionVue
                  v-for="(item, index)  in form.questions"
                  :key="index"
                  :question="item"
                  class="question-content"
                  @removeQuestion="removeQuestion"
                 />
              </div>

            </div>
            <div class="settings-wrap" style="width: 10%">
                <el-button
                type="success"
                class="button1"
                style="padding-right: 10px;"
                @click="getAllQues()"
                >添加试题</el-button>
            </div>
          </div>
          <el-button
            type="primary"
            :loading="loading"
            style="margin-top: 20px"
            @click="submit"
          >
            提交试卷
          </el-button>
        </el-form>
      </div>

      <!-- 添加试题 -->
      <el-dialog title="添加试题" :visible.sync="setQuesDialogFlag" width="70%" >
        <el-row>
          <el-col :span="6">
              <el-select v-model="queryInfo.paperType"  clearable @clear="getAllQues()" placeholder="请选择试题类型">
              <el-option
                  v-for="item in quesTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
              </el-select>
          </el-col>
          <el-col :span="3">
              <el-button  icon="el-icon-search" @click="getAllQues()"></el-button>
          </el-col>
        </el-row>
        <br/>
        <el-table
          :data="questList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          border stripe>
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="题型" prop="quesTypeId"  width="80px">
            <template  slot-scope="scope">
                <el-tag color="white"  size="medium">
                  {{ scope.row.quesTypeId  < 3 ? scope.row.quesTypeId === 1 ?
                  '单选题' : '多选题'
                : scope.row.quesTypeId < 5 ?
                scope.row.quesTypeId === 3 ?
                    '填空题' : '简答题'
                  : '判断题' }}
                </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="题目" prop="title" show-overflow-tooltip width="345px"></el-table-column>
        <el-table-column label="分数" prop="score" width="60px" ></el-table-column>
        <el-table-column label="难度" prop="difficult" width="60px"></el-table-column>
        <el-table-column label="创建时间" sortable prop="createTime" show-overflow-tooltip ></el-table-column>
        <el-table-column label="操作"  width="65px">
            <template  slot-scope="scope" >
            <el-button type="info" icon="el-icon-view" size="mini" @click="view(scope.row)"></el-button>
            </template>
        </el-table-column>
        </el-table>
        <!-- 分页区域-->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="queryInfo.current" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.size"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setQuesDialogFlag = false">取 消</el-button>
          <el-button type="primary" @click="addQues()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 查看试题 -->
      <el-dialog title="查看试题" :visible.sync="viewQuesDialogFlag" width="65%" >
        <el-form>
          <viewQuestionVue
          :question="question"
          class="question-content"
          />
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="viewQuesDialogFlag = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
<script>
import questionVue from '@/views/paper/module/quesList'
import viewQuestionVue from '@/views/paper/module/question'

export default {
  name: 'Create',
  components: {
    questionVue,
    viewQuestionVue
  },
  data () {
    return {
      loginId: this.$cookie.get('loginId'),
      options: [], // 年级下拉框
      subjectOptions: [],
      classOptions: [], // 班级多选框接口返回的数据
      questList: [{}],
      total: 0,
      setQuesDialogFlag: false,
      viewQuesDialogFlag: false,
      isSubmit: false,
      loading: false,
      message: '',
      questionId: 0,

      queryInfo: {
        quesIds: '',
        size: 5
      },
      form: {
        gradeId: null,
        subjectId: null,
        questions: [],
        quesIds: '',
        test: []
      },
      question: {}, // view
      multipleSelection: [],
      rules: {
        // deadline: [{
        //   required: true,
        //   message: '请选择截止时间',
        //   trigger: 'blur'
        // }],
        headline: [{
          required: true,
          message: '请输入试卷标题（1-20个字）',
          trigger: 'blur'
        }],
        subjectId: [{
          required: true,
          message: '请选择学科',
          trigger: 'blur'
        }]
      },
      quesTypeOptions: [
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
        }]
    }
  },
  created () {
    this.getAllGrade()
  },
  watch: {
    'form.gradeId' () {
      this.form.subjectId = null
      // 获取学科
      this.$http.get('/subject/getSubjectByGradeId/' + this.form.gradeId).then(result => {
        if (result.data.code === 0) {
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

      // 获取班级
      this.form.classIds = []
      this.$http.get('/class/getClassByGradeId/' + this.form.gradeId).then(result => {
        if (result.data.code === 0) {
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
  methods: {
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
    getAllQues () {
      this.isSubmit = true
      if (this.form.gradeId === null) {
        this.isSubmit = false
        this.message = '请输入年级'
      } else if (this.form.subjectId === null) {
        this.isSubmit = false
        this.message = '请输入学科'
      }
      if (!this.isSubmit) {
        this.$notify({
          title: '警告',
          message: this.message,
          type: 'warning'
        })
        return
      }
      this.queryInfo.quesIds = ''
      this.queryInfo.gradeId = this.form.gradeId
      this.queryInfo.subjectId = this.form.subjectId
      this.form.quesIds = ''
      for (var i = 0; i < this.form.questions.length; i++) {
        this.queryInfo.quesIds += this.form.questions[i].id + ','
      }

      this.$http.get('/vQuestion/getPage', {
        params: this.queryInfo
      }).then(result => {
        if (result.data.code === 0) {
          const res = result.data.data
          this.questList = res.records
          this.total = res.total
          this.setQuesDialogFlag = true
        } else if (result.data.code === 1) {
          this.$message.error('查询失败')
        } else {
          this.$message.error(result.data.msg)
          this.$store.commit('delToken')
          this.$router.push('/')
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.size = newSize// 重新指定每页数据量
      this.getAllQues()// 带着新的分页请求获取数据
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.current = newPage// 重新指定当前页
      this.getAllQues()// 带着新的分页请求获取数据
    },
    addQues () {
      this.queryInfo.current = 1
      for (var i = 0; i < this.multipleSelection.length; i++) {
        var ques = this.multipleSelection[i]
        this.questionId++
        ques.idIndex = this.questionId
        ques.answer = JSON.parse(ques.answer)
        ques.content = JSON.parse(ques.content)
        this.form.questions.push(ques)
      }
      this.setQuesDialogFlag = false
    },
    removeQuestion (idIndex) { // 删除题目
      this.questionId--
      this.form.test.splice(0)
      for (let i = 0; i < this.form.questions.length; i++) {
        if (this.form.questions[i].idIndex != idIndex) {
          this.form.test.push(this.form.questions[i])
        }
      }
      this.form.questions.splice(0)
      for (let i = 0; i < this.form.test.length; i++) {
        this.form.test[i].idIndex = i + 1
        this.form.questions.push(this.form.test[i])
      }
    },
    view (row) {
      this.question = JSON.parse(JSON.stringify(row))
      this.question.answer = JSON.parse(row.answer)
      this.question.content = JSON.parse(row.content)
      this.viewQuesDialogFlag = true
    },
    submit () {
      if (this.form.questions.length === 0) {
        this.$notify({
          title: '警告',
          message: '请添加试题',
          type: 'warning'
        })
        return
      }
      const form = JSON.parse(JSON.stringify(this.form))
      this.loading = true
      this.$refs.form.validate(res => {
        if (!res) {
          this.loading = false
          return
        }

        for (var i = 0; i < form.questions.length; i++) {
          form.quesIds += form.questions[i].id + ','
        }
        form.questions.splice(0)
        form.userId = this.loginId
        this.$http.post('/paper/add',
          form).then((res) => {
          this.$message.success('添加成功~')
          this.$router.push('/paper/list')
        }).catch(() => {
          this.loading = false
        })
      })
    }
  }
}
</script>

  <style rel="stylesheet/scss" lang="scss" scoped>
    .card-label {
      margin: 30px 0 15px;
    }
  .card-panel {
    display: flex;
    flex-direction: row;
    padding: 17px 15px 0px;
    color: #666;
    box-shadow: 0 0 3px 1px #e7e7e7;
    border-color: #e7e7e7;
      .settings-wrap {
        margin-right: 4%;
      }
    }
    .content-label {
      display: block;
      padding-bottom: 5px;
    }
  </style>
