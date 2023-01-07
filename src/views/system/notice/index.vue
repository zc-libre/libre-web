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
          <el-form-item label="标题" prop="title">
            <el-input
              v-model="query.title"
              placeholder="请输入标题"
              clearable
              size="small"
            />
          </el-form-item>
          <el-form-item label="操作人员" prop="createBy">
            <el-input
              v-model="query.createBy"
              placeholder="请输入操作人员"
              clearable
              size="small"
            />
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select
              v-model="query.type"
              placeholder="公告类型"
              clearable
              size="small"
            >
              <el-option
                v-for="item in dict.sys_notice_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
      <el-table-column label="序号" align="center" prop="id" width="100" />
      <el-table-column
        label="标题"
        align="center"
        prop="title"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="类型"
        align="center"
        prop="type"
        :formatter="typeFormat"
        width="100"
      />
      <el-table-column
        label="状态"
        align="center"
        prop="status"
        :formatter="statusFormat"
        width="100"
      />
      <el-table-column
        label="创建者"
        align="center"
        prop="createdBy"
        width="100"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createdAt"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
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
    <!-- 添加或修改公告对话框 -->
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
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入公告标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择">
                <el-option
                  v-for="item in dict.sys_notice_type"
                  :key="item.id"
                  :label="item.label"
                  :value="Number(item.value)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="item in dict.sys_notice_status"
                  :key="item.id"
                  :label="Number(item.value)"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容">
              <Editor v-model="form.content" />
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
  import crudNotice from '@/api/system/notice'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import Editor from '@/components/Editor'

  const defaultForm = {
    id: null,
    title: null,
    type: 1,
    status: 0,
    content: null,
  }
  export default {
    name: 'Notice',
    components: { crudOperation, rrOperation, pagination, udOperation, Editor },
    cruds() {
      return CRUD({
        title: '通知配置',
        url: 'system/notice',
        crudMethod: { ...crudNotice },
      })
    },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    // 设置数据字典
    dicts: ['sys_notice_status', 'sys_notice_type'],
    data() {
      return {
        depts: [],
        rules: {
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          deptSort: [
            {
              required: true,
              message: '请输入序号',
              trigger: 'blur',
              type: 'number',
            },
          ],
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
      typeFormat(row, column) {
        const val = Number(row[column.property])
        return this.dict.label['sys_notice_type'][val]
      },
      statusFormat(row, column) {
        const val = Number(row[column.property])
        return this.dict.label['sys_notice_status'][val]
      },
    },
  }
</script>
