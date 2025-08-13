<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="部门搜索" clearable style="margin-bottom:30px;" />
    <el-tree
      ref="tree2"
      :data="deptTree"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />
  </div>
</template>

<script>
import postManager   from "@/api/postManager";
export default {

  data() {
    return {
      filterText: '',
      deptTree: [],
      defaultProps: {
        children: 'children',
        label: 'deptName'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.deptName.indexOf(value) !== -1
    },
    getDeptTree() {
      postManager.getDeptTree().then(res => {
        this.deptTree = res.data
      })
    }
  },

  created() {
    this.getDeptTree()
  },
}
</script>

