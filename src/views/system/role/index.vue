<template>
  <el-container>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="16">
          <RoleList :role-id.sync="roleId" />
        </el-col>
        <el-col :span="8">
          <resource-tree :role-id.sync="roleId" />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>

import RoleList from './RoleList'
import ResourceTree from './ResourceTree'

export default {
  name: 'Role',
  components: { RoleList, ResourceTree },
  data() {
    return {
      roleId: ''
    }
  },
  created() {

  },
  methods: {

  }
}
</script>
