<template>
  <el-container>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="12">
          <dict-list :dict-id.sync="dictId" />
        </el-col>
        <el-col :span="12">
          <dict-detail-list :dict-id.sync="dictId" />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>

import DictList from './DictList'
import DictDetailList from './DictDetailList'

export default {
  name: 'Dict',
  components: { DictList, DictDetailList },
  data() {
    return {
      dictId: ''
    }
  },
  created() {

  },
  methods: {

  }
}
</script>
