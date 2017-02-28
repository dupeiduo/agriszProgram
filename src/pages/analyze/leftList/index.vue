<template>
  <div class="al-list fl pr">
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
    <div class="none-data" 
          v-show="leftList.length === 0"
          :style="{height: clientH + 'px'}" 
          >-暂无数据-</div>
  </div>
</template>

<script>
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
        curIndex: -1
      }
    },
    computed: {

    },
    mounted() {
      this.clientH = document.documentElement.clientHeight - 70 || document.body.clientHeight - 70
      this.curIndex = 0
    },
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
    },
  }
</script>
<style 
    lang="less"
    rel="stylesheet/less"
    scoped>
  .al-list {
    z-index: 2;
    position: fixed;
    top: 68px;
    width: 176px;
    height: 100%;
    border-right: 1px solid #d0d0d0;
      .al-list-ul {
        width: 176px;
        height: 100%;
        background: url(/static/assets/img/common/report-left.png) no-repeat;
        background-size: cover;
          .on {
                font-size: 14px;
                color: #fff;
                background: #42e495;
            }
          li:hover {
                  border: 1px solid #a6aba9;
          }
          li {
                line-height: 42px;
                height: 42px;
                padding-left: 26px;
                cursor: pointer;
                color: #666;
                border-top: 1px solid transparent;
                border-right: 1px solid #e5e5e5;
                border-bottom: 1px solid #e5e5e5;
                border-left: 1px solid transparent;
          }
    }
}
</style>