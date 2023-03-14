<!-- 答卷 -->
<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>题库管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/paper/list' }">列表</el-breadcrumb-item>
        <el-breadcrumb-item>答卷</el-breadcrumb-item>
      </el-breadcrumb>
        <el-form>
            <!-- 调用另一个vue  试题模板vue  -->
            <userAnswer
                v-for="item in form.questions"
                :key="item.id"
                :question="item"
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

import userAnswer from '@/views/paper/module/userAnswer'

export default ({
  components: {
    userAnswer
  },
  props: {
  },
  created () {
    this.addQuestion()
  },
  data () {
    return {
      form: this.$route.query.params,
      quesIndex: 0
    }
  },
  methods: {
    // 从试卷模板vue添加题目方法
    addQuestion () {
      for (let i = 0; i < this.form.questions.length; i++) {
        this.quesIndex++
        const question = this.form.questions[i]
        if ((question.quesTypeId === 1 || question.quesTypeId === 2) && question.content.length != 0) {
          question.content = JSON.parse(question.content)
        }
        question.userAnswer = []
        question.quesIndex = this.quesIndex
      }
    },
    goBack () {
      // 点击返回按钮，向后跳转
      this.$router.go(-1)
    },
    submit () {
      const form = JSON.parse(JSON.stringify(this.form))
      for (let i = 0; i < form.questions.length; i++) {
        const question = form.questions[i]
        if ((question.quesTypeId === 1 || question.quesTypeId === 2) && question.content.length != 0) {
          question.content = JSON.stringify(question.content)
        }
        question.userAnswer = JSON.stringify(question.userAnswer)
      }
      console.log(form)
      this.$http.put('/paper/answer/update', form)
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
