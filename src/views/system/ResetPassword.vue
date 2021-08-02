<template>

  <el-dialog
    title="修改密码"
    :visible.sync="dialogVisible"
    :before-close="close"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="原密码" prop="oldPassword">
        <el-input
          v-model.trim="form.oldPassword"
          :type="passwordType"
          placeholder="请输入原密码"
          maxlength="18"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model.trim="form.newPassword"
          :type="passwordType"
          placeholder="请输入新密码"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="againPassword">
        <el-input
          v-model.trim="form.againPassword"
          :type="passwordType"
          placeholder="请再次输入新密码"
          maxlength="18"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitForm('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { resetPassword } from '@/api/system/user'
import { passwordValidate } from '@/utils/validate'

export default {
  name: 'ResetPassword',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    const validatePassword = (rule, value, callback) => {
      if (!passwordValidate(value)) {
        callback(new Error('您的密码复杂度太低（密码中必须包含字母、数字的8到16位字符串），请及时改密码！'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      formLabelWidth: '100px',
      passwordType: 'password',
      form: {
        oldPassword: '',
        newPassword: '',
        againPassword: ''
      },
      formRules: {
        oldPassword: [
          { required: true, message: '原密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能不为空', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        againPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  mounted: function() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          resetPassword(this.form).then(() => {
            this.$message.success('更新密码成功')
            this.$store.dispatch('user/logout')
            this.$router.push('/login')
          })
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
