<template>
<div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学科管理</el-breadcrumb-item>
      <el-breadcrumb-item>学科列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
     <el-card>
      <el-row :gutter="20"
        ><!-- gutter是指定每个分栏的间隔 -->
        <!-- 分栏一共占24格，给搜索框7格，添加按钮4格 -->
        <el-col :span="4">
          <!-- 搜索与添加区域 clearable清空输入框-->
          <el-input placeholder="请输入科目名称"  v-model="queryInfo.name" clearable @clear="getPageSubject()">
          </el-input>
        </el-col>
        <el-col :span="4">
            <el-select v-model="queryInfo.gradeName" filterable placeholder="请选择年级"  clearable @clear="getPageSubject()">
                <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.name">
                </el-option>
            </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-search" @click="getPageSubject()">搜索</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="success" icon="el-icon-plus"   @click="addShow()">新增</el-button>
        </el-col>
      </el-row>
      <br/>
      <el-table  :data="list" border stripe>
        <el-table-column type="index" label="序号"  width="55"  align="center"/>
        <el-table-column prop="name" label="学科名称"/>
        <el-table-column prop="gradeName" label="年级" />
        <el-table-column prop="createTime" label="创建时间" width="160px"/>
        <el-table-column label="操作" width="290px">
            <template slot-scope="scope">
                <!-- 放置修改、删除按钮 -->
                <el-tooltip effect="dark" content="修改" placement="top">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row)">修改</el-button>
                </el-tooltip>
                 <el-tooltip effect="dark" content="删除" placement="top">
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row)">删除</el-button>
                </el-tooltip>
            </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.current" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="新增" :visible.sync="addDialogVisible" width="50%" >
      <el-form :model="subjectInfo"  :rules="rules"  label-width="100px" >
        <el-form-item label="角色标识:" prop="role">
          <el-input v-model="subjectInfo.role" ></el-input>
        </el-form-item>
        <el-form-item label="角色名称:" prop="roleName">
          <el-input v-model="subjectInfo.roleName" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add(subjectInfo)">确 定</el-button>
      </span>
    </el-dialog>
</div>
</template>
<script>
export default {
  data () {
    return {
      queryInfo: {
        current: 1,
        size: 10,
        name: '',
        gradeName: ''
      },
      list: [],
      options: [], // 年级下拉框
      addDialogVisible: false,
      subjectInfo: {}
    }
  },
  created () {
    this.getPageSubject()
    this.getAllGrade() // 年级列表
  },
  methods: {
    getPageSubject () {
      this.$http.get('/subject/getPageSubject', {
        params: this.queryInfo
      }).then(result => {
        if (result.data.code === 0) {
          const res = result.data.data
          this.list = res.records
          this.total = res.total
        } else if (result.data.code === this.tokenFail) {
          this.$message.error(result.data.msg)
          this.$store.commit('delToken')
          this.$router.push('/')
        } else {
          this.$message.error('查询失败')
        }
      })
    },
    // 分页 ===监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.size = newSize// 重新指定每页数据量
      this.getPageSubject()// 带着新的分页请求获取数据
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.current = newPage// 重新指定当前页
      this.getPageSubject()// 带着新的分页请求获取数据
    },
    getAllGrade () {
      this.$http.get('/subject/getAllGrade').then(result => {
        if (result.data.code === 0) {
          this.options = result.data.data
        } else {
          this.$message.error('查询失败')
        }
      })
    },
    addShow () {
      this.addDialogVisible = true
    }
  }
}
</script>
