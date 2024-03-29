<template>
  <div
    v-loading="!show"
    element-loading-text="数据加载中..."
    :style="!show ? 'height: 500px' : 'height: 100%'"
    class="app-container"
  >
    <el-row>
      <el-col :span="24" class="card-box">
        <el-card>
          <div slot="header"><span>基本信息</span></div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <tbody>
                <tr>
                  <td><div class="cell">Redis版本</div></td>
                  <td>
                    <div v-if="redis.info" class="cell">
                      {{ redis.info.redis_version }}
                    </div>
                  </td>
                  <td><div class="cell">运行模式</div></td>
                  <td>
                    <div v-if="redis.info" class="cell">
                      {{
                        redis.info.redis_mode == 'standalone' ? '单机' : '集群'
                      }}
                    </div>
                  </td>
                  <td><div class="cell">端口</div></td>
                  <td>
                    <div v-if="redis.info" class="cell">
                      {{ redis.info.tcp_port }}
                    </div>
                  </td>
                  <td><div class="cell">客户端数</div></td>
                  <td>
                    <div v-if="redis.info" class="cell">
                      {{ redis.info.connected_clients }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td><div class="cell">运行时间(天)</div></td>
                  <td>
                    <div v-if="redis.info" class="cell">
                      {{ redis.info.uptime_in_days }}
                    </div>
                  </td>
                  <td><div class="cell">使用内存</div></td>
                  <td>
                    <div v-if="redis.info" class="cell">
                      {{ redis.info.used_memory_human }}
                    </div>
                  </td>
                  <td><div class="cell">使用CPU</div></td>
                  <td>
                    <div v-if="redis.info" class="cell">
                      {{
                        parseFloat(redis.info.used_cpu_user_children).toFixed(2)
                      }}
                    </div>
                  </td>
                  <td><div class="cell">内存配置</div></td>
                  <td>
                    <div v-if="redis.info" class="cell">
                      {{ redis.info.maxmemory_human }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td><div class="cell">AOF是否开启</div></td>
                  <td>
                    <div v-if="redis.info" class="cell">
                      {{ redis.info.aof_enabled == '0' ? '否' : '是' }}
                    </div>
                  </td>
                  <td><div class="cell">RDB是否成功</div></td>
                  <td>
                    <div v-if="redis.info" class="cell">
                      {{ redis.info.rdb_last_bgsave_status }}
                    </div>
                  </td>
                  <td><div class="cell">Key数量</div></td>
                  <td>
                    <div v-if="redis.dbSize" class="cell">
                      {{ redis.dbSize }}
                    </div>
                  </td>
                  <td><div class="cell">网络入口/出口</div></td>
                  <td>
                    <div v-if="redis.info" class="cell">
                      {{ redis.info.instantaneous_input_kbps }}kps/{{
                        redis.info.instantaneous_output_kbps
                      }}kps
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header"><span>命令统计</span></div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div ref="commandstats" style="height: 420px" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header">
            <span>内存信息</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div ref="usedmemory" style="height: 420px" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { getRedisInfo } from '@/api/monitor/redis'
  import echarts from 'echarts'

  export default {
    name: 'RedisMonitor',
    data() {
      return {
        show: false,
        // 统计命令信息
        commandstats: null,
        // 使用内存
        usedmemory: null,
        // redisInfo 信息
        redis: [],
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      /** 加载 redis 信息 */
      loadData() {
        getRedisInfo().then((result) => {
          this.show = true
          this.redis = result
          this.commandstats = echarts.init(this.$refs.commandstats, 'macarons')
          this.commandstats.setOption({
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)',
            },
            series: [
              {
                name: '命令',
                type: 'pie',
                roseType: 'radius',
                radius: [15, 95],
                center: ['50%', '38%'],
                data: this.redis.commandStats,
                animationEasing: 'cubicInOut',
                animationDuration: 1000,
              },
            ],
          })
          this.usedmemory = echarts.init(this.$refs.usedmemory, 'macarons')
          this.usedmemory.setOption({
            tooltip: {
              formatter: '{b} <br/>{a} : ' + this.redis.info.used_memory_human,
            },
            series: [
              {
                name: '峰值',
                type: 'gauge',
                min: 0,
                max: 1000,
                detail: {
                  formatter: this.redis.info.used_memory_human,
                },
                data: [
                  {
                    value: parseFloat(this.redis.info.used_memory_human),
                    name: '内存消耗',
                  },
                ],
              },
            ],
          })
        })
      },
    },
  }
</script>
