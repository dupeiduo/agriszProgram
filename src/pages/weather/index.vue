<template>
  <div class="scale-atbottom">
    <my-map class="map" 
      @initMap="initMap" 
      :switchCtl="true"
      :top="98"
      borderRadius="4px"
      :useWeather="false"
      :useTools="true"
      :centerCtl="{use: true, bounds: offsetBounds}" ref="map">
    </my-map>
    
    <!-- <my-searchpoi right="134px" :map="map" @setCenter="setCenter"></my-searchpoi> -->

    <div v-if="showTip" class="map-tooltip" :style="{top: tipInfo.top +'px', left: tipInfo.left + 'px'}">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30px" height="21.184px" viewBox="0 0 30 21.184" enable-background="new 0 0 30 21.184" xml:space="preserve">
        <path fill="#FFFFFF" d="M22.982,5.871c-1.666-3.067-4.927-5.026-8.437-5.026c-4.877,0-8.83,3.412-9.472,8.042
        c-2.453,0.552-4.291,2.746-4.291,5.362c0,3.031,2.466,5.498,5.498,5.498c1.275,0,2.462-0.414,3.416-1.179
        c1.538,0.985,3.131,1.466,4.849,1.466c1.624,0,2.728-0.258,3.995-0.961c1.081,0.629,2.301,0.961,3.566,0.961
        c3.921,0,7.109-3.188,7.109-7.108C29.217,9.301,26.492,6.304,22.982,5.871z"></path>
      </svg>
      <div class="">
        <h3 class="h3-tooltip">{{tipInfo.head}}</h3>
        <p class="p-tooltip">{{tipInfo.body}}</p>
      </div>
    </div>
    <my-dialog class="echart-dialog" 
      v-show="echartVisible"
      @close="echartVisible = false"
      :overFlow="'none'"
      titlePadding="0px 0px 0px 20px" >

      <div class="weather-chart-menu no-select" slot="title">
        <ul>
          <li @click="index='tem'" 
            :class="index ==='tem' ? 'active' : ''">
            <span class="tool-pop-arrow ps"></span>
            <i class="iconfont icon-qiwen" :style="{color: index === 'tem' ? 'rgb(165, 194, 94)' : ''}"></i> 气温</li>
          <li @click="index='gst'"
            :class="index ==='gst' ? 'active' : ''">
            <span class="tool-pop-arrow ps"></span>
            <i class="iconfont icon-diwen-" :style="{color: index === 'gst' ? 'rgb(3, 150, 147)':''}"></i> 地温</li>
          <li @click="index='temacc'"
            :class="index ==='temacc' ? 'active' : ''">
            <span class="tool-pop-arrow ps"></span>
            <i class="iconfont icon-jiwen-" :style="{color: index === 'temacc' ? ' rgb(229, 162, 0)':''}"></i> 积温</li>
          <li @click="index='ssd'"
            :class="index ==='ssd' ? 'active' : ''">
            <span class="tool-pop-arrow ps"></span>
            <i class="iconfont icon-rizhao-" :style="{color: index === 'ssd' ? 'rgb(214, 87, 93)':''}"></i> 日照</li>
          <li @click="index='pre'"
            :class="index ==='pre' ? 'active' : ''">
            <span class="tool-pop-arrow ps"></span>
            <i class="iconfont icon-jiangshui-" :style="{color: index === 'pre' ? ' rgb(10, 147, 212)':''}"></i> 降水</li>
        </ul>
      </div>
      <div slot="content" v-loading.lock="chartLoading">
        <my-echart class="pop-chart" 
      :options="chartOption"></my-echart>
      </div>    
    </my-dialog>

    <left-list 
      :loading="listLoading"
      :addressLoading="addressLoading"
      :currentDate="currentDate"
      :curPosition="curPosition"
      :opacity="opacity"
      :echartHeight="echartHeight"
      :showMe="showPopBottom"
      @dateChange="dateChange"
      @backtoDetail="backtoDetail"
      @clearLayers="clearLayers"
      @opacityCtl="opacityCtl"
      @switchLayer="switchLayer"></left-list>
    
    <weather-legend v-show="!isforecast" class="we-legend map-zIndex" :legendKey="selectedItem.styles" :lengthTitle="selectedItem.name"></weather-legend>
    <no-data :noLayer="noLayer"></no-data>

    <pop-bottom 
      @hideBottom="closePopBottom" 
      :class="showPopBottom ? 'an-bottom-echart-in':'an-bottom-echart-out'">
      <div slot="pop-echart" v-if="noWeatherChart">
        <no-data :noLayer="noWeatherChart"></no-data>
      </div>
      <div slot="pop-echart" v-else>
        <my-echart class="my-botttom-echart"
                   v-loading.lock="bottomChartLoading"
                   :options="weOptions"
                   :style="{width: screenWidth - menuWidth - 10 + 'px', height: 212 + 'px'}"
                   @datazoom="datazoomEvent">
        </my-echart>
      </div>
    </pop-bottom>

    <pop-bottom
      class="abc"
      :class="isforecast && curPosition.show ? 'an-bottom-weather-in':'an-bottom-weather-out'"  
      @hideBottom="curPosition.show = false">
      <div slot="pop-echart">
        <weather-forecast
          :width="screenWidth - menuWidth - 302"
          :top="0" 
          :right="0"
          :centerInfo="curPosition">
        </weather-forecast>
      </div>
    </pop-bottom>
    
    <pop-message :popTitle="popTitle" ref="popMessage"></pop-message>

    <div id="atmostPop" class="atmos-popup">
      <span class="w-popper-arrow ps"></span>
      <h3 class="atmos-popup-title" v-loading.lock="addressLoading">{{atmosTitle}}</h3>
      <span class="close-btn ps el-icon-close" @click="closeOverlay"></span>
      <p class="atmos-popup-lonlat">{{lonlatStr}}</p>
      <div class="atmos-histroy" @click="showBottomChart">
        <div class="show-history" v-loading.lock="bottomChartLoading">
          <span>查看历史数据</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import request from 'api/request.js'
  import model from 'api/model.js'
  import mapctl from './mapctl/index.js'
  import echart from './echart/index.js'
  import {dateUtil, formatData} from 'plugins/utils.js'
  import weathProduct from './product'
  import configData from '../../config/data.js'
  import config from 'config/env/config.env.js'
  import format from 'api/model.js'
  import viewreport from 'components/viewReport'
  import reportlist from 'components/reportList'
  import leftList from './list'
  import noData from 'components/noData'
  import {mapGetters} from 'vuex'
  import weatherLegend from './legend'
  import popBottom from './popbottom'

  import './forecast/index.less'
  import forecast from './forecast/index.js'
  var _forecast = forecast(request)
  var myweather = Vue.component(_forecast.name, _forecast.prop)

  export default{
    data(){
      return {
        map: null,
        styleCtl:'',
        tree: [],
        code: null,
        bounds: [],
        offsetBounds: [],
        showTip: false,
        tipInfo: {top: -100, left: -100, head: '', body: ''},
        stationId: null,
        stationInfo: null,
        index: '',
        chartConfig: {
          startDate: '1991-01-01',
          endDate: dateUtil.formatDate(new Date())
        },
        chartOption: {},
        chartLoading: false,
        echartVisible: false,
        echartHeight: 212,
        listData: configData.weatherProduct,
        currentDate: "",
        currentYear: '',
        showDateTip: false,
        wpLayer: null,
        noLayer: false,
        height: 0,

        listLoading: true,
        addressLoading: false,
        opacity: 90,
        curPosition: {show: false},
        lastPosition: {show: false},
        forecastPointLayer: null,
        START_YEAR: 2010,
        START_TENDAY: 1,
        bottomChartLoading: false,
        showPopBottom: false,
        weOptions: null,
        popTitle: '',
        atmosPointLayer: null,

        selectedItem: {styles: '', name: '', key: ''},

        isforecast: true,
        overlay: null,
        atmosTitle: '',
        lonlatStr: '',
        lonlat: [],
        resetBound: true,

        clickTimeHan: null,
        clickAtmos: false,
        dataZoom: {},
        noWeatherChart: false,
      }
    },
    mounted() {
      this.fetchAreaInfo()
      this.fetchAtmosStations()
      this.bindMapEvent()
    },
    computed: {
      ...mapGetters({
        menuWidth: 'menuWidth',
        getScreenHeight: 'getScreenHeight',
        screenWidth: 'screenWidth'
      })
    },
    methods: {
      datazoomEvent(params) {
        this.dataZoom = {start: params.start, end: params.end}
      },
      closePopBottom(){
        this.showPopBottom = false
      },
      setDefualtCenter(lonlat, zoom) {
        if (!this.map) {
          setTimeout(()=> {
            this.setDefualtCenter(lonlat, zoom)
          })

        } else {
          
          if (lonlat) {
            this.resetBound = false
          } else {
            this.resetBound = true
          }

          var view = this.map.getView()

          lonlat = lonlat ? lonlat : view.getCenter()
          zoom = zoom ? zoom : view.getZoom()

          view.animate({zoom: zoom, center: lonlat, duration: 550, easing:  (t)=> Math.pow(t, 1.5)});
          this.getAddress(lonlat)
        }
      },
      initMap (map) {
        this.map = map;
      },
      bindMapEvent() {
        this.$on('hoverPoint', (tipInfo) => {
          this.showTip = true
          this.tipInfo = tipInfo
        })
        this.$on("clickAtmosPoint", ()=> {
          this.clickAtmos = true
          setTimeout(()=> {
            this.clickAtmos = false
          }, 500)
        })
        this.$on('outPoint', () => {
          this.showTip = false
        })
        this.$on('clickPoint', (station) => {
          this.stationId = station.stationId
          this.stationInfo = station.currentStation
          this.echartVisible = true
        })

        this.map.on('click', this.getPointInfo)
        vueBus.$on('mapDrawHandler', this.mapDrawHandler)
      },
      mapDrawHandler({maptool, ndvi}) {
        if(maptool) {
          this.map.un('click', this.fetchPointChart)
          this.map.un('click', this.getPointInfo)

        } else {
          this.bindMapClickEvt(this.isforecast)
        }
      },
      fetchAreaInfo() {
        var data = { arealist: [ { "grade": '0', "area_code": '000000' } ] }

        request.getPartAreas(data).then((response) => {
          
          if (response && response.status === 200 && response.data.status === 0) {
            this.tree = response.data.data
            this.code = this.tree[0].area_id
            this.bounds = model.formatBounds(this.tree[0])

            this.addAreaLayers([this.code])

          } else {
            console.log("接口返回:" + response.data.error_msg); 
          }
        });
      },
      fetchAtmosStations() {
        request.weatherStations().then((response) => {
          if (response && response.status === 200 && response.data.status === 0) {
            mapctl.renderStations(response.data.data, this)
          }
        })
      },
      fetchAtmosConfig() {
        request.atmosConfig().then((response) => {
          if (response && response.status === 200 && response.data.status === 0) {
            console.log(response.data)
          }
        })
      },
      fetchExistFt(year, name) {
        if (year < this.START_YEAR) {
          this.showPopMsgUnHide(`暂无数据`)
          this.removeWpLayer()
          console.log("no this layer data", name)

        } else {
          request.atmosExist(year, name).then((response) => {
            if (response && response.status === 200 && response.data.status === 0) {
              
              this.dateToLatest(response.data.data, year)
            } else {
              console.log("no this layer data", year, name)
            }
          })
        }
      },
      fetchExist(year, name, peroid, day) {
        request.atmosExist(year, name).then((response) => {
          if (response && response.status === 200 && response.data.status === 0) {
            
            this.dateExistPeriod(response.data.data, year, peroid, day)
          }
        })
      },
      setDateTips() {
        var dateStr = ''
        if (this.currentDate && this.showDateTip) {
          if (this.selectedItem.date_tag === "tenday") {
            var periodArray = ["上旬","中旬","下旬",]
            var date = new Date(this.currentDate)
            var period = dateUtil.dayToPeriod(date.getDate())
            console.log(this.currentDate, date, period)
            period = periodArray[period-1]
            dateStr = `${date.getFullYear()}-${date.getMonth()+1}-${period}`

          } else {
            dateStr = this.currentDate + "日"
          }
        } 
        return dateStr
      },
      fetchLayername(period) {
        var dateStr = this.setDateTips()
        var options = {
          startYear: this.currentYear,
          startTenday: period,
          endYear: this.currentYear,
          endTenday: period
        }
        request.atmosLayername(options).then((response) => {
          if (response && response.status === 200 && response.data.status === 0) {
            
            if (this.selectedItem.date_tag === "tenday") {
              var layerName = response.data.data[0].products[this.selectedItem.key]
            
            } else {
              var data = response.data.data[0].products[this.selectedItem.key]
              var layerName = this.getDayLayerName(data)
            }
            
            this.addLayerByName(layerName)
            dateStr = dateStr ? ` (${dateStr}) ` : ''
            this.showPopMsg(`已切换至${dateStr}${this.selectedItem.name}`)

            if (this.showPopBottom) {
              this.fetchPointData(this.lonlat)
            }

          } else {
            this.showPopMsgUnHide(`暂无数据`)
            this.removeWpLayer()
            console.log("no this peroid data", period)
          }
        })
      },
      getDayLayerName(data) {
        var dateStr = this.currentDate.replace(/\//g,"-")
        var layerName
        for (var i = 0; i < data.length; i++) {
          if (data[i].date === dateStr) {
            layerName = data[i].layer_name
            break
          }
        }
        
        return layerName
      },
      fetchPointData(lonlat) {
        var END_TENDAY = dateUtil.dateToPeriod(new Date())
        
        if (this.selectedItem.styles === "atmos_tem_acc") {
          this.fetchDayChartData(lonlat, END_TENDAY)

        } else {
          this.fetchPeriodChartData(lonlat, END_TENDAY)
        }
          
      },
      fetchDayChartData(lonlat, END_TENDAY) {
        var END_YEAR = new Date().getFullYear()
        var len = END_YEAR - this.START_YEAR
        
        var chartData = { X: [], Y: [] }

        for (var i = len; i >= 0 ; i--) {
          var endTenday = i !== len ? 36 : END_TENDAY

          let currentYear = (this.START_YEAR+i).toString()

          this.fetchPointByYear(lonlat, currentYear, currentYear, endTenday, (data)=> {
            if (data) {
              var startDate =  dateUtil.periodToDate(this.START_YEAR.toString() + this.START_TENDAY.toString())
              var endDate = new Date()
              
              var formated = this.formatApiData(data, startDate, endDate)
              this.concatExistData(chartData, formated, currentYear, startDate, endDate)
              
              this.setChartOptions(chartData)

            } else {
              this.noWeatherChart = true
            }
          }, true)
        }
      },
      concatExistData(chartData, formated, currentYear, start, end) {
        
        if (chartData.Y.length === 0) {
          chartData.X = formated.X
          chartData.Y = formated.Y
          
        } else {
          var indexs = this.getStartLength(currentYear, start, end)

          var currentYearData = formated.Y.splice(indexs[0], indexs[1])
          var params = indexs.concat(currentYearData)
          
          chartData.Y.splice.apply(chartData.Y, params)
        }
      },
      getStartLength(currentYear, start, end) {
        var totalDays = this.getDaysInTowDate(start, end)

        var currentStart = new Date(currentYear + "-01-01")
        var currentEdn = new Date(currentYear + "-12-31")

        var arrLength = this.getDaysInTowDate(currentStart, currentEdn)
        
        var startIndex = this.getDaysInTowDate(start, currentStart)

        return [startIndex, parseInt(arrLength) + 1]
      },
      getDaysInTowDate(start, end) {
        var miliseconds = end - start 
        var days = Number(miliseconds / 1000 / 60 / 60 / 24).toFixed(0)

        return days
      },
      fetchPeriodChartData(lonlat, END_TENDAY) {
        var END_YEAR = new Date().getFullYear()

        this.fetchPointByYear(lonlat, this.START_YEAR, END_YEAR, END_TENDAY, (data)=> {
          if (data) {
            var formated = this.formatApiData(data)
            this.setChartOptions(formated)

          } else{
            this.noWeatherChart = true
          }
        })
      },
      fetchPointByYear(lonlat, startYear, endYear, period, reqCb, disableCancel) {
        var options = {
          startYear: startYear,
          startTenday: this.START_TENDAY,
          endYear: endYear,
          endTenday: period,
          lon: lonlat[0],
          lat: lonlat[1],
          name: this.selectedItem.key
        }

        if (this.chartReqHandler && !disableCancel) {
          this.chartReqHandler.cancelRequest("cancel request")
          this.chartReqHandler = null
        }

        this.chartReqHandler = request.atmosAtPoint(options)

        this.bottomChartLoading = true
        this.chartReqHandler.then((response) => {
          if (response && response.status === 200 && response.data.status === 0) {
            reqCb(response.data.data)
            this.noWeatherChart = false

          } else {
            // 出错或重新请求
            reqCb(null)
          }
          this.bottomChartLoading = false

          this.chartReqHandler = null
        }).catch((e)=> {
          this.showPopMsg("有点问题，请重试...")
          this.chartReqHandler = null
          reqCb(null)
          console.log(e)
        })
      },
      formatApiData(data, start, end) {
        var date = dateUtil.periodToDate(`${this.START_YEAR}${this.START_TENDAY}`)
        
        if (this.selectedItem.date_tag == "tenday") {
          var options = {
            startDate: date,
            endDate: new Date(),
            ENCN: true,
            data: data,
            toFixed: 2
          };
          var formated = formatData.apiDataToPeriod(options);
          
        } else {
          options = {
            startDate: start,
            endDate: end,
            data: data,
            toFixed: 2
          };
          var formated = formatData.apiDataToDay(options)
        }
        
        return formated
      },
      setChartOptions(data) {
        switch(this.selectedItem.styles) {
          case "atmos_tem":
            this.weOptions = echart.getTemChart(data.X, data.Y, this.selectedItem.name, this.dataZoom)
            break
          case "atmos_pre":
          case "atmos_pre_acc":
            this.weOptions = echart.getRainChart(data.X, data.Y, this.selectedItem.name, this.dataZoom)
            break
          case "atmos_pre_an":
            this.weOptions = echart.getRainAnChart(data.X, data.Y, this.selectedItem.name, this.dataZoom)
            break
          case "atmos_pre_anp":
            this.weOptions = echart.getRainAnpChart(data.X, data.Y, this.selectedItem.name, this.dataZoom)
            break
          case "atmos_tem_acc":
            this.weOptions = echart.getTemAccChart(data.X, data.Y, this.selectedItem.name, this.dataZoom)
            break
          case "atmos_tem_an":
            this.weOptions = echart.getTemAnChart(data.X, data.Y, this.selectedItem.name, this.dataZoom)
            break
          default :
            this.noWeatherChart = true
            break
        }
        
      },
      dateToLatest(data, year) {
        if (this.selectedItem.date_tag === "tenday") {
          this.periodToLatest(data, year)

        } else {
          this.dayToLatest(data, year)
        }
          
      },
      dayToLatest(data, year) {
        var latest = ''
        for (var i = 1; i <= 366; i++) {
          var key = i < 10 ? '0' + i : i

          if (data[year][key] && data[year][key] === 1) {
            latest = key
          }
        }

        if (latest === '') {
          this.currentYear = this.currentYear - 1
          this.fetchExistFt(this.currentYear - 1, this.selectedItem.key)

        } else {
          var date = dateUtil.periodToDate(this.currentYear.toString() + latest.toString())
          this.currentDate = dateUtil.formatDate(date);
          var period = dateUtil.daysToPeriod(year, latest)
          console.log(period)
          this.fetchLayername(period)
        } 
      },
      periodToLatest(data, year) {
        var latest = ''
        for (var i = 1; i <= 36; i++) {
          var key = i < 10 ? '0' + i : i

          if (data[year][key] === 1) {
            latest = key
          }
        }

        if (latest === '') {
          this.currentYear = this.currentYear - 1
          this.fetchExistFt(this.currentYear - 1, this.selectedItem.key)

        } else {
          var date = dateUtil.periodToDate(this.currentYear.toString() + latest.toString())
          this.currentDate = dateUtil.formatDate(date);

          this.fetchLayername(latest)
        } 
      },
      dateExistPeriod(data, year, peroid, day) {

        if (this.selectedItem.date_tag === "tenday") {
          if (data[year][peroid] === 1) {
            this.fetchLayername(peroid)

          } else {
            this.showPopMsgUnHide(`暂无数据`)
            this.removeWpLayer()
          }
        } else {
          if (data[year][day] === 1) {
            this.fetchLayername(peroid)

          } else {
            this.showPopMsgUnHide(`暂无数据`)
            this.removeWpLayer()
          }
        }
          
      },
      setCenter() {
        this.$refs['map'].setCenter()
      },
      getPointInfo(event) {
        this.$nextTick(() => {
          if (event.drag  || this.clickAtmos) {
            return
          }

          this.isforecast = true
          if (this.clickTimeHan) {
            clearTimeout(this.clickTimeHan)
            this.clickTimeHan = null

          } else {
            this.clickTimeHan = setTimeout(() => {
              this.clickTimeHan = null
              var coordinate = event.coordinate
              this.getAddress(coordinate)
            }, 300)
          }
        })
          
      },
      getAddress(center) {
        this.addForecastLayer(center)

        this.fetchTdtPoint(center, (content) => {
          var zoom = this.map.getView().getZoom()
          this.curPosition = {show: true, center, zoom, content}
          this.lastPosition = {show: true, center, zoom, content}
        })
      },
      fetchTdtPoint(center, callback) {
        var lonlat = ol.proj.toLonLat(center),
          params = { lon: lonlat[0], lat: lonlat[1] }

        if (this.adsReqHandler) {
          this.adsReqHandler.cancelRequest("cancel request")
          this.adsReqHandler = null
        }

        this.addressLoading = true
        this.adsReqHandler = request.tdtPoi(params)
        
        this.adsReqHandler.then((response)=> {
          this.adsReqHandler = null
          if (!response) {
            callback("暂无该点位置信息")

          } else {
            var formated = model.formatTdtPoi(response.data),
              content;
            
            if (formated) {
              if (formated.addressComponent.address) {
                content = formated.addressComponent.address
              } else {
                content = formated.addressComponent.poi
              }
              callback(content)
              
            }
          }
            
          this.addressLoading = false
          this.listLoading = false
        })
      },
      addForecastLayer(center) {
        this.removeForcastLayer()
        this.forecastPointLayer = mapctl.addPointByLonlat(center, this.map)
      },
      removeForcastLayer() {
        if (this.forecastPointLayer) {
          this.map.removeLayer(this.forecastPointLayer)
        }
      },
      bindMapClickEvt(isforecast) {
        if (isforecast) {
          this.map.un('click', this.fetchPointChart)
          this.map.on('click', this.getPointInfo)

        } else {
          this.map.un('click', this.getPointInfo)
          this.map.on('click', this.fetchPointChart)
        }
        this.isforecast = isforecast
      },
      unbindMapClickEvt() {
        this.map.un('click', this.getPointInfo)
        this.map.un('click', this.fetchPointChart)
      },
      backtoDetail(isforecast) {
        this.bindMapClickEvt(isforecast)

        if (isforecast) {
          this.opacity = 90

          if (this.forecastPointLayer) {
            this.map.addLayer(this.forecastPointLayer)
          }
          this.curPosition = this.lastPosition

        } else if (this.wpLayer){
          this.wpLayer.setOpacity(this.opacity/100)
        }
          
      },
      clearLayers() {
        this.removeForcastLayer()
        this.removeAtmosLayer()
        this.removeOverlay()
        if (this.wpLayer) {
          this.wpLayer.setOpacity(0)
        }
        
        this.unbindMapClickEvt()
        this.curPosition = {show: false, content: ""}
        this.showPopBottom = false
      },
      dateChange(dateStr) {
        this.currentDate = dateStr
        this.currentYear = dateStr.substr(0, 4)
        this.showDateTip = true

        var day = dateUtil.dateToDay(new Date(dateStr))
        var period = dateUtil.dateToPeriod(new Date(dateStr))
        this.fetchExist(this.currentYear, this.selectedItem.key, period, day)
      },
      getChart() {
        var options = {
          stationId: this.stationId,
          index: this.index,
          startDate: this.chartConfig.startDate,
          endDate: this.chartConfig.endDate
        }
        this.chartLoading = true
        request.weatherFeature(options).then((response) => {
          if (response && response.status === 200 && response.data.status === 0) {
            this.chartOption = echart.formatChartData(response.data, this.chartConfig)
          }
          this.chartLoading = false
        });
      },
      setTitle(config) {
        if (this.stationInfo.hasName) {
          this.chartConfig.head = `${this.chartConfig.title} - ${this.stationInfo.name}站`
        } else {
          this.chartConfig.head = `站点${this.stationInfo.name} - ${this.chartConfig.title}`;
        }
      },
      switchLayer(item) {
        /* 
          if first time to load
            set current exist date 

          set params
          do exist request  
            if have data then 
              set current date
              set legend
              set sld
              add layer
            else show no data 
        */
       
        var firstLoad = this.currentDate === ''
        this.showPopMsgUnHide('数据加载中…')
        this.showDateTip = false
        this.selectedItem = item

        if (firstLoad) {
          this.currentYear = new Date().getFullYear()
          this.fetchExistFt(this.currentYear, this.selectedItem.key)
        
        } else {
          var year = this.currentDate.substr(0,4)
          var period = dateUtil.dateToPeriod(new Date(this.currentDate))
          var day = dateUtil.dateToDay(new Date(this.currentDate))
          
          this.fetchExist(year, this.selectedItem.key, period, day)
        }
      },
      opacityCtl(value) {
        this.opacity = value
        if (this.wpLayer) {
          this.wpLayer.setOpacity(value/100)
        }
      },
      addLayerByName(layerName) {
        var extent = ol.extent.applyTransform(this.bounds, ol.proj.getTransform("EPSG:4326", "EPSG:3857"))

        var layerOptions = {
          serverUrl: config.atomsMapUrl,
          visible: true,
          extent: extent,
          layerName: "map:" + layerName,
          styles: this.selectedItem.styles,
          opacity: this.opacity/100,
          zIndex: 3
        }

        this.removeWpLayer()
        this.wpLayer = this.$refs['map'].addGeoLayer(layerOptions, this.map);
      },
      removeWpLayer() {
        if (this.wpLayer) {
          this.map.removeLayer(this.wpLayer)
        }
      },
      fetchPointChart(event) {
        if (event.drag || this.clickAtmos) {
          return
        }


        if (this.clickTimeHan) {
          clearTimeout(this.clickTimeHan)
          this.clickTimeHan = null

        } else {
          this.clickTimeHan = setTimeout(() => {
            this.clickTimeHan = null
            var coordinate = event.coordinate
            this.renderPointByCoord(coordinate)
          }, 300)
        }
      },
      renderPointByCoord(coordinate) {
        this.lonlatStr = this.coordinateToLonlat(coordinate)
        
        this.lonlat = ol.proj.toLonLat(coordinate)

        this.removeAtmosLayer()
        this.atmosPointLayer = mapctl.addPointByLonlat(coordinate, this.map)
        
        this.removeOverlay()
        this.overlay = mapctl.addAtmosOverlay(this.lonlat, this.map)
        
        this.fetchTdtPoint(coordinate, (content) => {
          this.atmosTitle = content
          
        })

        if (this.showPopBottom) {
          this.fetchPointData(this.lonlat)
        }
      },
      coordinateToLonlat(coordinate) {
        var lonlat = ol.coordinate.toStringHDMS(ol.proj.transform(
          coordinate, 'EPSG:3857', 'EPSG:4326'));
        if (lonlat.indexOf('N') > 0) {
          var lon = '北纬' + lonlat.split('N')[0]
          if (lonlat.indexOf('E') > 0) {
            var lat = '东经' + lonlat.split('N')[1].split('E')[0]
          } else {
            var lat = '西经' + lonlat.split('N')[1].split('W')[0]
          }
        } else if (lonlat.indexOf('S') > 0) {
          var lon =  '南纬' + lonlat.split('S')[0]
          if (lonlat.indexOf('E') > 0) {
            var lat = '东经' + lonlat.split('S')[1].split('E')[0]
          } else {
            var lat = '西经' + lonlat.split('S')[1].split('W')[0]
          }
        }
        var lonlatStr = lat + '  ' + lon
        return lonlatStr
      },
      removeAtmosLayer() {
        if (this.atmosPointLayer) {
          this.map.removeLayer(this.atmosPointLayer)
          this.atmosPointLayer = null
        }
      },
      removeOverlay() {
        if (this.overlay) {
          var popup = document.getElementById('atmostPop')
          popup.style.display = 'none'
        }
      },
      showBottomChart() {
        this.showPopBottom = true
        this.isforecast = false
        this.fetchPointData(this.lonlat)
      },
      closeOverlay() {
        this.removeAtmosLayer()
        this.removeOverlay()
      },
      showPopMsg(msg) {
        this.$refs['popMessage'].showDialog()
        this.popTitle = msg
      },
      showPopMsgUnHide(msg) {
        this.$refs['popMessage'].showUnAutoHideDialog()
        this.popTitle = msg
      },
      removeAreaLayer() {
        if (this.areaLayer) {
          this.map.removeLayer(this.areaLayer)
          this.areaLayer = null
        }
      },
      addAreaLayers(codes) {
        this.removeAreaLayer()

        this.areaLayer = this.$refs.map.getMultyAreaLayer(config.mapUrl, codes, this.bounds)
        this.map.addLayer(this.areaLayer)
      },
    },
    watch: {
      stationId: function(id) {
        if (this.index == '') {
          this.index = 'pre'
        } else {
          this.setTitle()
          this.getChart()
        }
      },
      index: function (index) {
        if (this.stationId) {
          this.chartConfig = echart.setChartConfig(index, this.chartConfig)
          this.setTitle()
          this.getChart()
        }
      },
      bounds(bounds) {
        if (this.resetBound) {
          var size = this.map.getSize()
          this.offsetBounds = this.$refs.map.getOffsetBounds(this.bounds, size)
        }
      },
      $route:{
        handler: function (route) {
          var query = route.query
          if(query.position) {
            var position = query.position.split(',')
            var zoom = query.zoom
            this.setDefualtCenter(position, zoom)
          } else {
            this.setDefualtCenter(null)
          }
        },
        immediate: true
      }
    },
    destroyed() {
      this.map.un('click', this.getPointInfo)
      mapctl.overlay = null
    },
    components: {
      weathProduct,
      viewreport,
      reportlist,
      leftList,
      noData,
      weatherLegend,
      popBottom
    }
  }
</script>
<style 
lang="less" >
@import '../../assets/style/common';
  .atmos-popup {
    position: absolute;
    left: -124px;
    top: -168px;
    .adv-boxshadow();
    .adv-common-border-radius();
    background: @assistant-bg;
    width: 248px;
    padding-bottom: 16px;
    cursor: default;
    border: 1px solid #dedede;
    .w-popper-arrow {
      left: 50%;
      bottom: -10px;
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 10px solid #fff;
      margin-left: -5px;
    }
    .atmos-popup-lonlat {
      color: #8e8e8e;
      padding-left: 14px;
    }
    .atmos-popup-title {
      width: 210px;
      padding: 14px 0 10px 14px;
      .adv-font-big();
    }
    .close-btn {
      right: 8px;
      top: 8px;
      cursor: pointer;  
    }
    .atmos-histroy {
      color: #fff;
      text-align: center;
      margin-top: 16px;

      .show-history {
        .adv-btn(); 
        .adv-btn-primary();
        padding: 8px 38px;

        .el-loading-mask {
          width: 0;
          top: 14px;
          left: 5px;

          .el-loading-spinner {
            .circular {
              width: 25px;
              height: 25px;
            }
            .path {
              stroke: #fff;
              stroke-width: 4px;
            }
          }
        }
      }
    }
  }
  .map-tooltip {
    position: fixed;
    width: 180px;
    height: 48px;
    background: #fff;
    border-radius: 25px;
    svg {
      width: 28px;
      height: 28px;
      float: left;
      background: #f6b45a;
      border-radius: 19px;
      padding: 5px;
      margin: 4px 10px;
    }
    div {
      position: relative;
      top: 10px;
      h3 {
        .adv-font-small();
        font-weight: 400;
        color: #333;
      }
      p {
        font-size: 10px;
        font-weight: 400;
        color: #666;
      }
    }
  }
  .pop-chart {
    width: 700px;
    height: 382px;
    padding: 20px 0 0 10px;
  }
  .weather-chart-menu {
    position: absolute;
    left: -1px;
    top: 1px;
    overflow: hidden;
    height: 36px;
    border-radius: 8px 8px 0 0;
    background: #fff;
    ul {
      margin-left: 20px;
      margin-top: 6px;
      overflow: hidden;
      li {
        float: right;
        box-sizing: border-box;
        font-size: 14px;
        color: #a4a4a4;
        cursor: pointer;
        position: relative;
        border-bottom: 4px solid #fff;
        .adv-horizontal-center(80px);
        height: 30px;
        .tool-pop-arrow {
          left: 33px;
          bottom: 0px;
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 5px solid #97cb6f;
          display: none;
        }
        &:hover {
          color: #3e3e3e;
        }
      }
      .active {
        color: #333;
        border-bottom: 4px solid #97cb6f;
        .tool-pop-arrow {
          display: block;
        }
      }
    }
  }
  .left-list {
    .left-tab {
      z-index: 2;
    }
  }
  .wp-date {
    position: relative;
    top: 80px;
    left: 60px;
    width: 200px;
    z-index: 1;
    h3 {
      .adv-font-normal();
      .adv-boxshadow();
      .adv-height(35px);
      .adv-horizontal-center(200px);
      position: relative;
      background: #fff;
      border-radius: 5px;
    }
    .btn {
      .adv-font-normal();
      .adv-common-border-radius();
      display: inline-block;
      padding: 6px 11px;
      margin: 10px 0;
      font-weight: 400;
      line-height: 1.42857143;
      cursor: pointer;
      border: 1px solid transparent;
    }
    .date-picker {
      position: relative;
      width: 125px;
      margin: 0 3px;
      top: 10px;
    }
  }
@keyframes bottom-in {
    0% {
      height: 0px;
    }
    100% {
       height: 212px;
    }
}
.an-bottom-echart-in {
  .adv-animation(bottom-in;.5s;1;forwards)
}
@keyframes bottom-out {
    0% {
      height: 212px;
    }
    100% {
      height: 0px;
    }
}
.an-bottom-echart-out {
  .adv-animation(bottom-out;.5s;1;forwards)
}
@keyframes weather-bottom-in {
    0% {
      height: 0px;
    }
    100% {
       height: 274px;
    }
}
.an-bottom-weather-in {
  .adv-animation(weather-bottom-in;.5s;1;forwards)
}
@keyframes weather-bottom-out {
    0% {
      height: 274px;
    }
    100% {
      height: 0px;
    }
}
.an-bottom-weather-out {
  .adv-animation(weather-bottom-out;.5s;1;forwards)
}
</style>