<template>
  <div class="date-line">
    <span class="pre el-icon-arrow-left fl" 
      @click="changePeriod(-1)" 
      :class="dateClassName"></span>
    <div class="dl-header" :class="dateClassName">
      <i>{{curYear}}</i>
    </div>
    <t-line class="dl-body pr"
      :curIndex="curIndex"
      :dlData="dateLineData"
      :changeTimeHeight="showChangeHeight"
      :atmosLoading="atmosLoading"
      :forecastLoading="forecastLoading"
      @change="change"
      @setCurYear="setCurYear"></t-line>
    <span class="next el-icon-arrow-right fr"
       @click="changePeriod(1)" 
       :class="dateClassName"
       ></span>
  </div>
</template>

<script>
import {dateUtil} from 'plugins/utils.js'
import tLine from './tline'
  export default{
    props: {
      dlData: {
        type: Object,
        default: null
      },
      start:{
        type: Date,
        default: new Date('2010-01-01')
      },
      end:{
        type: Date,
        default: new Date()
      },
      date: {
        type: Date,
        default: new Date()
      },
      showWeather: {
        type: Boolean,
        default: false
      },
      atmosLoading: {
        type: Boolean,
        default: false
      },
      forecastLoading: {
        type: Boolean,
        default: false
      },
    },
    data(){
      return {
        expand: false,
        curIndex: 0,
        dateLineData: [],
        curYear: '',
        showChangeHeight: false,
        dateClassName: ''
      }
    },
    mounted() {
      this.expandCtl(this.dlData !== null && this.dlData.index !== 0)
    },
    methods: {
      change(data) {
        this.curIndex = data.index;
        var date = new Date(data.date);
        this.$emit('changeDate', date)
      },
      expandCtl(expand) {
        this.expand = expand
      },
      changePeriod(step) {
        var period = dateUtil.dateToPeriod(this.date)
        var year = this.date.getFullYear()
        if (parseInt(period) === 1 && step === -1) {
          year -= 1
          period = 36
        } else if (parseInt(period) === 36 && step === 1) {
          year += 1
          period = 1
        } else {
          period = parseInt(period) + step
        }
        period = year.toString() + period
        var date = dateUtil.periodToDate(period)

        var end = new Date(this.end.getFullYear() + '-12-21')
        if (end.getTime() >= date.getTime() && this.start.getTime() <= date.getTime()) {
          this.$emit('changeDate', date)
        }
      },
      setCurYear(year) {
        this.curYear = year
        this.$emit("currentYearChange", year)
      }
    },
    watch: {
      dlData: {
        handler: function (dlData) {
          this.expandCtl(this.dlData !== null && this.dlData.index !== 0)
          this.curIndex = dlData.index
          this.dateLineData = dlData.data
          this.curYear = this.dateLineData[this.curIndex].date.toString().substr(0, 4)
        },
        deep: true
      },
      date: function (date) {
        var dateStr = dateUtil.formatDate(date)

        for (var i = this.dateLineData.length - 1; i >= 0; i--) {
          if(this.dateLineData[i].date === dateStr) {
            this.curIndex = i;
            this.curYear = this.dateLineData[i].date.toString().substr(0, 4)
            return
          }
        }
      },
      showWeather(show) {
        if (show) {
          this.showChangeHeight = true
          this.dateClassName = 'animation-button-top'
        } else {
          this.showChangeHeight = false
          this.dateClassName = 'animation-button-bottom'  
        }
      }
    },
    components: {
      tLine

    }
  }
</script>
<style 
lang="less" 
scoped>
@import '../../../assets/style/common';
.date-line {
  .dl-header {
    position: absolute;
    background: #fff;
    height: 34px;
    line-height: 34px;
    padding: 0 9px;
    color: #000;
    left: 20px;
    font-size: 14px;
    text-align: center;
    z-index: 3;
    box-shadow: 2px 3px 4px #b1b4b4;
  }
  .dl-body {
  	height: 176px;
    background: #fff;
    z-index: 0;
    position: absolute;
    left: 0;
    background-color: #fff;
    border: 1px solid #d0d0d0;
    box-shadow: 0 1px 6px #aeaeae;
  }
  .dl-footer {
    position: absolute;
    right: 0;
    top: 0;
    width: 20px;
    height: 176px;
    line-height: 176px;
    text-align: center;
    font-size: 20px;
    color: #949494;
    cursor: pointer;
    border-left: 1px solid #d0d0d0;
    background: -webkit-linear-gradient(top,#ffffff,#e6e5e5);
    z-index: 20;
  }
  span {
    font-size: 14px;
    z-index: 20;
    position: relative;
    width: 20px;
    height: 34px;
    line-height: 34px;
    background: #d6d6d3;
    cursor: pointer;
    text-align: center;
    transition: all ease-in 0.35s;
    &:hover {
      background: #c4e48a;
    }
  }
}
.animation-button-bottom {
      .adv-animation(button-bottom;.5s;1;forwards);
  }
  @keyframes button-bottom {
    0% {
        height: 176px;
        line-height: 176px;
    }
    100% {
        height: 34px;
        line-height: 34px;
    }
  }
  .animation-button-top {
      .adv-animation(button-top;.5s;1;forwards);
  }
  @keyframes button-top {
    100% {
        height: 176px;
        line-height: 176px;
    }
    0% {
        height: 34px;
        line-height: 34px;
    }
  }
</style>