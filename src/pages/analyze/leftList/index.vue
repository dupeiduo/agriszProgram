<template>
  <div class="al-list fl pr" :style="{'height': getScreenHeight - 50 + 'px'}">
    <ul class="al-list-ul" 
      :style="{height: clientH + 'px'}"
      v-show="leftList.length > 0">
      <li 
          v-for="(item,index) in leftList" 
          :class="index == curIndex ? 'on' : ''"
          @click="curIndex = index"
          :data-key="item.key"
          >{{item.name}}
      </li>
    </ul>
    <expect-data 
        :showSectionData="true"
        :style="{height: getScreenHeight - 50 + 'px'}"
        v-show="leftList.length === 0"
        > 
    </expect-data>
  </div>
</template>

<script>
import expectData from 'components/expectData/'
import {mapGetters} from 'vuex'
  export default{
    props: {
      leftList: {
        type: Array,
        default: []
      }
    },
    data(){
      return {
        clientH: -1,
        curIndex: -1,
        showSectionData: false,
      }
    },
    mounted() {
      this.curIndex = 0
    },
    computed: {
     ...mapGetters({
      menuWidth: 'menuWidth',
      screenWidth: 'screenWidth',
      getScreenHeight: 'getScreenHeight'
    })},
    watch:{
      curIndex: function(index) {
        this.$emit('changeState', index)
      }
    },
    methods: {
      initMap (map) {
        this.map = map;
      }
    },
    components: {
      expectData
    },
  }
</script>
<style 
    lang="less"
    rel="stylesheet/less"
    scoped>
    @import '../../../assets/style/common';
    @top: 47px;
  .al-list {
    z-index: 3;
    width: 176px;
    margin-top: @top;
    border-right: 1px solid #d0d0d0;
    background: #ebf7e0;
      .al-list-ul {
        width: 176px;
        padding-top: 10px;
          .on,.on:hover {
                .adv-font-normal();
                .adv-gradient(#beea6a;#a0d13d);
                color: #fff;
            }
          li:hover {
                  background: #f8fef1;
          }
          li {
                line-height: 42px;
                height: 42px;
                padding-left: 26px;
                cursor: pointer;
                color: #545252;
                border-top: 1px solid transparent;
                border-right: 1px solid #e5e5e5;
                border-bottom: 1px solid #e5e5e5;
                border-left: 1px solid transparent;
                &:first-child {
                  border-top: 1px solid #e5e5e5;
                }
          }
    }
}
</style>