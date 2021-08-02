<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>字典</span>
      <el-form ref="action" class="search-form" :model="action" :label-width="formLabelWidth">
        <el-row type="flex" :gutter="20">
          <el-col :span="12">
            <el-form-item label="名称：" prop="name">
              <el-input
                v-model.trim="action.name"
                placeholder="请输入"
                clearable
                style="width:100%;"
                @keyup.enter.native="search"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="描述：" prop="remark">
              <el-input
                v-model.trim="action.remark"
                placeholder="请输入"
                clearable
                style="width:100%;"
                @keyup.enter.native="search"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" :gutter="20">
          <el-col :span="24" class="search-button-class">
            <el-button type="primary" icon="el-icon-search" size="small" @click="search">查询</el-button>
            <el-button type="warning" icon="el-icon-refresh" size="small" @click="resetForm('action')">重置</el-button>
            <el-button v-permission="['dict:add']" type="primary" icon="el-icon-plus" size="small" @click="addData">新增
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      :data="list"
      element-loading-text="拼命加载中"
      fit
      stripe
      border
      :header-cell-style="{background:'#f8f8f8'}"
      highlight-current-row
      @row-click="handler"
    >
      <el-table-column header-align="center" align="left" :show-overflow-tooltip="true" label="名称" prop="name" />
      <el-table-column header-align="center" align="left" :show-overflow-tooltip="true" label="描述" prop="remark" />
      <el-table-column align="center" min-width="120" label="操作">
        <template slot-scope="scope">
          <el-button
            v-permission="['dict:modify']"
            icon="el-icon-edit"
            size="mini"
            type="primary"
            @click="editData(scope.row)"
          >编辑
          </el-button>
          <el-button
            v-permission="['dict:delete']"
            icon="el-icon-delete"
            size="mini"
            type="danger"
            @click="deleteData(scope.row)"
          >删除
          </el-button>
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
    <!-- 新增OR修改弹框 -->
    <dict-edit :dialog-visible.sync="editDialogVisible" :row="editForm" @refreshList="search" />
  </el-card>
</template>
<script>
import { fetchPage, deleteDict } from '@/api/system/dict'
import DictEdit from './DictEdit'

const defaultEditForm = {
  id: null,
  name: '',
  remark: ''
}

export default {
  name: 'DictList',
  components: { DictEdit },
  props: {
    // eslint-disable-next-line vue/require-default-prop,vue/require-prop-types
    dictId: {
      default: ''
    }
  },
  data() {
    return {
      formLabelWidth: '80px',
      action: {
        name: '',
        remark: '',
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      list: null,
      loading: false,
      editDialogVisible: false,
      editForm: defaultEditForm
    }
  },
  created() {
    this.search()
  },
  methods: {
    fetchList() {
      this.loading = true
      fetchPage(this.action).then(res => {
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
    handler(row) {
      this.$emit('update:dictId', row.id)
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
      this.$confirm('确认删除字典 ' + row.name + ' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDict(row.id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.search()
        })
      })
    }
  }
}
</script>
