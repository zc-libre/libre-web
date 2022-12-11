<template>
  <div class="menuManagement-container">
    <el-row>
      <el-col>
        <vab-query-form>
          <vab-query-form-top-panel :span="12">
            <el-button
              icon="el-icon-plus"
              size="mini"
              type="primary"
              @click="handleEdit()"
            >
              添加
            </el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="handleEdit()"
            >
              删除
            </el-button>
          </vab-query-form-top-panel>
        </vab-query-form>
        <el-table
          ref="menuTable"
          v-loading="listLoading"
          :data="list"
          :element-loading-text="elementLoadingText"
          row-key="id"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            show-overflow-tooltip
            prop="meta.title"
            label="菜单标题"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="name"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="path"
            label="路径"
          ></el-table-column>
          <el-table-column show-overflow-tooltip label="是否隐藏">
            <template #default="{ row }">
              <span>
                {{ row.hidden ? '是' : '否' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="是否一直显示当前节点">
            <template #default="{ row }">
              <span>
                {{ row.alwaysShow ? '是' : '否' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="component"
            label="vue文件路径"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="redirect"
            label="重定向"
          ></el-table-column>
          <el-table-column show-overflow-tooltip label="图标">
            <template #default="{ row }">
              <span v-if="row.meta">
                <svg-icon
                  v-if="row.meta.icon"
                  :icon-class="row.meta.icon"
                ></svg-icon>
              </span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="是否固定">
            <template #default="{ row }">
              <span v-if="row.meta">
                {{ row.meta.affix ? '是' : '否' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="是否无缓存">
            <template #default="{ row }">
              <span v-if="row.meta">
                {{ row.meta.noKeepAlive ? '是' : '否' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="badge">
            <template #default="{ row }">
              <span v-if="row.meta">
                {{ row.meta.badge }}
              </span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="200">
            <template #default="{ row }">
              <el-button type="text" @click="handleEdit(row)">编辑</el-button>
              <el-button type="text" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <edit ref="edit" @fetch-data="fetchData"></edit>
  </div>
</template>

<script>
  import { getTree, doDelete } from '@/api/menu'
  import Edit from './components/MenuEdit.vue'

  export default {
    name: 'Menu',
    components: { Edit },
    data() {
      return {
        data: [],
        menus: [],
        form: {
          type: 1,
          icon: null,
          isIframe: 0,
          cache: 0,
          seq: 0,
          title: null,
          parentId: null,
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
    async created() {
      await this.fetchData()
    },
    methods: {
      handleEdit(row) {
        if (row && row.path) {
          this.$refs['edit'].showEdit(row)
        } else {
          this.$refs['edit'].showEdit()
        }
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const ids = []
            ids.push(row.id)
            const { msg } = await doDelete(JSON.stringify(ids))
            this.$baseMessage(msg, 'success')
            await this.fetchData()
          })
        }
      },
      async fetchData() {
        this.listLoading = true
        const { data } = await getTree()
        this.list = data
        setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
      handleNodeClick(data) {
        this.fetchData()
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach((row) => {
            this.$refs.menuTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.menuTable.clearSelection()
        }
      },
      handleSelectionChange(val) {
        this.menus = val
      },
    },
  }
</script>
