<template>
  <el-container>
    <el-header height="40">
      <el-form ref="action" class="search-form" :model="action" :label-width="formLabelWidth">
        <el-row type="flex" :gutter="20">
          <el-col :span="6">
            <el-form-item label="资源名称：" prop="name">
              <el-input v-model.trim="action.name" placeholder="请输入" clearable style="width:100%;" @keyup.enter.native="search" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" :gutter="20">
          <el-col :span="24" class="search-button-class">
            <el-button type="primary" icon="el-icon-search" size="small" @click="search">查询</el-button>
            <el-button type="warning" icon="el-icon-refresh" size="small" @click="resetForm('action')">重置</el-button>
            <el-button v-permission="['resource:add']" type="primary" icon="el-icon-plus" size="small" @click="addData">新增</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main>
      <el-table
        v-loading="loading"
        row-key="id"
        :default-expand-all="true"
        :data="list"
        element-loading-text="拼命加载中"
        fit
        stripe
        border
        :header-cell-style="{background:'#f8f8f8'}"
        highlight-current-row
      >
        <el-table-column header-align="center" align="left" min-width="80" :show-overflow-tooltip="true" label="资源名称" prop="name" />
        <el-table-column align="center" min-width="40" label="资源类型" prop="type">
          <template slot-scope="scope">
            {{ dict.label.resource_type[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="图标" align="center" min-width="30">
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.icon !== ''" :icon-class="scope.row.icon ? scope.row.icon : ''" />
            <span v-else> - </span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="30" label="排序" prop="sort" />
        <el-table-column header-align="center" align="left" min-width="80" :show-overflow-tooltip="true" label="路由地址" prop="path" />
        <el-table-column header-align="center" align="left" min-width="80" :show-overflow-tooltip="true" label="权限标识" prop="permission" />
        <el-table-column header-align="center" align="left" min-width="80" :show-overflow-tooltip="true" label="组件路径" prop="component" />
        <el-table-column align="center" min-width="30" label="缓存" prop="cache">
          <template slot-scope="scope">
            {{ scope.row.cache === null ? '-' : (scope.row.cache ? '是' : '否') }}
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="30" label="可见" prop="hidden">
          <template slot-scope="scope">
            {{ scope.row.hidden === null ? '-' : (scope.row.hidden ? '否' : '是') }}
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="120" fixed="right" :show-overflow-tooltip="true" label="操作">
          <template slot-scope="scope">
            <el-button v-permission="['resource:modify']" icon="el-icon-edit" size="mini" type="primary" @click="editData(scope.row)">编辑</el-button>
            <el-button v-permission="['resource:delete']" icon="el-icon-delete" size="mini" type="danger" @click="deleteData(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <ResourceEdit :row="editForm" :dialog-visible.sync="editDialogVisible" :menus="menus" @refreshList="search" />
  </el-container>
</template>
<script>

import { fetchPage, deleteResource } from '@/api/system/resource'
import ResourceEdit from './Edit'

const defaultEditForm = {
  id: null,
  pid: 0,
  name: '',
  permission: '',
  component: '',
  type: '0',
  sort: '',
  icon: '',
  path: '',
  cache: null,
  hidden: null
}

export default {
  name: 'Resource',
  components: { ResourceEdit },
  dicts: ['resource_type'],
  data() {
    return {
      formLabelWidth: '120px',
      action: {
        name: ''
      },
      list: [],
      loading: false,
      editDialogVisible: false,
      editForm: defaultEditForm,
      menus: []
    }
  },
  created() {
    this.search()
  },
  methods: {
    fetchList() {
      this.loading = true
      fetchPage(this.action).then(res => {
        this.list = res.data
        this.menus = []
        const menu = { id: 0, name: '顶级类目' }
        // 将数据处理成 下拉框需要的数据  然后交给edit处理
        if (res.data.length > 0) {
          const data = JSON.parse(JSON.stringify(res.data))
          this.formatTree(data)
          menu.children = data
        }
        this.menus.push(menu)
      }).finally(() => {
        this.loading = false
      })
    },
    search() {
      this.fetchList()
    },
    resetForm(form) {
      this.$refs[form].resetFields()
    },
    handleSizeChange() {
      this.search()
    },
    addData() {
      this.editForm = defaultEditForm
      this.editDialogVisible = true
    },
    editData(row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.editDialogVisible = true
    },
    deleteData(row) {
      this.$confirm('确认删除资源 ' + row.name + ' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteResource(row.id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.search()
        })
      })
    },
    formatTree(menu) {
      for (let i = 0; i < menu.length; i++) {
        menu[i].label = menu[i].name
        if (menu[i].children && menu[i].children.length > 0) {
          this.formatTree(menu[i].children)
        } else {
          delete menu[i].children
        }
      }
    }

  }
}
</script>
