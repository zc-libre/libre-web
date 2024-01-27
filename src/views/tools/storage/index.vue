<template>
  <el-tabs v-model="activeName" style="padding-left: 8px;" @tab-click="tabClick">
    <el-tab-pane label="本地存储" name="first">
      <Local ref="local" />
    </el-tab-pane>
    <el-tab-pane label="oss存储" name="second">
      <QiNiu ref="qiNiu" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import QiNiu from './oss/index.vue'
import Local from './local/index.vue'
export default {
  name: 'Storage',
  components: { QiNiu, Local },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    tabClick(name) {
      if (this.activeName === 'first') {
        this.$refs.local.crud.toQuery()
      } else {
        this.$refs.qiNiu.crud.toQuery()
      }
    }
  }
}
</script>

<style scoped>
</style>
