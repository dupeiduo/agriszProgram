<template>
  <div class="scale-atbottom soil">
    <my-map class="map" v-loading.body="mapLoading" 
      @initMap="initMap" :switchCtl="true" background="#31c37c" :top="120" borderRadius="4px" :centerCtl="{use: true, bounds: bounds}" 
      :addTileAreas="{code: code, areas: tree}"  ref="map"></my-map>
    <left-tab :showList="showList" 
      :leftTab="[]"
      :noDetail="true"
      :backList="backList"
      @toggleList="toggleListStatus" 
      @changeState="switchList"
      :title="backList ? title + '土壤监测数据详情' : '全国土壤监测数据'"
      v-loading.body="leftLoading">
      <div slot="list" class="list">
         <div class="detail-place-list">
          <div class="detail-border">
            <p class="detail-soso pr">
              <input v-model="selectName" placeholder="请输入监测点名称" class="ps" @keyup.13="searchByField"/>
              <span class="el-icon-search ps" @click="searchByField"></span>
            </p>
          </div>
          <div class="detail-result-bj">
            <el-row class="block-col-detail clear">
              <el-col>
                <el-dropdown trigger="click" menu-align="start" class="clear"> 
                  <span class="el-dropdown-link">
                   {{provinceName}}<i class="el-icon-arrow-down el-icon-right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown" v-if="provinces.length > 0" class="soil-drop-menu">
                    <el-dropdown-item 
                      v-for="(province, index) in provinces"
                      @click.native="selectProvince(index)">
                      {{province.area_name}}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
              <el-col :class="cities.length == 0 ? 'disabled': ''">
                <el-dropdown trigger="click" menu-align="start">
                  <span class="el-dropdown-link">
                    {{cityName}}<i class="el-icon-arrow-down el-icon-right"></i>
                  </span>
                  <el-dropdown-menu class="soil-drop-menu" slot="dropdown" v-if="cities.length > 0">
                    <el-dropdown-item 
                      v-for="(city, index) in cities"
                      @click.native="selectCity(index)">
                      {{city.area_name}}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
              <el-col :class="counties.length == 0 ? 'disabled': ''">
                <el-dropdown trigger="click" menu-align="start">
                  <span class="el-dropdown-link">
                    {{countyName}}<i class="el-icon-arrow-down el-icon-right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown" class="soil-drop-menu" v-if="counties.length > 0">
                    <el-dropdown-item 
                      v-for="(county, index) in counties"
                      @click.native="selectCounty(index)">
                      {{county.area_name}}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
              <el-col>
                <el-dropdown trigger="click" menu-align="start" :hide-on-click="dropMenu">
                  <span class="el-dropdown-link">
                    项目筛选<i class="el-icon-arrow-down el-icon-right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown" class="item-screen">
                    <el-dropdown-item class="clear">
                      <p class="filter-title fl">监测项目</p>
                      <ul class="fl">
                        <li v-for="(target, index) in targets"
                          :class="index === targetIndex ? 'active' : ''"
                          @click="selectTarget(index)">
                          {{target.name}}
                        </li>
                      </ul>
                    </el-dropdown-item>
                    <el-dropdown-item class="clear">
                      <p class="filter-title fl">达标情况</p>
                      <ul class="fl">
                        <li v-for="(standard, index) in standards"
                          :class="index === standardIndex ? 'active' : ''"
                          @click="changeStandard(index)">
                          {{standard.name}}
                        </li>
                      </ul>
                    </el-dropdown-item>
                    <el-dropdown-item class="clear item-button">
                      <h3 class="fr">
                        <span class="cancel" @click="dropMenu = true">取消</span>
                        <span class="confirm" @click="filterPoints">筛选</span>
                      </h3>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
              <el-col class="select-index">已选择 : <span>{{this.targetIndex === 0 ? '全部项目' : '项目：' + targets[targetIndex].name}}</span><span v-show="this.flag === 1">达标</span><span v-show="this.flag === 2">不达标</span></el-col>
            </el-row>
          </div>
          <div class="point-name">
            <table>
              <thead>
                <tr>
                  <th width="35%">监测点名称</th>
                  <th width="22%">概况</th>
                  <th width="22%">监测项目</th>
                  <th width="21%">倍数</th>
                </tr>
              </thead>
              <tbody v-if="monitorPointList.length > 0">
                <tr v-if="curSelectTarget === ''" 
                  v-for="(item, index) in monitorPointList"
                  @click="showStationDetail(index)">
                  <el-tooltip :content="item.station" placement="top" :disabled="item.station.length < 6" >
                    <td><span>{{item.station}}</span></td>
                  </el-tooltip>
                  <td>{{item.desc}}</td>
                  <td>{{item.default.name}}</td>
                  <td :style="{color: item.default.times > 0 ? 'red' : '#333'}">{{item.default.times}}</td>
                </tr>
                <tr v-if="curSelectTarget !== ''"
                  v-for="(item, index) in monitorPointList"
                  @click="showStationDetail(index)">
                  <el-tooltip :content="item.station" placement="top" :disabled="item.station.length < 6" >
                    <td width="35%"><span>{{item.station}}</span></td>
                  </el-tooltip>
                  <td>{{item.desc}}</td>
                  <td>{{item[curSelectTarget].name}}</td>
                  <td>{{item[curSelectTarget].times}}</td>
                </tr>
              </tbody>
              <tbody v-else class="none-data">
                －暂无数据－
              </tbody>
            </table>
          </div>
          <p class="point-page no-select">
            <i class="el-icon-arrow-left" @click="prePage"></i>
            <span>{{pageIndex}}/{{pageCount}}</span>
            <i class="el-icon-arrow-right" @click="nextPage"></i>
          </p>
        </div>
      </div>
      <div slot="detail" class="list list-content" v-if="backList">
        <div class="detail-content">
          <div class="list-result-bj">
            <h3 class="list-result clear">
              <span class="fl"><i :style="{color: curMonitorPoint.overproof > 0 ? 'red' : 'blue', fontWeight: '900'}">{{curMonitorPoint.overproof > 0 ? '有污染' : '无污染'}}</i></span>
              <span class="fr">更新时间: {{curMonitorPoint.date_time}}</span>
            </h3>
          </div>
          <div class="list-height">
            <table class="table-result">
            <tr>
              <th width="125">监测项目</th>
              <th width="74">标准值</th>
              <th width="72">实测值</th>
              <th width="52" rowspan="2">倍数</th>
            </tr>
            <tr>
              <td>PH值</td>
              <td>4.0~8.0</td>
              <td>{{curMonitorPoint.ph.toFixed(2) + (curMonitorPoint.ph < 7 ? '(酸性)' : '(碱性)')}}</td>
            </tr>
          </table>
          <p class="soil-show-result clear">
            <span class="fl">土壤环境质量基本控制项目</span>
            <span class="fr soil-unit">μg/g</span>
          </p>
          <table class="soil-table-result">
            <tr>
              <td rowspan="2" width="50">总镉</td>
              <el-tooltip content="水作、旱作、果树等≤" placement="top">
                <td width="60"><span>水作、旱作、果树等≤</span></td>
              </el-tooltip>
              <td width="75">{{curMonitorPoint.cd.normal[0]}}</td>
              <td width="72" :class="curMonitorPoint.cd.times > 0 ? 'color-red': ''">{{curMonitorPoint.cd.actual}}</td>
              <td width="52" :class="curMonitorPoint.cd.times > 0 ? 'color-red': ''">{{curMonitorPoint.cd.times}}</td>
            </tr>
            <tr>
              <td><span>蔬菜≤</span></td>
              <td>{{curMonitorPoint.cd.normal[1]}}</td>
              <td :class="curMonitorPoint.cd.times > 0 ? 'color-red': ''">{{curMonitorPoint.cd.actual}}</td>
              <td :class="curMonitorPoint.cd.times > 0 ? 'color-red': ''">{{curMonitorPoint.cd.times}}</td>
            </tr>

            <tr>
              <td rowspan="2">总汞</td>
              <el-tooltip content="水作、旱作、果树等≤" placement="top">
                <td><span>水作、旱作、果树等≤</span></td>
              </el-tooltip>
              <td>{{curMonitorPoint.hg.normal[0]}}</td>
              <td :class="curMonitorPoint.hg.times > 0 ? 'color-red': ''">{{curMonitorPoint.hg.actual}}</td>
              <td :class="curMonitorPoint.hg.times > 0 ? 'color-red': ''">{{curMonitorPoint.hg.times}}</td>
            </tr>
            <tr>
              <td><span>蔬菜≤</span></td>
              <td>{{curMonitorPoint.hg.normal[1]}}</td>
              <td :class="curMonitorPoint.hg.times > 0 ? 'color-red': ''">{{curMonitorPoint.hg.actual}}</td>
              <td :class="curMonitorPoint.hg.times > 0 ? 'color-red': ''">{{curMonitorPoint.hg.times}}</td>
            </tr>

            <tr>
              <td rowspan="2">总砷</td>
              <el-tooltip content="旱作、果树等≤" placement="top">
                <td><span>旱作、果树等≤</span></td>
              </el-tooltip>
              <td>{{curMonitorPoint.as.normal[0]}}</td>
              <td :class="curMonitorPoint.as.times > 0 ? 'color-red': ''">{{curMonitorPoint.as.actual}}</td>
              <td :class="curMonitorPoint.as.times > 0 ? 'color-red': ''">{{curMonitorPoint.as.times}}</td>
            </tr>
            <tr>
              <el-tooltip content="水作、蔬菜≤" placement="top">
                <td><span>水作、蔬菜≤</span></td>
              </el-tooltip>
              <td>{{curMonitorPoint.as.normal[1]}}</td>
              <td :class="curMonitorPoint.as.times > 0 ? 'color-red': ''">{{curMonitorPoint.as.actual}}</td>
              <td :class="curMonitorPoint.as.times > 0 ? 'color-red': ''">{{curMonitorPoint.as.times}}</td>
            </tr>

            <tr>
              <td rowspan="2">总铅</td>
              <el-tooltip content="水作、旱作、果树等≤" placement="top">
                <td><span>水作、旱作、果树等≤</span></td>
              </el-tooltip>
              <td>{{curMonitorPoint.pb.normal[0]}}</td>
              <td :class="curMonitorPoint.pb.times > 0 ? 'color-red': ''">{{curMonitorPoint.pb.actual}}</td>
              <td :class="curMonitorPoint.pb.times > 0 ? 'color-red': ''">{{curMonitorPoint.pb.times}}</td>
            </tr>
            <tr>
              <td><span>蔬菜≤</span></td>
              <td>{{curMonitorPoint.pb.normal[1]}}</td>
              <td :class="curMonitorPoint.pb.times > 0 ? 'color-red': ''">{{curMonitorPoint.pb.actual}}</td>
              <td :class="curMonitorPoint.pb.times > 0 ? 'color-red': ''">{{curMonitorPoint.pb.times}}</td>
            </tr>

            <tr>
              <td rowspan="2">总铬</td>
              <el-tooltip content="水作、旱作、果树等≤" placement="top">
                <td><span>水作、旱作、果树等≤</span></td>
              </el-tooltip>
              <td>{{curMonitorPoint.cr.normal[0]}}</td>
              <td :class="curMonitorPoint.cr.times > 0 ? 'color-red': ''">{{curMonitorPoint.cr.actual}}</td>
              <td :class="curMonitorPoint.cr.times > 0 ? 'color-red': ''">{{curMonitorPoint.cr.times}}</td>
            </tr>
            <tr>
              <td><span>蔬菜≤</span></td>
              <td>{{curMonitorPoint.cr.normal[1]}}</td>
              <td :class="curMonitorPoint.cr.times > 0 ? 'color-red': ''">{{curMonitorPoint.cr.actual}}</td>
              <td :class="curMonitorPoint.cr.times > 0 ? 'color-red': ''">{{curMonitorPoint.cr.times}}</td>
            </tr>

            <tr>
              <td rowspan="2">总铜</td>
              <el-tooltip content="水作、旱作、果树等≤" placement="top">
                <td><span>水作、旱作、果树等≤</span></td>
              </el-tooltip>
              <td>{{curMonitorPoint.cu.normal[0]}}</td>
              <td :class="curMonitorPoint.cu.times > 0 ? 'color-red': ''">{{curMonitorPoint.cu.actual}}</td>
              <td :class="curMonitorPoint.cu.times > 0 ? 'color-red': ''">{{curMonitorPoint.cu.times}}</td>
            </tr>
            <tr>
              <td><span>蔬菜≤</span></td>
              <td>{{curMonitorPoint.cu.normal[1]}}</td>
              <td :class="curMonitorPoint.cu.times > 0 ? 'color-red': ''">{{curMonitorPoint.cu.actual}}</td>
              <td :class="curMonitorPoint.cu.times > 0 ? 'color-red': ''">{{curMonitorPoint.cu.times}}</td>
            </tr>

            <tr>
              <td colspan="2">六六六</td>
              <td>{{curMonitorPoint.six.normal}}</td>
              <td :class="curMonitorPoint.six.times > 0 ? 'color-red': ''">{{curMonitorPoint.six.actual}}</td>
              <td :class="curMonitorPoint.six.times > 0 ? 'color-red': ''">{{curMonitorPoint.six.times}}</td>
            </tr>
            <tr>
              <td colspan="2">滴滴涕</td>
              <td>{{curMonitorPoint.ddt.normal}}</td>
              <td :class="curMonitorPoint.ddt.times > 0 ? 'color-red': ''">{{curMonitorPoint.ddt.actual}}</td>
              <td :class="curMonitorPoint.ddt.times > 0 ? 'color-red': ''">{{curMonitorPoint.ddt.times}}</td>
            </tr>
          </table>
          <p class="soil-show-result clear">
            <span class="fl">土壤环境质量选择控制项目</span>
            <span class="fr soil-unit">μg/g</span>
          </p>
          <table class="soil-table-result">
            <tr>
              <td width="125" colspan="2">总锌</td>
              <td width="74">{{curMonitorPoint.zn.normal}}</td>
              <td width="72">{{curMonitorPoint.zn.actual}}</td>
              <td width="52">{{curMonitorPoint.zn.times}}</td>
            </tr>
            <tr>
              <td colspan="2">总镍</td>
              <td>{{curMonitorPoint.ni.normal}}</td>
              <td>{{curMonitorPoint.ni.actual}}</td>
              <td>{{curMonitorPoint.ni.times}}</td>
            </tr>
          </table>
          </div>
        </div>
       
      </div>
    </left-tab>
    
    <footer-lite></footer-lite>
    <pop-detail :gridData="gridData" :seatSpot="seatSpot"
      :coordinates="coordinates" 
      :standardInfo="standardInfo"
      :left="detailLeft"
      :top="detailTop"
      :showPop="showPop"
      @goDetail="goDetail"></pop-detail>

    <pop-message popTitle="请先选择一条数据" ref="popMessage"></pop-message>
  </div>
</template>
<script>
import request from 'api/request.js'
import model from 'api/model.js'
import leftTab from 'components/leftTab'
import mapctl from './map/index.js'
import footerLite from 'components/footerlite'
import configData from '../../config/data.js'
import popDetail from './popDetail/'

export default {
  data() {
      return {
        map: null,
        showList: true,
        backList: false,
        tree: [],
        code: null,
        bounds: [],
        options: [],
        value: '',
        pointLayer: null,
        mapLoading: false,
        leftLoading: false,
        showTip: false,
        tipLeft: 0,
        tipTop: 0,
        radius: 500,
        enterprise: [],
        monitorPoints: [],
        monitorPointList: [],
        monitorPointIndex: -1,
        curMonitorPoint: null,
        selectName: '',
        selectElement: '',
        title:'',
        areas: {},
        provinces: [],
        cities: [],
        counties: [],
        provinceName: '全国',
        cityName: '城市',
        countyName: '区县',
        flag: 2,
        targets: [],
        targetIndex: 0,
        curSelectTarget: '',
        standards: [],
        standardIndex: 2,
        pageSize: 8,
        pageIndex: 1,
        pageCount: 0,
        pointLayer: null,
        seatSpot: {},
        gridData: [],
        coordinates: [],
        standardInfo: [],
        dropMenu: false,
        detailLeft: 0,
        detailTop: 0,
        showPop: true,
        bindMapEvent: false
      }
    },
    mounted() {
      this.mapLoading = true
      var data = { arealist: [ { "grade": '4', "area_code": '000000' } ] }

      request.getPartAreas(data).then((response) => {
        
        if (response.status !== 200 || response.data.status != '0') {
          console.log("接口返回:" + response.data.error_msg); 
        } else {
          this.areas = model.formatAreas(response.data.data)
          this.provinces = this.areas.province
          this.tree = [this.provinces[0]]
          this.code = this.tree[0].area_id
          this.bounds = this.provinces[0].bounds

          this.getMonitorPoints(this.code, this.flag)
        }
        this.mapLoading = false
      });

      var targets = configData.soil.targets
      for(var key in targets) {
        var name = targets[key]
        this.targets.push({name ,key})
      }

      this.standards = configData.soil.standard

      this.$on('featureInfo', (featureInfo) => {
        this.coordinates = featureInfo.coordinates
        this.standardInfo = this.getStandardInfo(featureInfo.id)

        this.detailLeft = featureInfo.left - 95;
        this.detailTop = featureInfo.top - 130;
        this.seatSpot.station = featureInfo.station
        this.seatSpot.id = this.monitorPointIndex = featureInfo.id

        this.gridData = this.getMaxTwo(featureInfo.id)
      })

      this.$on('dragPoint', ({left, top}) => {
        this.detailLeft = this.detailLeft - left;
        this.detailTop = this.detailTop - top;
      })
    },
    methods: {
      initMap(map) {
        this.map = map;
      },
      toggleListStatus() {
        this.showList = !this.showList
      },
      switchList() {
        if (this.monitorPointIndex === -1 && !this.backList) {
          this.$refs['popMessage'].showDialog()
        } else {
          this.backList = !this.backList
        }
      },
      selectProvince(index) {
        this.code = this.provinces[index].area_id
        this.provinceName = this.provinces[index].area_name
        this.bounds = this.provinces[index].bounds
        this.tree = [this.provinces[index]]
        this.cities = []
        for (var i = 0; i < this.areas.city.length; i++) {
          if (this.areas.city[i].parent === this.code) {
            this.cities.push(this.areas.city[i])
          }
        }
        this.getMonitorPoints(this.code, this.flag)
      },
      selectCity(index) {
        this.code = this.cities[index].area_id
        this.tree = [this.cities[index]]
        this.cityName = this.cities[index].area_name
        this.bounds = this.cities[index].bounds
        this.counties = []
        for (var i = 0; i < this.areas.county.length; i++) {
          if (this.areas.county[i].parent === this.code) {
            this.counties.push(this.areas.county[i])
          }
        }
        this.getMonitorPoints(this.code, this.flag)
      },
      selectCounty(index) {
        this.code = this.counties[index].area_id
        this.tree = [this.counties[index]]
        this.countyName = this.counties[index].area_name
        this.bounds = this.counties[index].bounds
        this.getMonitorPoints(this.code, this.flag)
      },
      selectTarget(index) {
        this.dropMenu = false
        this.targetIndex = index
        this.selectElement = this.targets[index].key
      },
      changeStandard(index) {
        this.dropMenu = false
        this.flag = this.standards[index].flag
        this.standardIndex = index
      },
      searchByField() {
        this.getMonitorPoints(this.code, this.flag)
      },
      filterPoints() {
        this.dropMenu = true;
        this.getMonitorPoints(this.code, this.flag)
      },
      getEnterprises(coodinates) {
        var data = {
          point: coodinates,
          radius: this.radius
        }
        request.nearEnterprises(data).then((response) => {
          if (response.status === 200 && response.data.status === 0) {
            this.enterprise = model.formateEnterprise(response.data.data)
            
          }
        })
        this.getMonitorPoints(this.code, this.flag)
      },
      getMonitorPoints(area_code, flag) {
        var data = {
          area_code,
          flag: (flag ? flag : 0)
        }
        if (this.selectName) {
          this.selectName = this.selectName.replace(/[、|，|,|\s|\n|\r]/g," ")
          data.select_name = this.selectName
        }
        if (this.selectElement) {
          data.select_element = this.selectElement
        }
        this.clearMonitorPoints()
        this.leftLoading = true
        this.showPop = false
        request.monitorPoints(data).then((response) => {
          if (response.status === 200 && response.data.status === 0) {
            this.monitorPoints = model.formatMonitorPoints(response.data.data)
            this.pageCount = Math.ceil(this.monitorPoints.length / this.pageSize)
            this.curPageData()
            this.addPoints()
          }
          this.leftLoading = false
          this.showPop = true
        })
      },
      clearMonitorPoints() {
        this.pageIndex = 1
        this.pageCount = 0
        this.monitorPoints = []
        this.monitorPointList = []
        this.curMonitorPoint = []
        this.removeLayer()
      },
      curPageData() {
        var start = (this.pageIndex - 1) * this.pageSize
        var end = this.pageIndex * this.pageSize
        this.monitorPointList = this.monitorPoints.slice(start, end)
        this.curSelectTarget = this.targetIndex !== 0 ? this.targets[this.targetIndex].key : ''
      },
      prePage() {
        if (this.pageIndex > 1) {
          this.pageIndex--
          this.curPageData()
        }
      },
      nextPage() {
        if (this.pageCount > this.pageIndex) {
          this.pageIndex++
          this.curPageData()
        }
      },
      goDetail(index) {
        this.backList = true
        this.curMonitorPoint = this.monitorPoints[index]
        this.title = this.curMonitorPoint.station
      },
      showStationDetail(index) {
        this.monitorPointIndex = index
        this.backList = true
        this.curMonitorPoint = this.monitorPointList[index]
        this.title = this.curMonitorPoint.station
      },
      addPoints() {
        this.removeLayer()
        
        var points = []
        for (var i = 0; i < this.monitorPoints.length; i++) {
          var obj = {
            id: i,
            lonlat: this.monitorPoints[i].point,
            station: this.monitorPoints[i].station,
            outof: this.monitorPoints[i].overproof > 0 ? 1 : 0,
            maxValue: this.monitorPoints[i].maxValue
          }
          points.push(obj)
        }

        if (this.flag === 1) {
          var isOutof = false
        } else if (this.flag === 2) {
          var isOutof = true
        } else  {
          var isOutof = null
        }
        
        this.pointLayer = mapctl.addPoints(points, this.map, isOutof)
        if (!this.bindMapEvent) {
          this.bindMapEvent = true
          mapctl.mapEvents(this)
        } else {
          mapctl.mapEvents(this, true)
        }
        
      },
      removeLayer() {
        if (this.pointLayer) {
          this.map.removeLayer(this.pointLayer)
        }
      },
      getMaxTwo(index) {
        var targets = configData.soil.targets,
          temArray = []

        temArray = turnToArray(this.monitorPoints[index])
        return bubbleSort(temArray)

        function turnToArray(data) {
          var array = []
          for(var key in targets) {
            if (key !== 'all' && key !== 'ph') {
              var obj = {
                  name: data[key].name,
                  normal: data[key].normal,
                  actual: data[key].actual,
                  times: data[key].times
                }
              array.push(obj)
            } 
          }
          return array
        }

        function bubbleSort(array) {
          var len = array.length;

          for (var i = 0; i < len; i++) {
            for (var j = i + 1; j < len; j++) {
              if (Number(array[j].times) > Number(array[i].times)) {
                var temObject = array[i]
                array[i] = array[j]
                array[j] = temObject
              } else if (Number(array[j].times) === Number(array[i].times) && Number(array[j].actual) > Number(array[i].actual)) {
                var temObject = array[i]
                array[i] = array[j]
                array[j] = temObject
              }
            }
          }
          return [array[0], array[1]]
        }
      },
      getStandardInfo(index) {
        var targets = configData.soil.targets,
          temArray = [],
          data = this.monitorPoints[index]

        for(var key in targets) {
          if (key !== 'all' && key !== 'ph' && data[key].times > 0) {
            var obj = {
              name: data[key].name,
              normal: data[key].normal,
              actual: data[key].actual,
              times: data[key].times
            }
            temArray.push(obj)
          } 
        }
        return temArray
      }
    },
    watch: {
    },
    components: {
      leftTab,
      footerLite,
      popDetail
    }
}
</script>
<style 
lang="less" 
scoped>
.soil {
  color: #333;
  .list {
    .search-container {
      input {
        width: 260px;
        height: 32px;
      }
    }
  }
  .detail-content {
    table {
      width: 100%;
      .color-red {
        color: #f15553;
      }
      td,th {
        border: 1px solid #cdd0d2;
        border-bottom: none;
        text-align: center;
      }
    }
  }
  .detail-place-list {
    .detail-border {
      border: 1px solid #cdd0d2;
    }
    .detail-result-bj {
      background: #f1f4f4;
      padding-top: 6px;
        .block-col-detail {
          padding: 10px 0 0 16px;
          background: #fff;
          .select-index {
            span {
              display: inline-block;
              height: 24px;
              line-height: 24px;
              padding: 0 8px;
              margin-right: 5px;
              background: #e5f3cb;
              border-radius: 4px;
              cursor: pointer;
            }
          }
          .el-col {
            width: auto;
            margin: 0 6px 14px 0;
          }
        }
    }
    .detail-soso {
      height: 26px;
      margin: 14px 16px;
      border: 1px solid #cdd0d2;
      border-radius: 4px;
      background: #f4fcfc;
      color: #a1a8ad;
      overflow: hidden;
      input {
        top: 0px;
        width: 260px;
        height: 26px;
        padding-left: 10px;
        background: #f5fafd;
      }
      span {
        right: 10px;
        top: 5px;
        height: 26px;
        font-size: 16px;
        color: #425660;
        cursor: pointer;
        &:hover{
          color: #55af00;
        }
      }
    }
    .block-col-detail {
      .disabled {
        .el-dropdown {
          color: #b6b6b6;
          background: #fafafa;
        }
      }
      .el-dropdown {
        display: block;
        line-height: 26px;
        border: 1px solid #cdd0d2;
        border-radius: 4px;
        background: #f5fafd;
        height: 26px;
        font-size: 12px;
        cursor: pointer;
          .el-icon-right {
            position: absolute;
            right: 6px;
            top: 8px;
          }
          .el-dropdown-link {
            position: relative;
            width: 70px;
            display: block;
            padding: 0 10px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          &:hover {
            i {
              color: #909393;
            }
          }
      }
    }
    .point-name {
      height: 344px;
      overflow: auto;
      table {
        width: 100%;
        cursor: pointer;
        thead {
          tr {
            height: 38px;
            line-height: 38px;
            background: #eef6fb;
          }
        }
        .none-data {
          position: absolute;
          left: 118px;
          border-bottom: none;
        }
        tbody {
          border-bottom: 1px solid #ededed;
          tr:hover,tr:nth-child(2n):hover {
            background: #cceaff;
          }
          tr:nth-child(2n) {
            background: #eef6fb;
          }
          .active {
            background: #cceaff;
          }
          .active:hover {
            background: #cceaff;
          }
          td {
            height: 28px;
            line-height: 28px;
            text-align: center;
             span {
              position: relative;
              top: 6px;
              left: 14px;
              width: 80px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              display: inline-block;
             }
          }
        }
      }
      @media screen and (max-height: 708px) {
        height: 236px;
      }
    }
    .point-page {
      text-align: center;
      line-height: 36px;
      i {
        font-size: 14px;
        color: #c1c1c1;
        cursor: pointer;
        &:hover {
          color: #999;
        }
      }
      span {
        color: #7a7a7a;
      }
    }
  }
  .mouse-tip {
    position: fixed;
    width: 120px;
    height: 30px;
    background: #fff;
    border-radius: 5px;
    .soil-triangle-bottom {
      left: 50px;
      bottom: -12px;
      width: 0px;
      height: 0px;
      border: 6px solid transparent;
      border-top: 6px solid rgba(0, 0, 0, .5);
    }
    h3 {
      line-height: 30px;
      text-align: center;
      border-radius: 4px;
      background: rgba(0, 0, 0, .5);
      color: #fff;
      cursor: pointer;
    }
  }
}
.range-select {
  margin: 14px;
  span {
    margin-right: 10px;
  }
  select {
    width: 100px;
    height: 26px;
    border: 1px solid #959595;
    background: #f5fafd;
  }
}
.soil-tip-table {
  table {
    width: 100%;
    thead {
      tr {
        background: #eef6fc;
      }
    }
    tr {
      height: 28px;
      padding-left: 15px;
      text-align: center;
      cursor: pointer;
      &:nth-child(2n) {
        background: #eef6fc;
      }
    }
  }
}
.item-screen {
  li {
    .filter-title {
      height: 20px;
      line-height: 20px;
    }
    &:hover {
      background-color: #fff;
    }
  }
  .item-button {
        padding-top: 10px;
        border-top: 1px solid #d3d6d5;
        .cancel {
          background: #c9c9c9;
        }
        .confirm {
          background: #8ec51f;
        }
        span {
          display: inline-block;
          width: 50px;
          height: 25px;
          line-height: 25px;
          text-align: center;
          border: 1px solid #d3d6d5;
          border-radius: 4px;
          margin-right: 8px;
          cursor: pointer;
          color: #fff;
        }
      }
  li {
    line-height: 1em;
    padding: 0 12px;
    p {
      margin-right: 16px;
      margin-top: 6px;
    }
    ul {
      width: 208px;
      margin-top: 6px;
      overflow: hidden;
      .active {
        background: #54b000;
        border: 1px solid #54b000;
        color: #fff;
      }
      li {
        line-height: 18px;
        float: left;
        width: 38px;
        height: 18px;
        padding: 0;
        text-align: center;
        border: 1px solid #d3d6d5;
        margin: 0px 12px 12px 0;
        border-radius: 4px;
        background: #f2f5f5;
      }
    }
  }
}
.list-content {
  .list-result-bj {
    background: #f1f4f4;
    padding-bottom: 10px;
    .list-result {
      line-height: 52px;
      height: 52px;
      padding: 0 10px;
      border: 1px solid #cdd0d2;
      background: #fff;
      font-weight: normal;
      i {
        color: #ed0f02;
        margin-left: 5px;
      }
    }
  }
  .list-height {
    height: 488px;
    overflow: auto;
    @media screen and (max-height: 708px) {
      height: 378px;
    }
  }
  .table-result {
    td,th {
      border: 1px solid #cdd0d2;
    }
  }
  .soil-show-result {
    font-size: 14px;
    line-height: 40px;
    height: 40px;
    width: 292px;
    background: #eef5fb;
    padding: 0 14px 0  10px;
    border: 1px solid #cdd0d2;
    border-bottom: none;
    .soil-unit {
      margin-right: 10px;
    }
  }
}
</style>
