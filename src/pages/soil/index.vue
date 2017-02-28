<template>
  <div class="scale-atbottom soil">
    <my-map class="map" v-loading.body="mapLoading" @initMap="initMap" :switchCtl="true" background="#31c37c" :top="120" borderRadius="4px" :centerCtl="{use: true, bounds: bounds}" :addTileAreas="{code: code, areas: tree}" ref="map"></my-map>
    <left-tab :showList="showList" 
      :leftTab="[]"
      :backList="backList"
      @toggleList="toggleListStatus" 
      @changeState="switchList"
      :title="backList ? '土壤监测数据详情' : '全国土壤监测数据'">
      <div slot="list" class="list">
        <div class="search-container">
          <input type="input" class="fl" placeholder="请输入地点名称">
          <i class="iconfont icon-fangdajing fl"
            @click="backList=false"></i>
        </div>
      </div>
      <div slot="detail" class="list list-content">
        <div class="detail-content">
          <div class="list-result-bj">
            <h3 class="list-result clear">
              <span class="fl"><b class="font14">监测结果:</b> <i>不适合农业生产</i></span>
              <span class="fr">更新时间: 2016-2-6</span>
            </h3>
          </div>
          <table class="table-result">
            <tr>
              <th width="30%">监测项目</th>
              <th width="25%">标准值</th>
              <th width="25%">实测值</th>
              <th width="20%" rowspan="2">倍数</th>
            </tr>
            <tr>
              <td width="30%">PH值</td>
              <td width="25%">4.0~8.0</td>
              <td width="25%">6.1(酸性)</td>
            </tr>
          </table>
          <p class="soil-show-result clear">
            <span class="fl">土壤环境质量基本控制项目</span>
            <span class="fr">mg/kg</span>
          </p>
          <table class="soil-table-result">
            <tr>
              <td rowspan="2" width="20%">总镉</td>
              <el-tooltip :content="title" placement="top" :disabled="title.length < 6" >
                <td width="20%"><span>{{title}}</span></td>
              </el-tooltip>
              <td width="20%">0.30</td>
              <td width="20%"></td>
              <td width="20%"></td>
            </tr>
            <tr>
              <el-tooltip :content="title" placement="top" :disabled="title.length < 6">
                <td width="20%"><span>{{title}}</span></td>
              </el-tooltip>
              <td>0.30</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td colspan="2">六六六</td>
              <td>0.30</td>
              <td></td>
              <td></td>
            </tr>
          </table>
          <p class="soil-show-result clear">
            <span class="fl">土壤环境质量基本控制项目</span>
            <span class="fr">mg/kg</span>
          </p>
          <table class="soil-table-result">
            <tr>
              <td width="30%" colspan="2">六六六</td>
              <td width="23%" >0.30</td>
              <td width="23%"></td>
              <td width="23%"></td>
            </tr>
          </table>
        </div>
      </div>
    </left-tab>
    
    <div class="mouse-tip" v-if="showTip" @click="showDetail" :style="{left: tipLeft + 'px', top: tipTop + 'px'}">
      <span class="soil-triangle-bottom ps"></span>
      <h3>查看周边企业</h3>
    </div>
    <footer-lite></footer-lite>
  </div>
</template>
<script>
import request from 'api/request.js'
import model from 'api/model.js'
import leftTab from 'components/leftTab'
import mapctl from './map/index.js'
import footerLite from 'components/footerlite'

export default {
  data() {
      return {
        map: null,
        showList: true,
        backList: true,
        tree: [],
        code: null,
        bounds: [],
        options: [],
        value: '',
        pointLayer: null,
        mapLoading: false,
        showTip: false,
        tipLeft: 0,
        tipTop: 0,
        radius: 500,
        enterprise: [],
        monitorPoints: [],
        selectName: '',
        selectElement: '',
        title:'水作水作水作水作水作水作'
      }
    },
    mounted() {
      // this.mapLoading = true
      // var data = { arealist: [ { "grade": '4', "area_code": '000000' } ] }

      // request.getPartAreas(data).then((response) => {
        
      //   if (response.status !== 200 || response.data.status != '0') {
      //     console.log("接口返回:" + response.data.error_msg); 
      //   } else {
      //     this.tree = response.data.data
      //     this.code = this.tree[0].area_id
      //     this.treeNodeName = this.tree[0].area_name
      //     this.bounds = model.formatBounds(this.tree[0])
      //     this.mapLoading = false

      //     this.getMonitorPoints(this.code)
      //   }
      // });
      // this.map.on('click', (event) => {
      //   console.log(event.coordinate)
      //   this.getEnterprises(event.coordinate)
      // })
    },
    methods: {
      initMap(map) {
        this.map = map;
      },
      toggleListStatus() {
        this.showList = !this.showList
      },
      switchList() {
        this.backList = !this.backList
      },
      showDetail() {

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
      },
      getMonitorPoints(area_code, selectName, selectElement) {
        var data = {
          area_code
        }
        if (this.selectName) {
          data.select_name = this.selectName
        }
        if (this.selectElement) {
          data.select_element = this.selectElement
        }

        request.monitorPoints(data).then((response) => {
          if (response.status === 200 && response.data.status === 0) {
            this.monitorPoints = response.data.data
            
          }
        })
      }
    },
    watch: {
    },
    components: {
      leftTab,
      footerLite
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
  .list-content {
    .list-result-bj {
      background: #f1f4f4;
      padding-bottom: 10px;
      .list-result {
        line-height: 50px;
        height: 50px;
        padding: 0 10px;
        border: 1px solid #cdd0d2;
        background: #fff;
          i {
            color: #ed0f02;
            margin-left: 5px;
          }
      }
    }
      table {
        width: 100%;
        td,th {
          border: 1px solid #cdd0d2;
          text-align: center;
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
        background: #eef5fb;
        padding: 0 14px 0  10px;
        border-left: 1px solid #cdd0d2;
        border-right: 1px solid #cdd0d2;
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
</style>
