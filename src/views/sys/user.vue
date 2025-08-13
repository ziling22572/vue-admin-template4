<template>
  <div>
    <el-container>
      <el-aside width="200px">
        <el-input v-model="filterText" placeholder="部门搜索" clearable style="margin-top:30px;" />
        <el-tree
          ref="tree2"
          :data="deptTree"
          :props="defaultProps"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
          class="filter-tree"
          default-expand-all
        />
      </el-aside>
      <el-main>
        <!--搜索栏-->
        <el-card id="search">
          <el-row>
            <el-col :span="20">
              <el-input v-model="searchModel.username" placeholder="用户名" clearable></el-input>
              <el-input v-model="searchModel.phone" placeholder="手机号" clearable></el-input>
              <el-select v-model="searchModel.status" placeholder="请选择状态" clearable>
                <el-option
                  v-for="item in statusOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-button type="primary" round icon="el-icon-search" @click="getUserList">搜索</el-button>
            </el-col>
            <el-col :span="4" align="right">
              <el-button type="primary" icon="el-icon-plus" circle @click="openEditForm(null)">新增</el-button>
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
              <template slot-scope="scope">
                <a
                  href="javascript:void(0);"
                  style="color: #409EFF; cursor: pointer;"
                  @click="openViewForm(scope.row.id)"
                >
                  {{ scope.row.username }}
                </a>
              </template>
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
              <template slot-scope="scope">
                <el-tag v-if="scope.row.sex===1">男</el-tag>
                <el-tag v-if="scope.row.sex===2" type="info">女</el-tag>
                <el-tag v-if="scope.row.sex===3" type="danger">其他</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status===1">正常</el-tag>
                <el-tag v-else type="danger">禁用</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="createdAt"
              label="创建时间">
            </el-table-column>

            <el-table-column
              prop="deptName"
              label="归属部门">
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" circle size="mini"
                           @click="openEditForm(scope.row.id)"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle size="mini"
                           @click="deleteUserForm(scope.row)"></el-button>
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

      </el-main>
    </el-container>

    <el-dialog @close="clearUserForm" :title="dialogTitle" :visible.sync="dialogFormVisible" :disabled="readOnlyMode">
      <el-form :model="userForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名称" prop="username">
          <el-input v-model="userForm.username" :disabled="readOnlyMode"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" :disabled="readOnlyMode"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" :disabled="readOnlyMode"></el-input>
        </el-form-item>

        <el-form-item label="密码" v-if="userForm.id==null||false" prop="password">
          <el-input
            :type="showPassword ? 'text' : 'password'"
            v-model="userForm.password"
            placeholder="请输入密码"
            :disabled="readOnlyMode">
            <template #append>
              <el-button @click="togglePasswordVisibility" icon="el-icon-view" size="mini" :disabled="readOnlyMode"></el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="userForm.status"
            :active-value="1"
            :inactive-value="0"
            :disabled="readOnlyMode">
          </el-switch>
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <el-select v-model="userForm.sex" placeholder="请选择性别" :disabled="readOnlyMode">
            <el-option
              v-for="item in sexOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="角色权限" prop="roleIds">
          <el-checkbox-group v-model="userForm.roleIds" :disabled="readOnlyMode">
            <el-checkbox v-for="role in roleList" :label="role.id" :key="role.id">{{ role.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="归属部门" prop="deptId">
          <el-tree
            :data="deptTree"
            show-checkbox
            default-expand-all
            node-key="id"
            :checked-keys="[userForm.deptId]"
            ref="tree"
            highlight-current
            check-strictly
            :disabled="readOnlyMode"
            :props="defaultProps"
            @check="handleSingleCheck"
          />
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer" v-if="!readOnlyMode">
        <el-button @click="clearUserForm">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>



  </div>
</template>

<script>
//todo @ 代表src目录
import userApi from '@/api/userManager'
import roleApi from '@/api/roleManager'
import postManager   from "@/api/postManager";

export default {
  methods: {
    handleSingleCheck(checkedNode, { checkedKeys }) {
      // 单选逻辑
      if (checkedKeys.length > 1) {
        this.$refs.tree.setCheckedKeys([checkedNode.id]);
      }
      this.userForm.deptId = checkedNode.id || null;
      // 手动触发表单验证
      this.$refs.ruleForm.validateField('deptId');
    },
    handleNodeClick(data){
      // console.log(data.id+":"+data.deptName);
      this.searchModel.deptId = data.id;
      this.getUserList();
    },

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

    getAllRole() {
      roleApi.getAllRole().then(res => {
        this.roleList = res.data;
      })
    },

    deleteUserForm(user) {
      this.$confirm(`此操作将删除用户${user.username}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userApi.deleteUser(user.id).then(response => {
          if (response.code === 20000) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.getUserList();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
      openViewForm(id) {
        this.dialogFormVisible = true;
        this.dialogTitle = '用户查看';
        this.readOnlyMode = true; // 开启只读模式
        userApi.getUserById(id).then(res => {
          this.userForm = res.data;
          this.$nextTick(() => {
            if (this.userForm.deptId) {
              this.$refs.tree.setCheckedKeys([this.userForm.deptId]);
            }
          });
        });
      },
      openEditForm(id) {
        this.dialogFormVisible = true;
        this.readOnlyMode = false; // 编辑模式
        if (id == null) {
          this.dialogTitle = '用户注册';
          this.userForm = { status: 1, roleIds: [], deptId: null };
          this.$nextTick(() => {
            this.$refs.tree && this.$refs.tree.setCheckedKeys([]);
          });
        } else {
          this.dialogTitle = '用户修改';
          userApi.getUserById(id).then(res => {
            this.userForm = res.data;
            this.$nextTick(() => {
              if (this.userForm.deptId) {
                this.$refs.tree.setCheckedKeys([this.userForm.deptId]);
              }
            });
          });
        }
      },
    clearUserForm() {
      this.dialogFormVisible = false;
      this.userForm = {
        roleIds: []
      }
      // todo 清除校验
      this.$refs.ruleForm.clearValidate()
    },
    // 切换密码显示/隐藏
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
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

// 添加用户请求
    addUserRequest() {
      return userApi.submit(this.userForm);
    },

// 成功响应处理
    handleSuccessResponse(response) {
      if (response.code === 20000) {
        this.$message({
          message: response.message || '操作成功',
          type: 'success'
        });
        this.dialogFormVisible = false;
        this.getUserList();
      }
    },
// 最终处理（无论成功或失败都会执行）
    handleFinally() {
      this.loading = false; // 结束加载状态
    },
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
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  data() {
    return {
      readOnlyMode:false,
      filterText: '',
      deptTree: [],
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      roleList: [],
      showPassword: false, // 控制密码是否显示
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
        status: null,
        deptId: null
      },
      userForm: {
        status: 1,
        roleIds: [],
        deptId: null
      },
      userList: [],
      // 校验规则
      rules: {
        username: [
          {required: true, message: '请输入名称', trigger: 'blur'},
          {min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur'}
        ],
        sex: [
          {required: true, message: '请选择性别', trigger: 'blur'}
        ],
        roleIds: [
          {required: true, message: '请选择角色', trigger: 'blur'}
        ],
        deptId: [
          {required: true, message: '请选择部门', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {
            pattern: /^(13[0-9]|14[5-9]|15[0-3]|15[5-9]|16[6]|17[0-8]|18[0-9]|19[8-9])\d{8}$/,
            message: '请输入正确的手机号格式',
            trigger: 'blur'
          }
        ],
        email: [
          {required: true, message: "请输入邮箱地址", trigger: "blur"},
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur",
          },
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
          {min: 8, max: 12, message: "密码长度在 8 到 12 位之间的字符", trigger: "blur"},
          {
            pattern: /^[^\u4e00-\u9fa5]+$/,
            message: "密码不能包含中文字符",
            trigger: "blur",
          },
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
    this.getUserList();
    this.getAllRole();
    this.getDeptTree();
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


.el-aside {
  //background-color: #D3DCE6;
  //color: #333;
  text-align: center;
  line-height: 20px;
}

.el-main {
  //background-color: #E9EEF3;
  //color: #333;
  text-align: center;
  line-height: 20px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

/* 自定义 el-tree 选中节点颜色 */
.el-tree-node.is-current > .el-tree-node__content {
  background-color: #409EFF !important; /* Element UI 主色蓝 */
  color: #fff !important;
}

/* 鼠标悬停时的颜色 */
.el-tree-node__content:hover {
  background-color: #66b1ff !important;
  color: #fff !important;
}

</style>
