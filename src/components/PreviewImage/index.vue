<template>
  <el-image
    style="width: 100px; height: 100px"
    :src="src"
    :preview-src-list="srcList"
  />
</template>
<script>

import { downloadFile } from '@/api/common'
import { filePreview } from '@/utils'

export default {
  name: 'PreviewImage',
  props: {
    // eslint-disable-next-line vue/require-prop-types
    path: {
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

  }
}
</script>
