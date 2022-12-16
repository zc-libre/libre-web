<template>
  <div class="roleManagement-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button icon="el-icon-plus" type="primary" @click="handleEdit">
          添加
        </el-button>
        <el-button icon="el-icon-delete" type="danger" @click="handleDelete">
          批量删除
        </el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.blurry"
              placeholder="请输入查询条件"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-row :gutter="15">
      <el-col
        :xs="24"
        :sm="24"
        :md="16"
        :lg="16"
        :xl="17"
        style="margin-bottom: 10px"
      >
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
          </div>
          <el-table
            v-loading="listLoading"
            :data="list"
            :element-loading-text="elementLoadingText"
            @selection-change="setSelectRows"
            @current-change="handleChange"
          >
            <el-table-column
              show-overflow-tooltip
              type="selection"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="roleName"
              label="角色名称"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="permission"
              label="权限码"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="gmtCreate"
              label="创建时间"
            ></el-table-column>
            <el-table-column show-overflow-tooltip label="操作" width="200">
              <template #default="{ row }">
                <el-button type="text" @click="handleEdit(row)">编辑</el-button>
                <el-button type="text" @click="handleDelete(row)">
                  删除
                </el-button>
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
          <edit ref="edit" @fetch-data="fetchData"></edit>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip
              class="item"
              effect="dark"
              content="选择指定角色分配菜单"
              placement="top"
            >
              <span class="role-span">菜单分配</span>
            </el-tooltip>
            <el-button
              :disabled="!showButton"
              :loading="menuLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="saveMenu"
            >
              保存
            </el-button>
          </div>
          <el-tree
            ref="menu"
            :data="menus"
            :default-checked-keys="menuIds"
            :props="defaultProps"
            check-strictly
            accordion
            show-checkbox
            node-key="id"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { getPage, doDelete, editMenu, getMenu, get } from '@/api/role'
  import Edit from './components/RoleEdit.vue'
  import { getMenusTree } from '@/api/menu'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import arrayToTree from 'array-to-tree'

  export default {
    name: 'RoleManagement',
    components: { Edit },
    data() {
      return {
        defaultProps: { children: 'children', label: 'title', isLeaf: 'leaf' },
        currentId: 0,
        menuLoading: false,
        showButton: false,
        menus: [],
        menuIds: [],
        list: null,
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          blurry: '',
        },
      }
    },
    created() {
      this.fetchData()
      this.getMenuDatas()
    },
    methods: {
      getMenuDatas() {
        setTimeout(() => {
          getMenusTree().then((res) => {
            this.menus = arrayToTree(res.data, { parentProperty: 'parentId' })
          })
        }, 100)
      },
      setSelectRows(val) {
        this.selectRows = val
      },

      handleEdit(row) {
        if (row.id) {
          this.$refs['edit'].showEdit(row)
        } else {
          this.$refs['edit'].showEdit()
        }
      },
      handleDelete(row) {
        let ids = []
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            ids.push(row.id)
            const { msg } = await doDelete(JSON.stringify(ids))
            this.$baseMessage(msg, 'success')
            await this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            ids = this.selectRows.map((item) => item.id)
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await doDelete(JSON.stringify(ids))
              this.$baseMessage(msg, 'success')
              await this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error')
            return false
          }
        }
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      handleChange(val) {
        if (val) {
          const _this = this
          // 清空菜单的选中
          this.$refs.menu.setCheckedKeys([])
          // 保存当前的角色id
          this.currentId = val.id
          // 初始化
          this.menuIds = []
          getMenu(val.id).then((res) => {
            res.data.forEach(function (data, index) {
              _this.menuIds.push(data.id)
            })
            _this.$refs.menu.setCheckedKeys(_this.menuIds)
            _this.showButton = true
          })
        }
      },
      queryData() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const res = await getPage(this.queryForm)
        this.list = res.data.records
        this.total = res.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
      update() {
        // 无刷新更新 表格数据
        get(this.currentId).then((res) => {
          for (let i = 0; i < this.list.length; i++) {
            if (res.id === this.list[i].id) {
              this.list[i] = res
              break
            }
          }
        })
      },
      // 保存菜单
      saveMenu() {
        this.menuLoading = true
        const role = { id: this.currentId, menuIds: [] }
        // 得到半选的父节点数据，保存起来
        this.$refs.menu.getHalfCheckedNodes().forEach(function (data, index) {
          role.menuIds.push(data.id)
        })
        // 得到已选中的 key 值
        this.$refs.menu.getCheckedKeys().forEach(function (data, index) {
          role.menuIds.push(data)
        })
        editMenu(role)
          .then((res) => {
            this.$baseMessage('保存成功', 'success')
            this.menuLoading = false
            this.update()
          })
          .catch((err) => {
            this.menuLoading = false
            console.log(err.response.data.message)
          })
      },
    },
  }
</script>
