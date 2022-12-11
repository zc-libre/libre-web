<template>
  <div>首页</div>
</template>
<script>
  import Sortable from 'sortablejs'
  export default {
    data() {
      return {
        tableData: [
          {
            title: '帮助中小企业盈利1个亿',
            endTIme: '2099-12-31',
            percentage: 50,
            color: '#95de64',
          },
          {
            title: '帮助10万个人',
            endTIme: '2029-12-31',
            percentage: 8,
            color: '#69c0ff',
          },
          {
            title: '交个帅气的男朋友',
            endTIme: '2021-12-31',
            percentage: 76,
            color: '#1890FF',
          },
          {
            title: 'vue-admin-beautiful标星过1K',
            endTIme: '2020-03-31',
            percentage: 100,
            color: '#ffc069',
          },
          {
            title: '活到老，学到老',
            endTIme: '2094-12-16',
            percentage: 25,
            color: '#5cdbd3',
          },
          {
            title: '变成像尤雨溪一样优秀的人',
            endTIme: '此生无望',
            percentage: 1,
            color: '#b37feb',
          },
        ],
      }
    },
    mounted() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0]
          _this.tableData.splice(newIndex, 0, currRow)
        },
      })
    },
  }
</script>
