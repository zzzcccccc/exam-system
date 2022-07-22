<template>
<div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
         <el-col :span="4">
          <el-button type="primary" @click="showAddRoleDialog()">添加角色</el-button>
        </el-col>
    </el-row>
    <br/>
    <!-- 带边框、斑马纹  v-loading="listLoading" 预加载-->
      <el-table  v-loading="listLoading"  :data="list" border stripe>
        <el-table-column type="index" label="序号"  width="70"  align="center"/>
        <el-table-column prop="role" label="角色标识"/>
        <el-table-column prop="roleName" label="角色名称"/>
        <el-table-column prop="createTime" label="创建时间"/>
        <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
                <!-- 放置修改、删除和分配角色按钮  -->
                <!--  鼠标放上去会提示内容标签 <el-tooltip effect="dark" content="删除" placement="top"></el-tooltip> -->
                <el-button type="warning" icon="el-icon-setting" size="mini"  @click="showRole(scope.row)" >分配权限</el-button>
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="delRole(scope.row)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" >
      <!-- 树形组件 -->
        <el-tree :data="rightsList" :props="treeProps" show-checkbox default-expand-all
          node-key="id" :default-checked-keys="defkeys"  ref="treeRef" ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolePermission()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%" >
      <el-form :model="roleForm" ref="roleForm"  label-width="100px" >
        <el-form-item label="角色标识:">
          <el-input v-model="roleForm.role" style="width: 100%;outline: none;height: 100%" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称:">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
         <el-form-item label="创建时间:">
          <el-input v-model="roleForm.createTime" style="width: 100%;outline: none;height: 100%" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" >
      <el-form :model="roleForm" ref="roleForm" :rules="rules"  label-width="100px" >
        <el-form-item label="角色标识:" prop="role">
          <el-input v-model="roleForm.role" ></el-input>
        </el-form-item>
        <el-form-item label="角色名称:" prop="roleName">
          <el-input v-model="roleForm.roleName" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole(roleForm)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      list: [],
      listLoading: true,
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      editDialogVisible: false,
      addDialogVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'permissionName',
        children: 'children'
      },
      // 默认选中的权限ID数组对象
      defkeys: [],
      roleId: 0,
      roleForm: {
        id: 0,
        role: '',
        roleName: '',
        createTime: ''
      },
      rules: {
        role: [
          { required: true, message: '请输入角色标识', trigger: 'blur' },
          { pattern: /^[^\u4e00-\u9fa5]+$/, message: '不能包含汉字' }
        ],
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.listAllBlog()
  },
  methods: {
    listAllBlog () {
      this.listLoading = true
      this.$http.get('/system/getAllRole').then(result => {
        // this.list = result.data;
        if (result.data.code === 0) {
          const res = result.data.data
          this.list = res
        } else {
          this.$message.error('查询失败')
        }
        this.listLoading = false
      })
    },
    showRole (row) {
      this.roleId = row.id
      this.$http.get('/system/getAllPermission')
        .then(result => {
          if (result.data.code === 0) {
            this.rightsList = result.data.data
          } else {
            this.$message.error('获取权限数据失败！')
          }
        })
      // 角色ID row.id
      this.defkeys = [] // 清空已选权限
      this.$http.get('/system/getUsePermissionByRoleId/' + row.id)
        .then(result => {
          if (result.data.code === 0) {
            this.defkeys = result.data.data
            this.setRightDialogVisible = true
          } else {
            this.$message.error('获取权限数据失败！')
          }
        })
    },
    editRolePermission () {
      // "..."为“展开运算符”，将一个数组转为用逗号分隔的参数序列
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys()
        // ...this.$refs.treeRef.getHalfCheckedKeys() // 半选中的节点(父类的Id)
      ]
      console.log(keys)
      this.$http.put('/system/editRolePermission/', {
        roleId: this.roleId,
        permissionIds: keys
      })
        .then(result => {
          if (result.data.code === 0) {
            this.$message.success('分配权限成功！')
            // 重新获取用户列表数据
            this.listAllBlog()
          } else {
            this.$message.error('分配权限失败！')
          }
        })

      this.setRightDialogVisible = false
    },
    showEditDialog (row) {
      this.roleForm = row
      this.editDialogVisible = true
    },
    editRole () {
      this.$http.put('system/editRole', this.roleForm)
        .then(result => {
          if (result.data.code === 0) {
            this.$message.success(result.data.msg)
            this.listAllBlog()
            this.editDialogVisible = false
          } else {
            this.$message.error(result.data.msg)
          }
        })
    },
    delRole (row) {
      // 弹框询问用户是否删除数据
      this.$confirm('此操作将永久删除角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/system/delRole/' + row.id)
          .then(result => {
            if (result.data.code === 0) {
              this.$message.success(result.data.msg)
              // 重新获取用户列表数据
              this.listAllBlog()
            } else {
              this.$message.error(result.data.msg)
            }
          })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    showAddRoleDialog () {
      this.addDialogVisible = true
    },
    addRole (roleForm) {
      this.$refs.roleForm.validate((valid) => { // 开启校验
        if (valid) { // 如果校验通过，请求接口，允许提交表单
          this.$http.post('system/addRole', {
            role: roleForm.role,
            roleNamme: roleForm.roleName
          })
            .then(result => {
              if (result.data.code === 0) {
                this.$message.success(result.data.msg)
                this.listAllBlog()
                this.addDialogVisible = false
              } else {
                this.$message.error(result.data.msg)
              }
            })
        } else { // 校验不通过
          return false
        }
      })
    }
  }
}
</script>
