<template>
  <div>
    <svg-icon icon-class="doc" @click="click" />
  </div>
</template>

<script>
  export default {
    name: 'Doc',
    methods: {
      click() {
        window.open('http://wiki.dreamlu.net/mica-fast', '_blank')
      },
    },
  }
</script>
