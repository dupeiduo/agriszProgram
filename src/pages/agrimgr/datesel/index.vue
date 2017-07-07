<template>
  <div class="date-picker no-select" v-if="showPop">
    <div class="date-container no-select">
      <span class="date-ctl">
        <el-tooltip class="item" effect="dark"  popper-class="tooltip-opacity" :content="preYearTip | formatedDate" placement="top-start">
          <i class="el-icon-d-arrow-left" @click="jumpYear(-1)"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark"  popper-class="tooltip-opacity" :content="preTip | formatedDate" placement="top-start">
          <i class="el-icon-arrow-left" @click="jumpMonth(-1)"></i>
        </el-tooltip>
      </span>
      <span class="cur-date no-select" @click="togglePanel">{{dateStr}}</span>
      <span class="date-ctl">
        <el-tooltip class="item" effect="dark"  popper-class="tooltip-opacity" :content="nextTip | formatedDate" placement="top-end">
          <i class="el-icon-arrow-right" @click="jumpMonth(1)"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark"  popper-class="tooltip-opacity" :content="nextYearTip | formatedDate" placement="top-end">
          <i class="el-icon-d-arrow-right" @click="jumpYear(1)"></i>
        </el-tooltip>
      </span>
    </div>
    <div class="tb-container no-select">
      <my-button 
        :buttons="phaseBtns" 
        @btnClick="cropClick"
        :curIndex="curIndex"
        ></my-button>
    </div>
  </div>
</template>


<script type="text/javascript">
import {dateUtil} from 'plugins/utils.js'
import configData from '../../../config/data.js'
  export default {
    props: {
      curDate: {
        type: Date,
        default: new Date()
      },
      startDate: {
        type: Date,
        default: new Date('2006-01-01')
      },
      exist: {
        type: Array,
        default: []
      },
      showPop: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        curData: '',
        rowList: [],
        endDate: new Date(),
        dateStr: '',
        curIndex: -1,
        preYearTip: '',
        nextYearTip: '',
        preTip: '',
        nextTip: '',
        phaseBtns: []
      }
    },
    filters: {
      formatedDate(value) {
        return value.replace(/-/g,'/')
      }
    },
    mounted() {
      this.endDate.setMonth(11)
      this.endDate.setDate(31)
      this.dateStr = dateUtil.formatDate(this.curDate).replace(/-/g,'/')
      this.renderPage(this.curDate)
    },
    methods: {
      togglePanel() {
        event.stopPropagation()
        this.$emit('showPopEvt', !this.showPop)
      },
      chooseDate(date, index) {
        if (date) {
          var layerName = this.getLayerName(date)
          this.$emit('changeDate', {date, layerName, index})
          this.$emit('showPopEvt', false)
        }
      },
      jumpYear(step) {
        event.stopPropagation()
        if (step > 0 && this.curIndex === this.exist.length - 1) {
          this.$emit('changeDate', {noLater: true})
          return
        } 
        if(step < 0 && this.curIndex === 0) {
          this.$emit('changeDate', {noEarlier: true})
          return
        }

        var year = this.curDate.getFullYear() + step
        var date = new Date(dateUtil.formatDate(this.curDate))
        var index = this.curIndex
        date.setYear(year)

        var layerName = this.getLayerName(date, step)

        if (layerName.noLater) {
          this.$emit('changeDate', {noLater: true, tips: "没有下一年的同期数据"})

        } else if (layerName.noEarlier) {
          this.$emit('changeDate', {noEarlier: true, tips: "没有上一年的同期数据"})

        } else {
          this.$emit('changeDate', {index, date, ...layerName})
        }
      },
      jumpMonth(step) {
        event.stopPropagation()
        var index
        if (step > 0) {
          if (this.curIndex === this.exist.length - 1) {
            this.$emit('changeDate', {date, noLater: true})

          } else {
            this.curIndex = this.curIndex + step
            index = this.curIndex
            var date = this.exist[this.curIndex].date,
              layerName = this.exist[this.curIndex].layerName
            this.$emit('changeDate', {index, date, layerName})
          }
        } else {
          if (this.curIndex === 0) {
            this.$emit('changeDate', {date, noEarlier: true})

          } else {
            this.curIndex = this.curIndex + step
            index = this.curIndex
            var date = this.exist[this.curIndex].date,
              layerName = this.exist[this.curIndex].layerName
            this.$emit('changeDate', {index, date, layerName})
          }
        } 
      },
      getLayerName(date, step) {
        var layerName = null

        if (typeof step === "number") { 
          layerName = this.getLayerNameByStep(date, step)
        } else { 
          layerName = this.getLayerNameByDate(date)
        }

        return layerName
      },
      getLayerNameByDate(date) {
        var layerName = '',
          isPrevious = false,
          selected = new Date(date).getTime(),
          current = null

        var isBorder = this.getBorder(date)
        if (isBorder.earlier) {
          layerName = this.exist[0].layerName
          this.curIndex = 0

        } else if (isBorder.later) {
          layerName = this.exist[this.exist.length - 1].layerName
          this.curIndex = this.exist.length - 1

        } else {

          for (var i = 0; i < this.exist.length; i++) {
            if (this.exist[i].date.indexOf(date) >= 0) {
              layerName = this.exist[i].layerName
              this.curIndex = i
              break

            } else {
              var curLoop = new Date(this.exist[i].date).getTime()
              if (curLoop - selected < 0) {
                var next = new Date(this.exist[i +1].date).getTime()
                if (next - selected > selected - curLoop) {
                  layerName = this.exist[i].layerName
                  this.curIndex = i
                  break
                } else {
                  layerName = this.exist[i + 1].layerName
                  this.curIndex = i
                  break
                }
              }
            }
          }

        }

        return layerName
      },
      getLayerNameByStep(date, step) {
        var layerName = '',
          isPrevious = false,
          selected = new Date(date).getTime(),
          cache = null,
          noEarlier= false,
          noLater = false

        var isBorder = this.getBorder(date)
        
        if (isBorder.earlier) {
          if (step < 0) {
            noEarlier = true

            // layerName = this.exist[0].layerName
            // noEarlier = true
            // this.curIndex = 0
          }

        } else if (isBorder.later) {
          if (step > 0) {
            noLater = true

            // layerName = this.exist[this.exist.length - 1].layerName
            // noLater = true
            // this.curIndex = this.exist.length - 1
          }

        } else {

          for (var i = 0; i < this.exist.length; i++) {
            if (this.exist[i].date.indexOf(date) >= 0) {
              layerName = this.exist[i].layerName
              this.curIndex = i
              break

            } else {
              var curLoop = new Date(this.exist[i].date).getTime()
              if (step > 0) {
                if (curLoop - selected < 0) {
                  layerName = this.exist[i + 1].layerName
                  this.curIndex = i
                  break
                }
              } else {
                if (curLoop - selected < 0) {
                  layerName = this.exist[i].layerName
                  this.curIndex = i
                  break
                }
              }
            }
          }

        }

        return {layerName, noEarlier, noLater}
      },
      getBorder(date, step) {
        var current = new Date(date).getTime(),
          start = new Date(this.exist[0].date).getTime(),
          end = new Date(this.exist[this.exist.length -1].date).getTime(),
          earlier = false,
          later = false

        if (typeof step === "number") {
          if (step > 0 && current > end) {
            later = true
          } 

          if (step < 0 && current < start) {
            earlier = true
          }
        } else {
          later = current > end 
          earlier = current < start
        }
        
        return {earlier, later}
      },
      isLeap(year) {
        return ( year%100 === 0 ? 
            (year%400 === 0 ? 1 : 0): 
            (year%4 === 0 ? 1 :0) );
      },
      getDays(year, month) {
        var daysArray = [31,28+this.isLeap(year),31,30,31,31,30,31,30,31,30,31]
        return daysArray[month]
      },
      processData(date) {
        var temDate = new Date(dateUtil.formatDate(date))
        temDate.setDate(1)
        var firstday = temDate.getDay(),
          year = date.getFullYear(),
          month = date.getMonth(),
          days = this.getDays(year, month),
          rows = Math.ceil((days + firstday + 1)/7)

        var rowList = []

        for (var row = 0; row < rows; row++) {
          var columnList = []
          for (var column = 0; column < 7; column++) {
            if (row === 0 && column <= firstday) {
              var rowItem = { date: '', value: "" }
              columnList.push(rowItem)

            } else {
              var date = row * 7 + column - firstday
              if (date > days) {
                var rowItem = { date: '', value: "" }
              } else {
                var day = date > 10 ? date : '0' + date ,
                  mon = (month + 1) > 10 ? (month + 1) : '0' + (month + 1),
                  value = `${year}-${mon}-${day}`,
                  hasDate = this.getHasDate(value),
                  rowItem = { date, value, hasDate}
              }

              columnList.push(rowItem)
            }
          }
          rowList.push(columnList)
        }
        return rowList
      },
      getHasDate(value) {
        var result = false
        for (var i = 0; i < this.exist.length; i++) {
          if (this.exist[i].date.indexOf(value) >= 0) {
            result = true
          }
        }
        return result
      },
      renderPage(date) {
        this.dateStr = dateUtil.formatDate(date).replace(/-/g,'/')
        for (var i = 0; i < this.exist.length; i++) {
          var _date = new Date(this.exist[i].date)
          var _dateStr = dateUtil.formatDate(_date).replace(/-/g,'/')
          if (this.dateStr === _dateStr) {
            this.curIndex = i
          }
        }
        // this.rowList = this.processData(date)
      },
      renderPhase(dataArr) {
        this.phaseBtns = []
        for (var i = 0; i < dataArr.length; i++) {
          var item = {
            name: `第 ${i+1} 期`
          }
          this.phaseBtns[i] = item
        }
      },
      cropClick(index) {
        this.chooseDate(this.exist[index].date, index)
        this.curIndex = index
      }
    },
    watch: {
      curDate(date) {
        this.renderPage(date)
      },
      exist(dataArr) {
        if (dataArr && dataArr.length > 0) {
          this.chooseDate(dataArr[dataArr.length -1].date)
          this.renderPhase(dataArr)
          this.curIndex = dataArr.length -1
        }
      },
      curIndex(index) {
        var curYear = this.exist[index].date.split(' ')[0].toString().substr(0,4),
          curDay = this.dateStr.substr(4).replace(/\//g, "/")

        if (index === 0) {
          this.preTip = "已经是最早的监测结果了"
          this.preYearTip = "已经是最早的监测结果了"

          this.nextTip = `显示下一期(${(this.exist[index + 1].date).split(' ')[0]})监测结果`
          this.nextYearTip = `显示下一年同期(${parseInt(curYear)+1}${curDay})监测结果`
        } else if (index === this.exist.length -1) {
          this.nextTip = "已经是最新的监测结果了"
          this.nextYearTip = "已经是最新的监测结果了"

          this.preTip = `显示上一期(${(this.exist[index - 1].date).split(' ')[0]})监测结果`
          this.preYearTip = `显示上一年同期(${curYear-1}${curDay})监测结果`
        } else {
          this.preTip = `显示上一期(${(this.exist[index - 1].date).split(' ')[0]})监测结果`
          this.nextTip = `显示下一期(${(this.exist[index + 1].date).split(' ')[0]})监测结果`
          
          
          this.preYearTip = `显示上一年同期(${curYear-1}${curDay})监测结果`
          this.nextYearTip = `显示下一年同期(${parseInt(curYear)+1}${curDay})监测结果`
        }
      }
    }
  }

</script>

<style 
lang="less" scoped>
  @import '../../../assets/style/common';
  .date-picker {
    position: relative;

    .title {
      margin: 0 18px;
    }
    .date-container {
      text-align: center;
      background: #f3fbeb;
      padding: 8px 4px;
      border: 1px solid #dcdcdc;
      .date-ctl {
        cursor: pointer;

        i {
          background: #f3fbeb;
          border: 1px solid #bed7b5;
          padding: 5px;
          border-radius: 2px;
          color: #708c69;
        }
      }
      .cur-date {
        border: 1px solid #9ed132;
        padding: 4px 10px;
      }
    } 
  }
  .tb-container {
    width: 232px;
    padding: 12px 6px 0;
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
      span {
        color: #c7cdda;
        cursor: pointer;
      }
      .time-title {
        width: 164px;
        display: inline-block;
        text-align: center;
      }

    .date-tip {
      position: fixed;
      .adv-horizontal-center(78px);
      line-height: 32px;
      background: url("/static/assets/img/monitor/tip.png") no-repeat;
      color: #333;
      .adv-common-border-radius();
    }
  }
</style>