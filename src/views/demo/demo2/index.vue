<template>
  <el-container>
    <el-header height="40">
      <el-form ref="action" class="search-form" :model="action" :label-width="formLabelWidth">
        <el-row type="flex" :gutter="20">
          <el-col :span="6">
            <el-form-item label="条件1：" prop="condition1">
              <el-input v-model.trim="action.condition1" placeholder="请输入" clearable style="width:100%;" @keyup.enter.native="search" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="条件2：" prop="condition2">
              <el-input v-model.trim="action.condition2" placeholder="请输入" clearable style="width:100%;" @keyup.enter.native="search" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row type="flex" :gutter="20">
        <el-col :span="24" class="search-button-class">
          <el-button type="primary" icon="el-icon-search" size="small" @click="search">查询</el-button>
          <el-button type="warning" icon="el-icon-refresh" size="small" @click="resetForm('action')">重置</el-button>
        </el-col>
      </el-row>
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
        <el-table-column header-align="center" align="left" min-width="150px" :show-overflow-tooltip="true" label="属性1" prop="value1" />
        <el-table-column header-align="center" align="left" min-width="150px" :show-overflow-tooltip="true" label="属性2" prop="value2" />
        <el-table-column header-align="center" align="left" min-width="150px" :show-overflow-tooltip="true" label="属性3" prop="value3" />
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
  </el-container>
</template>

<script>
import service from '@/utils/request'

const baseForm = {
  condition1: '',
  condition2: ''
}

export default {
  name: 'D',
  components: { },
  data() {
    return {
      formLabelWidth: '120px',
      detailFormLabelWidth: '140px',
      action: {
        condition1: '',
        condition2: '',
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      list: [],
      loading: false,
      form: baseForm
    }
  },
  watch: {
  },
  created() {
    this.search()
  },
  methods: {
    fetchList() {
      this.loading = true
      const params = JSON.parse(JSON.stringify(this.action))
      service.get('/table/list', params).then(res => {
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
    }
  }
}
</script>
