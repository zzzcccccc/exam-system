<!-- data数据 必须是树形结构   demo页面  测试-->
<!-- columns 设置属性 -->
<!-- border边框 -->
<!-- show-row-hover="false" 高亮显示为false -->
<!-- selection-type="false 有>箭头，可以展开 -->
<!-- expand-type="false 有复选框 可以选中 -->
<template>
  <div>
   <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
     <!-- 卡片视图 -->
      <el-card>
        <el-row>
          <el-col :span="4">
              <el-button type="primary" @click="showAddPermission()">添加分类</el-button>
           </el-col>
        </el-row>
        <br/>
        <!-- 表格区域 -->
        <tree-table
          class="tb-cate"
          index-text="#"
          show-index
          stripe
          border
          :data="categoriesdata"
          :columns="columns"
          :expand-type="false"
          :selection-type="false"
        >
          <!-- 排序 -->
          <template slot="level" scope="scope">
            <el-tag type="primary" effect="plain" size="mini" v-if="scope.row.level == 1">
            一级
            </el-tag>
            <el-tag type="success" effect="plain" size="mini" v-else-if="scope.row.level == 2">
            二级
            </el-tag>
            <el-tag type="warning" effect="plain" size="mini" v-else>三级</el-tag>
          </template>
          <!-- 操作 -->
          <template slot="opt" slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="openedit(scope.row)">
            编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="opendel(scope.row)">
            删除
            </el-button>
          </template>
        </tree-table>
      </el-card>
      <!-- 添加分类表单 -->
      <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" >
      <el-form :model="permissionCateForm" :rules="permissionCateFormRules"
      ref="permissionCateForm" label-width="100px">
        <el-form-item label="权限标识" prop="permission" >
            <el-input v-model="permissionCateForm.permission"></el-input>
        </el-form-item>
        <el-form-item label="权限名称" prop="permissionName">
            <el-input v-model="permissionCateForm.permissionName"></el-input>
        </el-form-item>
        <el-form-item label="描述">
            <el-input v-model="permissionCateForm.detail"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
            <el-select v-model="permissionCateForm.parentId" clearable  filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.menu_id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPermission">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类表单 -->
    <el-dialog title="修改分类" :visible.sync="editDialogVisible" width="50%" >
      <el-form :model="permissionCateForm" :rules="permissionCateFormRules"
      ref="permissionCateForm" label-width="100px">
        <el-form-item label="权限标识" prop="permission" >
            <el-input v-model="permissionCateForm.permission"></el-input>
        </el-form-item>
        <el-form-item label="权限名称" prop="permissionName">
            <el-input v-model="permissionCateForm.permissionName"></el-input>
        </el-form-item>
        <el-form-item label="描述">
            <el-input v-model="permissionCateForm.detail"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
            <el-select v-model="permissionCateForm.parentId" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.permissionName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPermission">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tokenFail: this.$store.state.tokenFail,
      columns: [
        { label: '权限名称', prop: 'name' },
        {
          label: '权限标识',
          prop: 'permission'
        },
        {
          label: '描述',
          prop: 'detail'
        },
        {
          label: '分类等级',
          prop: 'level',
          type: 'template',
          template: 'level'
        },
        {
          label: '创建时间',
          prop: 'createTime'
        },
        {
          label: '操作',
          type: 'template',
          width: '200px',
          template: 'opt'
        }
      ],
      categoriesdata: [],
      permissionCateForm: {
        permission: '',
        permissionName: '',
        parentId: '',
        detail: ''
      },
      addDialogVisible: false,
      editDialogVisible: false,
      permissionCateFormRules: {
        permission: [
          { required: true, message: '请输入权限名称', trigger: 'blur' },
          { pattern: /^[^\u4e00-\u9fa5]+$/, message: '不能包含汉字' }
        ],
        permissionName: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ]
      },
      options: [{
        id: 0,
        permissionName: ''
      }]
    }
  },
  created () {
    this.getPermissionAll()
  },
  methods: {
    getPermissionAll () {
      this.$http.get('/menu/getAll/0')
        .then(result => {
          if (result.data.code === 0) {
            this.categoriesdata = result.data.data
          } else if (result.data.code === this.tokenFail) {
            this.$message.error(result.data.msg)
            this.$store.commit('delToken')
            this.$router.push('/')
          } else {
            this.$message.error('获取权限数据失败！')
          }
        })
    },
    showAddPermission () {
      this.permissionCateForm = {}
      this.getPermissionOne()
      this.addDialogVisible = true
    },
    getPermissionOne () {
      this.$http.get('/system/getPermissionOne')
        .then(result => {
          if (result.data.code === 0) {
            this.options = result.data.data
          } else if (result.data.code === this.tokenFail) {
            this.$message.error(result.data.msg)
            this.$store.commit('delToken')
            this.$router.push('/')
          } else {
            this.$message.error('获取权限数据失败！')
          }
        })
    },
    addPermission () {
      this.$refs.permissionCateForm.validate((valid) => {
        if (valid) {
          this.$http.post('/system/addPermission', this.permissionCateForm)
            .then(result => {
              if (result.data.code === 0) {
                this.$message.success(result.data.msg)
                this.getPermissionAll()
                this.addDialogVisible = false
              } else if (result.data.code === this.tokenFail) {
                this.$message.error(result.data.msg)
                this.$store.commit('delToken')
                this.$router.push('/')
              } else {
                this.$message.error(result.data.msg)
              }
            })
        } else {
          return false
        }
      })
    },
    openedit (row) {
      this.getPermissionOne()
      this.permissionCateForm = row
      this.editDialogVisible = true
    },
    editPermission () {
      this.$refs.permissionCateForm.validate((valid) => {
        if (valid) {
          this.$http.post('/system/editPermission', this.permissionCateForm)
            .then(result => {
              if (result.data.code === 0) {
                this.$message.success(result.data.msg)
                this.getPermissionAll()
              } else if (result.data.code === this.tokenFail) {
                this.$message.error(result.data.msg)
                this.$store.commit('delToken')
                this.$router.push('/')
              } else {
                this.$message.error(result.data.msg)
              }
              this.editDialogVisible = false
            })
        } else {
          return false
        }
      })
    },
    opendel (row) {
      this.$confirm('此操作将永久删除角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/system/delPermission/' + row.id + '/' + row.parentId)
          .then(result => {
            if (result.data.code === 0) {
              this.$message.success(result.data.msg)
              // 重新获取用户列表数据
              this.getPermissionAll()
            } else if (result.data.code === this.tokenFail) {
              this.$message.error(result.data.msg)
              this.$store.commit('delToken')
              this.$router.push('/')
            } else {
              this.$message.error(result.data.msg)
            }
          })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    }
  }
}
</script>
