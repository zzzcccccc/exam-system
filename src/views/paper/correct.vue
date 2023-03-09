<!-- 批改 -->
<template>
    <div>
      <el-row>
        <el-col :span="16" :offset="4" style="margin-top: 20px">
          <el-card class="box-card">
            <div v-for="(question, index) in questions" :key="index" style="margin-top: 25px">
              <div v-if="index !== 0" class="line" />
              <el-row style="font-weight: 900">
                <el-col :span="18" :offset="1">
                  <span>
                    {{ (index + 1) + '.' + '【' + question.quesTypeId + '】' + question.title + '（' + question.score + '分）' }}
                  </span>
                </el-col>
                <el-col :span="2">
                  <span style="color: rgba(0, 0, 0, 0.5)">得分：</span>
                </el-col>
                <el-col :span="3">
                  <span v-if="!question.imper" style="color: #FF0000">
                    {{ question.userScore }}
                  </span>
                  <el-input
                    v-else
                    v-model="question.userScore"
                    style="margin-top: -15px; width: 70px"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    placeholder="未批改"
                    @change="getGrade"
                  />
                </el-col>
              </el-row>
              <el-row v-if="!question.imper">
                <el-col :span="1" :offset="1">
                  <el-checkbox
                    v-for="(item, i) in question.content.length === 0 ? ['对', '错'] : question.content"
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
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 35px">
        <el-col :span="2" :offset="4">
          <span style="font-size: 18px">总分：</span>
          <span style="color: #FF0000; font-weight: 900; font-size: 20px">{{ grade }}</span>
        </el-col>
        <el-col :span="4" :offset="11">
          <el-button-group>
            <el-button type="primary" icon="el-icon-arrow-left" :disabled="userIndex === 0" @click="getBefore">上一个</el-button>
            <el-button type="primary" @click="getNext">下一个<i class="el-icon-arrow-right el-icon--right" /></el-button>
          </el-button-group>
        </el-col>
      </el-row>
    </div>
  </template>

<script>

export default {
  data () {
    return {
      queryId: {
        examId: 0,
        userId: 0
      },
      questions: [],
      grade: 0,
      scoreList: [],
      userList: [],
      userIndex: 0
    }
  },
  created () {
    this.queryId = this.$route.query
    this.getExam()
  },
  methods: {
    getExam () {
    //   if (this.userIndex >= this.userList.length) {
    //     this.userList.push(this.queryId.userId)
    //   }
      this.grade = 0
      this.scoreList.splice(0)
      const _this = this
      this.$http.get('/vQuestion/getPage', {
        params: this.queryInfo
      }).then(result => {
        const res = result.data.data
        this.questions = res.records
        this.questions.forEach(function (question) {
          question.answer = JSON.parse(question.answer)
          question.content = JSON.parse(question.content)
          //   question.userAnswer = JSON.parse(question.userAnswer)
          if (question.imper && question.userScore === -1) {
            question.userScore = null
          }
          _this.grade += question.userScore
        })
      })
    },
    getGrade () {
      const _this = this
      _this.grade = 0
      this.questions.forEach(function (question) {
        if (question.imper && question.userScore !== null) {
          question.userScore = parseInt(question.userScore, 10)
        }
        _this.grade += question.userScore
      })
    },
    isAlready () {
    //   let b = false
    //   this.questions.forEach(function (question) {
    //     if (question.imper && question.userScore === null) {
    //       b = true
    //     }
    //   })
    //   if (b) {
    //     return confirm('有试题未批改，确定要提交吗？（未批改试题将记为零分）')
    //   }
    //   return true
    },
    getImper () {
      const _this = this
      this.questions.forEach(function (question) {
        if (question.imper) {
          const ques = {
            quesId: question.id,
            userScore: question.userScore === null ? 0 : question.userScore
          }
          _this.scoreList.push(ques)
        }
      })
    },
    getBefore () {
    //   if (this.isAlready()) {
    //     this.getImper()
    //     crudExam.correct({
    //       examId: this.queryId.examId,
    //       userId: this.queryId.userId,
    //       examScore: this.grade,
    //       scoreList: this.scoreList
    //     }).then(() => {
    //       this.queryId.userId = this.userList[--this.userIndex]
    //       this.getExam()
    //     })
    //   }
    },
    getNext () {
    //   if (this.isAlready()) {
    //     this.getImper()
    //     crudExam.correct({
    //       examId: this.queryId.examId,
    //       userId: this.queryId.userId,
    //       examScore: this.grade,
    //       scoreList: this.scoreList
    //     }).then(() => {
    //       this.userIndex++
    //       if (this.userIndex < this.userList.length) {
    //         this.queryId.userId = this.userList[this.userIndex]
    //         this.getExam()
    //       } else {
    //         crudList.select(0, this.queryId.examId, { page: 0, size: 10 }).then(res => {
    //           if (res.data.length === 0) {
    //             this.$router.push('/exam/index')
    //           }
    //           this.queryId.userId = res.data[0].userId
    //           this.getExam()
    //         })
    //       }
    //     })
    //   }
    },
    isAnswer (content, answers) {
      let b = false
      answers.forEach(function (answer) {
        if (answer === content) {
          b = true
        }
      })
      return b
    }
  }
}
</script>

  <style scoped>
  .line {
    width: 110%;
    height: 1px;
    background-color: #f1f2f3;
    margin: 0 0 25px -3%;
  }
  .box-card {
    max-height: 700px;
    overflow-y: scroll;
  }
  </style>
