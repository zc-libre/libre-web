<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.blurry"
          size="small"
          clearable
          placeholder="输入名称或者描述搜索"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
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
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!-- 表单渲染 -->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="520px"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.roleName" style="width: 380px" />
        </el-form-item>
        <el-form-item label="标识" prop="permission">
          <el-input
            v-model="form.permission"
            :disabled="form.permission === 'admin'"
            style="width: 380px"
          />
        </el-form-item>
        <el-form-item label="排序" prop="seq">
          <el-input-number
            v-model.number="form.seq"
            :min="0"
            :max="999"
            controls-position="right"
            style="width: 380px"
          />
        </el-form-item>
        <!--        <el-form-item label="描述信息" prop="remark">-->
        <!--          <el-input-->
        <!--            v-model="form.remark"-->
        <!--            style="width: 380px"-->
        <!--            rows="5"-->
        <!--            type="textarea"-->
        <!--          />-->
        <!--        </el-form-item>-->
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
    <el-row :gutter="15">
      <!--角色管理-->
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
            ref="table"
            v-loading="crud.loading"
            highlight-current-row
            style="width: 100%"
            :data="crud.data"
            @selection-change="crud.selectionChangeHandler"
            @current-change="handleCurrentChange"
          >
            <el-table-column
              :selectable="checkboxT"
              type="selection"
              width="55"
            />
            <el-table-column prop="roleName" label="名称" />
            <el-table-column prop="permission" label="标识" />
            <el-table-column prop="seq" label="排序" />
            <el-table-column
              :show-overflow-tooltip="true"
              prop="remark"
              label="描述"
            />
            <el-table-column
              :show-overflow-tooltip="true"
              width="135px"
              prop="gmtCreate"
              label="创建日期"
            />
            <el-table-column
              v-permission="['admin', 'roles:edit', 'roles:del']"
              label="操作"
              width="130px"
              align="center"
              fixed="right"
            >
              <template #default="scope">
                <udOperation :data="scope.row" :permission="permission" />
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <pagination />
        </el-card>
      </el-col>
      <!-- 菜单授权 -->
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
              v-permission="['admin', 'system:roles:edit']"
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
  import crudRoles from '@/api/system/role'
  import { getMenusTree } from '@/api/system/menu'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import arrayToTree from 'array-to-tree'

  const defaultForm = {
    id: null,
    roleName: null,
    seq: 999,
  }
  export default {
    name: 'Role',
    components: {
      Treeselect,
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
    },
    cruds() {
      return CRUD({
        title: '角色',
        url: '/api/sys/role/page',
        sort: 'seq,desc',
        crudMethod: { ...crudRoles },
      })
    },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    data() {
      return {
        defaultProps: { children: 'children', label: 'title', isLeaf: 'leaf' },
        currentId: 0,
        menuLoading: false,
        showButton: false,
        menus: [],
        menuIds: [],
        permission: {
          add: ['admin', 'system:role:add'],
          edit: ['admin', 'system:role:edit'],
          del: ['admin', 'system:role:del'],
        },
        rules: {
          roleName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
          title: [{ required: true, message: '请输入标识', trigger: 'blur' }],
          permission: [
            { required: true, message: '请输入权限', trigger: 'blur' },
          ],
        },
      }
    },
    created() {
      // 菜单配置
      this.getMenuDatas()
    },
    methods: {
      getMenuDatas() {
        setTimeout(() => {
          getMenusTree().then((res) => {
            this.menus = arrayToTree(res, { parentProperty: 'parentId' })
          })
        }, 100)
      },
      [CRUD.HOOK.afterRefresh]() {
        this.$refs.menu.setCheckedKeys([])
      },
      // 触发单选
      handleCurrentChange(val) {
        if (val) {
          const _this = this
          // 清空菜单的选中
          this.$refs.menu.setCheckedKeys([])
          // 保存当前的角色id
          this.currentId = val.id
          // 初始化
          this.menuIds = []
          // 菜单数据需要特殊处理
          crudRoles.getMenu(val.id).then((res) => {
            res.forEach(function (data, index) {
              _this.menuIds.push(data.id)
            })
            _this.$refs.menu.setCheckedKeys(_this.menuIds)
            _this.showButton = true
          })
        }
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
        crudRoles
          .editMenu(role)
          .then((res) => {
            this.crud.notify('保存成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
            this.menuLoading = false
            this.update()
          })
          .catch((err) => {
            this.menuLoading = false
            console.log(err.response.data.message)
          })
      },
      // 改变数据
      update() {
        // 无刷新更新 表格数据
        crudRoles.get(this.currentId).then((res) => {
          for (let i = 0; i < this.crud.data.length; i++) {
            if (res.id === this.crud.data[i].id) {
              this.crud.data[i] = res
              break
            }
          }
        })
      },
      checkboxT(row, rowIndex) {
        return true
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

<style rel="stylesheet/scss" lang="scss">
  .role-span {
    font-weight: bold;
    color: #303133;
    font-size: 15px;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
  ::v-deep .vue-treeselect__multi-value {
    margin-bottom: 0;
  }
  ::v-deep .vue-treeselect__multi-value-item {
    border: 0;
    padding: 0;
  }
</style>
