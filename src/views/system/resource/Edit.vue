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
      <el-form-item label="上级目录" prop="pid">
        <TreeSelect v-model="form.pid" :options="menus" :normalizer="normalizer" placeholder="选择上级类目" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio-button v-for="(item,i) in dict.label.resource_type" :key="i" :label="i">{{ item }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="form.sort" placeholder="菜单排序" controls-position="right" :min="1" :max="999" />
      </el-form-item>
      <el-form-item label="资源名称" prop="name">
        <el-input
          v-model.trim="form.name"
          placeholder="资源名称"
          maxlength="64"
          show-word-limit
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item label="权限标识" prop="permission">
        <el-input
          v-model.trim="form.permission"
          placeholder="权限标识"
          maxlength="64"
          show-word-limit
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-collapse-transition>
        <el-form-item v-show="form.type === '0' || form.type === '1'" label="路由地址" prop="path">
          <el-input
            v-model.trim="form.path"
            placeholder="路由地址"
            maxlength="64"
            show-word-limit
            autocomplete="off"
            clearable
          />
        </el-form-item>
      </el-collapse-transition>
      <el-collapse-transition>
        <el-form-item v-show="form.type === '0' || form.type === '1'" label="组件" prop="component">
          <el-input
            v-model.trim="form.component"
            placeholder="组件"
            maxlength="64"
            show-word-limit
            autocomplete="off"
            clearable
          />
        </el-form-item>
      </el-collapse-transition>
      <el-collapse-transition>
        <el-form-item v-show="form.type === '0'" label="图标" prop="icon">
          <el-popover
            placement="bottom-start"
            width="450"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input slot="reference" v-model="form.icon" style="width: 100%;" placeholder="点击选择图标" readonly>
              <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>
      </el-collapse-transition>
      <el-collapse-transition>
        <el-form-item v-show="form.type === '0' || form.type === '1'" label="是否可见" prop="hidden">
          <el-radio-group v-model="form.hidden">
            <el-radio-button :label="true">不可见</el-radio-button>
            <el-radio-button :label="false">可见</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-collapse-transition>
      <el-collapse-transition>
        <el-form-item v-show="form.type === '0' || form.type === '1'" label="是否缓存" prop="cache">
          <el-radio-group v-model="form.cache">
            <el-radio-button :label="true">缓存</el-radio-button>
            <el-radio-button :label="false">不缓存</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-collapse-transition>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="submitForm('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { createResource as createData, updateResource as updateData } from '@/api/system/resource'
import IconSelect from '@/components/IconSelect'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'ResourceEdit',
  components: { IconSelect, TreeSelect },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    row: {
      type: Object
    },
    menus: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  dicts: ['resource_type'],
  data: function() {
    return {
      editName: '资源',
      formLabelWidth: '100px',
      form: this.row,
      formRules: {
        type: [
          { required: true, message: '资源类型不能为空', trigger: 'change' }
        ],
        name: [
          { required: true, message: '资源标题不能为空', trigger: 'blur' }
        ],
        remark: [
        ]
      },
      submitLoading: false,
      normalizer(node) {
        return {
          id: node.id,
          label: node.name,
          children: node.children
        }
      }
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
    },
    // 选中图标
    selected(name) {
      this.form.icon = name
    }

  }
}
</script>

<style scoped>

</style>
