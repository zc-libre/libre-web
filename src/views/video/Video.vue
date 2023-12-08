<template>
  <div class="video-container">
    <el-row type="flex" justify="center">
      <el-col :span="6">
         <el-input v-model="queryParams.title"></el-input>
      </el-col>
      <el-col :span="3">
        <el-button @click="queryVideo">搜索</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6" v-for="(video, index) in videoList" :key="index">
        <el-card :body-style="{ }" shadow="always" style="margin: 20px; height: 300px" >
          <img :src="baseApi + '/file/image/' + video.image" class="image" style="height: 200px;width: 300px;  ">
          <div>
            <el-link @click="toVideoItem(video)">{{ video.title }}</el-link>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"

          :current-page.sync="queryParams.current"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="queryParams.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :key="current">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import { list } from "@/api/video";
import {mapGetters} from "vuex";

export default {
  name: 'VideoPlayer',
  data() {
    return {
      current: 1,
      videoList: [],
      queryParams: {
        title: '',
        size: 20,
        current: 1,
      },
      total: 0,
    }
  },
  computed: {
    ...mapGetters([
      'baseApi'
    ]),
  },
  mounted() {
    if (sessionStorage.getItem("searchFlag")) {
      const param = JSON.parse(sessionStorage.getItem("searchForm"))
      this.queryParams.current = param.current
      this.queryParams.size = param.size
      this.queryParams.title = param.title
      this.current = param.current
      console.log(this.queryParams)
      this.fetchVideoList()
      this.$forceUpdate()
    }
    else {
      this.queryParams.pageSize = 20;
      this.queryParams.current = 1;
      this.queryParams.title = '';
      this.current = this.queryParams.current
      // 首次进入列表页,清除缓存中的搜索条件
      sessionStorage.removeItem("searchForm")
      this.fetchVideoList()
    }
  },

  methods: {
    toVideoItem(video) {
      sessionStorage.setItem("searchForm", JSON.stringify(this.queryParams));
      this.$router.push({ name:'watch', params: { video: video }})
    },
    queryVideo() {
      sessionStorage.removeItem("searchForm");
      sessionStorage.removeItem("searchFlag");
      this.fetchVideoList()
    },
    async fetchVideoList() {
      let data = await list(this.queryParams)
      if (data) {
         this.videoList = data.content
         this.total = data.totalElements
      }
    },
    handleSizeChange(val) {
      this.queryParams.size = val
      this.fetchVideoList()
    },
    handleCurrentChange(val) {
      this.queryParams.current = val
      this.current = this.queryParams.current
      this.fetchVideoList()
    }
  },
  destroyed() {
    // 销毁组件
    sessionStorage.removeItem("searchFlag");
  },
}
</script>

<style scoped lang="scss">
 .video-container{
   margin: 0;
   padding: 0;
   width: 100%;
   height: 100%;
 }
</style>
