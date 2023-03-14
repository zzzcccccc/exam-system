<template>
    <div>
        <el-select v-model="queryInfo.paperType" filterable   @click.native="listAllBlog()" clearable @clear="listAllBlog()" placeholder="请选择题目类型">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
    </div>
</template>

<script>
export default {
  components: {
  },
  props: {
  },
  data () {
    return {
      queryInfo: {},
      options: []
    }
  },
  created () {
  },
  methods: {
    listAllBlog () {
      this.$http.get('/paper/test', {
      }).then(result => {
        if (result.data.code === 0) {
          this.options = result.data.data
        }
      })
    }
  }
}
</script>
