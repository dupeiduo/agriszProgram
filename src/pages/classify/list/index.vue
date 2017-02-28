<template>
  <div class="classify-list">
    <ul v-if="list.length > 0">
      <li v-for="(item, index) in list"
        :class="curIndex === index ? 'gradient' : ''">
        <div class="classification-title">
          {{item.title}}
          <span class="iconfont icon-bingtu btn-chart"
            @mouseover="showPopup(index)"
            @mouseout="hidePopup"
            >
          </span>
        </div>
        <p class="cf-desc">{{item.summary}}</p>
        <p>发布日期 ： {{item.publish_time}}
          <i class="btn-detail"
            @click="indexChange(index)">查看详情</i>
        </p>
      </li>
    </ul>
    <h3 v-else>－暂无数据－</h3>
    
    <div class="chart-popover" v-loading.body="chartLoading">
      <my-echart class="echart" 
        :options="options"></my-echart>
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
      }
    },
    data() {
      return {
        hoverIndex: -1,
        chartLoading: false,
        popTarg: null
      }
    },
    mounted() {
      this.popTarg = document.getElementsByClassName('chart-popover')[0]
    },
    methods: {
      indexChange (index) {
        this.$emit('listChange', index)
      },
      showPopup(index) {
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
    }
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
      height: 320px;
      background: #fff;

      .gradient {
        .mixin-gradient();
        &:hover {
          .mixin-gradient();
        }
        .classification-title {
          font-weight: 600;
        }
        p {
          color: #4e4c4c;
        }
      }
      li {
        position: relative;
        clear: both;
        padding: 0 10px;
        width: 296px;
        height: 115px;
        border-right: 1px solid #bbbec2;
        border-bottom: 1px solid #bbbec2;
        border-left: 1px solid #bbbec2;

        &:hover {
          background: #f5fded;
          .btn-chart {
            color: #f7b779;
          }
        }
        div {
          font-size: 14px;
          line-height: 40px;
          position: relative;
          .btn-chart {
            position: absolute;
            display: block;
            font-size: 16px;
            top: 0;
            right: 0px;
            width: 17px;
            height: 17px;
            color: #b5b5b5;
            z-index: 9999;
            cursor: pointer;
          }
        }
        .cf-desc {
          overflow: hidden;
          width: 290px;
          height: 46px;
        }
        p {
          line-height: 22px;
          position: relative;
          color: #b6b6b6;
        }
        .btn-detail {
          position: absolute;
          line-height: 24px;
          right: 12px;
          bottom: 0;
          width: 66px;
          height: 24px;
          cursor: pointer;
          text-align: center;
          color: #8abefa;
          border: 1px solid #8abefa;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          &:hover {
            color: #fff;
            background: #8abefa;
          }
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
      left: 340px;
      background: #fff;
      border-radius: 5px;
      box-shadow: 0 2px 8px #aeaeae;
    }
  }
</style>