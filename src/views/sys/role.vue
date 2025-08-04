<template>
  <div>
    <!--搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchModel.name" placeholder="角色名称" clearable></el-input>
          <el-button type="primary" round icon="el-icon-search" @click="getRoleList">搜索</el-button>
        </el-col>
        <el-col :span="4" align="right">
          <el-button type="primary" icon="el-icon-plus" circle @click="openEditForm(null)">新增</el-button>
        </el-col>
      </el-row>

    </el-card>
    <!--  列表数据    -->
    <el-card>
      <el-table
        :data="roleList"
        style="width: 100%"
        :row-class-name="tableRowClassName">
        <el-table-column
          type="index"
          label="序号"
          width="80">
          <!--作用域插槽,补充动态分页统计-->
          <template slot-scope="scope">
            {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column
          prop="name"
          label="名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="description"
          label="角色描述"
          width="180">
        </el-table-column>
        <el-table-column
          prop="roleCode"
          label="角色编码"
          width="180">
        </el-table-column>
        <el-table-column
          prop="createdAt"
          label="创建时间">
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle size="mini"
                       @click="openEditForm(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="mini"
                       @click="deleteRoleForm(scope.row)"></el-button>


          </template>
        </el-table-column>

      </el-table>
    </el-card>
    <!--    分页组件-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchModel.pageNo"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <el-dialog @close="clearRoleForm" :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="roleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="roleForm.description"></el-input>
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="roleForm.roleCode"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearRoleForm">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
//todo @ 代表src目录
import roleApi from '@/api/roleManager'

export default {
  methods: {
    tableRowClassName({rowIndex}) {
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getRoleList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getRoleList();
    },
    getRoleList() {
      roleApi.getRoleList(this.searchModel).then(res => {
        this.roleList = res.data.rows;
        this.total = res.data.total;
      })
    },

    deleteRoleForm(role) {
      this.$confirm(`此操作将删除角色${role.name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        roleApi.deleteRole(role.id).then(response => {
          if (response.code === 20000) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.getRoleList();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    openEditForm(id) {
      this.dialogFormVisible = true;
      if (id == null) {
        this.dialogTitle = '角色新增';
      } else {
        this.dialogTitle = '角色修改';
        // 通过 id获取用户信息
        roleApi.getRoleById(id).then(res => {
          this.roleForm = res.data
        })
      }
    },
    clearRoleForm() {
      this.dialogFormVisible = false;
      this.roleForm = {}
      // todo 清除校验
      this.$refs.ruleForm.clearValidate()
    },
    submitForm() {
      if (this.loading) return; // 防止重复点击
      // 验证表单
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return; // 如果表单无效，返回
        this.loading = true; // 开启加载状态
        this.addRoleRequest()
          .then(this.handleSuccessResponse)
          .finally(this.handleFinally);
      });
    },

// 添加用户请求
    addRoleRequest() {
      return roleApi.submit(this.roleForm);
    },

// 成功响应处理
    handleSuccessResponse(response) {
      if (response.code === 20000) {
        this.$message({
          message: response.message || '操作成功',
          type: 'success'
        });
        this.dialogFormVisible = false;
        this.getRoleList();
      }
    },
// 最终处理（无论成功或失败都会执行）
    handleFinally() {
      this.loading = false; // 结束加载状态
    },


  },
  data() {
    return {
      formLabelWidth: '120px',
      // 对话框标题：动态
      dialogTitle: '',
      // 是否可见
      dialogFormVisible: false,
      total: 0,
      searchModel: {
        pageSize: 10,
        pageNo: 1,
        name: ''
      },
      roleForm: {},
      roleList: [],
      // 校验规则
      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'},
          {min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '请输入名称', trigger: 'blur'},
          {min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur'}
        ],
        roleCode: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
          { pattern: /^[A-Za-z]+$/, message: '只能输入大小写字母', trigger: 'blur' }
        ]
      },
      // 下拉列表
      sexOptions: [
        {id: 1, name: '男'},
        {id: 2, name: '女'},
        {id: 3, name: '其他'}
      ],
      statusOptions: [
        {id: 1, name: '正常'},
        {id: 0, name: '禁用'}
      ],
    }
  },

// todo 使用钩子函数 初始化加载
  created() {
    this.getRoleList();
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

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}


</style>
