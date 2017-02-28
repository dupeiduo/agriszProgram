<template>
    <div class="left-container fl">
    <ul class="report-type"
      :style="{height: clientH + 'px'}" 
      v-show="leftList.length > 0">
      <li class="special-report" 
          v-for="(item,index) in leftList" 
          :class="index == curIndex ? 'on' : ''"
          @click="curIndex = index"
          >
        <a>{{item.topic_name}}</a>
        <span class="report-common">
          <em :class="item.report_class">{{item.report_label}}</em>
          <i class="iconfont icon-xiangyou"></i>
        </span>
      </li>
    </ul>
    <div class="none-data" 
          v-show="leftList.length === 0"
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
      }
    },
    data() {
      return {
        clientH: -1,
        curIndex: -1
      }
    },
    mounted() {
      this.clientH = document.documentElement.clientHeight - 70 || document.body.clientHeight - 70
    },
    computed: {},
    methods: {},
    components: {},
    watch: {
      leftList: function(leftList) {
        if (leftList.length > 0) {
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
    .left-container {
      z-index: 1;
      position: fixed;
      top: 68px;
      width: 176px;
      border-right: 1px solid #d0d0d0;
        .report-type {
          width: 176px;
          background: url(/static/assets/img/common/report-left.png) no-repeat;
          background-size: cover;
            .on {
                background: #42e495;
                    a {
                      font-size: 14px;
                      text-decoration: none;
                      color: #fff;
                    }
                    i {
                    opacity: 1;
                }
            }
            li:hover {
              border: 1px solid #a6aba9;
                i {
                  opacity: 1;
                  color: #555;
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
                a {
                  line-height: 42px;
                  display: inline-block;
                  overflow: hidden;
                  width: 96px;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  color: #545252;
              }
              span {
                position: absolute;
                right: 2px;
                clear: both;
                overflow: hidden;
                margin-top: 12px;
                  em {
                    line-height: 18px;
                    float: left;
                    width: 18px;
                    height: 18px;
                    margin-right: 10px;
                    text-align: center;
                    color: #fff;
                    border-radius: 50%;
                }
                i {
                  font-size: 14px;
                  float: left;
                  width: 14px;
                  height: 14px;
                  opacity: 0;
                  color: #fff;
              }
            }
          }
      }
  }
</style>