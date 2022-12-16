<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="570px"
    @close="close"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      :inline="true"
      label-width="66px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model.trim="form.username" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="昵称" prop="nickName">
        <el-input v-model.trim="form.nickName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model.trim="form.phone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="form.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.gender" style="width: 178px">
          <el-radio :label="0">男</el-radio>
          <el-radio :label="1">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.enabled">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="form.roleIds" multiple placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :value="item.id"
            :label="item.roleName"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit, save } from '@/api/sysUser'
  import { getList } from '@/api/role'

  export default {
    name: 'UserEdit',
    data() {
      return {
        form: {
          username: '',
          password: '',
          email: '',
          permissions: [],
          roleIds: [],
          seq: 0,
        },
        roleList: [],
        rules: {
          username: [
            { required: true, trigger: 'blur', message: '请输入用户名' },
          ],
          password: [
            { required: true, trigger: 'blur', message: '请输入密码' },
          ],
          email: [{ required: true, trigger: 'blur', message: '请输入邮箱' }],
          permissions: [
            { required: true, trigger: 'blur', message: '请选择权限' },
          ],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {},
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
        }
        this.getRoleList()
        this.dialogFormVisible = true
      },
      close() {
        this.form = {}
        this.dialogFormVisible = false
      },
      submit() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            if (this.form.id) {
              const { msg } = await doEdit(this.form)
              this.$baseMessage(msg, 'success')
            } else {
              const { msg } = await save(this.form)
              this.$baseMessage(msg, 'success')
            }
            this.$emit('fetch-data')
            this.close()
          } else {
            return false
          }
        })
      },
      async getRoleList() {
        const { data } = await getList()
        this.roleList = data
      },
    },
  }
</script>
