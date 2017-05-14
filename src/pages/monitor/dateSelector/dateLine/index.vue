<template>
  <div class="date-line">
    <span class="pre el-icon-arrow-left fl" 
      @click="changePeriod(-1)"></span>
    <div class="dl-header">
      <i>{{curYear}}</i>
    </div>
    <t-line class="dl-body"
      :curIndex="curIndex"
      :dlData="dateLineData"
      @change="change"
      @setCurYear="setCurYear"></t-line>
    <span class="next el-icon-arrow-right fr"
       @click="changePeriod(1)"></span>
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
      }
    },
    data(){
      return {
        expand: false,
        curIndex: 0,
        dateLineData: [],
        curYear: ''
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
      }
    },
    watch: {
      dlData: function (dlData) {
        this.expandCtl(this.dlData !== null && this.dlData.index !== 0)
        this.curIndex = dlData.index
        this.dateLineData = dlData.data
        this.curYear = this.dateLineData[this.curIndex].date.toString().substr(0, 4)
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
@import '../../../../assets/style/reset';
.date-line {
  position: relative;
  overflow: hidden;
  height: 42px;

  .dl-header {
    position: absolute;
    background: #fff;
    height: 42px;
    padding: 0 9px;
    color: #000;
    left: 20px;
    font-size: 14px;
    text-align: center;
    z-index: 3;
    box-shadow: 2px 3px 4px #b1b4b4;
    i {
      position: relative;
      top: 14px;
    }
  }
  .dl-body {
    background: #fff;
    z-index: 0;
    height: 42px;
    position: absolute;
    left: 0;
    background-color: #fff;
    border: 1px solid #d0d0d0;
    .box-bottom;
  }
  .dl-footer {
    position: absolute;
    right: 0;
    top: 0;
    width: 20px;
    height: 42px;
    line-height: 42px;
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
    height: 42px;
    line-height: 42px;
    background: #d6d6d3;
    cursor: pointer;
    text-align: center;
    &:hover {
      background: #c4e48a;
    }
  }
}
</style>