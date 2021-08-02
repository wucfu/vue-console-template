<template>
  <el-container>
    <el-header height="40">
      <el-form ref="action" class="search-form" :model="action" :label-width="formLabelWidth">
        <el-row type="flex" :gutter="20">
          <el-col :span="6">
            <el-form-item label="用户名：" prop="username">
              <el-input v-model.trim="action.username" placeholder="请输入" clearable style="width:100%;" @keyup.enter.native="search" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号：" prop="phone">
              <el-input v-model.trim="action.phone" placeholder="请输入" clearable style="width:100%;" @keyup.enter.native="search" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" :gutter="20">
          <el-col :span="24" class="search-button-class">
            <el-button type="primary" icon="el-icon-search" size="small" @click="search">查询</el-button>
            <el-button type="warning" icon="el-icon-refresh" size="small" @click="resetForm('action')">重置</el-button>
            <el-button v-permission="['user:add']" type="primary" icon="el-icon-plus" size="small" @click="addData">新增</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main>
      <el-table
        v-loading="loading"
        :data="list"
        element-loading-text="拼命加载中"
        fit
        stripe
        border
        :header-cell-style="{background:'#f8f8f8'}"
        highlight-current-row
        @row-dblclick="handler"
      >
        <el-table-column header-align="center" align="left" min-width="80" :show-overflow-tooltip="true" label="用户名" prop="username" />
        <el-table-column header-align="center" align="left" min-width="80" :show-overflow-tooltip="true" label="真实姓名" prop="realName" />
        <el-table-column header-align="center" align="left" min-width="80" :show-overflow-tooltip="true" label="昵称" prop="nickname" />
        <el-table-column header-align="center" align="left" min-width="60" label="手机号" prop="phone" />
        <el-table-column header-align="center" align="left" min-width="80" :show-overflow-tooltip="true" label="邮箱" prop="email" />
        <el-table-column align="center" label="状态" min-width="50" prop="invalidFlag">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.invalidFlag"
              v-permission="['user:enable','user:disable']"
              :disabled="scope.row.username === 'admin' || name === scope.row.username"
              :active-value="true"
              :inactive-value="false"
              active-color="#409EFF"
              inactive-color="#F56C6C"
              @change="changeEnabled(scope.row, scope.row.invalidFlag)"
            />
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="left" min-width="120" label="权限" prop="roles">
          <template slot-scope="scope">
            {{ formatterRoles(scope.row.roles) }}
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="130" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button v-permission="['user:modify']" icon="el-icon-edit" size="mini" type="primary" :disabled="scope.row.username === 'admin' || name === scope.row.username" @click="editData(scope.row)">编辑</el-button>
            <el-button v-permission="['user:rebuild-password']" size="mini" type="primary" :disabled="scope.row.username === 'admin' || name === scope.row.username" @click="rebuild(scope.row)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          small
          :current-page.sync="action.pageNum"
          :page-sizes="[10,20,30,40,50,100,150,200]"
          :page-size.sync="action.pageSize"
          layout="total, sizes, prev, next, pager,jumper,->"
          :total="action.total"
          @size-change="handleSizeChange"
          @current-change="fetchList"
        />
      </div>
    </el-main>

    <!-- 新增OR修改弹框 -->
    <Edit :dialog-visible.sync="editDialogVisible" :row="editUser" @refreshList="search" />
  </el-container>
</template>

<script>
import { fetchUserPage, rebuildPassword, enableUser, disableUser } from '@/api/system/user'
import Edit from './Edit'
import { mapGetters } from 'vuex'

export default {
  name: 'User',
  components: { Edit },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  // eslint-disable-next-line vue/order-in-components
  data() {
    return {
      formLabelWidth: '120px',
      action: {
        username: '',
        phone: '',
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      list: null,
      loading: false,
      editDialogVisible: false,
      editUser: {
        id: 0,
        username: '',
        roleIds: []
      }
    }
  },
  created() {
    this.search()
  },
  methods: {
    fetchList() {
      this.loading = true
      fetchUserPage(this.action).then(res => {
        this.list = res.data.records
        this.action.total = res.data.total
      }).catch(() => {
        this.action.pageNum = 1
      }).finally(() => {
        this.loading = false
      })
    },
    search() {
      this.action.pageNum = 1
      this.fetchList()
    },
    resetForm(form) {
      this.$refs[form].resetFields()
    },
    handleSizeChange() {
      this.search()
    },
    handler() {

    },
    addData() {
      this.editUser = {
        id: null,
        username: '',
        realName: '',
        nickname: '',
        email: '',
        phone: '',
        avatar: '',
        invalidFlag: true,
        roleIds: []
      }
      this.editDialogVisible = true
    },
    editData(row) {
      const ids = []
      if (row.roles) {
        row.roles.forEach((role) => {
          ids.push(role.id)
        })
      }
      this.editUser = {
        id: row.id,
        username: row.username,
        realName: row.realName,
        nickname: row.nickname,
        email: row.email,
        phone: row.phone,
        avatar: row.avatar,
        invalidFlag: row.invalidFlag,
        roleIds: ids
      }
      this.editDialogVisible = true
    },
    rebuild(row) {
      this.$confirm('确认重置 ' + row.username + ' 用户密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        rebuildPassword(row.id).then(() => {
          this.$message({
            type: 'success',
            message: '重置成功!'
          })
          this.search()
        })
      })
    },
    formatterRoles(roles) {
      if (roles) {
        const arr = []
        roles.forEach((role) => {
          arr.push(role.name)
        })
        return arr.join(',')
      }
      return ''
    },
    // 改变状态
    changeEnabled(row, val) {
      this.$confirm('此操作将' + (val ? '启动' : '禁用') + row.username + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (val) {
          enableUser(row.id).then(() => {
            this.$message({
              type: 'success',
              message: '启用用户' + row.username + '成功'
            }).catch(() => {
              row.invalidFlag = !row.invalidFlag
            }).finally(() => {
              this.search()
            })
          })
        } else {
          disableUser(row.id).then(() => {
            this.$message({
              type: 'success',
              message: '禁用用户' + row.username + '成功'
            }).catch(() => {
              row.invalidFlag = !row.invalidFlag
            }).finally(() => {
              this.search()
            })
          })
        }
      }).catch(() => {
        row.invalidFlag = !row.invalidFlag
      })
    }
  }
}
</script>
