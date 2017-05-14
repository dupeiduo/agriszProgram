<template>
  <div class="classify-list">
    <ul v-if="list.length > 0">
      <li v-for="(item, index) in list"
        class="clear"
        :class="curIndex === index ? 'gradient' : ''">
          <span class="fl list-img" :class="'list-n' + (index + 1)"></span>
          <div class="fl select-product">
            <div class="classification-title pr">
              {{item.title}}
              <span class="iconfont icon-tongjitu btn-chart"
                @mouseover="showPopup($event,index)"
                @mouseout="hidePopup"
                >
              </span>
            </div>
            <p v-limitLine>{{item.summary}}</p>
            <p class="release-date ps">发布日期 ： {{item.publish_time | formatDatetime}}
              <i class="btn-detail"
                @click="indexChange(index)">{{curIndex === index ? '返回详情': '查看详情'}}</i>
            </p>
          </div>
      </li>
    </ul>
    <h3 v-else-if="list.length == 0 && showNoData">－暂无数据－</h3>
    
    <div class="chart-popover">
      <my-echart class="echart" 
        :options="options" v-loading.lock="chartLoading"></my-echart>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      list: {
        type: Array,
        default: []
      },
      options: {
        type: Object,
        default: null
      },
      curIndex: {
        type: Number,
        default: 0
      },
      showNoData: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        hoverIndex: 0,
        chartLoading: false,
        popTarg: null
      }
    },
    filters: {
      formatDatetime(value) {
        return value.replace(/-/g, "/")
      }
    },
    mounted() {
      this.popTarg = document.getElementsByClassName('chart-popover')[0]
    },
    methods: {
      indexChange (index) {
        this.$emit('listChange', index)
      },
      showPopup(event,index) {
        event = event || window.event;
        var y = event.clientY - 80
        this.popTarg.style.top = `${y}px`
        this.popTarg.style.display = 'block'
        this.hoverIndex = index
      },
      hidePopup() {
        this.popTarg.style.display = 'none'
      }
    },
    watch: {
      hoverIndex (index) {
        this.chartLoading = true
        this.$emit('getChartData', index)
      },
      options: function (options) {
        this.chartLoading = false
      }
    },
    directives: {
      limitLine: {
        bind: function(el) {
          $clamp(el, {
            clamp: 2
          })
        }
      }
    },
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import '../../../assets/style/reset';
  .classify-list {
    h3 {
      text-align: center;
    }
    ul {
      overflow-x: hidden;
      max-height: 540px;
      background: #fff;
      border-radius: 4px;
      .gradient {
        .mixin-gradient-bg(#effdd7;#e3f8bc);
        &:hover {
          .mixin-gradient-bg(#effdd7;#e3f8bc);
        }
      }
      li {
        position: relative;
        clear: both;
        padding: 0 16px;
        height: 115px;
        border-right: 1px solid #bbbec2;
        border-bottom: 1px solid #bbbec2;
        border-left: 1px solid #bbbec2;
        .list-img {
          display: block;
          width: 56px;
          height: 56px;
          margin-top: 24px;
          border-radius: 50%;
        }
        .list-n1 {
          background: url('/static/assets/img/classify/list1.png') no-repeat;
        }
        .list-n2 {
          background: url('/static/assets/img/classify/list2.png') no-repeat;
        }
        .list-n3 {
          background: url('/static/assets/img/classify/list3.png') no-repeat;
        }
        .select-product {
          width: 256px;
          margin-left: 10px;
          .release-date {
            width: 250px;
            bottom: 10px;
          }
          .btn-detail {
            position: absolute;
            right: 0px;
            bottom: 0;
            background: #fff;
            color: #969696;
            cursor: pointer;
            .mixin-width(68px);
            .mixin-height(24px);
            .mixin-border(#969696;4px);
            &:hover {
              color: #6e9716;
              border: 1px solid #6e9716;
            }
          }
          .classification-title {
            font-size: 14px;
            width: 250px;
            height: 32px;
            margin-top: 6px;
            font-weight: bold;
          }
        }
        &:hover {
          background: #eee;
        }
          .btn-chart {
            position: absolute;
            font-size: 16px;
            top: 0;
            right: 0px;
            color: #b5b5b5;
            cursor: default;
          }
        p {
          line-height: 20px;
          color: #4e4c4c;
        }
      }
    }
    .tip-chart, .echart {
      width: 288px;
      height: 238px;
    }
    .chart-popover {
      display: none;
      position: absolute;
      width: 298px;
      height: 248px;
      left: 360px;
      top: 0;
      background: #fff;
      border-radius: 5px;
      .mixin-boxshadow();
    }
  }
</style>