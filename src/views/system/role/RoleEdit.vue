<template>

  <el-dialog
    :title="(form.id ? '编辑' : '新增')+editName"
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
      <el-form-item label="名称" prop="name">
        <el-input
          v-model.trim="form.name"
          :disabled="!!form.id"
          placeholder="名称"
          maxlength="20"
          show-word-limit
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          v-model.trim="form.description"
          placeholder="描述"
          maxlength="255"
          show-word-limit
          autocomplete="off"
          clearable
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="submitForm('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { createRole as createData, updateRole as updateData } from '@/api/system/role'

export default {
  name: 'RoleEdit',
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
      editName: '角色',
      formLabelWidth: '100px',
      form: this.row,
      formRules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        description: [
        ]
      },
      submitLoading: false
    }
  },
  watch: {
    row: {
      handler(newValue) {
        this.form = newValue
      },
      deep: true
    }
  },
  mounted: function() {

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
            updateData(this.form.id, this.form).then(() => {
              this.$message.success('更新' + this.editName + '成功')
              this.$emit('refreshList')
              this.close()
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            // 创建
            createData(this.form).then(() => {
              this.$message.success('创建' + this.editName + '成功')
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
