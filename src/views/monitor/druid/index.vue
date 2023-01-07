<template>
  <div
    v-loading="!show"
    element-loading-text="数据加载中..."
    :style="!show ? 'height: 500px' : 'height: 100%'"
    class="app-container"
  >
    <el-table v-if="show" lazy :data="data" row-key="ID">
      <el-table-column type="expand">
        <template slot-scope="props">
          <span>{{ props.row.SQL }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="ID"
        align="center"
        prop="ID"
        width="58"
        sortable
      />
      <el-table-column label="SQL" prop="SQL" :show-overflow-tooltip="true" />
      <el-table-column
        label="执行数"
        align="center"
        prop="ExecuteCount"
        width="80"
        sortable
      />
      <el-table-column
        label="耗时"
        align="center"
        prop="TotalTime"
        width="68"
        sortable
      />
      <el-table-column
        label="最慢"
        align="center"
        prop="MaxTimespan"
        width="68"
        sortable
      />
      <el-table-column
        label="事务执行"
        align="center"
        prop="InTransactionCount"
        width="94"
        sortable
      />
      <el-table-column
        label="错误数"
        align="center"
        prop="ErrorCount"
        width="80"
        sortable
      />
      <el-table-column
        label="更新行数"
        align="center"
        prop="EffectedRowCount"
        width="94"
        sortable
      />
      <el-table-column
        label="读取行数"
        align="center"
        prop="FetchRowCount"
        width="94"
        sortable
      />
      <el-table-column
        label="执行中"
        align="center"
        prop="RunningCount"
        width="80"
        sortable
      />
      <el-table-column
        label="最大并发"
        align="center"
        prop="ConcurrentMax"
        width="94"
        sortable
      />
    </el-table>
  </div>
</template>

<script>
  import { getSqlList } from '@/api/monitor/druid'

  export default {
    name: 'DruidSqlMonitor',
    data() {
      return {
        show: false,
        data: [],
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        getSqlList().then((result) => {
          this.show = true
          // 转成数字类型, 用于排序
          for (let i = 0; i < result.length; i++) {
            result[i].ID = Number(result[i].ID)
            result[i].ExecuteCount = Number(result[i].ExecuteCount)
            result[i].TotalTime = Number(result[i].TotalTime)
            result[i].MaxTimespan = Number(result[i].MaxTimespan)
            result[i].InTransactionCount = Number(result[i].InTransactionCount)
            result[i].ErrorCount = Number(result[i].ErrorCount)
            result[i].EffectedRowCount = Number(result[i].EffectedRowCount)
            result[i].FetchRowCount = Number(result[i].FetchRowCount)
            result[i].RunningCount = Number(result[i].RunningCount)
            result[i].ConcurrentMax = Number(result[i].ConcurrentMax)
          }
          this.data = result
        })
      },
    },
  }
</script>
