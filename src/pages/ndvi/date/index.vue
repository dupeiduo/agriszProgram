<template>
  <div class="date-picker no-select">
    <span class="title fl">NDVI时间</span>
    <div class="date-ctl no-select">
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
    <div v-if="showPop" class="tb-container no-select">
      <table>
        <tbody>
          <tr>
            <td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td>
          </tr>
          <tr v-for="item in rowList">
            <td 
              v-for="_date in item"
              :class="_date.hasDate ? 'exist-data' : ''"
              @click="chooseDate(_date.value)">
              {{_date.date}}
            </td>
          </tr>
        </tbody>
      </table>
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
      chooseDate(date) {
        if (date) {
          var layerName = this.getLayerName(date)
          this.$emit('changeDate', {date, layerName})
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
        date.setYear(year)

        var layerName = this.getLayerName(date, step)

        if (layerName.noLater) {
          this.$emit('changeDate', {noLater: true, tips: "没有下一年的同期数据"})

        } else if (layerName.noEarlier) {
          this.$emit('changeDate', {noEarlier: true, tips: "没有上一年的同期数据"})

        } else {
          this.$emit('changeDate', {date, ...layerName})
        }
      },
      jumpMonth(step) {
        event.stopPropagation()
        if (step > 0) {
          if (this.curIndex === this.exist.length - 1) {
            this.$emit('changeDate', {date, noLater: true})

          } else {
            this.curIndex = this.curIndex + step
            var date = this.exist[this.curIndex].date,
              layerName = this.exist[this.curIndex].layerName
            this.$emit('changeDate', {date, layerName})
          }
        } else {
          if (this.curIndex === 0) {
            this.$emit('changeDate', {date, noEarlier: true})

          } else {
            this.curIndex = this.curIndex + step
            var date = this.exist[this.curIndex].date,
              layerName = this.exist[this.curIndex].layerName
            this.$emit('changeDate', {date, layerName})
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

          for (var i = this.exist.length -1; i >= 0; i--) {
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

          for (var i = this.exist.length -1; i >= 0; i--) {
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
        this.rowList = this.processData(date)
      }
    },
    watch: {
      curDate(date) {
        this.renderPage(date)
      },
      exist(dataArr) {
        if (dataArr && dataArr.length > 0) {
          this.chooseDate(dataArr[dataArr.length -1].date)
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

<style lang="less" scoped>
  @import '../../../assets/style/reset';
  .date-picker {
    position: relative;
    margin: 10px 0 0;

    .title {
      margin: 0 18px;
    }
    .date-ctl {
      cursor: pointer;
      margin: 0 -4px;

      i {
        background: #f3fbeb;
        border: 1px solid #bed7b5;
        padding: 5px;
        border-radius: 2px;
        color: #708c69;
      }
      .cur-date {
        border-bottom: 1px solid #9ed132;
        border-top: 1px solid #9ed132;
        padding: 4px 10px;
      }
    }
  }
  .crop-test-time {
      width: 132px;
      background: #fff;
      border-radius: 4px;
      margin: 14px 0 10px 0;
      .mixin-height(28px);
      span {
        float: left;
        cursor: pointer;
      }
      span:nth-child(1) {
        border-right: 1px solid #cacaca;
        .mixin-width(50px);
      }
      span:nth-child(2) {
        border-right: 1px solid #cacaca;
        .mixin-width(28px);
      }
      span:nth-child(3) {
        .mixin-width(52px);
      }
    &:hover {
        span {
          color: #6ea265;
          }
        }
    }
  .tb-container {
    position: absolute;
    top: 35px;
    left: 80px;
    width: 220px;
    padding: 6px 18px;
    background: #fff;
    border-radius: 4px;
    z-index: 10002;
    overflow: hidden;
    .mixin-boxshadow();
      span {
        color: #c7cdda;
        cursor: pointer;
      }
      .time-title {
        width: 164px;
        display: inline-block;
        text-align: center;
      }

    table {
      width: 100%;
      margin: 5px 0;
      text-align: center;
      tbody {
        width: 100%;
        tr {
          width: 100%;
          cursor: pointer;
          border-radius: 4px;
          .period-hover {
            background: #eeeeee;
          }
          .period-active {
            background: #c2e675;
          }
          .exist-data {
            background: #bed7b5;
            border-radius: 2px; 
          }
        }

      }
    }
    .date-tip {
      position: fixed;
      .mixin-width(78px);
      line-height: 32px;
      background: url("/static/assets/img/monitor/tip.png") no-repeat;
      color: #333;
      border-radius: 4px;
    }
  }
</style>