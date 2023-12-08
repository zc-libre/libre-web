<template>
  <div class="vueVideoPlayer">
    <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true"
                  :options="playerOptions" @ready="handleReady" @beforeCre>
    </video-player>
  </div>
</template>

<script>
import { watch } from '@/api/video'
import {mapGetters} from "vuex";
export default {
  name: 'VideoItems',
  data () {
    return {
      src: '',
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: this.autoplay, // 如果true,浏览器准备好时自动播放视频
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:10', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.vue.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          withCredentials: false,
          type: "application/x-mpegURL", // m3u8视频的类型，而mp4的为video/mp4
          src: ''
        }],
        hls: true,
        crossOrigin: '*',
        // poster: this.cover_url, // 你的封面地址
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: true, // 是否显示剩余时间功能
          fullscreenToggle: true // 是否显示全屏按钮
        }
      }
    }
  },

  computed: {
    ...mapGetters([
      'baseApi'
    ]),
  },
  methods: {
    fetchVideo(id) {
       watch(id).then(res => {
        if (res) {
          this.src = this.baseApi + '/file/' + res
          this.playerOptions.sources[0].src = this.src
        }
      })
    }
  },
  mounted () {
     console.log("id====", this.$route.params)
     let video = this.$route.params.video
     this.fetchVideo(video.id)
     sessionStorage.setItem("searchFlag", "1");
  }
}
</script>

<style>
</style>
