<template>
  <el-card v-loading="roleResourceLoading" class="box-card">
    <div slot="header" class="clearfix">
      <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单" placement="top">
        <span class="role-span">菜单分配</span>
      </el-tooltip>
      <el-button
        v-permission="['role-resource:devide']"
        :disabled="!roleId"
        :loading="menuLoading"
        icon="el-icon-check"
        size="mini"
        style="float: right;"
        type="primary"
        @click="saveMenu"
      >保存</el-button>
    </div>
    <el-tree
      ref="menu"
      :data="menus"
      :default-checked-keys="menuIds"
      :props="defaultProps"
      :default-expand-all="true"
      :check-strictly="true"
      show-checkbox
      node-key="id"
    />
  </el-card>
</template>
<script>

import { fetchPage } from '@/api/system/resource'
import { fetchResourceIdsByRole, allocateResources } from '@/api/system/role'

export default {
  name: 'ResourceTree',
  props: {
    // eslint-disable-next-line vue/require-prop-types
    roleId: {
      default: ''
    }
  },
  data() {
    return {
      formLabelWidth: '120px',
      roleResourceLoading: false,
      menuLoading: false,
      menus: [],
      menuIds: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {
    roleId: {
      handler(newValue) {
        if (newValue) {
          this.fetchRoleResource()
        } else {
          this.menuIds = []
        }
      },
      deep: true
    }
  },
  created() {
    // 查询菜单树
    this.menuLoading = true
    fetchPage({}).then(res => {
      // 将数据处理成 树需要的数据
      this.menus = res.data
    }).finally(() => {
      this.menuLoading = false
    })
  },
  methods: {
    /**
     * 查询角色权限
     */
    fetchRoleResource() {
      this.roleResourceLoading = true
      fetchResourceIdsByRole(this.roleId).then(res => {
        this.$refs.menu.setCheckedKeys([])
        this.menuIds = res.data
      }).finally(() => {
        this.roleResourceLoading = false
      })
    },
    saveMenu() {
      this.menuLoading = true
      let resourceIds = this.$refs.menu.getCheckedKeys()
      resourceIds = resourceIds.concat(this.$refs.menu.getHalfCheckedKeys())
      allocateResources(this.roleId, resourceIds).then(() => {
        this.$message({
          type: 'success',
          message: '分配成功!'
        })
      }).finally(() => {
        this.menuLoading = false
      })
    }
  }
}
</script>
