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
          <el-form-item label="文章标题" prop="title">
            <el-input
              v-model="query.blurry"
              placeholder="请输入文章标题"
              clearable
              size="small"
            />
          </el-form-item>
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
          <rrOperation/>
        </el-form>
      </div>
      <crudOperation :permission="permission"/>
    </div>
    <el-table
      ref="table"
      v-loading="crud.loading"
      lazy
      :data="crud.data"
      row-key="id"
      @select="crud.selectChange"
      @select-all="crud.selectAllChange"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column
        label="文章名称"
        align="center"
        prop="articleName"
        :show-overflow-tooltip="true"
      />
      <!--      <el-table-column-->
      <!--        prop="top"-->
      <!--        label="置顶"-->
      <!--        width="100"-->
      <!--        :filters="[{ text: 0, value: '家' }, { text: '公司', value: '公司' }]"-->
      <!--        :filter-method="filterTag"-->
      <!--        filter-placement="bottom-end">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-tag-->
      <!--            :type="scope.row.tag === '家' ? 'primary' : 'success'"-->
      <!--            disable-transitions>{{scope.row.tag}}</el-tag>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="置顶" align="center" prop="top">
        <template #default="scope">
          <el-switch
            v-model="scope.row.top"
            :disabled="enableChangeTop"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="changeTop(scope.row, scope.row.top)"
          />
        </template>
      </el-table-column>
      <el-table-column label="推荐" align="center" prop="featured">
        <template #default="scope">
          <el-switch
            v-model="scope.row.featured"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="changeEnabled(scope.row, scope.row.featured)"
          />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="changeEnabled(scope.row, scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="创建者"
        align="center"
        prop="gmtCreateName"
        width="100"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="gmtCreate"
        width="200"
      >
      </el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="gmtModified"
        width="200"
      >
      </el-table-column>
      <!--   编辑与删除   -->
      <el-table-column
        v-permission="['admin', 'post:edit', 'post:del']"
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template #default="scope">
          <el-button
            v-permission="permission.edit"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="editArticle(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination/>
  </div>
</template>

<script>
import crudArticle from '@/api/blog/article'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import Editor from '@/components/Editor'
import {changeStatus, changeTop} from '@/api/blog/article'

const defaultForm = {
  id: null,
  tagName: null
}
export default {
  name: 'Tag',
  components: {crudOperation, rrOperation, pagination, udOperation, Editor},
  cruds() {
    return CRUD({
      title: '添加文章标签',
      url: 'api/blog/article/page',
      crudMethod: {...crudArticle},
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      enableChangeTop: false,
      permission: {
        add: ['admin', 'blog:article:add'],
        edit: ['admin', 'blog:article:edit'],
        del: ['admin', 'blog:article:del'],
      },
    }
  },
  created() {
    this.crud.optShow = {
      del: true,
      download: false,
      reset: true,
    }
  },
  methods: {
    [CRUD.HOOK.afterRefresh]() {

    },
    changeTop(row, top) {
      changeTop(row).then(res => {
        this.$message({
          showClose: true,
          message: '修改成功',
          type: 'success'
        });
        this.top = top
      }).catch(e => {
        console.log(e)
        this.crud.refresh()
      }).finally(() => {
      })
    },
    changeEnabled(row, status) {
      changeStatus(row).then(res => {
        this.$message({
          showClose: true,
          message: '修改成功',
          type: 'success'
        });
      }).catch(error => {
        console.log(error)
        this.crud.refresh()
      }).finally(() => {

      })
    },
    editArticle(row) {
      this.$router.push({path: '/blog/articleEdit', query: {articleId: row.id}})
    }
  },
}
</script>
