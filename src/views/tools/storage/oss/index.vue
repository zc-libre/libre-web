<template>
  <div class="app-container" style="padding: 8px;">
    <!--表单组件-->
    <eForm ref="form" />
    <!-- 工具栏 -->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.key" clearable size="small" placeholder="输入文件名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission">
        <template slot="left">
          <!-- 上传 -->
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-upload" @click="dialog = true">上传</el-button>
          <!-- 同步 -->
          <el-button :icon="icon" class="filter-item" size="mini" type="warning" @click="synchronize">同步</el-button>
          <!-- 配置 -->
          <el-button
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-s-tools"
            @click="doConfig"
          >配置</el-button>
        </template>
      </crudOperation>
      <!-- 文件上传 -->
      <el-dialog :visible.sync="dialog" :close-on-click-modal="false" append-to-body width="500px" @close="doSubmit">
        <el-upload
          :before-remove="handleBeforeRemove"
          :on-success="handleSuccess"
          :on-error="handleError"
          :file-list="fileList"
          :headers="headers"
          :data="{type: 2}"
          :action="ossUploadApi"
          class="upload-demo"
          multiple
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" style="display: block;" class="el-upload__tip">请勿上传违法文件，且文件不超过15M</div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="doSubmit">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" :show-overflow-tooltip="true" label="文件名">
          <template #default="scope">
            <el-link target="_blank"  @click="download(scope.row.id)">{{scope.row.name}}</el-link>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="suffix" label="文件类型" @selection-change="crud.selectionChangeHandler" />
        <el-table-column prop="size" label="文件大小" />
        <el-table-column prop="gmtCreate" label="创建日期" />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudQiNiu from '@/api/tools/qiniu'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import eForm from './form.vue'
import CRUD, { presenter, header, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation.vue'
import crudOperation from '@crud/CRUD.operation.vue'
import pagination from '@crud/Pagination.vue'

export default {
  components: { eForm, pagination, crudOperation, rrOperation },
  cruds() {
    return CRUD({ title: 'oss文件', url: '/api/sys/files', params: { saveType: 2 }, crudMethod: { ...crudQiNiu }})
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      permission: {
        del: ['admin', 'storage:del']
      },
      title: '文件', dialog: false,
      icon: 'el-icon-refresh',
      url: '',
      headers: { 'Authorization': getToken() },
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      files: [],
      newWin: null
    }
  },
  computed: {
    ...mapGetters([
      'ossUploadApi'
    ])
  },
  watch: {
    url(newVal, oldVal) {
      if (newVal && this.newWin) {
        this.newWin.sessionStorage.clear()
        this.newWin.location.href = newVal
        // 重定向后把url和newWin重置
        this.url = ''
        this.newWin = null
      }
    }
  },
  created() {
    this.crud.optShow.add = false
    this.crud.optShow.edit = false
  },
  methods: {
    // 七牛云配置
    doConfig() {
      const form = this.$refs.form
      form.init()
      form.dialog = true
    },
    handleSuccess(response, file, fileList) {
      const uid = file.uid
      const id = response.id
      this.files.push({ uid, id })
    },
    handleBeforeRemove(file, fileList) {
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].uid === file.uid) {
          crudQiNiu.del([this.files[i].id]).then(res => {})
          return true
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 刷新列表数据
    doSubmit() {
      this.fileList = []
      this.dialogVisible = false
      this.dialogImageUrl = ''
      this.dialog = false
      this.crud.toQuery()
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.crud.notify(msg.message, CRUD.NOTIFICATION_TYPE.ERROR)
    },
    // 下载文件
    download(id) {
      this.downloadLoading = true
      // 先打开一个空的新窗口，再请求
      this.newWin = window.open()
      crudQiNiu.download(id).then(res => {
        this.downloadLoading = false
        this.url = res
      }).catch(err => {
        this.downloadLoading = false
        console.log(err.response.data.message)
      })
    },
    // 同步数据
    synchronize() {
      this.icon = 'el-icon-loading'
      crudQiNiu.sync().then(res => {
        this.icon = 'el-icon-refresh'
        this.$message({
          showClose: true,
          message: '数据同步成功',
          type: 'success',
          duration: 1500
        })
        this.crud.toQuery()
      }).catch(err => {
        this.icon = 'el-icon-refresh'
        console.log(err.response.data.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
