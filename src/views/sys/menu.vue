<template>
  <div>
    <!--搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchModel.name" placeholder="菜单名称" clearable></el-input>
          <el-input v-model="searchModel.menuCode" placeholder="菜单编码" clearable></el-input>
          <el-button type="primary" round icon="el-icon-search" @click="getMenuList">搜索</el-button>
        </el-col>
        <el-col :span="4" align="right">
          <el-button type="primary" icon="el-icon-plus" circle @click="openEditForm(null)">新增</el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-card>
      <el-table :data="menuList" row-key="id" default-expand-all
                :tree-props="{ children: 'children', hasChildren: false }">
        <el-table-column prop="name" label="菜单名称"/>
        <el-table-column prop="menuCode" label="编码"/>
        <el-table-column prop="path" label="路径"/>
        <el-table-column prop="icon" label="图标"/>
        <el-table-column prop="orderNum" label="排序"/>
        <!--        <el-table-column prop="createdAt" label="创建时间"/>-->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="action-buttons">
              <el-button size="mini" type="info" @click="openDetailForm(scope.row.id)">查看</el-button>
              <el-button size="mini" type="primary" @click="openEditForm(scope.row.id)">编辑</el-button>
              <el-button size="mini" type="warning" @click="handleDelete(scope.row)">删除</el-button>
              <el-button size="mini" type="danger" @click="addChildren(scope.row.id)">新增子项</el-button>
            </div>
          </template>
          /
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog @close="clearMenuForm" :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="menuForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"  :disabled="isDetail">
        <el-form-item label="父节点">
          <el-select v-model="menuForm.parentId" placeholder="请选择父级菜单" filterable clearable style="width: 100%">
            <el-option
              v-for="item in flatMenuList"
              :key="item.id"
              :label="item.indentedName"
              :value="item.id"
              :disabled="item.id === menuForm.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="menuForm.name"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="menuCode">
          <el-input v-model="menuForm.menuCode"></el-input>
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="menuForm.path"></el-input>
        </el-form-item>

        <el-form-item label="图表" prop="icon">
          <el-input v-model="menuForm.icon"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!isDetail">
        <el-button @click="clearMenuForm">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>


</template>

<script>
import menuApi from '@/api/menuManager'

export default {
  data() {
    return {
      isDetail: false, // 是否是详情模式
      // 对话框标题：动态
      dialogTitle: '',
      // 是否可见
      dialogFormVisible: false,
      menuList: [],
      menuForm: {
        name: '',
        menuCode: '',
        parentId: 0,
        path: '',
        icon: ''
      },
      searchModel: {
        name: '',
        menuCode: ''
      },
      // 校验规则
      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'},
          {min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur'}
        ],
      },
    }
  },
  created() {
    this.loadMenuData()
  },
  computed: {
    flatMenuList() {
      const result = []
      const flatten = (list, level = 0) => {
        list.forEach(item => {
          result.push({
            id: item.id,
            indentedName: `${'—'.repeat(level * 2)} ${item.name}`.trim()
          })
          if (item.children && item.children.length) flatten(item.children, level + 1)
        })
      }
      flatten(this.menuList)
      return result
    }
  },
  methods: {
    async loadMenuData() {
      const res = await menuApi.getMenuTree()
      if (res.code === 20000) {
        this.menuList = res.data
      }
    },
    getMenuList() {
      if (this.searchModel.name.length > 0 || this.searchModel.menuCode.length > 0) {
        menuApi.getMenuListTree(this.searchModel).then(res => {
          if (res.code === 20000) {
            this.menuList = res.data
          }
        });
      } else {
        // 获取菜单树
        this.loadMenuData()
      }
    },
    // 详情界面 关闭操作按钮和页面只能查看
    openDetailForm(id) {
      this.isDetail = true; // 详情模式
      this.dialogFormVisible = true;
      this.dialogTitle = '菜单详情';
      // 通过 id获取用户信息
      menuApi.getMenuById(id).then(res => {
        this.menuForm = res.data
      })
      // 关闭其他按钮和页面只能查看
    },
    addChildren(parentId) {
      this.isDetail = false; // 可编辑
      this.dialogFormVisible = true;
      this.dialogTitle = '菜单新增';
      this.menuForm.parentId = parentId
    },
    clearMenuForm() {
      this.dialogFormVisible = false;
      this.menuForm = {};
      // todo 清除校验
      this.$refs.ruleForm.clearValidate();
      this.menuForm.parentId = '0';
    },

    openEditForm(id) {
      this.isDetail = false;
      this.dialogFormVisible = true;
      if (id == null) {
        this.dialogTitle = '菜单新增';
      } else {
        this.dialogTitle = '菜单修改';
        // 通过 id获取用户信息
        menuApi.getMenuById(id).then(res => {
          this.menuForm = res.data
        })
      }
    },
    submitForm() {
      if (this.loading) return; // 防止重复点击
      // 验证表单
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return; // 如果表单无效，返回
        this.loading = true; // 开启加载状态
        this.addUserRequest()
          .then(this.handleSuccessResponse)
          .finally(this.handleFinally);
      });
    },

    addUserRequest() {
      // console.log(this.menuForm)
      return menuApi.submit(this.menuForm);
    },

    // 成功响应处理
    handleSuccessResponse(response) {
      if (response.code === 20000) {
        this.$message({
          message: response.message || '操作成功',
          type: 'success'
        });
        this.dialogFormVisible = false;
        this.loadMenuData();
      }
    },
// 最终处理（无论成功或失败都会执行）
    handleFinally() {
      this.loading = false; // 结束加载状态
    },

    handleDelete(menu) {
      this.$confirm(`此操作将删除【${menu.name}】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        menuApi.deleteMenuById(menu.id).then(response => {
          if (response.code === 20000) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            // 重新加载
            this.loadMenuData();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }

}
</script>

<style>
#search .el-input {
  width: 200px;
  margin-right: 10px;
}

.el-card {
  margin-bottom: 10px;
}

.action-buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 4px;
  justify-content: flex-start;
}

</style>

