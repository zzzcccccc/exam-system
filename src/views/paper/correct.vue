<!-- 批改 -->
<template>
    <div>
      <el-card class="box-card">
        <div v-for="(question, index) in questions" :key="index" style="margin-top: 25px">
          <div v-if="index !== 0" class="line" />
          <el-row style="font-weight: 900">
            <el-col :span="18" :offset="1">
              <span>
                {{ (index + 1) + '.' + '【' + question.quesTypeName + '】' + question.title + '（' + question.score + '分）' }}
              </span>
            </el-col>
            <el-col :span="5">
              <span style="color: rgba(0, 0, 0, 0.5)">得分：</span>
              <span v-if='question.quesTypeId === 1 || question.quesTypeId ===2 || question.quesTypeId===5' style="color: #FF0000">
                {{ question.userScore }}
              </span>
              <span v-else-if='(question.quesTypeId === 3 || question.quesTypeId === 4 ) && question.correctState == "1"' style="color: #FF0000">
                {{ question.userScore }}
              </span>
              <el-input
                v-else
                v-model="question.userScore"
                style="margin-top: -15px; width: 65px"
                oninput="value=value.replace(/[^\d]/g,'')"
                placeholder="未批改"
                @change="getGrade"
              />
            </el-col>
          </el-row>
          <el-row v-if='question.quesTypeId === 1 || question.quesTypeId ===2 || question.quesTypeId ===5'>
            <el-col :span="1" :offset="1">
              <el-checkbox
                v-for="(item, i) in question.content"
                :key="i"
                v-model="question.userAnswer"
                :label="item"
                style="margin-top: 15px"
                disabled
              >
                <span v-if="isAnswer(item, question.answer)" style="color: #FF0000; padding-left: 10px">{{ item }}</span>
                <span v-else style="color: #000; padding-left: 10px">{{ item }}</span>
              </el-checkbox>
            </el-col>
          </el-row>
          <el-row v-else>
            <el-col :span="20" :offset="1">
              <el-input
                v-model="question.userAnswer[0]"
                style="margin-top: 20px"
                disabled
              />
              <p style="color: #999; margin-top: 30px">
                <b>参考答案：</b>
                {{ question.answer[0] }}
              </p>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-row style="margin: 20px 0 35px">
        <el-col :span="2" :offset="2">
          <span style="font-size: 18px">总分：</span>
          <span style="color: #FF0000; font-weight: 900; font-size: 20px">{{ grade}}</span>
        </el-col>
        <el-col v-if="queryId.type == 'edit'" :span="5" :offset="13">
            <el-button-group>
            <el-button type="primary" icon="el-icon-arrow-left"  :disabled="userIndex === 0" @click="getBefore">上一个</el-button>
            <el-button type="primary" @click="getNext">下一个<i class="el-icon-arrow-right el-icon--right" /></el-button>
            </el-button-group>
        </el-col>
        <el-col v-else :span="1" :offset="17">
            <el-button type="info"  @click="$router.back()" >返回</el-button>
        </el-col>
      </el-row>
    </div>
  </template>

<script>

export default {
  data () {
    return {
      queryId: {
        paperId: 0,
        userId: 0,
        type: ''
      },
      questions: [],
      grade: 0.0,
      scoreList: [],
      userList: [],
      form: {},
      userIndex: 0
    }
  },
  created () {
    this.queryId = this.$route.query
    this.getExam()
  },
  methods: {
    getExam () {
      if (this.userIndex >= this.userList.length) {
        this.userList.push(this.queryId.userId)
      }
      this.grade = 0
      this.scoreList.splice(0)
      const _this = this
      this.$http.get('/paper/answer/getList', {
        params: this.queryId
      }).then(result => {
        const res = result.data.data
        this.questions = JSON.parse(res.answerArray)
        this.questions.forEach(function (question) {
          question.correctState = res.correctState
          question.answer = JSON.parse(question.answer)
          question.userAnswer = JSON.parse(question.userAnswer)
          if (question.quesTypeId === 5) {
            question.content = ['对', '错']
          } else {
            question.content = JSON.parse(question.content)
          }
          _this.grade += question.userScore
        })
      })
    },
    getGrade () {
      const _this = this
      _this.grade = 0.0
      this.questions.forEach(function (question) {
        _this.grade += parseInt(question.userScore)
      })
    },
    isAlready () {
      var b = true
      if (b) {
        return confirm('确认已无试题未批改，继续提交？（一经提交无法修改！）')
      }
      return true
    },
    getImper () {
      // this.questions.forEach(function (question) {
      //   question.content = JSON.stringify(question.content)
      //   question.answer = JSON.stringify(question.answer)
      //   question.userAnswer = JSON.stringify(question.userAnswer)
      // })
    },
    getBefore () {
      if (this.isAlready()) {
        this.form.paperId = this.queryId.paperId
        this.form.userId = this.queryId.userId
        this.form.grade = this.grade
        this.form.scoreList = this.questions
        this.$http.get('/paper/answer/correct', this.form)
          .then(() => {
            this.queryId.userId = this.userList[--this.userIndex]
            this.getExam()
          })
      }
    },
    getNext () {
      if (this.isAlready()) {
        this.form.paperId = this.queryId.paperId
        this.form.userId = this.queryId.userId
        this.form.grade = this.grade
        this.questions.forEach(function (question) {
          question.content = JSON.stringify(question.content)
          question.answer = JSON.stringify(question.answer)
          question.userAnswer = JSON.stringify(question.userAnswer)
        })
        this.form.scoreList = this.questions
        this.$http.put('/paper/answer/correct', this.form)
          .then((res) => {
            if (res.data.code === 1 || res.data.code === 503) {
              this.$message.error(res.data.msg)
            } else if (res.data.code === 0) {
              this.getExam()
            } else {
              this.$message.error(res.data.msg)
              this.$store.commit('delToken')
              this.$router.push('/')
            }
            this.userIndex++
            if (this.userIndex < this.userList.length) {
              this.queryId.userId = this.userList[this.userIndex]
              this.getExam()
            } else {
              // crudList.select(0, this.queryId.examId, { page: 0, size: 10 }).then(res => {
              //   if (res.data.length === 0) {
              //     this.$router.push('/exam/index')
              //   }
              //   this.queryId.userId = res.data[0].userId
              //   this.getExam()
              // })
              // this.queryId.userId = res.data[0].userId
              this.getExam()
            }

            this.queryId.userId = this.userList[--this.userIndex]
            this.getExam()
          })

        // crudExam.correct({
        //   paperId: this.queryId.paperId,
        //   userId: this.queryId.userId,
        //   grade: this.grade,
        //   scoreList: this.scoreList
        // }).then(() => {
        //   this.userIndex++
        //   if (this.userIndex < this.userList.length) {
        //     this.queryId.userId = this.userList[this.userIndex]
        //     this.getExam()
        //   } else {
        //     crudList.select(0, this.queryId.examId, { page: 0, size: 10 }).then(res => {
        //       if (res.data.length === 0) {
        //         this.$router.push('/exam/index')
        //       }
        //       this.queryId.userId = res.data[0].userId
        //       this.getExam()
        //     })
        //   }
        // })
      }
    },
    isAnswer (content, answers) {
      let b = false
      if (answers != null && answers.length > 0) {
        answers.forEach(function (answer) {
          if (answer === content) {
            b = true
          }
        })
      }
      return b
    }
  }
}
</script>

  <style scoped>
  .line {
    width: 110%;
    height: 3px;
    background-color: #f1f2f3;
    margin: 0 0 25px -3%;
  }
  .box-card {
    max-height: 700px;
    overflow-y: scroll;
  }
  </style>
