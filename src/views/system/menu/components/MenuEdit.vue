<template>
  <el-dialog
    append-to-body
    title="菜单编辑"
    width="580px"
    :visible.sync="dialogFormVisible"
  >
    <el-form
      ref="form"
      :inline="true"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-form-item label="菜单类型" prop="type">
        <el-radio-group v-model="form.type" size="mini" style="width: 178px">
          <el-radio-button :label="0">目录</el-radio-button>
          <el-radio-button :label="1">菜单</el-radio-button>
          <el-radio-button :label="2">按钮</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="form.type !== 2" label="菜单图标" prop="icon">
        <el-popover
          placement="bottom-start"
          width="450"
          trigger="click"
          @show="$refs['iconSelect'].reset()"
        >
          <IconSelect ref="iconSelect" @selected="selected" />
          <el-input
            slot="reference"
            v-model="form.icon"
            style="width: 450px"
            placeholder="点击选择图标"
            readonly
          >
            <svg-icon
              v-if="form.icon"
              slot="prefix"
              :icon-class="form.icon"
              class="el-input__icon"
              style="height: 32px; width: 16px"
            />
            <i v-else slot="prefix" class="el-icon-search el-input__icon" />
          </el-input>
        </el-popover>
      </el-form-item>
      <el-form-item v-show="form.type !== 2" label="外链菜单" prop="isFrame">
        <el-radio-group v-model="form.isFrame" size="mini">
          <el-radio-button :label="1">是</el-radio-button>
          <el-radio-button :label="0">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="form.type === 1" label="菜单缓存" prop="cache">
        <el-radio-group v-model="form.cache" size="mini">
          <el-radio-button :label="1">是</el-radio-button>
          <el-radio-button :label="0">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="form.type !== 2" label="菜单可见" prop="hidden">
        <el-radio-group v-model="form.hidden" size="mini">
          <el-radio-button :label="0">是</el-radio-button>
          <el-radio-button :label="1">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.type !== 2" label="菜单标题" prop="meta.title">
        <el-input
          v-model="form.title"
          :style="form.type === 0 ? 'width: 450px' : 'width: 178px'"
          placeholder="菜单标题"
        />
      </el-form-item>
      <el-form-item v-if="form.type === 2" label="按钮名称" prop="meta.title">
        <el-input
          v-model="form.title"
          placeholder="按钮名称"
          style="width: 178px"
        />
      </el-form-item>
      <el-form-item v-show="form.type !== 0" label="权限标识" prop="permission">
        <el-input
          v-model="form.permission"
          placeholder="权限标识"
          style="width: 178px"
        />
      </el-form-item>
      <el-form-item v-if="form.type !== 2" label="路由地址" prop="path">
        <el-input
          v-model="form.path"
          placeholder="路由地址"
          style="width: 178px"
        />
      </el-form-item>
      <el-form-item label="菜单排序" prop="seq">
        <el-input-number
          v-model.number="form.seq"
          :min="0"
          :max="999"
          controls-position="right"
          style="width: 178px"
        />
      </el-form-item>
      <el-form-item
        v-show="form.isFrame === 0 && form.type === 1"
        label="组件名称"
        prop="name"
      >
        <el-input
          v-model="form.name"
          style="width: 178px"
          placeholder="匹配组件内Name字段"
        />
      </el-form-item>
      <el-form-item
        v-show="form.isFrame === 0 && form.type === 1"
        label="组件路径"
        prop="component"
      >
        <el-input
          v-model="form.component"
          style="width: 178px"
          placeholder="组件路径"
        />
      </el-form-item>
      <el-form-item label="上级类目" prop="parentId">
        <treeselect
          v-model="form.parentId"
          :options="menus"
          :normalizer="normalizer"
          style="width: 450px"
          placeholder="选择上级类目"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="close">取消</el-button>
      <el-button type="primary" @click="save">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit, getSupMenus } from '@/api/menu'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import IconSelect from '@/components/IconSelect'
  import arrayToTree from 'array-to-tree/index'
  export default {
    name: 'MenuEdit',
    components: { Treeselect, IconSelect },
    data() {
      return {
        form: {
          type: 0,
          icon: '',
          isFrame: 0,
          cache: 0,
          seq: 0,
          title: '',
          hidden: 0,
          parentId: null,
        },
        menus: [],
        rules: {
          type: [
            { required: true, trigger: 'blur', message: '请选择菜单类型' },
          ],
          title: [
            { required: true, trigger: 'blur', message: '请输入菜单标题' },
          ],
          path: [{ required: true, trigger: 'blur', message: '请输入路径' }],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {},
    methods: {
      init() {
        if (this.form.id) {
          const data = []
          data.push(this.form.id)
          this.getSupMenus(data)
        } else {
          this.getSupMenus([])
        }
      },
      // 选中图标
      selected(name) {
        this.form.icon = name
        this.$forceUpdate()
      },
      showEdit(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
          this.form.title = row.meta.title
          this.form.icon = row.meta.icon
        }
        this.init()
        this.dialogFormVisible = true
      },
      close() {
        this.form = {}
        this.dialogFormVisible = false
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const { msg } = await doEdit(this.form)
            this.$baseMessage(msg, 'success')
            this.$emit('fetch-data')
            this.close()
          } else {
            return false
          }
        })
      },
      async getSupMenus(param) {
        const { data } = await getSupMenus(param)
        const children = arrayToTree(data, { parentProperty: 'parentId' })
        this.menus = [{ id: 0, title: '顶级类目', children: children }]
        console.log(this.menus)
      },
      normalizer(node) {
        return {
          id: node.id,
          label: node.title,
          children: node.children,
        }
      },
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
  ::v-deep .vue-treeselect__control,
  ::v-deep .vue-treeselect__placeholder,
  ::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
  }
</style>
