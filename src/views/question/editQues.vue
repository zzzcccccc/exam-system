<template>
<div>
    <el-form>
        <!-- 调用另一个vue  试题模板vue  -->
        <questionVue
          :question="questions"
          class="question-content"
        />
        <el-button
            type="success"
            style="margin-top: 20px"
            @click="submit"
          >
            提交
          </el-button>
          <el-button
            style="margin-top: 20px"
            @click="goBack"
          >
            返回
          </el-button>
    </el-form>
</div>
</template>

<script>
import questionVue from '@/views/question/module/question'

export default ({
  components: {
    questionVue
  },
  props: {
  },
  created () {
    this.addQuestion()
  },
  data () {
    return {
      quesInfo: this.$route.query.params,
      questions: {}
    }
  },
  methods: {
  // 从试卷模板vue添加题目方法
    addQuestion () {
      const question = this.quesInfo
      question.content = JSON.parse(this.quesInfo.content)
      question.answer = JSON.parse(this.quesInfo.answer)
      this.questions = question
    },
    goBack () {
      // 点击返回按钮，向后跳转
      this.$router.go(-1)
    },
    submit () {
      this.questions.answer = JSON.stringify(this.questions.answer)
      this.questions.content = JSON.stringify(this.questions.content)

      this.$http.put('vQuestion/edit', this.questions)
        .then(result => {
          if (result.data.code === 0) {
            this.$message.success(result.data.msg)
            this.$router.back()
          } else if (result.data.code === 1) {
            this.$message.error(result.data.msg)
          } else {
            this.$message.error(result.data.msg)
            this.$store.commit('delToken')
            this.$router.push('/')
          }
        })
    }
  }

})
</script>
