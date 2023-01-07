<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col>
        <!--工具栏-->
        <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <el-input
              v-model="query.blurry"
              clearable
              size="small"
              placeholder="输入名称或者邮箱搜索"
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
            <el-select
              v-model="query.enabled"
              clearable
              size="small"
              placeholder="状态"
              class="filter-item"
              style="width: 90px"
              @change="crud.toQuery"
            >
              <el-option
                v-for="item in dict.sys_common_enabled"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <rrOperation />
          </div>
          <crudOperation show="" :permission="permission" />
        </div>
        <!--表单渲染-->
        <el-dialog
          append-to-body
          :close-on-click-modal="false"
          :before-close="crud.cancelCU"
          :visible.sync="crud.status.cu > 0"
          :title="crud.status.title"
          width="570px"
        >
          <el-form
            ref="form"
            :inline="true"
            :model="form"
            :rules="rules"
            size="small"
            label-width="66px"
          >
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="form.username" :disabled="form.id !== null" />
            </el-form-item>
            <el-form-item label="电话" prop="phone">
              <el-input v-model.number="form.phone" />
            </el-form-item>
            <el-form-item label="昵称" prop="nickName">
              <el-input v-model="form.nickName" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" />
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="form.gender" style="width: 178px">
                <el-radio
                  v-for="item in dict.sys_user_sex"
                  :key="item.id"
                  :label="Number(item.value)"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group
                v-model="form.enabled"
                :disabled="form.id === user.id"
              >
                <el-radio
                  v-for="item in dict.sys_common_enabled"
                  :key="item.id"
                  :label="Number(item.value)"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="角色" prop="roles">
              <el-select
                v-model="roleDatas"
                style="width: 437px"
                multiple
                placeholder="请选择"
                @remove-tag="deleteTag"
                @change="changeRole"
              >
                <el-option
                  v-for="item in roles"
                  :key="item.roleName"
                  :disabled="level !== 1 && item.level <= level"
                  :label="item.roleName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark" style="margin-bottom: 0">
              <el-input
                v-model="form.remark"
                style="width: 440px"
                rows="2"
                type="textarea"
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
        <!--表格渲染-->
        <el-table
          ref="table"
          v-loading="crud.loading"
          :data="crud.data"
          style="width: 100%"
          @selection-change="crud.selectionChangeHandler"
        >
          <el-table-column
            :selectable="checkboxT"
            type="selection"
            width="55"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="username"
            label="用户名"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="nickName"
            label="昵称"
          />
          <el-table-column
            prop="gender"
            :formatter="genderFormat"
            label="性别"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="phone"
            label="电话"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="email"
            label="邮箱"
          />
          <el-table-column label="状态" align="center" prop="enabled">
            <template #default="scope">
              <el-switch
                v-model="scope.row.enabled"
                :disabled="Number(user.id) === Number(scope.row.id)"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                @change="changeEnabled(scope.row, scope.row.enabled)"
              />
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="gmtCreate"
            label="创建日期"
          ></el-table-column>
          <el-table-column
            v-permission="['admin', 'user:edit', 'user:del']"
            label="操作"
            width="115"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <udOperation
                :data="scope.row"
                :permission="permission"
                :disabled-dle="scope.row.id === user.id"
              />
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination />
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import crudUser from '@/api/system/user'
  import { isvalidPhone } from '@/utils/validate'
  import { getAll } from '@/api/system/role'
  import { getAllPost } from '@/api/system/post'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import Treeselect from '@riophae/vue-treeselect'
  import { mapGetters } from 'vuex'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  let userRoles = []
  const defaultForm = {
    id: null,
    username: null,
    nickName: null,
    gender: 1,
    email: null,
    enabled: 1,
    roles: [],
    posts: [],
    dept: { id: null },
    phone: null,
  }
  export default {
    name: 'User',
    components: {
      Treeselect,
      crudOperation,
      rrOperation,
      udOperation,
      pagination,
    },
    cruds() {
      return CRUD({
        title: '用户',
        url: 'api/sys/user/page',
        crudMethod: { ...crudUser },
      })
    },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    // 数据字典
    dicts: ['sys_common_enabled', 'sys_user_sex'],
    data() {
      // 自定义验证
      const validPhone = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入电话号码'))
        } else if (!isvalidPhone(value)) {
          callback(new Error('请输入正确的11位手机号码'))
        } else {
          callback()
        }
      }
      return {
        height: document.documentElement.clientHeight - 180 + 'px;',
        deptName: '',
        depts: [],
        deptDatas: [],
        posts: [],
        level: 3,
        roles: [],
        postDatas: [],
        roleDatas: [], // 多选时使用
        defaultProps: { children: 'children', label: 'name', isLeaf: 'leaf' },
        permission: {
          add: ['admin', 'system:user:add'],
          edit: ['admin', 'system:user:edit'],
          del: ['admin', 'system:user:del'],
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur',
            },
          ],
          nickName: [
            { required: true, message: '请输入用户昵称', trigger: 'blur' },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur',
            },
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
          ],
          phone: [{ required: true, trigger: 'blur', validator: validPhone }],
        },
      }
    },
    computed: {
      ...mapGetters(['user']),
    },
    created() {
      this.crud.msg.add = '新增成功，默认密码：123456'
    },
    mounted() {
      const that = this
      window.onresize = function temp() {
        that.height = document.documentElement.clientHeight - 180 + 'px;'
      }
    },
    methods: {
      genderFormat(row, column) {
        const val = row[column.property]
        return this.dict.label['sys_user_sex'][val]
      },
      normalizer(node) {
        return {
          id: node.id,
          label: node.name,
          children: node.children,
        }
      },
      changeRole(value) {
        userRoles = []
        value.forEach(function (data, index) {
          const role = { id: data }
          userRoles.push(role)
        })
      },
      deleteTag(value) {
        userRoles.forEach(function (data, index) {
          if (data.id === value) {
            userRoles.splice(index, value)
          }
        })
      },
      // 新增与编辑前做的操作
      [CRUD.HOOK.afterToCU](crud, form) {
        this.getRoles()
      },
      // 新增前将多选的值设置为空
      [CRUD.HOOK.beforeToAdd]() {
        this.roleDatas = []
      },
      // 打开编辑弹窗前做的操作
      [CRUD.HOOK.beforeToEdit](crud, form) {
        this.roleDatas = []
        userRoles = []
        const _this = this
        form.roles.forEach(function (role, index) {
          _this.roleDatas.push(role.id)
          // 初始化编辑时候的角色
          const rol = { id: role.id }
          userRoles.push(rol)
        })
      },
      // 提交前做的操作
      [CRUD.HOOK.afterValidateCU](crud) {
        if (this.roleDatas.length === 0) {
          this.$message({
            message: '角色不能为空',
            type: 'warning',
          })
          return false
        }
        crud.form.roleIds = userRoles.map((role) => role.id)
        delete crud.form.roles
        return true
      },
      // 改变状态
      changeEnabled(data, val) {
        this.$confirm(
          '此操作将 "' +
            this.dict.label.sys_common_enabled[Number(val)] +
            '" ' +
            data.userName +
            ', 是否继续？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            crudUser
              .edit(data)
              .then((res) => {
                this.crud.notify(
                  this.dict.label.sys_common_enabled[Number(val)] + '成功',
                  CRUD.NOTIFICATION_TYPE.SUCCESS
                )
              })
              .catch(() => {
                data.enabled = !data.enabled
              })
          })
          .catch(() => {
            data.enabled = !data.enabled
          })
      },
      // 获取弹窗内角色数据
      getRoles() {
        getAll()
          .then((res) => {
            this.roles = res
          })
          .catch(() => {})
      },
      checkboxT(row, rowIndex) {
        return row.id !== this.user.id
      },
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  ::v-deep .vue-treeselect__control,
  ::v-deep .vue-treeselect__placeholder,
  ::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
  }
</style>
