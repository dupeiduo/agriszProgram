<template>
  <div>
    <p class="crop-test-time fr clear" @click="togglePanel">
      <span>{{current[0]}} - {{current[1]}} - {{current[2]}}</span>
    </p>
    <div v-if="showDatepicker" class="tb-container pop-zIndex">
      <div class="date-control no-select no-select">
        <span v-if="!hidePre" class="pre fl">
          <i class="pre-year el-icon-d-arrow-left" @click="jumpYear(-1)"></i>
          <i class="pre-month el-icon-arrow-left" @click="jumpMonth(-1)"></i>
        </span>
        <i class="time-title">{{dateStr}}</i>
        <span v-if="!hideNext" class="next fr">
          <i class="next-month el-icon-arrow-right" @click="jumpMonth(1)"></i>
          <i class="next-year el-icon-d-arrow-right" @click="jumpYear(1)"></i>
        </span>
      </div>

      <table>
        <tbody>
          <tr>
            <td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td>
          </tr>
          <tr v-for="item in rowList">
            <td :style="{background: curPeriod === _date.period ? '#c2e675' : ''}"
              :class="(hoverStyle >= 0 && hoverStyle === _date.period) ? 'period-hover' : ''" 
              v-for="_date in item"
              @mouseover="addTip($event, _date.period, _date.date)"
              @mouseout="removeTip"
              @click="chooseDate(_date.date)">
              {{_date.date}}
            </td>
          </tr>
        </tbody>
      </table>
      <span class="date-tip"
        v-if="periodStr !==''"
        :style="{top: tipTop + 'px', left: tipLeft + 'px'}">{{periodStr}}</span>
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
      showPop: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        curData: '',
        rowList: [],
        temDate: new Date(),
        hideNext: false,
        hidePre: false,
        current: [],
        hoverStyle: '',
        curPeriod: -1,
        periodStr: '',
        showDatepicker: false,
        tipLeft: 0,
        tipTop: 0,
        endDate: new Date(),
        dateStr: ''
      }
    },
    mounted() {
      this.renderPage(this.curDate)
    },
    methods: {
      togglePanel() {
        this.showDatepicker = !this.showDatepicker
        if (this.showDatepicker) {
          this.$emit('showPanel')
        }
      },
      addTip(event, className, day) {
        this.hoverStyle = className

        var date = new Date(dateUtil.formatDate(this.temDate))
        date.setDate(day) 

        var number = dateUtil.dateToPeriod(date),
          index = parseInt(number)

        if (date > this.endDate) {
          this.periodStr = "敬请期待"

        } else {
          this.periodStr = configData.dateItem.period[index -1][number]
        }
        
        this.tipLeft = event.clientX - 30
        this.tipTop = event.clientY + 40
      },
      removeTip() {
        this.hoverStyle = -1
        this.periodStr = ''
      },
      chooseDate(day) {
        var date = new Date(dateUtil.formatDate(this.temDate))
        if (day <= 10) {
          day = 1
        } else if (day <= 20) {
          day = 11
        } else {
          day = 21
        }
        date.setDate(day)
        this.$emit('changeDate', date)
        this.showDatepicker = false
      },
      jumpYear(step) {
        this.curPeriod = -1
        var year = this.temDate.getFullYear() + step
        var goNext = this.checkYear(year)
        if (goNext) {
          var date = new Date(dateUtil.formatDate(this.temDate))
          date.setYear(year)

          this.renderPage(date)
        }
      },
      jumpMonth(step) {
        this.curPeriod = -1
        var date = new Date(dateUtil.formatDate(this.temDate)),
          month = date.getMonth() + step
        date.setMonth(month)

        this.renderPage(date)
      },
      checkYear(year) {
        var goNext = true
        if (year > this.endDate.getFullYear() || year < this.startDate.getFullYear()) {
          goNext = false
        } 
        return goNext
      },
      setBtnStatus(date) {
        var endMonth = this.endDate.getMonth()
        var endYear = this.endDate.getFullYear()

        var startMonth = this.startDate.getMonth()
        var startYear = this.startDate.getFullYear()

        var curMonth = date.getMonth()
        var curYear = date.getFullYear()

        if (curYear >= endYear && curMonth >= endMonth) {
          this.hideNext = true
        } else {
          this.hideNext = false
        }

        if (curYear <= startYear && curMonth <= startMonth) {
          this.hidePre = true
        } else {
          this.hidePre = false
        }
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
              var rowItem = {
                date: '',
                period: -9
              }
              columnList.push(rowItem)

            } else {
              var date = row * 7 + column - firstday
              if (date > days) {
                var rowItem = { date: '', period: -9 }
              } else {
                var rowItem = { date }

                if (date < 11) {
                  rowItem.period = 0
                } else if (date < 21) {
                  rowItem.period = 1
                } else {
                  rowItem.period = 2
                }
              }

              columnList.push(rowItem)
            }
          }
          rowList.push(columnList)
        }
        return rowList
      },
      renderPage(date) {
        this.temDate = new Date(dateUtil.formatDate(date))
        this.setBtnStatus(this.temDate)
        this.current = dateUtil.formatDateToPeriodZH(this.temDate).split('-')
        this.dateStr = this.temDate.getFullYear() + '年' + (this.temDate.getMonth() + 1) + '月'
        this.rowList = this.processData(this.temDate)
      }
    },
    watch: {
      curDate(date) {
        this.curPeriod = dateUtil.dayToPeriod(date.getDate()) - 1
        this.renderPage(date)
      },
      showPop(show) {
        this.showDatepicker = show
      }
    }
  }

</script>

<style
 lang="less" scoped>
  @import '../../../assets/style/common';
  .crop-test-time {
      .adv-height(24px);
      .adv-horizontal-center(105px);
      background: @assistant-bg;
      border-radius: 2px;
      margin: 14px 21px 10px 0;
      span {
        cursor: pointer;
      }
    &:hover {
        span {
          color: #6ea265;
          }
        }
    }
  .tb-container {
    .adv-common-border-radius();
    .adv-boxshadow();
    position: absolute;
    top: 86px;
    left: 130px;
    width: 220px;
    padding: 6px 18px;
    background: @assistant-bg;
    overflow: hidden;
      span {
        color: #c7cdda;
        cursor: pointer;
        i {
          &:hover {
            color: #939393;
          }
        }
      }
      .time-title {
        .adv-horizontal-center(164px);
        display: inline-block;
      }

    table {
      width: 100%;
      margin: 5px;
      text-align: center;
      tbody {
        width: 100%;
        tr {
          .adv-common-border-radius();
          width: 100%;
          cursor: pointer;
          .period-hover {
            background: #eeeeee;
          }
          .period-active {
            background: #c2e675;
          }
        }

      }
    }
    .date-tip {
      .adv-horizontal-center(78px);
      .adv-common-border-radius();
      position: fixed;
      line-height: 32px;
      background: url("/static/assets/img/monitor/tip.png") no-repeat;
      color: #333;
    }
  }
</style>