'use strict';
import echart from './echart.js'
import {mapGetters} from 'vuex'

module.exports = function (request) {
  return {
    name: 'weather-forecast',
    prop: {
      template: `<div class="weather-tool clear" :style="{top: top + 'px', right: right + 'px'}" v-loading.lock="weatherLoading">
                    <div class="fl everytime">
                      <p class="clear everytime-title">
                        <span class="fl font14">实时天气</span>
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
                              <em class="fl">{{temperature | toFixedZero}}</em>
                              <i class="fl">℃</i>
                            </div>
                          </div>
                          <div class="fl pr everytime-status">
                            <em>{{realtimeSkycon}}</em>
                            <i class="iconfont" :class="realtimeIcon" :style="{color: realtimeColor}"></i>
                          </div>
                        </div>
                        <p class="information">
                          <span>
                            <i class="iconfont icon-fengxiang wind-icon"></i>
                            <em v-html="windContent"></em>
                          </span>
                          <span>
                            <i class="iconfont icon-shidu moisture-icon"></i>
                            湿度 <b>{{humidity}}</b>                      
                          </span>
                          <span>
                            <i>AQI:</i>
                            <em :style="{color: pm25.color}">{{pm25.content}}</em>
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
                    <div class="fl moretime pr" :style="{width: rightContantWidth + 'px'}">
                      <ul class="weather-menu">
                        <li class="no-select pr" v-for="(item, index) in panelList" 
                          @click="openPanel(index)"
                          :class="panelIndex === index ? 'active': ''"
                          :label="item.label" :name="item.name">
                          <span class="tool-pop-arrow ps"></span>
                          {{item.label}}
                      </li>
                      </ul>
                      <div v-if="panelIndex === 0" class="two-day pr">
                        <span class="wind-icon ps w-icon">风向</span>
                        <span class="windlev-icon ps w-icon">风力</span>

                        <span class="weath-icon ps w-icon">天气</span>
                        <span class="tem-icon ps w-icon">气温</span>
                        <div class="two-day-width pr" :style="{width: rightListWidth - 5 + 'px'}">

                          <div class="two-border pr">
                            
                              
                            <div class="all-wind clear" :style="{width: '3726px'}">
                              
                              <ul class="two-day-wind fl pr">
                                <li class="pr" v-for="(item,index) in windChartData">
                                  
                                  
                                  <div class="text-explain ps">
                                    <span class="direction">&nbsp;&nbsp;{{item.name}}
                                      <svg t="1497512327820" class="icon" :style="{transform: 'rotate('+(item.direction + 90) +'deg)'}" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12858" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16"><defs></defs><path d="M115.2 675.10272l428.35968 0 0 149.21728 388.5056-288.29696-388.5056-288.29696 0 149.21728L115.2 396.94336 115.2 675.10272z" p-id="12859"></path></svg>
                                    </span>
                                    <span class="level" :style="{background : '-webkit-linear-gradient(left,' + windLevBg[item.value] + ',' + (windChartData[index + 1] ? windLevBg[windChartData[index + 1].value] : windLevBg[item.value]) + ')'}">{{item.value}}级</span>
                                  </div>

                                </li>
                              </ul>
                            </div>

                            <div class="two-day-tem" v-if="tempChartData" :style="{width: '3666px'}">
                              <div class="assistant-line-start"></div>
                              <my-echart  class="echart"
                                :style="{width: '3666px'}"
                                :options="tempChartData"                       
                              ></my-echart>
                              <div class="assistant-line-end"></div>
                            </div>
                            <div class="two-day-icon clear ps" :style="{width: '3703px'}">
                              <template v-for="item in weaChangeIcon">
                                <span class="iconfont" 
                                  :class="item.icon"
                                  :style="{color: item.color}"
                                  >
                                    <el-tooltip v-if="item.tips" class="item" effect="dark" :content="item.tips" placement="top">
                                      <i class="rain-level">{{item.name}}</i>
                                    </el-tooltip>
                                  </span>
                              </template>
                                
                            </div>
                          </div>
                          
                        </div>
                        
                      </div>
                      <div>
                        <div v-if="panelIndex === 1" class="fifteen-weather pr">
                        <div class="fifteen-prediction-title" :style="{width: width + 'px'}">
                          <div class="fifteen-prediction-length ps">
                            <p class="fifteen-week clear" :style="{width: rightListWidth + 'px'}">
                              <span v-for="(item,index) in detailData" :style="{width: (rightListWidth) / 15 + 'px'}">{{item.week}}<i>{{item.date}}</i></span>
                            </p>
                            <p class="fifteen-weather-icon clear">
                              <span v-for="(item,index) in detailData" :style="{width: (rightListWidth) / 15 + 'px'}"><i class="iconfont" :class="item.icon" :style="{color: item.color}"></i>{{item.name}}</span>
                            </p>
                          </div>
                        </div>
                        <my-echart  class="fifteen-echart"
                            :style="{width: rightListWidth + 'px'}"
                            @datazoom="dailyZoomEvent"
                            :options="fiveDaysChartData"
                          >
                          </my-echart>
                        </div>
                      </div>
                    </div>
                </div>`,
      props: {
        top: {
          type: Number,
          default: 60
        },
        right: {
          type: Number,
          default: 385
        },
        width: {
          type: Number,
          default: 300
        },
        showDetail: {
          type: Boolean,
          default: false
        },
        centerInfo: {
          type: Object,
          default: null
        },
      },
      data: function data() {
        return {
          center: [],
          zoom: 0,

          panelIndex: 0,
          curPanel: '',
          className: '',
          panelBottom: null,
          timeSlot: '',
          panelList: [
            {
              label: "48小时预报",
              name: "second"
            },
            {
              label: "十五天预报",
              name: "third"
            },
          ],
          windContent: "", //风向
          humidity: 0, // 湿度
          realtimeIcon: "icon-tianqitubiao_qing",
          realtimeColor: "#c6b56d",
          currentPosition: "……",
          realtimeSkycon: '晴天', // 天气

          minMaxTemperature: '9/20',
          pm25: 0,
          temperature: 0,

          forecastContentBefore: "",
          forecastContentAfter: "",
          forecastIcon: "icon-tianqitubiao_dongyu",
          forecastColor: "#376786",

          warnInfo: {
            exist: false
          },
          windChartData: [],
          tempChartData: null,
          fiveDaysChartData: {},
          fiveDaysIcons: [],

          dailyLen: 0,

          iconsPosition: 0,
          totalWidth: 0,

          rainLevel: 0,
          weaChangeIcon: [],

          detailTotalWidth: 0,
          detailiconsPosition: 0,

          detailData: [],
          reqTimeHandler: null,
          minTem: null,
          maxTem: null,
          todayHours: '',
          todayMinutes: '',
          todaySeconds: '',

          rightListWidth:'',
          rightContantWidth:'',
          fifteenForecastOneListWidth:'',

          weatherLoading:false,
          endColor: '#999999',
          windLevBg:['#ffffff','#e9fdff','#d8fdfe','#b2fbfd','#94fafd','#7cf9fc','#78f354','#a3f43f','#dff746','#fad542','#f6bd3e','#fda03f','#eb572d','#ad06cc']
        };
      },
      computed: {
      ...mapGetters({
        menuWidth: 'menuWidth',
        getScreenHeight: 'getScreenHeight',
        screenWidth:'screenWidth'
      })},
      mounted() {
        this.getrightListWidth()
        this.getRightListBorderWidth()
        this.weatherLoading = true
        setInterval(this.time,1000)
      },
      filters: {
        toFixedZero(value) {
          return value.toFixed(0)
        },
      }, 
      methods: {
        getrightListWidth(){
          this.rightListWidth = this.screenWidth - this.menuWidth - 302
          if (this.rightListWidth / 15 < 35) {
            this.rightListWidth = 525
          }
        },
        getRightListBorderWidth(){
          this.rightContantWidth = this.screenWidth - this.menuWidth - 302
          this.fifteenForecastOneListWidth = (this.rightContantWidth / 15) / 2
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
        initReq({center, zoom}) {
          if (center && center.length === 2) {
            var lonlat = ol.proj.toLonLat(center)

            request.weatherRealtime(lonlat).then((data) => {
              if(data && data.status === 200 && data.data.status === 0 && data.data.data.status === "ok") {                
                this.renderRealtimeWeather(data.data.data.result)
              }              
            })
            request.weatherFifteenDays(lonlat).then((data)=> {
              if(data && data.status === 200 && data.data.status === 0 && data.data.data.status === "ok") {
                this.renderForecastWeather(data.data.data.result)
                this.weatherLoading = false
              }
            })
          } else {
            // 
          }
        },
        renderRealtimeWeather(data) {
          this.temperature = data.temperature
          this.pm25 = echart.getAqi(data.aqi)
          this.humidity = Number(data.humidity * 100).toFixed(0) + '%'
          this.windContent = echart.getBoldWindContent(data.wind.direction, data.wind.speed)
          
          var rain = data.precipitation.local.intensity
          this.renderRainInfo(rain, data.skycon)
        },
        renderForecastWeather(data) {
          this.warnInfo = this.setWarnInfo(data.alert)
          this.openPanel(this.panelIndex)
          this.setChartsData(data)

          this.minMaxTemperature = (data.daily.temperature[0].min).toFixed(0) + '/' + 
                                 (data.daily.temperature[0].max).toFixed(0)

          if (!this.warnInfo.exist && this.rainLevel === 0) {
            this.setForecastInfo(data.minutely.precipitation)
          }
        },
        renderRainInfo(rain, skycon) {
          if (rain > 0.05) {
            var rainInfo = echart.getRainLevel(rain)
            
            this.rainLevel = rainInfo.level
            this.realtimeSkycon = rainInfo.intensity
            this.realtimeIcon = rainInfo.icon
            this.realtimeColor = rainInfo.color

            this.forecastContentBefore = "正在下雨"
            this.forecastContentAfter = ""
            this.forecastIcon = rainInfo.icon

          } else {
            echart.setCurrentSkycon(skycon)
            this.rainLevel = 0
            this.realtimeSkycon = echart.getSkyconZh()
            this.realtimeIcon = echart.getSkyconIcon()
            this.realtimeColor = echart.getSkyconColor()
          }
        },
        setChartsData(data) {
          var tempChartInfo = echart.getTempChartData(data.hourly)
          this.tempChartData = tempChartInfo.options
          this.renderChangeIcons(tempChartInfo.icons, tempChartInfo.tips)

          this.windChartData = echart.getWindChartData(data.hourly.wind)        

          var fiveDaysInfo = echart.getFiveDaysChartData(data.daily,this.fifteenForecastOneListWidth)
          this.fiveDaysChartData = fiveDaysInfo.options
          this.detailData = fiveDaysInfo.xTitle
          this.minTem = data.daily.temperature[0].min.toFixed(0)
          this.maxTem = data.daily.temperature[0].max.toFixed(0)
          this.dailyLen = data.daily.temperature.length
        },
        datazoomEvent(params) {
          this.setIconsPosition(params.start);
        },
        dailyZoomEvent(params) {
          this.setTitleIconPosition(params.start)
        },
        renderChangeIcons(icons, rainInfo) {
          this.weaChangeIcon = []

          for (var i = 0; i < 48; i++) {
            var obj = {
              name: "",
              icon: ""
            }
            if (icons[i] === "") {
              this.weaChangeIcon.push(obj)

            } else {
              echart.setCurrentSkycon(icons[i])
              obj = {
                name: rainInfo[i] ? rainInfo[i].intensity : echart.getSkyconZh(),
                icon: rainInfo[i] ? rainInfo[i].icon : echart.getSkyconIcon(),
                color: rainInfo[i] ? rainInfo[i].color : echart.getSkyconColor(),
                tips: rainInfo[i] ? rainInfo[i].tips : null
              }
              this.weaChangeIcon.push(obj)
            }
          }
          this.iconsPosition = 0
        },
        setIconsPosition(start) {
          var len = this.weaChangeIcon.length,
            width = 273,
            inscreen = 3,
            eachWidth = width / inscreen,
            relativeWidth = eachWidth * len  * start / 100,
            moveLength = this.iconsPosition + relativeWidth

          console.log(this.iconsPosition, relativeWidth, eachWidth)
          
          if (moveLength * 3 > eachWidth || moveLength * 3 < -eachWidth) {
            this.totalWidth = eachWidth * len;
            this.iconsPosition = -(this.totalWidth * start / 100)
          }
        },
        setTitleIconPosition(start) {
          var len = this.dailyLen,
            width = 340,
            inscreen = 4,
            eachWidth = width / inscreen,
            moveLength

          this.detailTotalWidth = eachWidth * len;
          this.detailiconsPosition = -(this.detailTotalWidth * start / 100)
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
              var rainInfo = echart.getRainLevel(precipitation[i])
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
        togglePanel(index) {
          this.$emit('toggleWeaDetail', !this.showDetail)
          this.openPanel(index)
        },
        openPanel(index) {
          this.panelIndex = index
         if(index === 1) {
            this.setIconsPosition(0)
            this.panelBottom = 5
          } else {
            this.setTitleIconPosition(0)
            this.panelBottom = 3
          }
        }
      },
      watch: {
        centerInfo: {
          handler: function(info) {
            if (info && this.zoom !== info.zoom || this.center !== info.center) {
              this.zoom = info.zoom
              this.center = info.center

              if (this.reqTimeHandler) {
                clearTimeout(this.reqTimeHandler)
              }
              this.reqTimeHandler = setTimeout(()=> {
                this.reqTimeHandler = null
                this.initReq(info)
              }, 300)
            }
          },
          immediate: true
        },
        screenWidth(change){
          if (change) {
            this.getrightListWidth()
            this.getRightListBorderWidth()
          }
        }
      }
    }
  };
};