<template>
    <div class="app-container">
      <div>
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          class="form"
        >
        <h4 class="card-label">是否生成试卷</h4>
          <div class="card-panel_1">
            <div class="settings-wrap" style="width: 20%">
              <input type="radio" name="radios" value="1" v-model="form.check"><label>是</label>
              <input type="radio" name="radios" value="2"   v-model="form.check"><label>否</label>
            </div>
          </div>
        <h4 class="card-label">设置任务</h4>
        <div class="card-panel">
          <div class="settings-wrap" style="width: 18%">
            <span class="content-label">选择年级</span>
            <el-form-item prop="gradeId">
              <!--  添加multiple 属性可选择多个-->
              <el-select
                v-model="gradeId"
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
              <span class="content-label">选择科目</span>
              <el-form-item prop="subjectId">
                <el-select
                  v-model="subjectId"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择科目"
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
            <div v-if="form.check == '1'" class="settings-wrap"  style="width: 18%" >
                <span class="content-label">选择班级</span>
                <el-select
                  clearable
                  v-model="chooseClassIds"
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
            <div v-if="form.check == '1'" class="settings-wrap" style="width: 18%">
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
          <h4 v-if="form.check=='1'" class="card-label">试卷标题</h4>
          <div v-if="form.check=='1'"  class="card-panel">
            <div class="settings-wrap" style="width: 40%">
              <el-form-item prop="headline">
                <el-input
                  v-model="form.headline"
                  type="text"
                  placeholder="请输入试卷标题（1-20个字）"
                  maxlength="20"
                  show-word-limit
                />
              </el-form-item>
            </div>
          </div>
          <!-- 调用另一个vue  试题模板vue  -->
          <questionVue
            v-for="item in form.questions"
            :key="item.id"
            :question="item"
            class="question-content"
            @removeQuestion="removeQuestion"
          />

          <div class="question-type">
            <el-button
              v-for="item in questionType"
              :key="item.typeId"
              style="border-color: #2A82E4; color: #2A82E4"
              @click="addQuestion(item.typeId)"
            >
              <!-- <svg-icon :icon-class="item.icon" /> -->
              {{ item.typeName }}
            </el-button>
          </div>

          <el-button
            type="primary"
            class="submit"
            :loading="loading"
            style="margin-top: 20px"
            @click="submit"
          >
            提交试卷
          </el-button>
        </el-form>
      </div>
    </div>
  </template>

<script>
import questionVue from '@/views/question/module/question'

export default {
  name: 'Create',
  components: {
    questionVue
  },
  data () {
    return {
      options: [], // 年级下拉框
      subjectOptions: [],
      chooseClassIds: [], // 选择的班级
      classOptions: [], // 班级多选框接口返回的数据
      dialogVisible: false,
      loading: false,
      questionId: 0,
      form: {
        check: 1,
        deadline: '', // 截止时间
        questions: []
      },
      gradeId: null, // 年级ID
      subjectId: null, // 学科ID
      questionType: [],
      rules: {
        subjectId: [{
          required: true,
          message: '请选择学科',
          trigger: 'blur'
        }],
        gradeId: [{
          required: true,
          message: '请选择年级',
          trigger: 'blur'
        }]
      }
    }
  },
  created () {
    this.getAllGrade()
    this.getQuestionType()
  },
  watch: {
    gradeId () {
      // 获取学科
      this.$http.get('/subject/getSubjectByGradeId/' + this.gradeId).then(result => {
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

      // 获取班级
      this.chooseClassIds = []
      this.$http.get('/class/getClassByGradeId/' + this.gradeId).then(result => {
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
    getQuestionType () {
      this.questionType = [{ typeId: 1, typeName: '单选题' }, { typeId: 2, typeName: '多选题' }, { typeId: 3, typeName: '填空题' },
        { typeId: 4, typeName: '简答题' }, { typeId: 5, typeName: '判断题' }]
    },
    // 从试卷模板vue添加题目方法
    addQuestion (typeId) {
      const question = {
        id: this.questionId,
        difficult: null,
        quesTypeId: typeId,
        title: '',
        score: 0,
        answer: [],
        content: []
      }
      this.form.questions.push(question)
      this.questionId++
    },
    removeQuestion (id) { // 删除题目
      for (let i = 0; i < this.form.questions.length; i++) {
        if (this.form.questions[i].id === id) {
          this.form.questions.splice(i, 1)
        }
      }
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
      let isSubmit = true
      let message = ''
      this.loading = true
      this.$refs.form.validate(res => {
        if (!res) {
          this.loading = false
          return
        }
        for (let i = 0; i < form.questions.length; i++) {
          const question = form.questions[i]
          if (question.title === '') {
            isSubmit = false
            message = '请设置题目题干'
            break
          }
          if ((question.quesTypeId === 1 || question.quesTypeId === 2) && question.content.length === 0) {
            isSubmit = false
            message = '请设置选择题题答案'
            break
          }
          if ((question.quesTypeId === 1 || question.quesTypeId === 2 || question.quesTypeId === 5) && question.answer.length === 0) {
            isSubmit = false
            message = '请设置客观题选项'
            break
          }
        }
        if (!isSubmit) {
          this.$notify({
            title: '警告',
            message: message,
            type: 'warning'
          })
          this.loading = false
          return
        }
        form.questions.forEach(function (question) {
          question.answer = JSON.stringify(question.answer)
          question.content = JSON.stringify(question.content)
          question.difficult = JSON.stringify(question.difficult)
        })
        form.gradeId = this.gradeId
        form.subjectId = this.subjectId
        form.classIds = this.chooseClassIds

        this.$http.post('vQuestion/add',
          form).then((res) => {
          // this.loading = false
          // const params = {
          //   type: 2,
          //   typeId: res,
          //   url: this.$frontUrl + '/answerOnline'
          // }
          // crudList.remind(params).then(() => {
          //   this.$message.success('提醒成功~')
          // })
          this.$message.success('添加成功~')
          this.$router.push('/topic/list')
        }).catch(() => {
          this.form.splice(0)
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
    .card-panel_1 {
    display: flex;
    flex-direction: row;
    padding: 10px 15px 10px;
    color: #666;
    box-shadow: 0 0 3px 1px #e26e21;
    border-color: #e7e7e7;
      .settings-wrap {
        margin-right: 4%;
      }
    }
    .content-label {
      display: block;
      padding-bottom: 5px;
    }
    .checkbox-tabel {
      display: flex;
    flex-direction: row;
    padding: 10px 15px 10px;
    color: #666;
    box-shadow: 0 0 1px 1px #e7e7e7;
    border-color: #e7e7e7;
    }
    .question-type {
      margin-top: 20px;
    }
    .question-content {
      margin-top: 20px;
      color: #666;
      box-shadow: 0 0 4px 2px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
    }
  </style>
