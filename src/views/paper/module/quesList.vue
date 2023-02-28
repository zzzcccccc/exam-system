<template>
    <div  class="el-form-item el-form-item--default asterisk-left"
        role="group" aria-labelledby="el-id-2022-421" style="margin-top: 20px;
        padding-bottom: 20px; border-bottom: 1px solid rgb(223, 230, 236);">
        <div  class="el-form-item__label" style="width: 100px;">题目{{question.id}} ：</div>
        <div class="el-form-item__content">
            <div style="display: flex;" >
                <div style="line-height: 1.8; flex: 1 1 0%;" >
                    <div class="q-title" style="display: inline; margin-right: 10px;" >
                        {{question.title}}
                    </div>
                    <div class="q-content">
                        <span v-if="question.quesTypeId == 1 || question.quesTypeId== 2">
                            <span class="q-item-prefix">A</span>
                            <span class="q-item-content"> {{question.content[0]}}</span>
                            <span class="q-item-prefix">B</span>
                            <span class="q-item-content">{{question.content[1]}}</span>
                            <span class="q-item-prefix">C</span>
                            <span class="q-item-content">{{question.content[2]}}</span>
                            <span class="q-item-prefix">D</span>
                            <span class="q-item-content">{{question.content[3]}}</span>
                        </span>
                        <span v-if="question.quesTypeId == 5">
                            <span class="q-item-content">( </span>
                            <span class="q-item-content">对 </span>
                            <span class="q-item-content"> 错</span>
                            <span class="q-item-content"> )</span>
                        </span>
                    </div>
                </div>
                <div>
                    <el-button  style="position:absolute;right:0px;" icon="el-icon-delete" class="el-btn" type="danger"  @click="removeQuestion"></el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    question: {
      type: Object,
      required: true
    }
  },
  methods: {
    removeQuestion () {
      this.$emit('removeQuestion', this.question.id)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .el-form-item__label{
        display: inline-flex;
        justify-content: flex-end;
        align-items: flex-start;
        flex: 0 0 auto;
        font-size: 13px;
        color: #bfc0c3;
        height: 32px;
        line-height: 32px;
        padding: 0 12px 0 0;
        box-sizing: border-box;
    }
    .el-form-item__content {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        flex: 1;
        line-height: 32px;
        position: relative;
        font-size: 13px;
        min-width: 0;
    }
    .q-item-prefix {
        margin: 5px 10px;
    }
    .q-item-content {
        margin: 5px;
        white-space: normal;
        .q-item-content{
            font-size: 10px;
        }
    }
</style>
