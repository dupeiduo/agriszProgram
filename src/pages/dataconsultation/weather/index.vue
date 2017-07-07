<template>
  <div class="everytime">
    <p class="clear everytime-title">
      <em class="fr"><i>今天</i><b>{{minTem}}℃ 到 {{maxTem}}℃</b></em>
    </p>
    <div class="everytime-bg">
      <div class="everytime-content clear">
        <div class="everytime-left fl">
          <p class="everytime-hours">
            <em>{{timeSlot}}</em>
            <span>{{todayHours}}</span> :
            <span>{{todayMinutes}}</span> :
            <span>{{todaySeconds}}</span>
          </p>
          <div class="real-time-name clear">
            <em class="fl">{{weatherInfo.temperature | toFixedZero}}</em>
            <i class="fl">℃</i>
          </div>
        </div>
        <div class="fl pr everytime-status">
          <em>{{weatherInfo.realtimeSkycon}}</em>
          <i class="iconfont" :class="weatherInfo.realtimeIcon" :style="{color: weatherInfo.realtimeColor}"></i>
        </div>
      </div>
      <p class="information">
        <span>
          <i class="iconfont icon-fengxiang wind-icon"></i>
          <em v-html="weatherInfo.windContent"></em>
        </span>
        <span>
          <i class="iconfont icon-shidu moisture-icon"></i>
          湿度 <b>{{weatherInfo.humidity}}</b>                      
        </span>
        <span>
          <i>AQI:</i>
          <em :style="{color: weatherInfo.pm25color}">{{weatherInfo.pm25content}}</em>
        </span>
      </p>
      <div v-if="warnInfo.exist" class="warn-info">
        <template  v-for="item in warnInfo.content">
          <p>{{item}}</p>
        </template>
      </div>
      <div v-else class="weather-forecasting">
        <p>{{forecastContentBefore}}<i>{{forecastContentAfter}}</i><span class="iconfont" :class="forecastIcon" :style="{color: forecastColor}"></span></p>
      </div>
    </div>
  </div>
</template>

<script>
import request from 'api/request.js'
import {mapGetters} from 'vuex'
import forcastCtl from 'agrisz-weather/echart.js'
export default {
  props: {
    weatherInfo: {
      type: Object,
      default: null
    },
    lonlat: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      minTem: '',
      maxTem: '',
      todayHours: '',
      todayMinutes: '',
      todaySeconds: '',
      timeSlot: '',
      warnInfo: {
            exist: false
      },

      rainLevel: 0,
      forecastContentBefore: '',
      forecastContentAfter: '',
      forecastIcon: '',
      forecastColor: ''
    }
  },
  mounted() {
    setInterval(this.time,1000)
  },
  computed: {
    ...mapGetters({
      menuWidth: 'menuWidth',
      screenWidth: 'screenWidth',
      getScreenHeight: 'getScreenHeight'
  })},
  methods: {
    fetchForecast(lonlat) {
      if (lonlat && lonlat.length > 0) {
        request.weatherForecast(lonlat).then((data) => {
          if(data && data.status === 200 && data.data.status === 0 && data.data.data.status === "ok") {                
            this.renderForecastWeather(data.data.data.result)
          }              
        })
      }
    },
    renderForecastWeather(data) {
      this.warnInfo = this.setWarnInfo(data.alert)
      if (!this.warnInfo.exist && this.rainLevel === 0) {
        this.setForecastInfo(data.minutely.precipitation)
      }
      this.getMinMaxTem(data)
    },
    setWarnInfo(alert) {
      var warnInfo = {}
      if (alert && alert.status === "ok" && alert.content.length > 0) {
        warnInfo.exist = true
        warnInfo.content = []
        warnInfo.content.length = alert.content.length

        for (var i = 0; i < alert.content.length; i++) {
          console.log(alert.content[i].title)
          warnInfo.content[i] = alert.content[i].title
        }
      } else {
        warnInfo.exist = false
        warnInfo.content = []
      }
      return warnInfo
    },
    getWarnContent(status, location, code) {
      var type = ["台风","暴雨","暴雪","寒潮","大风","沙尘暴","高温","干旱","雷电","冰雹","霜冻","大雾","霾","道路结冰","森林火灾","雷雨大风"]
      var level = ["蓝色","黄色","橙色","红色"]
      var tIndex = parseInt(code.toString().substr(0,2))
      var lIndex = parseInt(code.toString().substr(2,2))

      return `${location}${type[tIndex]}${level[lIndex]}${status}`
    },
    setForecastInfo(precipitation) {
      for (var i = 0; i < precipitation.length; i++) {
        if (precipitation[i] > 0.05) {
          var rainInfo = forcastCtl.getRainLevel(precipitation[i])
          this.forecastContentBefore = (i + 1) + "分钟后可能会下" + rainInfo.intensity
          this.forecastContentAfter = ""
          this.forecastIcon = rainInfo.icon
          this.forecastColor = rainInfo.color

          break
        }
      }
      this.forecastContentBefore = "未来的一小时不会下雨"
      this.forecastContentAfter = ""
      this.forecastIcon = ""
    },
    getMinMaxTem(data) {
      this.minTem = data.daily.temperature[0].min
      this.maxTem = data.daily.temperature[0].max
    },
        toDou(num){
      if(num < 10){
        return '0' + num
      }else {
        return '' + num
      }
    },
    time(){
      var todayDate = new Date();
      this.todayHours = this.toDou(todayDate.getHours());
      this.todayMinutes = this.toDou(todayDate.getMinutes());
      this.todaySeconds = this.toDou(todayDate.getSeconds());
      if(this.todayHours > 0 && this.todayHours < 13) {
        this.timeSlot = "AM"
        return this.todayHours = this.toDou(todayDate.getHours())
      }else {
        this.timeSlot = "PM"
        return this.todayHours = (this.toDou(todayDate.getHours())-12)
      }
    },
  },
  filters: {
    toFixedZero(value){
      return Number(value).toFixed(0)
    }
  },
  watch: {
    lonlat: {
      handler: function (lonlat) {
        this.fetchForecast(lonlat)
        
      },
      deep: true
    }
  },
  componets: {
    
  }
}
</script>
<style 
  lang="less"
   rel="stylesheet/less"
   scoped>
@import '../../../assets/style/common';
.sunlight-icon,
.wind-icon {
    color:#c6b56d;
  }
.moisture-icon {
  color:#77c2e8;
}
.everytime {
  .everytime-title {
    padding: 12px 24px 12px 20px;
    border-bottom: 1px solid #dcdcdc;
    i {
      font-weight: @font-weight-bold;
      margin-right: 12px;
    }
  }
  .everytime-bg {
    width: 100%;
    background: #f3fee9;
    overflow: hidden;
    .everytime-content {
      margin: 16px 20px 0px;
      border: 4px solid #cfcfcf;
      background: @assistant-bg;
      .adv-common-border-radius();
      .everytime-left {
        padding-right: 20px;
        padding-left: 8px;
        margin-top: 8px;
        border-right: 1px solid #cfcfcf;
      }
      .everytime-hours {
        margin-left: 10px;
        padding-top: 4px;
        em {
          .adv-font-normal();
          margin-right: 6px;
          color: #858585;
          font-weight: bolder;
        }
        span {
          display: inline-block;
          border: 1px solid #cfcfcf;
          .adv-common-border-radius();
          .adv-horizontal-center(24px);
          .adv-height(24px); 
        }
      }
      .real-time-name {
        em {
          margin-left: 18px;
          font-size: 80px;
        }
        i {
           font-size: @font-super;
           margin-top: 16px;
          }
      }
      .everytime-status {
        .adv-font-big();
        margin: 0 9px 0 18px;
        em {
          position: absolute;
          top: 14px;
          right: 0px;
        }
        i {
          display: block;
          margin-top: 42px;
          font-size: 80px;
        }
      }
    }
    .information {
      margin: 10px 0 10px 20px;
      span {
      margin-right: 9px;

      .information-num{
        font-weight: @font-weight-bold;
        }
      }
    }
    .warn-info {
      height: 30px;
      background: @assistant-bg;
      overflow-x: hidden;
      text-align: center;
      border-top: 1px solid #dcdcdc;
      p {
        color: red;
        line-height: 30px;
      }
    }
    .weather-forecasting {
      padding: 6px 0px;
      background: @assistant-bg;
      border-top: 1px solid #cfcfcf;
      text-align: center;
      span {
        vertical-align: middle;
        margin-left: 16px;
      }
    }
  }
}
</style>