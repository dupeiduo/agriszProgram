<template>
    <div class="left-container fl"  :style="{height: clientH + 'px'}" v-loading.lock="loading">
    <ul class="report-type" 
      v-if="leftList.length > 0">
      <li class="special-report" 
          v-for="(item,index) in leftList" 
          :class="index == curIndex ? 'on' : ''"
          @click="curIndex = index"
          >
        <a>{{item.topic_name}}</a>
        <span class="report-common">
          <i class="iconfont " :class="index == curIndex ? 'icon-xiangyou' : 'icon-NOTEPAD'"></i>
        </span>
      </li>
    </ul>
    <div class="none-data" 
      v-else-if="!loading"
      :style="{height: clientH + 'px'}" 
      >暂无数据</div>
  </div>
</template>

<script>
  export default {
    props: {
      leftList: {
        type: Array,
        default: []
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        clientH: -1,
        curIndex: -1
      }
    },
    mounted() {
      this.clientH = document.documentElement.clientHeight - 50 || document.body.clientHeight - 50
    },
    computed: {},
    methods: {},
    components: {},
    watch: {
      leftList: function(leftList) {
        if (leftList && leftList.length > 0) {
          this.curIndex = 0;
        }

      },
      curIndex: function(index) {
        var topicId = this.leftList[index].topic_id
        this.$emit('changeTopic', topicId);
      }
    }
  }
</script>
<style 
    lang="less"
    rel="stylesheet/less"
    scoped>
    @import '../../../assets/style/reset';
    .left-container {
      z-index: 1;
      height: 800px;
      position: fixed;
      top: @top;
      width: 176px;
      background: #ebf7e0;
      border-right: 1px solid #d0d0d0;
        .report-type {
          width: 176px;
          padding-top: 10px;

            .on,.on:hover {
              .mixin-gradient-bg(#beea6a;#a0d13d);
                    a {
                      font-size: 14px;
                      text-decoration: none;
                      color: #fff;
                    }
                    i {
                      color: #fff;
                }
            }
            
            li {
              position: relative;
              height: 42px;
              padding-left: 26px;
              border-top: 1px solid transparent;
              border-right: 1px solid #e5e5e5;
              border-bottom: 1px solid #e5e5e5;
              border-left: 1px solid transparent;
              cursor: pointer;

              &:nth-child(1) {
                border-top: 1px solid #e5e5e5;
              }
                a {
                  line-height: 42px;
                  display: inline-block;
                  color: #545252;
                  .mixin-ellipsis(96px);
                }
              span {
                position: absolute;
                right: 12px;
                clear: both;
                overflow: hidden;
                margin-top: 12px;
                  i {
                    font-size: 14px;
                    float: left;
                    width: 14px;
                    height: 14px;
                    color: #a0ac91;
                }
              }
            &:hover {
                 background: #f8fef1;
              }
          }
      }

      .none-data {
        position: relative;
        top: 30px;
      }
  }
</style>