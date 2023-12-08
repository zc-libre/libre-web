<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <el-form
            ref="queryForm"
            :model="query"
            :inline="true"
            label-width="68px"
        >
          <el-form-item label="分类名称" prop="title">
            <el-input
                v-model="query.blurry"
                placeholder="请输入分类名称"
                clearable
                size="small"
            />
          </el-form-item>
          <el-date-picker
              v-model="query.createTime"
              :default-time="['00:00:00', '23:59:59']"
              type="daterange"
              range-separator=":"
              size="small"
              class="date-item"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
          />
          <rrOperation />
        </el-form>
      </div>
      <crudOperation :permission="permission" />
    </div>
    <el-table
        ref="table"
        v-loading="crud.loading"
        lazy
        :data="crud.data"
        row-key="id"
        @select="crud.selectChange"
        @select-all="crud.selectAllChange"
        @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
          label="分类名称"
          align="center"
          prop="categoryName"
          :show-overflow-tooltip="true"
      />
      <el-table-column
          label="创建者"
          align="center"
          prop="gmtCreateName"
          width="100"
      />
      <el-table-column
          label="创建时间"
          align="center"
          prop="gmtCreate"
          width="200"
      >
      </el-table-column>
      <el-table-column
          label="更新时间"
          align="center"
          prop="gmtModified"
          width="200"
      >
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
    <!-- 添加或修改对话框 -->
    <el-dialog
        append-to-body
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="680px"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="分类名称" prop="title">
              <el-input v-model="form.categoryName" placeholder="请输入分类名称" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button
            :loading="crud.status.cu === 2"
            type="primary"
            @click="crud.submitCU"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import crudCategory from '@/api/blog/category'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import Editor from '@/components/Editor'

const defaultForm = {
  id: null,
  categoryName: null
}
export default {
  name: 'Notice',
  components: { crudOperation, rrOperation, pagination, udOperation, Editor },
  cruds() {
    return CRUD({
      title: '添加文章分类',
      url: 'api/blog/category/page',
      crudMethod: { ...crudCategory },
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      },
      permission: {
        add: ['admin', 'system:notice:add'],
        edit: ['admin', 'system:notice:edit'],
        del: ['admin', 'system:notice:del'],
      },
    }
  },
  created() {
    this.crud.optShow = {
      add: true,
      edit: true,
      del: true,
      download: false,
      reset: true,
    }
  },
  methods: {

  },
}
</script>
