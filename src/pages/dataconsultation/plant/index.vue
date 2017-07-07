<template>
  <div class="plant-infor">
    <h3>玉米适宜性分级统计图</h3>
    <ul class="legend clear">
      <li :style="{'background':item.background,'borderColor':item.color,'borderWidth':'1px','borderStyle': 'solid'}"  class="pr" v-for="(item,index) in plantBarChart">
       <span :style="{'color':item.color}" class="iconfont icon-yuan"></span>
       <span>{{item.displayName}}{{item.percent}}%</span>
     </li>
   </ul>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  props: {
    plantBarChart: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      

    }
  },
  mounted() {
    
  },
  computed: {
    ...mapGetters({
      menuWidth: 'menuWidth',
      screenWidth: 'screenWidth',
      getScreenHeight: 'getScreenHeight'
  })},
  methods: {
    
  }, 
  watch: {

  },
  componets: {
    
  }
}
</script>
<style 
  lang="less"
   rel="stylesheet/less"
   scoped>
@import '../../../assets/style/common';
.plant-infor {
  h3 {
    font-size: 14px;
    margin: 18px 14px;
  }
  .legend {
    margin-right: 50px;
    li {
      float: right;
      margin-right: 14px;
      padding: 2px 3px;
      border: 1px solid #effaff;
      border-radius: 2px;
    }
  }
}
</style>