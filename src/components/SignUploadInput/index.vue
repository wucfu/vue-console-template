<template>
  <div>
    <el-upload
      :headers="{
        authorization: 'Bearer ' + token
      }"
      class="avatar-uploader"
      action="/console-template/file/upload"
      :show-file-list="false"
      :on-success="handleUploadSuccess"
      :on-exceed="handleExceed"
      :on-error="handleUploadFail"
      :before-upload="beforeUpload"
    >
      <img v-if="src" :src="src" class="avatar" alt="">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
      <div>
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-delete">
            <i class="el-icon-delete" @click="handleRemove" />
          </span>
        </span>
      </div>
    </el-upload>

    <!--    <el-upload-->
    <!--      action="/console-template/file/upload"-->
    <!--      :headers="{-->
    <!--        authorization: 'Bearer ' + token-->
    <!--      }"-->
    <!--      list-type="picture-card"-->
    <!--      :before-upload="beforeUpload"-->
    <!--      :multiple="false"-->
    <!--      :on-success="handleUploadSuccess"-->
    <!--      :on-error="handleUploadFail"-->
    <!--      :limit="1"-->
    <!--      :on-exceed="handleExceed"-->
    <!--      :file-list="fileList"-->
    <!--      :accept="accept"-->
    <!--    >-->
    <!--      <i slot="default" class="el-icon-plus" />-->
    <!--      <div slot="file" slot-scope="{file}">-->
    <!--        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">-->
    <!--        <span class="el-upload-list__item-actions">-->
    <!--          <span class="el-upload-list__item-preview">-->
    <!--            <i class="el-icon-zoom-in" @click="handlePictureCardPreview(file)" />-->
    <!--          </span>-->
    <!--          <span class="el-upload-list__item-delete">-->
    <!--            <i class="el-icon-delete" @click="handleRemove" />-->
    <!--          </span>-->
    <!--        </span>-->
    <!--      </div>-->
    <!--    </el-upload>-->
    <!--    <el-dialog :visible.sync="dialogVisible" :modal="false">-->
    <!--      <el-image width="100%" :src="src" />-->
    <!--    </el-dialog>-->
  </div>
</template>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
<script>

import { mapGetters } from 'vuex'
import { downloadFile } from '@/api/common'
import { filePreview } from '@/utils'

export default {
  name: 'SignUploadInput',
  props: {
    // eslint-disable-next-line vue/require-prop-types
    path: {
      default: ''
    },
    // eslint-disable-next-line vue/require-prop-types
    accept: {
      default: ''
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  // eslint-disable-next-line vue/order-in-components
  data() {
    return {
      fileList: [],
      src: '',
      formRules: {
        file: [
          { required: true, message: '文件不能为空', trigger: 'change' }
        ]
      },
      formLabelWidth: '0px',
      dialogVisible: false
    }
  },
  watch: {
    path: {
      handler(newValue, oldValue) {
        if (newValue) {
          if (newValue !== oldValue) {
            this.downloadFiles(newValue)
          }
        } else {
          this.src = ''
          this.fileList = []
        }
      },
      deep: true
    }
  },
  created() {
    if (this.path) {
      this.downloadFiles(this.path)
    }
  },
  methods: {
    beforeUpload(file) {
      if (file.name.endsWith('jpg') || file.name.endsWith('png')) {
        return true
      } else {
        this.$message.warning(`目前文件上传只支持JPG或者PNG`)
        return false
      }
    },
    // beforeRemove(file) {
    //   return this.$confirm(`确定移除 ${file.name}？`)
    // },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleRemove() {
      this.$emit('update:path', '')
      this.fileList = []
      this.$emit('validateField')
    },
    handleUploadSuccess(response, file) {
      if (response.code === 'success') {
        this.src = URL.createObjectURL(file.raw)
        this.fileList = [{ url: this.src }]
        this.$emit('update:path', response.data)
        this.$message.success('文件上传成功')
        this.$emit('validateField')
      } else {
        this.src = ''
        this.fileList = []
        this.$emit('update:path', '')
        this.$message.error(response.message)
        this.$emit('validateField')
      }
    },
    handleUploadFail() {
      this.$message.error('文件上传失败')
      this.$emit('validateField')
    },

    handlePictureCardPreview() {
      this.dialogVisible = true
    },

    downloadFiles(path) {
      downloadFile(path).then(res => {
        this.src = filePreview(res)
        this.fileList = [{ url: this.src }]
      }).catch(err => {
        console.log('图片加载异常，图片地址：' + path + ',异常：' + err)
      })
    }
  }
}
</script>
