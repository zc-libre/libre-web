<template>
  <elFrame :src="druidApi" />
</template>
<script>
  import { mapGetters } from 'vuex'
  import elFrame from '@/components/Iframe/index'
  export default {
    name: 'Druid',
    components: { elFrame },
    computed: {
      ...mapGetters(['druidApi']),
    },
  }
</script>
