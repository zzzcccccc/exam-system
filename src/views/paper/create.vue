<template>
    <div class="app-container">
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
              <span class="content-label">选择学科</span>
              <el-form-item prop="subjectId">
                <el-select
                  v-model="subjectId"
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
            <div class="settings-wrap" style="width: 18%">
              <span class="content-label">截止时间</span>
              <el-form-item prop="deadline">
                <el-date-picker
                  v-model="deadline"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </div>
          </div>
          <h4 class="card-label">试卷标题</h4>
          <div class="card-panel">
            <div class="settings-wrap" style="width: 40%">
              <el-form-item prop="headline">
                <el-input
                  v-model="headline"
                  type="text"
                  placeholder="请输入试卷标题（1-20个字）"
                  maxlength="20"
                  show-word-limit
                />
              </el-form-item>
            </div>
            <div class="settings-wrap" style="width: 40%">
                <el-button
                type="success"
                class="button1"
                style="padding-right: 10px;"
                @click="getAllQues()"
                >添加题目</el-button>
            </div>
          </div>
          <el-button
            type="primary"
            :loading="loading"
            style="margin-top: 20px"
          >
            提交试卷
          </el-button>
        </el-form>
      </div>
      <!-- 添加题目 -->
      <el-dialog title="添加题目" :visible.sync="setQuesDialogFlag" width="60%" >
        <h3>eeeeeee</h3>

        <el-col :span="6">
            <el-select v-model="queryInfo.paperType"  clearable @clear="listAllBlog()" placeholder="请选择题目类型">
            <el-option
                v-for="item in quesTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
            </el-select>
        </el-col>
        <el-col :span="3">
            <el-button  icon="el-icon-search" @click="listAllBlog()"></el-button>
        </el-col>

        <el-table :data="questList" tooltip-effect="dark"  border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="题型" prop="quesTypeId"  width="80px">
            <template  slot-scope="scope">
                <el-tag color="white"  size="medium">
                  {{ scope.row.quesTypeId  &lt; 3 ? scope.row.quesTypeId === 1 ?
                  '单选题' : '多选题'
                : scope.row.quesTypeId &lt; 5 ?
                scope.row.quesTypeId === 3 ?
                    '填空题' : '简答题'
                  : '判断题' }}
                </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="题目" prop="title" show-overflow-tooltip width="290px"></el-table-column>
        <el-table-column label="分数" prop="score" width="60px" ></el-table-column>
        <el-table-column label="难度" prop="difficult" width="60px"></el-table-column>
        <el-table-column label="创建时间" sortable prop="createTime" show-overflow-tooltip ></el-table-column>
        <el-table-column label="操作"  width="65px">
            <template  slot-scope="scope" >
            <el-button type="info" icon="el-icon-view" size="mini" @click="view(scope.row)"></el-button>
            </template>
        </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setQuesDialogFlag = false">取 消</el-button>
          <el-button type="primary" @click="addQues()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
<script>

export default {
  name: 'Create',
  components: {
  },
  data () {
    return {
      options: [], // 年级下拉框
      subjectOptions: [],
      chooseClassIds: [], // 选择的班级
      classOptions: [], // 班级多选框接口返回的数据
      gradeId: null, // 年级ID
      subjectId: null, // 学科ID
      questList: [{}],
      total: 0,
      setQuesDialogFlag: false,
      isSubmit: false,
      loading: false,
      message: '',
      queryInfo: {},
      form: {},
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
    getAllQues () {
      this.isSubmit = true
      //   if (this.gradeId === null) {
      //     this.isSubmit = false
      //     this.message = '请输入年级'
      //   } else if (this.subjectId === null) {
      //     this.isSubmit = false
      //     this.message = '请输入学科'
      //   }
      //   if (!this.isSubmit) {
      //     this.$notify({
      //       title: '警告',
      //       message: this.message,
      //       type: 'warning'
      //     })
      //     return
      //   }

      this.queryInfo.gradeId = this.gradeId
      this.queryInfo.subjectId = this.subjectId

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
