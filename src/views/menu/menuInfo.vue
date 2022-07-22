<template>
<div>
   <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>目录管理</el-breadcrumb-item>
      <el-breadcrumb-item>目录列表</el-breadcrumb-item>
    </el-breadcrumb>
     <!-- 卡片视图 -->
      <el-card>
        <el-row>
          <el-col :span="4">
              <el-button type="primary"  @click="showAddcategory">添加分类</el-button>
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
           <!-- 是否有效 -->
          <template slot="isok" slot-scope="scope">
           <el-tag :type="(scope.row.showFlag == '0' ? 'success' :  'danger')">
                {{ scope.row.showFlag == '0' ? '显示' : '隐藏'}}
            </el-tag>
          </template>
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
            <el-button type="success" icon="el-icon-plus" size="mini" @click="openadd(scope.row)">
            新增
            </el-button>
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
      <el-form :model="cateForm"
      ref="cateForm" label-width="100px" :rules="cateFormRules">
        <el-form-item label="目录名称" prop="authName" >
            <el-input v-model="cateForm.authName"></el-input>
        </el-form-item>
        <el-form-item label="访问路径" prop="path">
            <el-input v-model="cateForm.path"></el-input>
        </el-form-item>
        <el-form-item label="目录icon">
            <el-input v-model="cateForm.icon"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="showFlag"  required>
          <el-select v-model="cateForm.showFlag" placeholder="状态">
          <el-option v-for="item in statusEnum" :key="item.key" :value="item.key" :label="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
            <el-input v-model="cateForm.detail"></el-input>
        </el-form-item>
        <el-form-item label="父级分类"  filterable placeholder="请选择">
          <el-cascader
            v-model="value"
            :options="options"
            :props="cascaderProps"
            clearable
            @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMenu">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类表单 -->
      <el-dialog title="编辑分类" :visible.sync="editDialogVisible" width="50%" >
      <el-form :model="editCateForm"
      ref="editCateForm" label-width="100px" :rules="cateFormRules">
        <el-form-item label="目录名称" prop="authName" >
            <el-input v-model="editCateForm.authName"></el-input>
        </el-form-item>
        <el-form-item label="访问路径" prop="path" >
            <el-input v-model="editCateForm.path" style="width: 100%;outline: none;height: 100%" disabled></el-input>
        </el-form-item>
        <el-form-item label="目录icon">
            <el-input v-model="editCateForm.icon"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="showFlag"  required>
          <el-select v-model="editCateForm.showFlag" placeholder="状态">
          <el-option v-for="item in statusEnum" :key="item.key" :value="item.key" :label="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
            <el-input v-model="editCateForm.detail"></el-input>
        </el-form-item>
        <el-form-item label="父级分类"  filterable placeholder="请选择">
          <el-cascader
            v-model="value"
            :options="options"
            :props="cascaderProps"
            clearable
            @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editMenu">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      columns: [
        { label: '目录名称', prop: 'authName', width: '150px' },
        { label: '访问路径', prop: 'path' },
        { label: '目录icon', prop: 'icon' },
        { label: '描述', prop: 'detail' },
        { label: '状态', prop: 'showFlag', type: 'template', template: 'isok', width: '80px' },
        { label: '等级', prop: 'level', type: 'template', template: 'level' },
        { label: '创建时间', prop: 'createTime' },
        { label: '操作', type: 'template', width: '280px', template: 'opt' }
      ],
      categoriesdata: [],
      addDialogVisible: false,
      editDialogVisible: false,
      cateForm: {},
      editCateForm: {},
      menuId1: null,
      value: [],
      options: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'id',
        label: 'authName',
        children: 'children',
        expandTrigger: 'hover', // 悬浮显示
        checkStrictly: true // 可以选择任一级选项
      },
      cateFormRules: {
        path: [
          { required: true, message: '请输入访问路径', trigger: 'blur' },
          { pattern: /^[^\u4e00-\u9fa5]+$/, message: '不能包含汉字' }
        ],
        authName: [
          { required: true, message: '请输入目录名称', trigger: 'blur' }
        ],
        showFlag: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ]
      },
      statusEnum: [
        {
          key: '0',
          value: '展示'
        }, {
          key: '1',
          value: '隐藏'
        }
      ]
    }
  },
  created () {
    this.getMenuAll()
    this.getSecondLevel()
  },
  methods: {
    getMenuAll () {
      this.options = []
      this.$http.get('/menu/getAll')
        .then(result => {
          if (result.data.code === 0) {
            this.categoriesdata = result.data.data
            // this.options = result.data.data
          } else {
            this.$message.error('获取权限数据失败！')
          }
        })
    },
    getSecondLevel () {
      this.options = []
      this.$http.get('/menu/getSecondLevel')
        .then(result => {
          if (result.data.code === 0) {
            this.options = result.data.data
          } else {
            this.$message.error('获取权限数据失败！')
          }
        })
    },
    showAddcategory () {
      this.cateForm = {}
      this.addDialogVisible = true
    },
    handleChange (value) {
      this.cateForm.value = value
      this.editCateForm.value = value
    },
    addMenu () {
      this.$refs.cateForm.validate((valid) => {
        if (valid) {
          this.$http.post('/menu/addMenu', this.cateForm)
            .then(result => {
              if (result.data.code === 0) {
                this.$message.success(result.data.msg)
                this.getMenuAll()
                this.addDialogVisible = false
              } else {
                this.$message.error(result.data.msg)
              }
            })
        } else {
          return false
        }
      })
    },
    openadd (row) {
      this.cateForm = {}
      this.value = []
      if (row.parentId !== -1) {
        this.value.push(row.parentId)
      }
      this.value.push(row.id)
      this.cateForm.value = this.value // 回显子类的名称
      this.addDialogVisible = true
    },
    openedit (row) {
      if (row.level === 3) {
        this.$http.get('/menu/getInfoById/' + row.parentId)
          .then(result => {
            if (result.data.code === 0) {
              this.value = []
              this.value.push(result.data.data.parentId)
              this.value.push(row.parentId)
              this.editCateForm = row
              this.editCateForm.value = this.value // 回显子类的名称
              this.editDialogVisible = true
            }
          })
      } else {
        this.value = []
        this.value.push(row.parentId)
        this.editCateForm = row
        this.editCateForm.value = this.value // 回显子类的名称
        this.editDialogVisible = true
      }
    },
    editMenu () {
      this.$refs.editCateForm.validate((valid) => {
        console.log(this.editCateForm)
        if (valid) {
          this.$http.put('/menu/editMenu', this.editCateForm)
            .then(result => {
              if (result.data.code === 0) {
                this.$message.success(result.data.msg)
                this.getMenuAll()
                this.editDialogVisible = false
              } else {
                this.$message.error(result.data.msg)
              }
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
        this.$http.delete('/menu/delMenu/' + row.id + '/' + row.parentId)
          .then(result => {
            if (result.data.code === 0) {
              this.$message.success(result.data.msg)
              this.getMenuAll()
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
