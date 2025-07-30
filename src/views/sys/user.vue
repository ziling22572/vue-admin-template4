<template>
  <div>
    <!--搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchModel.userName" placeholder="用户名" clearable></el-input>
          <el-input v-model="searchModel.phone" placeholder="手机号" clearable></el-input>
          <el-button type="primary" round icon="el-icon-search" @click="getUserList">搜索</el-button>
        </el-col>
        <el-col :span="4" align="right">
          <el-button type="primary" icon="el-icon-plus" circle @click="openEditForm">新增</el-button>
          <!--      <el-button type="primary" icon="el-icon-edit" circle>编辑</el-button>-->
        </el-col>
      </el-row>

    </el-card>
    <!--  列表数据    -->
    <el-card>
      <el-table
        :data="userList"
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
          prop="username"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别">
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

    <el-dialog @close="clearUserForm" :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="userForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名称" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="userForm.status"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="userForm.sex" placeholder="请选择性别">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
            <el-option label="其他" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearUserForm">取 消</el-button>
        <el-button type="primary" @click="submitUser = false">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
//todo @ 代表src目录
import userApi from '@/api/userManager'

export default {
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getUserList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getUserList();
    },
    getUserList() {
      userApi.getUserList(this.searchModel).then(res => {
        this.userList = res.data.rows;
        this.total = res.data.total;
      })
    },
    openEditForm() {
      this.dialogFormVisible = true;
      this.dialogTitle = '用户注册';
    },
    clearUserForm() {
      this.dialogFormVisible = false;
      this.userForm = {}
    },

    submitUser() {
      userApi.addUser(this.userForm).then(res => {
        this.getUserList();
      })
    }
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
        username: '',
        phone: '',
      },
      userForm: {},
      userList: [],
      rules: {
        username: [
          {required: true, message: '请输入名称', trigger: 'blur'},
          {min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur'}
        ],
      }
    }
  },

// todo 使用钩子函数 初始化加载
  created() {
    this.getUserList();
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
