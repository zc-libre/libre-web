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
          <el-input
            v-model="query.name"
            placeholder="请输入参数名称"
            clearable
            size="small"
            style="width: 200px"
            class="filter-item"
            @keyup.enter.native="handleQuery"
          />
          <el-input
            v-model="query.field"
            placeholder="请输入参数键名"
            clearable
            size="small"
            style="width: 200px"
            class="filter-item"
            @keyup.enter.native="handleQuery"
          />
          <el-select
            v-model="query.isSystem"
            placeholder="系统内置"
            class="filter-item"
            clearable
            size="small"
            style="width: 104px"
          >
            <el-option
              v-for="item in dict.sys_yes_no"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
      v-loading="crud.loading"
      lazy
      :data="crud.data"
      row-key="id"
      @select="crud.selectChange"
      @select-all="crud.selectAllChange"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="参数主键" align="center" prop="id" />
      <el-table-column
        label="参数名称"
        align="center"
        prop="name"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="参数键名"
        align="center"
        prop="field"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="参数键值" align="center" prop="value" />
      <el-table-column
        label="系统内置"
        align="center"
        prop="isSystem"
        :formatter="dictFormat"
      />
      <el-table-column
        label="备注"
        align="center"
        prop="remark"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createdAt"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-permission="['admin', 'config:edit', 'config:del']"
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
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="570px"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="参数名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="参数键名" prop="field">
          <el-input v-model="form.field" placeholder="请输入参数键名" />
        </el-form-item>
        <el-form-item label="参数键值" prop="value">
          <el-input v-model="form.value" placeholder="请输入参数键值" />
        </el-form-item>
        <el-form-item label="系统内置" prop="isSystem">
          <el-radio-group v-model="form.isSystem">
            <el-radio
              v-for="item in dict.sys_yes_no"
              :key="item.id"
              :label="Boolean(Number(item.value))"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
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
  import crudConfig from '@/api/system/config'
  import CRUD, { crud, form, header, presenter } from '@crud/crud'
  import pagination from '@crud/Pagination'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'

  const defaultForm = {
    id: null,
    name: null,
    field: null,
    value: null,
    isSystem: true,
    remark: null,
  }
  export default {
    name: 'Config',
    components: { crudOperation, pagination, rrOperation, udOperation },
    cruds() {
      return CRUD({
        title: '参数配置',
        url: 'system/config',
        crudMethod: { ...crudConfig },
      })
    },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    // 设置数据字典
    dicts: ['sys_yes_no'],
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
          add: ['admin', 'system:config:add'],
          edit: ['admin', 'system:config:edit'],
          del: ['admin', 'system:config:del'],
        },
      }
    },
    methods: {
      dictFormat(row, column) {
        const val = Number(row[column.property])
        return this.dict.label['sys_yes_no'][val]
      },
    },
  }
</script>
