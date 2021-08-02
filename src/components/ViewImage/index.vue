<template>
  <el-image
    :src="src"
    @click="downloadFiles"
  />
</template>
<script>

import { downloadFile } from '@/api/common'
import { filePreview, fileDownload } from '@/utils'

export default {
  name: 'PreviewImage',
  props: {
    // eslint-disable-next-line vue/require-prop-types
    path: {
      default: ''
    },
    // eslint-disable-next-line vue/require-prop-types
    fileName: {
      default: ''
    }
  },
  data() {
    return {
      src: '',
      srcList: []
    }
  },
  watch: {

  },
  created() {
    downloadFile(this.path).then(res => {
      this.src = filePreview(res)
      this.srcList.push(this.src)
    }).catch(err => {
      console.log('图片加载异常，图片地址：' + this.path + ',异常：' + err)
    })
  },
  methods: {
    downloadFiles() {
      var file = this.fileName + this.path.substring(this.path.lastIndexOf('.'))
      downloadFile(this.path).then(res => {
        fileDownload(file, res)
      }).catch(err => {
        console.log('err: ', err)
      })
    }
  }
}
</script>
