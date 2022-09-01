
<!-- 使用的elementUi 的 Tree 树形控件 ，使用 render-content (列表、新增)-->
<template>
  <div>
    <div class="custom-tree-container">
        <div class="block">
            <p>测试DEMO 使用 render-content</p>
            <el-tree
            :data="rightsList"
            :props="data"
            show-checkbox
            node-key="menu_id"
            default-expand-all
            :expand-on-click-node="false"
            :render-content="renderContent">
            </el-tree>
        </div>
    </div>
     <el-dialog title="添加权限" :visible.sync="setAddPermissionDialogVisible" width="50%" >
       <el-form :model="permissionForm" ref="permissionForm" :rules="rules" label-width="100px" >
        <el-form-item label="角色标识:" prop="permission" required>
          <el-input v-model="permissionForm.permission" ></el-input>
        </el-form-item>
        <el-form-item label="角色名称:" prop="permissionName" required>
          <el-input v-model="permissionForm.permissionName" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setAddPermissionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPermission">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data () {
    return {
      tokenFail: this.$store.state.tokenFail,
      permissionId: 0,
      rightsList: [],
      setAddPermissionDialogVisible: false,
      data: {
        id: 'menu_id',
        label: 'name',
        children: 'children'
      },
      permissionForm: {
        permission: '',
        permissionName: ''
      },
      rules: {
        permission: [
          { required: true, message: '请输入权限名称', trigger: 'blur' },
          { pattern: /^[^\u4e00-\u9fa5]+$/, message: '不能包含汉字' }
        ],
        permissionName: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ]
      }
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
            this.rightsList = result.data.data
          } else if (result.data.code === this.tokenFail) {
            this.$message.error(result.data.msg)
            this.$store.commit('delToken')
            this.$router.push('/')
          } else {
            this.$message.error('获取权限数据失败！')
          }
        })
    },
    append (data) {
      this.permissionId = data.id
      this.setAddPermissionDialogVisible = true
    },
    addPermission () {
      this.$refs.permissionForm.validate((valid) => { // 开启校验
        if (valid) {
          this.permissionForm.parentId = this.permissionId
          this.$http.post('/system/addPermission', this.permissionForm)
            .then(result => {
              if (result.data.code === 0) {
                this.$message.success(result.data.msg)
                this.getPermissionAll()
                this.setAddPermissionDialogVisible = false
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
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },

    renderContent (h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button size="mini" type="text" on-click={ () => this.append(data) }> + 新增</el-button>
            <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
          </span>
        </span>)
    }
  }
}
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
