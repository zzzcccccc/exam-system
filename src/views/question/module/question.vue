<template>
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="margin-bottom: -10px">
        <!-- 卡片名称 -->
        <span
          class="type-name"
           v-text="question.quesTypeId < 3 ?
            question.quesTypeId === 1 ?
              '单选题' : '多选题'
            : question.quesTypeId < 5 ?
              question.quesTypeId === 3 ?
                '填空题' : '简答题'
              : '判断题'"
        ></span>
        <el-input v-model="question.score" style="width: 55px" />
        <span>分</span>
        <el-button style="float: right; border: none; font-size: 20px" icon="el-icon-close" @click="removeQuestion" />
      </div>
      <el-form-item>
        <el-input
          v-model="question.title"
          type="textarea"
          placeholder="请输入题干内容..."
        />
      </el-form-item>
      <!--单选、多选-->
      <el-form-item v-if="question.quesTypeId === 1 || question.quesTypeId === 2" style="margin-bottom: 0px">
        <el-checkbox-group
          v-model="question.answer"
          :min="0"
          :max="question.quesTypeId === 1 ? 1 : 4"
        >
          <el-row
            v-for="(item, index) in ['A', 'B', 'C', 'D']"
            :key="item"
          >
            <el-col :span="1">
              <el-checkbox-button
                v-model="question.answer"
                :label="question.content[index]"
                border
              >
                {{ item }}
              </el-checkbox-button>
            </el-col>
            <el-col :span="23">
              <el-input
                v-model="question.content[index]"
                placeholder="请输入选项..."
                @input="contentChange(question)"
              />
            </el-col>
          </el-row>
        </el-checkbox-group>
      </el-form-item>
      <!--简答、填空-->
      <el-form-item v-if="question.quesTypeId === 3 || question.quesTypeId === 4" style="margin-bottom: 0px">
        <el-input
          v-model="question.answer[0]"
          type="textarea"
          placeholder="请输入参考答案"
        />
      </el-form-item>
      <!--判断-->
      <el-form-item v-if="question.quesTypeId === 5" style="margin-bottom: 0px">
        <el-checkbox-group
          v-model="question.answer"
          :min="0"
          :max="1"
        >
          <el-checkbox v-model="question.answer" label="对" border />
          <el-checkbox v-model="question.answer" label="错" border />
        </el-checkbox-group>
      </el-form-item>
      <br/>
      <el-form-item>
        <el-input
          v-model="question.analyze"
          type="textarea"
          placeholder="请输入解析..."
        />
      </el-form-item>
      <!-- 打分 星标 -->
      <el-form-item>
        <div class="rate">
          <span v-if="showText" class="text">{{question.difficult}}分</span>
          <div class="star-wrap">
            <i> 难度&nbsp;:&nbsp;&nbsp;</i>
            <i
              v-for="(i, index) in 5"
              :key="index"
              @mouseenter="disabled ? '' :  question.difficult=i"
              :class="getClass(i)"
            >
            </i>
          </div>
        </div>
      </el-form-item>
    </el-card>
  </template>

<script>

export default {
  components: {
  },
  props: {
    question: {
      type: Object,
      required: true
    },
    // 是否只读，默认false，鼠标点击可以打分
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否显示分数，默认false
    showText: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      //  difficult: ''// 星星的数量
    }
  },
  methods: {
    removeQuestion () {
      this.$emit('removeQuestion', this.question.id)
    },
    contentChange (question) {
      question.answer.splice(0)
    },
    getClass (i) {
      return i <= this.question.difficult ? 'icon-star' : 'icon-star-o'
    }

  }
}
</script>

  <style lang="less" scoped>
  .type-name {
    color: #505050;
    margin-right: 20px;
  }

  .rate{
  .text{
    font-size: 18px;
    color: #ff7f2c;
    font-weight: bold;
  }
  .star-wrap{
    line-height: 0;
    .icon-star-o{
      position: relative;
      width:18px;
      height: 18px;
      line-height: 0;
      display: inline-block;
      margin-right: 2px;
      background: url('../../../assets/img/icon-star-gray.jpg') 0 0 ~'/' auto 100%;
      .icon-star{
        position: absolute;
        left:0;
        top:0;
      }
    }
    .icon-star{
      width: 18px;
      height: 18px;
      line-height: 0;
      display: inline-block;
      margin-right: 2px;
      background: url('../../../assets/img/icon-star-yellow.jpg') 0 0 ~'/' auto 100%;
    }
    i:last-child{
      margin-right: 0px;
    }
  }
}

  </style>
