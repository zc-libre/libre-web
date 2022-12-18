<template>
  <div class="menuManagement-container">
    <el-row>
      <el-col>
        <vab-query-form>
          <vab-query-form-right-panel :span="24">
            <el-form :inline="true" :model="queryForm" @submit.native.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.blurry"
                  placeholder="请输入用户名"
                  clearable
                />
              </el-form-item>
              <el-form-item>
                <el-date-picker
                  v-model="queryForm.createTime"
                  :default-time="['00:00:00', '23:59:59']"
                  type="daterange"
                  range-separator=":"
                  size="small"
                  class="date-item"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  icon="el-icon-search"
                  type="primary"
                  @click="queryData"
                >
                  查询
                </el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          ref="menuTable"
          v-loading="listLoading"
          :data="list"
          :element-loading-text="elementLoadingText"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="请求地址">
                  <span>{{ props.row.params }}</span>
                </el-form-item>
                <el-form-item v-if="props.row.className" label="类名">
                  <span>{{ props.row.className }}</span>
                </el-form-item>
                <el-form-item v-if="props.row.methodName" label="方法名">
                  <span>{{ props.row.methodName }}</span>
                </el-form-item>
                <el-form-item v-if="props.row.data" label="请求数据">
                  <span>{{ props.row.data }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>

          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="requestIp" label="IP" />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="address"
            label="IP来源"
          />
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="browser" label="浏览器" />
          <el-table-column prop="requestTime" label="请求耗时" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.requestTime <= 300">
                {{ scope.row.requestTime }}ms
              </el-tag>
              <el-tag v-else-if="scope.row.requestTime <= 1000" type="warning">
                {{ scope.row.requestTime }}ms
              </el-tag>
              <el-tag v-else type="danger">
                {{ scope.row.requestTime }}ms
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="gmtCreate" label="创建日期" width="180px">
            <template slot-scope="scope">
              <span>{{ scope.row.gmtCreate }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :layout="layout"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { getInfo } from '@/api/log'

  export default {
    name: 'InfoLog',
    data() {
      return {
        data: [],
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          blurry: null,
          createTime: null,
        },
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        list: [],
        listLoading: true,
        elementLoadingText: '正在加载...',
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      queryData() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const res = await getInfo(this.queryForm)
        this.list = res.data.records
        this.total = res.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
    },
  }
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 70px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
  .demo-table-expand .el-form-item__content {
    font-size: 12px;
  }
</style>
