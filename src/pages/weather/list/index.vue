<template>
  <div class="weather-list">
    <left-tab 
      :showList="showList"
      @toggleList="toggleListStatus"
      :leftTab="[]"
      title="气象产品列表"
      listTitle="返回查看所有气象产品"
      :backList="backList"
      @changeState="switchList">

      <div slot="list">
        <ul class="wl-list">
          <li v-for="(item, index) in listData"
            class="wl-list-item"
            :class="curIndex === index ? 'gradient' : ''"
            >
            <span :style="{backgroundImage: 'url(/static/assets/img/weather/' + item.img+')'}"></span>
            <div class="list-txt">
              <h3 class="title">
                {{item.title}}
                <el-tooltip class="tips" effect="light" 
                :content="item.help" placement="right-start" popper-class="tips-popover">
                <i class="tips iconfont icon-wenti  no-select"></i>
              </el-tooltip>
            </h3>
            <p class="desc" v-limitLine>{{item.desc}}</p>
            <h2 class="detail-btn no-select" @click="showDetail(index)">{{curIndex === index ? '返回详情' : '查看详情'}}</h2>
            </div>
          </li>
        </ul>
      </div>

      <div slot="detail" v-loading.lock="loading">
        <div class="detail-container" v-if="curIndex >= 0">
          <div class="detail-container-bg">
            <div class="clear">
              <h3 class="detail-title fl">
               {{listData[curIndex].title}}
              </h3>
              <div v-if="curIndex !== 0" class="fr">
                
                <div class="block weather-test-time" v-show="dateUnit==='tenday'">
                  <i v-if="disablePre" class="phase pre-period el-icon-arrow-left disable-phase"></i>
                  <el-tooltip class="item" effect="dark" content="上一期" placement="top">
                    <i class="phase pre-period el-icon-arrow-left" @click="jumpPeriod(-1)"></i>
                  </el-tooltip>
                  <date-period @click.native="stopEvent"
                    :curDate="curDate" 
                    :showPop="showTime"
                    :startDate="new Date('2010-01-01')"
                    @showPanel="showTime = true"
                    @changeDate="changeDate">
                  </date-period>
                  <i v-if="disableNext" class="phase next-period el-icon-arrow-right disable-phase"></i>
                  <el-tooltip v-else class="item" effect="dark" 
                    content="下一期" placement="top">
                    <i class="phase next-period el-icon-arrow-right" @click="jumpPeriod(1)"></i>
                  </el-tooltip>
                </div>

                <div class="block weather-test-time" v-show="dateUnit==='day'">
                  <i v-if="disablePre" class="phase pre-day el-icon-arrow-left disable-phase"></i>
                  <el-tooltip v-else class="item" effect="dark" content="上一期" placement="top">
                    <i class="phase pre-day el-icon-arrow-left" @click="jumpDay(-1)"></i>
                  </el-tooltip>
                  <el-date-picker
                    v-model="dateStr"
                    format="yyyy-MM-dd"
                    type="date"
                    :clearable="false"
                    placeholder="选择日期"
                    :picker-options="pickerOptions"
                    @change="dateChange">
                  </el-date-picker>
                  <i v-if="disableNext" class="phase next-day el-icon-arrow-right disable-phase"></i>
                  <el-tooltip v-else class="item" effect="dark" content="下一期" placement="top">
                    <i class="phase next-day el-icon-arrow-right" @click="jumpDay(1)"></i>
                  </el-tooltip>
                </div>

              </div>
            </div>

            <p class="desc">{{listData[curIndex].desc}}</p>
          </div>

          <div v-if="curIndex === 0">
            <div class="tip-content" v-loading.lock="addressLoading">
              <span class="current-positon-icon"></span>{{tipContent}}
            </div>
            <p class="veiw-detail-text">请点击地图上任意一点，查看详细信息</p>
            <!-- <template v-if="curPosition.show">
              <weather-forecast
                :top="0" 
                :right="0"
                :centerInfo="centerInfo">
              </weather-forecast>
            </template>
            <div v-else class="first-loading"></div> -->
          </div>

          <div v-else-if="curIndex !== 0" class="weather-all-detail">
            <div class="menu-container">
             <detail-list
              :showMe="showMe"
              :echartHeight="echartHeight"
              @getCategory="getCategory"
              ></detail-list>
              
            </div>

            <div class="block slider-container plant-slider pr ml12">
              <opacity-ctl 
                :opacity="opacity"
                :title="'图层透明度'"
                @changeOpacity="changeOpacity"
                :right="'44px'"
                ></opacity-ctl>
            </div>
          </div>

        </div>
      </div>
    </left-tab>
  </div>
</template>

<script>

import Vue from 'vue'
import leftTab from 'components/leftTab'

import request from 'api/request.js'
import '../forecast/index.less'
import forecast from '../forecast/index.js'
var _forecast = forecast(request)
var myweather = Vue.component(_forecast.name, _forecast.prop)

import configData from '../../../config/data.js'
import {elementUtil, dateUtil} from 'plugins/utils.js'
import detailList from './detail/'
import datePeriod from './period.vue'
import {mapGetters} from 'vuex'

export default {
  props: {
    curPosition: {
      type: Object,
      default: null
    },
    currentDate: {
      type: String,
      default: ""
    },
    opacity: {
      type: Number,
      default: 90
    },
    loading: {
      type: Boolean,
      default: false
    },
    addressLoading: {
      type: Boolean,
      default: false
    },
    echartHeight: {
      type: Number,
      default: 212
    },
    showMe: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      backList: false,
      showList: true,
      curIndex: -1,
      listData: [
        {
          title: "全国天气预报产品",
          desc: "利用公开气象数据，提供基于GPS位置的未来一小时分钟级别的精准天气预报。天气预报范围覆盖中国绝大部分地区，并提供PM2.5指标实时监控。",
          img: "list-weather1.jpg",
          help: "利用公开气象数据，提供基于GPS位置的未来一小时分钟级别的精准天气预报。天气预报范围覆盖中国绝大部分地区，并提供PM2.5指标实时监控。"
        },
        {
          title: "全国气象插值产品",
          desc: "应用大气的变化规律，根据当前及近期的天气形势，对不同地区的某一段时期内的天气状况进行预测，为工农业生产和群众生活服务。",
          img: "list-weather2.jpg",
          help: `气象插值产品是利用了数据插值的科学方法，加工气象站点的气象数据后得到的气象数据产品。
                在离散数据的基础上补插连续函数，使得这条连续曲线通过全部给定的离散数据点。
                插值是离散函数逼近的重要方法，利用它可通过函数在有限个点处的取值状况，估算出函数在其他点处的近似值。
                插值：用来填充图像变换时像素之间的空隙。早在6世纪，中国的刘焯已将等距二次插值用于天文计算。17世纪之后，I.牛顿，J.-L.拉格朗日分别讨论了等距和非等距的一般插值公式。在近代，插值法仍然是数据处理和编制函数表的常用工具，又是数值积分、数值微分、非线性方程求根和微分方程数值解法的重要基础，许多求解计算公式都是以插值为基础导出的。`
        }
      ],
      tipContent: '',
      centerInfo: null,
      dateStr: '',
      curDate: new Date(),
      showTime: false,
      diffIndex: -1,
      firstLoading: true,
      dateUnit: 'tenday',
      pickerOptions: {
        disabledDate: (time)=> {
          var  oldDate = new Date(2010,1,1,0,0,0).getTime(),  
                newDate = new Date().getTime();  
          if (time.getTime() > newDate) {
            return true
          } else if(time.getTime() < oldDate){
            return true
          }
        }
      },
      START_DATE: "2010-01-01",
      END_DATE: dateUtil.formatDate(new Date()),
      disablePre: false,
      disableNext: false
    }
  },
  mounted() {
    this.showDetail(0)
  },
  computed: {
    ...mapGetters({
      screenHeight: 'getScreenHeight'
    })
  },
  methods: {
    stopEvent(event) {
      event.stopPropagation()
    },
    toggleListStatus(isShow) {
      this.showList = isShow;
    },
    switchList() {
      this.backList = !this.backList; 

      !this.backList && this.$emit('clearLayers')
    },
    showDetail(index) {
      if (this.curIndex === index) {
        var isforecast = this.curIndex === 0
        this.$emit('backtoDetail', isforecast)

      } else {
        this.curIndex = index
        var isforecast = this.curIndex === 0
        this.$emit('backtoDetail', isforecast)
      }
      this.backList = true
    },
    getCenterInfo(center, zoom) {
      return {center, zoom}
    },
    dateChange(currentDate) {
      this.$emit('dateChange', currentDate)
    },
    jumpDay(step) {
      if (this.disableNext && step > 0 || this.disablePre && step < 0) {

        return
      }
      var date = new Date(this.currentDate)
      date = this.getDayDate(date, step)
      
      var dateStr = dateUtil.formatDate(date)
      this.$emit('dateChange', dateStr)
    },
    getDayDate(date, step) {
      var day = date.getDate()
      date.setDate(day + step)
      this.checkDayEnable(date)

      return date
    },
    checkDayEnable(date) {
      var _date = new Date(dateUtil.formatDate(date))
      var day = _date.getDate()
      _date.setDate(day + 1)
      this.disableNext = _date >= new Date(this.END_DATE)
      
      _date.setDate(day - 1)
      this.disablePre = _date <= new Date(this.START_DATE)
    },
    changeDate(date) {
      date = date > new Date() ? new Date() : date
      var dateStr = dateUtil.formatDate(date)
      this.$emit('dateChange', dateStr)
    },
    jumpPeriod(step) {
      var date = new Date(this.currentDate)

      date = this.getPeriodDate(date, step)
      var dateStr = dateUtil.formatDate(date)

      this.$emit('dateChange', dateStr)
    },
    getPeriodDate(date, step) {
      var year = date.getFullYear()
      var period = parseInt(dateUtil.dateToPeriod(date))
      
      period = step + period
      
      var _date = this.getDateByPeriod(year, period)
      this.checkPeriodEnable(year, period)

      return _date
    },
    checkPeriodEnable(year, period) {
      var _period = period - 1 
      var date = this.getDateByPeriod(year, _period)
      this.disablePre = date <= new Date(this.START_DATE)

      _period = period + 1
      date = this.getDateByPeriod(year, _period)

      this.disableNext = date >= new Date(this.END_DATE)
    },
    getDateByPeriod(year, period) {
      if (period > 36) {
        period = "01"
        year = year + 1

      } else if (period < 0) {
        period = "36"
        year = year - 1
      }

      var dateStr = year.toString() + period.toString()
      var date = dateUtil.periodToDate(dateStr)

      return date
    },
    changeOpacity(value) {
      this.$emit('opacityCtl', value)
    },
    getCategory(item) {
      this.dateUnit = item.date_tag   // tenday | day
      this.$emit('switchLayer', item)
    },
    changeLoadOpacity(color) {
      setTimeout(()=> {
        var dom = document.getElementsByClassName('el-loading-mask')
        elementUtil.setDomStyle(dom, 'backgroundColor', color)
      })
    },
    toogleList(){
      var menuContainer = document.getElementsByClassName('menu-container')[0]
        var menuContainerHeight = menuContainer.clientHeight
        var listChildContainerHeight = this.screenHeight - 100 - 574

          if (listChildContainerHeight <= 0 ) {
            this.showList = false
          }else{
            this.showList = true
          } 
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
  watch: {
    curPosition(position) {
      if (position.show) {
        this.tipContent = position.content
        this.centerInfo = null
        this.centerInfo = {center: position.center, zoom: position.zoom}
      }
    },
    currentDate(dateStr) {
      if (dateStr === "") {
        this.curDate = new Date()
        
      } else {
        this.curDate = new Date(dateStr)
        this.dateStr = dateStr
      }
    },
    loading:{
      handler: function (loading) {
        if (loading && this.firstLoading) {
          this.changeLoadOpacity("rgba(255,255,255,1)")
        } else {
          this.firstLoading = false
          this.changeLoadOpacity("rgba(255,255,255,.9)")
        }
      },
      immediate: true
    },
    showMe(change) {
      if (change === true) {
        this.toogleList()
      }else{
        this.showList = true
      }
    },
    dateUnit(key) {
      if (key === "tenday") {
        var period = dateUtil.dateToPeriod(this.curDate)
        var year = this.curDate.getFullYear()
        this.checkPeriodEnable(year, period)

      } else {
        this.checkDayEnable(this.curDate)
      }
    }
  },
  components: {
    leftTab,
    detailList,
    datePeriod
  }
}
  
</script>

<style 
lang="less" scoped>
 @import '../../../assets/style/common';
 .ml12 {
  margin-left: 12px;
 }
  .weather-list {
    position:absolute;
    top:0;
    left:0;
    .wl-list {
      .adv-border-bottom-radius;
      max-height: 585px;
      overflow-x: hidden;
      background: @assistant-bg;
      padding-bottom: 2px;
      .gradient,
      .gradient:hover {
        .adv-gradient(#effdd7;#e3f8bc);
      }
      li {
        position: relative;
        box-sizing: border-box;
        padding: 12px 16px 16px 72px;
        height: 116px;
        border-bottom: 1px solid #d2d2d2;
        &:last-child {
          border-bottom: 1px solid #fff;
        }
        &:hover {
          background: #eee;
        }
        span {
          position: absolute;
          top: 24px;
          left: 16px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
        }
        .list-txt {
          margin-left: 10px;
          h3 {
              .adv-font-normal();
              margin-top: 6px;
              line-height: 14px;
              position: relative;
              color: #484848;
          }
          p {
            .adv-text();
            height: 37px;
            margin-top: 5px;
            margin-right: 10px;
            line-height: 20px;
            color: #989696;
            overflow: hidden;
          }
          .tips {
                position: absolute;
                right: 10px;
                top: 0px;
                font-size: @font-super;
                font-weight: @font-weight-normal;
                color: #989898;
          }
        }
        .detail-btn {
          .adv-btn-fixed-small();
          .adv-common-border-radius();
          position: absolute;
          bottom: 10px;
          right: 18px;
          background: #fff;
          font-weight: @font-weight-normal;
          color: #969696;
          border: 1px solid #969696;
          &:hover{
            color: #6e9716;
            border: 1px solid #6e9716;
          }
        }
      }
    }

    .detail-container {
      .adv-border-bottom-radius();
      overflow: hidden;
      .detail-container-bg {
        padding: 0 14px;
        background: #9fd032;
      }
      .desc {
        .adv-text-line-height-normal();
        color: #fff;
        padding-bottom: 14px;
      }
      .tip-content {
        .adv-font-normal();
        position: relative;
        display: block;
        line-height: 42px;
        background: #f4fcec;
        padding-left: 15px;
        font-weight: bolder;
      }
      .veiw-detail-text{
          .adv-text();
          line-height: 32px;
          text-align: center;
          font-weight: @font-weight-normal;
          border-top: 1px solid #eee;
          background: @assistant-bg;
        }
      .first-loading {
        width: 358px;
        height: 182px;
      }
      .weather-all-detail {
        width: 100%;
      }
        
      .detail-title {
        .adv-title-list();
        margin: 12px 0 0;
      }
      .current-positon-icon {
        display: inline-block;
        width: 24px;
        height: 24px;
        background: url(/static/assets/img/map/altitude-little.png) center center no-repeat;
        vertical-align: middle;
      }
      .weather-test-time {
        .phase {
          position: absolute;
          padding: 8px 6px;
          background: #fff;
          border-radius: 2px;
          cursor: pointer;
        }
        .pre-period {
          margin: 14px 0 0 -28px;
        }
        .next-period {
          margin: 14px 119px;
        }
        .pre-day {
          margin: 14px 0 0 -47px;
        }
        .next-day {
          margin: 14px 100px;
        }
        .disable-phase {
          cursor: not-allowed;
          color: #a3a3a3;
        }
      }
    }
  }
</style>