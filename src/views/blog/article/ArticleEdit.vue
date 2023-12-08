<template>
  <el-card class="main-card">
    <div class="title">{{ this.$route.name }}</div>
    <div class="article-title-container">
      <el-input v-model="article.articleName" size="medium" placeholder="输入文章标题"/>
      <el-button
          type="danger"
          size="medium"
          class="save-btn"
          @click="saveArticleDraft"
          v-if="article.id == null || article.status === 3">
        保存草稿
      </el-button>
      <el-button type="danger" size="medium" @click="openModel" style="margin-left: 10px"> 发布文章</el-button>
    </div>
    <mavon-editor ref="md" v-model="article.content" @imgAdd="uploadImg"  style="height: calc(100vh - 260px)"/>
    <el-dialog :visible.sync="addOrEdit" width="40%" top="3vh">
      <div class="dialog-title-container" slot="title">发布文章</div>
      <el-form label-width="80px" size="medium" :model="article">
        <el-form-item label="文章分类">
          <el-tag
              type="success"
              v-show="article.categoryName"
              style="margin: 0 1rem 0 0"
              :closable="true"
              @close="removeCategory">
            {{ article.categoryName }}
          </el-tag>
          <el-popover placement="bottom-start" width="460" trigger="click" v-if="!article.categoryName">
            <div class="popover-title">分类</div>
            <el-autocomplete
                style="width: 100%"
                v-model="categoryName"
                :fetch-suggestions="searchCategories"
                placeholder="请输入分类名搜索"
                :trigger-on-focus="false"
                @select="handleSelectCategories">
              <template slot-scope="{ item }">
                <div>{{ item.categoryName }}</div>
              </template>
            </el-autocomplete>
            <div class="popover-container">
              <div v-for="item of categories" :key="item.id" class="category-item" @click="addCategory(item)">
                {{ item.categoryName }}
              </div>
            </div>
            <el-button type="success" plain slot="reference" size="small"> 添加分类</el-button>
          </el-popover>
        </el-form-item>
        <el-form-item label="文章标签">
          <el-tag
              v-for="(item, index) of article.tagNames"
              :key="index"
              style="margin: 0 1rem 0 0"
              :closable="true"
              @close="removeTag(item)">
            {{ item }}
          </el-tag>
          <el-popover placement="bottom-start" width="460" trigger="click" v-if="article.tagNames && article.tagNames.length < 3">
            <div class="popover-title">标签</div>
            <el-autocomplete
                style="width: 100%"
                v-model="tagName"
                :fetch-suggestions="searchTags"
                placeholder="请输入标签名搜索"
                :trigger-on-focus="false"
                @select="handleSelectTag">
              <template slot-scope="{ item }">
                <div>{{ item.tagName }}</div>
              </template>
            </el-autocomplete>
            <div class="popover-container">
              <div style="margin-bottom: 1rem">添加标签</div>
              <el-tag v-for="(item, index) of tagList" :key="index" :class="tagClass(item)" @click="addTag(item)">
                {{ item.tagName }}
              </el-tag>
            </div>
            <el-button type="primary" plain slot="reference" size="small"> 添加标签</el-button>
          </el-popover>
        </el-form-item>
        <el-form-item label="文章类型">
          <el-select v-model="article.type" placeholder="请选择类型">
            <el-option v-for="item in typeList" :key="item.type" :label="item.desc" :value="item.type"/>
          </el-select>
        </el-form-item>
        <el-form-item label="原文地址" v-if="article.type !== 1">
          <el-input v-model="article.originalUrl" placeholder="请填写原文链接"/>
        </el-form-item>
        <el-form-item label="上传封面">
          <el-upload
              class="upload-cover"
              drag
              :action="fileUploadApi"
              multiple
              :headers="headers"
              :before-upload="beforeUpload"
              :on-success="uploadCover">
            <i class="el-icon-upload" v-if="article.cover === ''"/>
            <div class="el-upload__text" v-if="article.cover === ''">将文件拖到此处，或<em>点击上传</em></div>
            <img :src="baseApi + '/file/' + article.cover" width="360px" height="180px"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="置顶">
          <el-switch
              v-model="article.top"
              active-color="#13ce66"
              inactive-color="#F4F4F5"
              :active-value="1"
              :inactive-value="0"/>
        </el-form-item>
        <el-form-item label="推荐">
          <el-switch
              v-model="article.featured"
              active-color="#13ce66"
              inactive-color="#F4F4F5"
              :active-value="1"
              :inactive-value="0"/>
        </el-form-item>
        <el-form-item label="发布形式">
          <el-radio-group v-model="article.status">
            <el-radio :label="1">公开</el-radio>
            <el-radio :label="2">密码</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="访问密码" v-if="article.status === 2">
          <el-input v-model="article.password" placeholder="请填写文章访问密码"/>
        </el-form-item>
        <el-form-item label="文章摘要">
          <el-input type="textarea" :autosize="true" v-model="article.summary"
                    placeholder="默认取文章前500个字符"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addOrEdit = false">取 消</el-button>
        <el-button type="danger" @click="saveOrUpdateArticle"> 发 表</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import * as imageConversion from 'image-conversion'
import { categoryList, list } from '@/api/blog/category'
import { listAllTag } from '@/api/blog/tag'
import { mapGetters } from "vuex";
import { getToken } from '@/utils/auth'
import { add, get } from '@/api/blog/article'
import { upload } from "@/api/tools/files"

export default {
  name: 'ArticleEdit',
  created() {
    console.log("-==========")
    const articleId = this.$route.query.articleId
    if (articleId) {
      get(articleId).then(res => {
        this.article = res
        this.article.categoryName = this.article.category.categoryName
        let tags = []
        this.article.tagNames = []
        this.article.tagIds = []
        if (this.article.tags) {
          tags = this.article.tags
          tags.forEach(tag => {
            this.article.tagNames.push(tag.tagName)
            this.article.tagIds.push(tag.id)
          })
        }
        console.log(this.article)
      })
    }
    else {
      const article = sessionStorage.getItem('article')
      if (article) {
        this.article = JSON.parse(article)
      }
    }
  },
  computed: {
    ...mapGetters([
      'baseApi',
      'fileUploadApi'
    ]),
    tagClass() {
      return function (item) {
        const index = this.article.tagNames.indexOf(item.tagName)
        return index !== -1 ? 'tag-item-select' : 'tag-item'
      }
    }
  },
  data() {
    return {
      addOrEdit: false,
      autoSave: true,
      categoryName: '',
      tagName: '',
      categories: [],
      tagList: [],
      typeList: [
        {
          type: 1,
          desc: '原创'
        },
        {
          type: 2,
          desc: '转载'
        },
        {
          type: 3,
          desc: '翻译'
        }
      ],
      article: {
        id: null,
        articleName: '',
        content: '',
        featured: 0,
        summary: '',
        cover: '',
        categoryName: null,
        categoryId: null,
        tagNames: [],
        tagIds: [],
        top: 0,
        type: 1,
        status: 1
      },
      headers: { Authorization: 'Bearer ' + getToken() }
    }
  },
  methods: {
    listCategories() {
      categoryList().then(res => {
        this.categories = res
      })
    },
    listTags() {
      listAllTag().then(res => {
        this.tagList = res
      })
    },
    openModel() {
      if (this.article.articleName.trim() === '') {
        this.$message.error('文章标题不能为空')
        return false
      }
      if (this.article.content.trim() === '') {
        this.$message.error('文章内容不能为空')
        return false
      }
      this.listCategories()
      this.listTags()
      this.addOrEdit = true
    },
    uploadCover(response) {
      this.article.cover = response.data
    },
    beforeUpload(file) {
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      return new Promise((resolve) => {
        if (isLt2M) {
          resolve(file)
        }
        imageConversion.compressAccurately(file, 1024).then((res) => {
          resolve(res)
        })
      })
    },
    uploadImg(pos, file) {
      const formData = new FormData();
      formData.append('file', file)
      upload(formData).then(res => {
        let path = this.baseApi + '/file/' + res
        this.$refs.md.$img2Url(pos, path)
      })
    },
    saveArticleDraft() {
      if (this.article.articleName.trim() === '') {
        this.$message.error('文章标题不能为空')
        return false
      }
      if (this.article.content.trim() === '') {
        this.$message.error('文章内容不能为空')
        return false
      }
      this.article.status = 3
      add(this.article).then(res => {
        if (res) {
          this.$notify.success({
            title: '成功',
            message: '保存草稿成功'
          })
        }
        else {
          this.$notify.error({
            title: '失败',
            message: '保存草稿失败'
          })
        }
      })
      this.autoSave = false
    },
    saveOrUpdateArticle() {
      if (this.article.articleName.trim() === '') {
        this.$message.error('文章标题不能为空')
        return false
      }
      if (this.article.content.trim() === '') {
        this.$message.error('文章内容不能为空')
        return false
      }
      if (this.article.categoryName == null) {
        this.$message.error('文章分类不能为空')
        return false
      }
      if (this.article.tagNames.length === 0) {
        this.$message.error('文章标签不能为空')
        return false
      }
      if (this.article.cover.trim() === '') {
        this.$message.error('文章封面不能为空')
        return false
      }
      add(this.article).then(res => {
        this.$notify.success({
          title: '成功'
        })
        this.addOrEdit = false
      })
      this.autoSave = false
    },
    searchCategories(keywords, cb) {
      let param = { blurry: keywords }
      list(param)
          .then(res => {
            cb(res)
          })
    },
    handleSelectCategories(item) {
      this.addCategory({
        categoryName: item.categoryName,
        id: item.id
      })
    },
    addCategory(item) {
      this.article.categoryName = item.categoryName
      this.article.categoryId = item.id
    },
    removeCategory() {
      this.article.categoryName = null
      this.article.categoryId = null
    },
    searchTags(keywords, cb) {
      this.axios
          .get('/api/admin/tags/search', {
            params: {
              keywords: keywords
            }
          })
          .then(({data}) => {
            cb(data.data)
          })
    },
    handleSelectTag(item) {
      this.addTag({
        tagName: item.tagName,
        id: item.id
      })
    },
    addTag(item) {
      if (this.article.tagNames.indexOf(item.tagName) === -1) {
        this.article.tagNames.push(item.tagName)
        this.article.tagIds.push(item.id)
      }
    },
    removeTag(item) {
      const index = this.article.tagNames.indexOf(item)
      this.article.tagNames.splice(index, 1)
      this.article.tagIds.splice(index, 1)
    }
  },
}
</script>

<style scoped>
.article-title-container {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  margin-top: 2.25rem;
}

.save-btn {
  margin-left: 0.75rem;
  background: #fff;
  color: #f56c6c;
}

.tag-item {
  margin-right: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
}

.tag-item-select {
  margin-right: 1rem;
  margin-bottom: 1rem;
  cursor: not-allowed;
  color: #ccccd8 !important;
}

.category-item {
  cursor: pointer;
  padding: 0.6rem 0.5rem;
}

.category-item:hover {
  background-color: #f0f9eb;
  color: #67c23a;
}

.popover-title {
  margin-bottom: 1rem;
  text-align: center;
}

.popover-container {
  margin-top: 1rem;
  height: 260px;
  overflow-y: auto;
}
</style>
