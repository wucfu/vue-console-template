<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>字典详情</span>
      <el-button v-if="dictId" v-permission="['dict-detail:add']" type="primary" icon="el-icon-plus" size="small" style="float: right;" @click="addData">新增</el-button>
    </div>
    <div v-if="!dictId">
      <el-divider direction="vertical" />
      点击字典查看详情
    </div>
    <div v-else>
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
        <el-table-column header-align="center" align="left" :show-overflow-tooltip="true" label="所属字典" prop="dictName" />
        <el-table-column header-align="center" align="left" min-width="50" :show-overflow-tooltip="true" label="字典标签" prop="label" />
        <el-table-column header-align="center" align="left" min-width="50" :show-overflow-tooltip="true" label="字典值" prop="value" />
        <el-table-column header-align="center" align="left" min-width="50" :show-overflow-tooltip="true" label="排序" prop="sort" />
        <el-table-column align="center" min-width="160" label="操作">
          <template slot-scope="scope">
            <el-button v-permission="['dict-detail:modify']" icon="el-icon-edit" size="mini" type="primary" @click="editData(scope.row)">编辑</el-button>
            <el-button v-permission="['dict-detail:delete']" icon="el-icon-delete" size="mini" type="danger" @click="deleteData(scope.row)">删除</el-button>
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
    </div>
    <!-- 新增OR修改弹框 -->
    <dict-detail-edit :dialog-visible.sync="editDialogVisible" :row="editForm" @refreshList="search" />
  </el-card>
</template>
<script>
import { fetchDetailPage, deleteDictDetail } from '@/api/system/dict'
import DictDetailEdit from './DictDetailEdit'

const defaultEditForm = {
  id: null,
  label: '',
  value: '',
  sort: '',
  dictId: ''
}

export default {
  name: 'DictDetailList',
  components: { DictDetailEdit },
  props: {
    // eslint-disable-next-line vue/require-default-prop,vue/require-prop-types
    dictId: {
      default: ''
    }
  },
  data() {
    return {
      formLabelWidth: '120px',
      action: {
        dictId: this.dictId,
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
  watch: {
    dictId: {
      handler(newValue) {
        this.action.dictId = newValue
        this.action.pageNum = 0
        this.search()
      },
      deep: true
    }
  },
  created() {
  },
  methods: {
    fetchList() {
      this.loading = true
      fetchDetailPage(this.action).then(res => {
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
      this.editForm = defaultEditForm
      this.editForm.dictId = this.action.dictId
      this.editDialogVisible = true
    },
    editData(row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.editDialogVisible = true
    },
    deleteData(row) {
      this.$confirm('确认删除字典详情 ' + row.label + ' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDictDetail(row.id).then(() => {
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
