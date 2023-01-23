<template>
  <div class="chat-container" v-loading="loading">
    <div class="input-question">
      <div>
        <el-input v-model="question" placeholder="请输入内容"></el-input>
      </div>
      <div>
        <el-button type="primary" @click="getResult">提问</el-button>
      </div>
      <div class="clear-button">
        <el-button type="success" @click="clear">清空</el-button>
      </div>
    </div>

    <div class="result-group">
      <div v-for="(item, index) in dataList" :key="index">
        <el-collapse-transition>
          <div class="result">
            <div v-if="item.style">
              <span class="question">{{ item.text }}</span>
            </div>
            <div v-else class="answer">
              <pre><code class="language-html">{{ item.text }}</code></pre>
            </div>
          </div>
        </el-collapse-transition>
      </div>
    </div>
  </div>
</template>

<script>
  import { getAnswer } from '@/api/tools/openapi'

  export default {
    name: 'Chat',
    data() {
      return {
        question: '',
        dataList: [],
        loading: false,
      }
    },
    methods: {
      clear() {
        this.dataList = []
      },
      getResult() {
        this.loading = true
        let item = {
          text: this.question,
          style: true,
        }
        this.dataList.push(item)
        getAnswer(this.question)
          .then((res) => {
            if (res) {
              let item = {
                text: res,
                style: false,
              }
              this.dataList.push(item)
              this.question = null
            }
          })
          .catch((e) => {})
          .finally(() => {
            this.loading = false
          })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .chat-container {
    display: flex;
    flex-direction: column;
    padding: 50px;
  }

  .input-question {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    .clear-button {
      display: flex;
      margin-left: 20px;
    }
  }

  .result-group {
    margin-top: 100px;
    justify-content: flex-start;
  }

  .result {
    display: flex;
    margin-top: 30px;
    font-size: 20px;
    width: 100%;
  }

  .question {
    background-color: #e8f4ff;
  }
  .answer {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    color: #bfbfbf;
    font-size: 20px;
    padding: 20px;
    border-radius: 5px;
    background-color: rgba(247, 247, 248);
  }
</style>
