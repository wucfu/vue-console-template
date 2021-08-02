<template>

  <el-dialog
    :title="form.id ? '编辑用户' : '新增用户'"
    :visible.sync="dialogVisible"
    :before-close="close"
    width="30%"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model.trim="form.username"
          :disabled="!!form.id"
          placeholder="用户名"
          maxlength="128"
          show-word-limit
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item v-if="!!form.id" label="密码" prop="newPassword">
        密码默认为12345678
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input
          v-model.trim="form.realName"
          placeholder="真实姓名"
          maxlength="64"
          show-word-limit
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model.trim="form.nickname"
          placeholder="昵称"
          maxlength="64"
          show-word-limit
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model.trim="form.phone"
          placeholder="手机号"
          maxlength="11"
          show-word-limit
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model.trim="form.email"
          placeholder="邮箱"
          maxlength="64"
          show-word-limit
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item label="状态" prop="invalidFlag">
        <el-radio-group v-model="form.invalidFlag">
          <el-radio-button :label="true">启用</el-radio-button>
          <el-radio-button :label="false">禁用</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="权限" prop="roleIds">
        <el-select v-model="form.roleIds" multiple placeholder="请选择" clearable>
          <el-option
            v-for="role in roles"
            :key="role.id"
            :label="role.name"
            :value="role.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="submitForm('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { createUser, updateUser } from '@/api/system/user'
import { fetchRoles } from '@/api/common'

export default {
  name: 'UserEdit',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    row: {
      type: Object
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      formLabelWidth: '100px',
      roles: [],
      form: {
        id: this.row.id,
        username: this.row.username,
        realName: this.row.realName,
        nickname: this.row.nickname,
        email: this.row.email,
        phone: this.row.phone,
        avatar: this.row.avatar,
        invalidFlag: this.row.invalidFlag,
        roleIds: this.row.roleIds
      },
      formRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { min: 11, max: 11, message: '手机号必须为11位', trigger: 'blur' }
        ]
      },
      submitLoading: false
    }
  },
  watch: {
    row: {
      handler(newValue) {
        this.form.id = newValue.id
        this.form.username = newValue.username
        this.form.realName = newValue.realName
        this.form.nickname = newValue.nickname
        this.form.email = newValue.email
        this.form.phone = newValue.phone
        this.form.avatar = newValue.avatar
        this.form.invalidFlag = newValue.invalidFlag
        this.form.roleIds = newValue.roleIds
      },
      deep: true
    }
  },
  mounted: function() {
    fetchRoles().then(res => {
      this.roles = res.data
    })
  },
  created() {
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          if (this.form.id) {
            // 更新
            updateUser(this.form.id, this.form).then(() => {
              this.$message.success('更新用户成功')
              this.$emit('refreshList')
              this.close()
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            // 创建
            createUser(this.form).then(() => {
              this.$message.success('创建用户成功')
              this.$emit('refreshList')
              this.close()
            }).finally(() => {
              this.submitLoading = false
            })
          }
        } else {
          this.submitLoading = false
        }
      })
    },
    close() {
      this.$refs['form'].resetFields()
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

<style scoped>

</style>
