<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎使用管理平台: {{ name }}!</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      url: 'blob:https://element.eleme.cn/36e309d7-687f-40a5-9e83-fe9d3077c0bc'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  created() {
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
