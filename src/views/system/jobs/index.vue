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
          <!-- 搜索 -->
          <el-input
            v-model="query.jobName"
            clearable
            size="small"
            placeholder="输入任务名称搜索"
            style="width: 200px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <el-select
            v-model="query.jobStatus"
            clearable
            size="small"
            placeholder="状态"
            class="filter-item"
            style="width: 90px"
            @change="crud.toQuery"
          >
            <el-option
              v-for="item in dict.sys_jobs_state"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <rrOperation />
        </el-form>
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--新增任务-->
    <el-dialog
      :title="crud.status.title"
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu === 1"
      width="600px"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        width="600px"
        label-width="100px"
      >
        <el-form-item label="任务名" prop="jobName">
          <el-input v-model="form.jobName" style="width: 370px" />
        </el-form-item>
        <el-form-item label="bean名称" prop="beanName">
          <el-input v-model="form.beanName" style="width: 370px" />
        </el-form-item>
        <el-form-item label="执行方法" prop="methodName">
          <el-input v-model="form.methodName" style="width: 370px" />
        </el-form-item>
        <el-form-item label="任务cron" prop="cronExpression">
          <el-input v-model="form.cronExpression" style="width: 370px" />
        </el-form-item>
        <el-form-item label="状态" prop="jobStatus">
          <el-radio
            v-for="item in dict.sys_job_status"
            :key="item.id"
            v-model="form.jobStatus"
            :label="Number(item.value)"
          >
            {{ item.label }}
          </el-radio>
        </el-form-item>

        <el-form-item label="参数内容" prop="params">
          <el-input
            type="textarea"
            v-model="form.params"
            style="width: 370px"
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
    <!--修改任务-->
    <el-dialog
      title="修改任务"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="updateFormVisible"
      width="600px"
    >
      <el-form
        ref="form"
        inline
        :model="form"
        :rules="updateRules"
        size="small"
        width="600px"
        label-width="100px"
      >
        <el-form-item label="任务名" prop="jobName">
          <el-input v-model="form.jobName" style="width: 370px" />
        </el-form-item>
        <el-form-item label="bean名称" prop="beanName">
          <el-input v-model="form.beanName" style="width: 370px" />
        </el-form-item>
        <el-form-item label="执行方法" prop="methodName">
          <el-input v-model="form.methodName" style="width: 370px" />
        </el-form-item>
        <el-form-item label="任务cron" prop="cronExpression">
          <el-input v-model="form.cronExpression" style="width: 370px" />
        </el-form-item>
        <el-form-item label="状态" prop="jobStatus">
          <el-radio
            v-for="item in dict.sys_job_status"
            :key="item.id"
            v-model="form.jobStatus"
            :label="Number(item.value)"
          >
            {{ item.label }}
          </el-radio>
        </el-form-item>

        <el-form-item label="参数内容" prop="params">
          <el-input
            type="textarea"
            v-model="form.params"
            style="width: 370px"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="updateFormVisible = false">
          取消
        </el-button>
        <el-button :loading="updateLoading" type="primary" @click="update">
          确认
        </el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      lazy
      :data="crud.data"
      row-key="id"
      @select="crud.selectChange"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column prop="jobName" label="任务名称" align="center" />
      <el-table-column
        prop="beanName"
        label="bean名称"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column
        prop="methodName"
        label="执行方法"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column
        prop="params"
        label="参数内容"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column
        prop="jobStatus"
        label="状态"
        align="center"
        :formatter="formatState"
      >
        <template #default="scope">
          <el-tag v-if="scope.row.jobStatus === 0">
            {{ formatState(scope.row.jobStatus) }}
          </el-tag>
          <el-tag v-else-if="scope.row.jobStatus === 1" type="warning">
            {{ formatState(scope.row.jobStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="cronExpression" label="表达式" align="center" />
      <el-table-column
        v-permission="['admin', 'jobs:edit', 'jobs:del']"
        label="操作"
        width="300px"
        align="center"
        fixed="right"
      >
        <template scope="scope">
          <el-button
            size="mini"
            type="info"
            @click="handlePause(scope.$index, scope.row)"
          >
            暂停
          </el-button>
          <el-button
            size="mini"
            type="warning"
            @click="handleResume(scope.$index, scope.row)"
          >
            恢复
          </el-button>
          <el-button
            size="mini"
            type="success"
            @click="handleUpdate(scope.$index, scope.row)"
          >
            修改
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
  import crudJob from '@/api/system/job'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import pagination from '@crud/Pagination'

  const defaultForm = {
    jobName: null,
    beanName: null,
    methodName: null,
    params: null,
    cronExpression: null,
    jobStatus: 0,
  }
  export default {
    name: 'Jobs',
    components: { crudOperation, rrOperation, pagination },
    cruds() {
      return CRUD({
        title: '任务',
        url: 'api/sys/job/page',
        isTreeTable: false,
        sort: [],
        crudMethod: { ...crudJob },
      })
    },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    // 设置数据字典
    dicts: ['sys_job_status'],
    data() {
      return {
        updateLoading: false,
        // 修改对话框默认可见性
        updateFormVisible: false,
        rules: {
          jobName: [
            { required: true, message: '请输入任务名称', trigger: 'blur' },
          ],
          jobGroup: [
            { required: true, message: '请输入任务组名', trigger: 'blur' },
          ],
          jobClassName: [
            { required: true, message: '请输入任务类名', trigger: 'blur' },
          ],
          cronExpression: [
            { required: true, message: '请输入任务cron', trigger: 'blur' },
          ],
        },
        updateRules: {
          cronExpression: [
            { required: true, message: '请输入任务cron', trigger: 'blur' },
          ],
        },
        permission: {
          add: ['admin', 'system:jobs:add'],
          edit: ['admin', 'system:jobs:edit'],
          del: ['admin', 'system:jobs:del'],
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
      changeEnabled() {},
      // 删除任务
      handleDelete: function (index, row) {
        crudJob.del(row.id).then((res) => {
          this.crud.refresh()
        })
      },
      // 暂停任务
      handlePause: function (index, row) {
        row.jobStatus = 1
        crudJob.updateStatus(row.id).then((res) => {
          this.crud.refresh()
        })
      },
      // 恢复任务
      handleResume: function (index, row) {
        row.jobStatus = 0
        crudJob.updateStatus(row.id).then((res) => {
          this.crud.refresh()
        })
      },
      // 更新
      handleUpdate(index, row) {
        this.updateFormVisible = true
        this.form.id = row.id
        this.form.beanName = row.beanName
        this.form.jobName = row.jobName
        this.form.params = row.params
        this.form.methodName = row.methodName
        this.form.jobStatus = row.jobStatus
        this.form.cronExpression = row.cronExpression
      },
      // 更新任务
      update() {
        this.updateLoading = true
        crudJob.edit(this.form).then((res) => {
          this.updateLoading = false
          this.updateFormVisible = false
          this.crud.refresh()
        })
      },
      // 格式化状态
      formatState(jobStatus) {
        const val = String(jobStatus)
        return this.dict.label['sys_job_status'][val]
      },
      normalizer(node) {
        return {
          id: node.id,
          label: node.name,
          children: node.children,
        }
      },
    },
  }
</script>
