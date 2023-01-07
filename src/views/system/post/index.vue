<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :dict="dict" :permission="permission" />
      <crudOperation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="code" label="编码" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="seq" label="排序" />
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            :inactive-value="0"
            :active-value="1"
            @change="changeEnabled(scope.row, scope.row.enabled)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdAt) }}</span>
        </template>
      </el-table-column>
      <!--   编辑与删除   -->
      <el-table-column
        v-permission="['admin', 'post:edit', 'post:del']"
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission" />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
    <!--表单渲染-->
    <eForm :dict="dict" />
  </div>
</template>

<script>
  import crudPost from '@/api/system/post'
  import eHeader from './module/header'
  import eForm from './module/form'
  import CRUD, { presenter } from '@crud/crud'
  import crudOperation from '@crud/CRUD.operation'
  import pagination from '@crud/Pagination'
  import udOperation from '@crud/UD.operation'

  export default {
    name: 'Post',
    components: { eHeader, eForm, crudOperation, pagination, udOperation },
    cruds() {
      return CRUD({
        title: '岗位',
        url: 'system/post',
        sort: ['seq,asc', 'id,desc'],
        crudMethod: { ...crudPost },
      })
    },
    mixins: [presenter()],
    // 数据字典
    dicts: ['sys_common_enabled'],
    data() {
      return {
        permission: {
          add: ['admin', 'system:post:add'],
          edit: ['admin', 'system:post:edit'],
          del: ['admin', 'system:post:del'],
        },
      }
    },
    methods: {
      // 改变状态
      changeEnabled(data, val) {
        this.$confirm(
          '此操作将 "' +
            this.dict.label.sys_common_enabled[val] +
            '" ' +
            data.name +
            '岗位, 是否继续？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            crudPost
              .edit(data)
              .then(() => {
                this.crud.notify(
                  this.dict.label.sys_common_enabled[val] + '成功',
                  'success'
                )
              })
              .catch((err) => {
                data.enabled = data.enabled ? 0 : 1
                console.log(err.data.message)
              })
          })
          .catch(() => {
            data.enabled = data.enabled ? 0 : 1
          })
      },
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
