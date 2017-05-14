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

      <div slot="detail">
        <div class="detail-container" v-if="curIndex >= 0">
         <div class="detail-container-bg">
          <div class="clear">
            <h3 class="detail-title fl">
             {{listData[curIndex].title}}
            </h3>
            <div v-if="curIndex !== 0" class="fr">
            <div class="block weather-test-time" v-if="diffIndex >= 0">
              <el-date-picker
                v-model="dateStr"
                format="yyyy/MM/dd"
                type="date"
                :clearable="false"
                placeholder="选择日期"
                @change="dateChange">
              </el-date-picker>
            </div>
            </div>
          </div>
          <p class="desc">{{listData[curIndex].desc}}</p>
          <div class="tip-content"><span v-if="curPosition && curPosition.show" 
            class="current-positon-icon"></span>{{tipContent}}</div>
          </div>
          <div v-if="curIndex === 0 && curPosition.show">
            <weather-forecast
              :top="0" 
              :right="0"
              :centerInfo="centerInfo"
              ></weather-forecast>
          </div>

          <div v-else-if="curIndex !== 0" class="weather-all-detail">
            <div class="menu-container">
              <ul class="menu-list">
                <li v-for="(item, _index) in diffList" class="main-li" 
                  @mouseleave="mouseleaveMenu"
                  @mouseover="parentIndex = _index">
                  <i class="iconfont" :class="item.icon" :style="{color: item.color}"></i>
                  <i>{{item.name}}</i>
                  <span class="el-icon-arrow-down"></span>
                  <ul class="sub-menu" 
                    v-show="parentIndex === _index"
                    :style="{left: 267 / (diffList.length - 1) * _index + 'px'}">
                    <li v-for="(menu, index) in item.child"
                      @click="addDiffProduct(menu, index)">{{menu.name}}</li>
                  </ul>
                </li>
              </ul>
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
    }
  },
  data() {
    return {
      backList: false,
      showList: true,
      curIndex: -1,
      parentIndex: -1,
      listData: [
        {
          title: "全国天气预报产品",
          desc: "利用公开气象数据，提供基于GPS位置的未来一小时分钟级别的精准天气预报。天气预报范围覆盖中国绝大部分地区，并提供PM2.5指标实时监控。",
          img: "list-weather1.jpg",
          help: "利用公开气象数据，提供基于GPS位置的未来一小时分钟级别的精准天气预报。天气预报范围覆盖中国绝大部分地区，并提供PM2.5指标实时监控。"
        },
        {
          title: "全国气象差值产品",
          desc: "应用大气的变化规律，根据当前及近期的天气形势，对不同地区的某一段时期内的天气状况进行预测，为工农业生产和群众生活服务。",
          img: "list-weather2.jpg",
          help: `气象插值产品是利用了数据插值的科学方法，加工气象站点的气象数据后得到的气象数据产品。
                在离散数据的基础上补插连续函数，使得这条连续曲线通过全部给定的离散数据点。
                插值是离散函数逼近的重要方法，利用它可通过函数在有限个点处的取值状况，估算出函数在其他点处的近似值。
                插值：用来填充图像变换时像素之间的空隙。早在6世纪，中国的刘焯已将等距二次插值用于天文计算。17世纪之后，I.牛顿，J.-L.拉格朗日分别讨论了等距和非等距的一般插值公式。在近代，插值法仍然是数据处理和编制函数表的常用工具，又是数值积分、数值微分、非线性方程求根和微分方程数值解法的重要基础，许多求解计算公式都是以插值为基础导出的。`
        }
      ],
      diffList: [
        {
          name: "气温",
          icon: "icon-qiwen",
          color: "rgb(165, 194, 94)",
          child: configData.weatherProduct[0].value
        },
        {
          name: "日照",
          icon: "icon-rizhao-",
          color: "rgb(214, 87, 93)",
          child: [{name: "敬请期待", wait: true}]
        },
        {
          name: "降水",
          icon: "icon-jiangshui-",
          color: "rgb(10, 147, 212)",
          child: [{name: "敬请期待", wait: true}]
        },
        {
          name: "地温",
          icon: "icon-diwen-",
          color: "rgb(3, 150, 147)",
          child: [{name: "敬请期待", wait: true}]
        }
      ],
      tipContent: '',
      centerInfo: null,
      dateStr: '',
      diffIndex: -1,


    }
  },
  mounted() {
    this.showDetail(0)
  },
  methods: {
    toggleListStatus(isShow) {
      this.showList = isShow;
    },
    switchList() {
      this.backList = !this.backList; 

      !this.backList && this.$emit('clearLayerStatus', true)
    },
    showDetail(index) {
      if (this.curIndex === index) {
        this.$emit('backtoDetail', this.curIndex === 0)
      } else {
        this.curIndex = index
        this.tipContent = index === 0 
                          ? "请点击地图上任意一点，查看详细信息。"
                          : "请选择具体气象要素，查看详细信息。"

        this.$emit('clearLayerStatus', index === 1)
      }
      this.backList = true
    },
    getCenterInfo(center, zoom) {
      return {center, zoom}
    },
    addDiffProduct(config, index) {
      if (!config.wait) {
        this.diffIndex = index
        this.$emit('addWpLayer', config)
      } else {
        this.diffIndex = -1
      }
    },
    dateChange(currentDate) {
      this.$emit('dateChange', currentDate)
    },
    changeOpacity(value) {
      this.$emit('opacityCtl', value)
    },
    showChild(index) {

    },
    mouseleaveMenu() {
      this.parentIndex = -1
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
      this.dateStr = dateStr
    }
  },
  components: {
    leftTab
  }
}
  
</script>

<style lang="less" scoped>
 @import '../../../assets/style/reset';
 .ml12 {
  margin-left: 12px;
 }
  .weather-list {
    .wl-list {
      max-height: 585px;
      overflow-x: hidden;
      background: #fff;
      .mixin-border-radius-bottom();
      .gradient,
      .gradient:hover {
        .mixin-gradient-bg(#effdd7;#e3f8bc);
      }
      li {
        position: relative;
        clear: both;
        padding: 0 16px;
        height: 116px;
        border-right: 1px solid #d2d2d2;
        border-bottom: 1px solid #d2d2d2;
        text-align: left;
        &:hover {
          background: #eee;
        }
        span {
          float: left;
          width: 56px;
          height: 56px;
          margin-top: 24px;
          border-radius: 50%;
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
        }
        .list-txt {
          float: left;
          margin-left: 10px;
          h3 {
              font-size: 14px;
              line-height: 40px;
              position: relative;
              width: 250px;
              height: 32px;
              margin-top: 6px;
              color: #484848;
          }
          .tips {
                position: absolute;
                right: 0px;
                top: 0px;
                font-size: 20px;
                color: #989898;
                font-weight: normal;
          }
          p {
            line-height: 20px;
            font-size: 12px;
            width: 250px;
            color: #989696;
          }
        }
        .detail-btn {
          position: absolute;
          bottom: 10px;
          right: 18px;
          font-size: 12px;
          font-weight: normal;
          background: #fff;
          color: #969696;
          cursor: pointer;
          .mixin-height(24px);
          .mixin-width(68px);
          .mixin-border(#969696;4px);
        }
      }
    }

    .detail-container {
      .detail-container-bg {
        padding: 0 14px;
        background: #9fd032;
      }
      .desc {
        color: #fff;
        line-height: 22px;
        padding-bottom: 14px;
      }
      .tip-content {
        font-size: 14px;
        position: relative;
        left: -14px;
        width: 343px;
        display: block;
        line-height: 42px;
        background: #f4fcec;
        padding-left: 15px;
      }
      .weather-all-detail {
        width: 100%;
      }
      .menu-container {
        .menu-list {
          overflow: hidden;
          .main-li {
            float: left;
            width: 68px;
            padding: 0 10px;
            border-left: 1px solid #eee;
            border-top: 1px solid #eee;
            border-bottom: 1px solid #eee;
            cursor: default;
            .mixin-height(44px);
            &:hover {
              background: #f4fcec;
            }
            .sub-menu {
              position: absolute;
              width: 90px;
              z-index: 10003;
              background: #fff;
              border-radius: 2px;
              left: 0px;
              .mixin-boxshadow();
              li {
                cursor: pointer;
                text-align: center;
                border-bottom: 1px solid #eee;
                .mixin-height(36px);
                &:hover {
                  color: #739a6e;
                  background: #f5f2f6;
                }
              }
            }
          }
        }
      }
        
      .detail-title {
        font-size: 16px;
        margin: 12px 0 4px;
        font-weight: 700;
        color: #fff;
      }
      .current-positon-icon {
        display: inline-block;
        width: 24px;
        height: 24px;
        background: url(/static/assets/img/map/altitude-little.png) center center no-repeat;
        vertical-align: middle;
      }
    }
  }
</style>