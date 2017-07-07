<template>
  <div class="classify-list">
    <ul v-if="list.length > 0">
      <li v-for="(item, index) in list"
        class="clear"
        :class="curIndex === index ? 'gradient' : ''">
          <span class="list-img" :class="'list-n' +index%3"></span>
          <div class="select-product">
            <div class="classification-title pr">
              {{item.title}}
              <span class="iconfont icon-tongjitu btn-chart"
                @mouseover="showPopup($event,index)"
                @mouseout="hidePopup"
                >
              </span>
            </div>
            <p v-limitLine class="product-txt">{{item.summary}}</p>
            <p class="release-date">发布日期 ： {{item.publish_time | formatDatetime}}
            </p>
            <i class="btn-detail"
                @click="indexChange(index)">{{curIndex === index ? '返回详情': '查看详情'}}</i>
          </div>
      </li>
    </ul>

    <expect-data class="list-nodata-bg pr" 
      :showSectionData="true" 
      v-else-if="list.length == 0 && showNoData"></expect-data>
    
    <div class="chart-popover">
      <my-echart class="echart" 
        :options="options" v-loading.lock="chartLoading"></my-echart>
    </div>
  </div>
</template>

<script>
import expectData from 'components/expectData/'
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
        if (this.hoverIndex === index) {
          this.$emit('getChartData', index)
        }
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
    components: {
      expectData
    }
  }
</script>
<style
 lang="less" rel="stylesheet/less" scoped>
@import '../../../assets/style/common';
  .classify-list {
    h3 {
      text-align: center;
    }
    ul {
      width: 100%;
      max-height: 540px;
      background: #fff;
      border-radius: 0px 0px 4px 4px;
      overflow: auto;
      .gradient {
        .adv-gradient(#effdd7;#e3f8bc);
        &:hover {
          .adv-gradient(#effdd7;#e3f8bc);
        }
      }
      li {
        position: relative;
        height: 116px;
        box-sizing: border-box;
        padding: 20px 16px 10px;
        border-bottom: 1px solid #bbbec2;
        &:last-child {
          border-bottom: 1px solid #fff;
        }
        .list-img {
          position: absolute;
          top: 24px;
          left: 16px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
        }
        .list-n0 {
          background: url('/static/assets/img/classify/list1.png') no-repeat;
        }
        .list-n1 {
          background: url('/static/assets/img/classify/list2.png') no-repeat;
        }
        .list-n2 {
          background: url('/static/assets/img/classify/list3.png') no-repeat;
        }
        .select-product {
          padding-left: 68px;
          .release-date {
            .adv-text-line-height-small();
            line-height: 20px;
            color: #4e4c4c;
            margin-top: 6px;
          }
          .btn-detail {
            position: absolute;
            right: 18px;
            bottom: 4px;
            .adv-fixed-small-btn();
          }
          .classification-title {
            .adv-title-normal();
            margin-bottom: 10px;
          }
          .product-txt{
            height: 37px;
            .adv-text-line-height-small();
            line-height: 20px;
            color: #4e4c4c;
          }
        }
        &:hover {
          background: #eee;
        }
        .btn-chart {
          position: absolute;
          font-size: 16px;
          top: 0;
          right: 0;
          color: #b5b5b5;
          cursor: default;
        }
      }
    }
    .tip-chart, .echart {
      width: 288px;
      height: 238px;
    }
    .list-nodata-bg {
      width: 358px;
      min-height: 300px; 
      overflow-y: auto;
      .adv-border-bottom-radius();
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
      .adv-boxshadow();
    }
  }
</style>