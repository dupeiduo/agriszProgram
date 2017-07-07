<template>
  <div  class="popdetail bottom-pop-zIndex" 
        :class="showPopDetail ? 'right-bottom-in-left' : 'right-bottom-out-left'"
        :style="{top: getScreenHeight - 500 + 'px'}"
        >
    <h3 class="popdetail-title pr">#{{landId}}<em>{{landCrop}}</em>
      <span class="close-btn el-icon-close ps" @click="closeDetail"></span></h3>
    <div class="popdetail-list">
      <ul class="popdetail-group clear no-select">
        <li
            v-for="(item,index) in listMenu"
            :class="index === currentIndex ? 'active' : ''"
            @click="menuClick(index)"
            >{{item}}</li>
      </ul>
      <div class="popdetail-item">
        <div v-if="currentIndex === 0" class="crop-detail">
          <p class="clear item-title">
            <span v-for="(item,index) in cropItem">{{item.name}}&nbsp;:&nbsp;<em>{{item.value}}</em></span>
          </p>
          <p class="history-title">耕作历史</p>
          <div class="popdetail-item-time pr">
            <hr class="pop-hr ps" :style="{height: (cropHistoryData.length - 1) * 42 + 'px'}">
            <ul v-if="cropHistoryData.length > 0">
              <li v-for="(item,index) in cropHistoryData">
                <div class="pop-icon"><span :class="item.selected ? 'active' : ''"></span></div>
                <div class="pop-list">{{item.year}}{{item.selected ? '(当期)' : ''}} —— {{item.crop}} </div>
              </li>
            </ul>
          </div>
        </div>
        <div v-if="currentIndex === 1">
          <p class="crop-item clear item-title">
              <span :class="popClassName">健康状况: <em>{{healthyStatus}}</em></span>
          </p>
           <div class="pr crop-item-chart">
            <span v-if="showHistory" @click="showHistory = !showHistory">查看两年对比</span>
            <span v-else @click="showHistory = !showHistory">查看历年走势</span>
            
            <my-echart class="crop-echart" v-if="showHistory" :options="allLineChart"></my-echart>
            <my-echart class="crop-echart" v-else :options="nearTowYear"></my-echart>
            
            <div class="legend-con ps">
              好<p><i class="legend"></i><i class="legend-bottom"></i></p>差
            </div>
          </div>
        </div>
        <div v-if="currentIndex === 2" class="output-value pr">
          <h3 class="output-value-title">产量预估</h3>
          <p class="output-trend top-red" :class="yieldStats.className">
            {{yieldStats.value}}%
            <span class="iconfont" :class="'icon-' + yieldStats.className"></span>
          </p>
          <ul class="output-legend ps">
            <li><span class="iconfont icon-zixunyuanjiaozhengfang top-red"></span>产量增加</li>
            <li><span class="iconfont icon-zixunyuanjiaozhengfang flat-blue"></span>持平</li>
            <li><span class="iconfont icon-zixunyuanjiaozhengfang down-green"></span>产量减少</li>
          </ul>
        </div>

        <div v-else-if="currentIndex === 3" class="soil-data">
          <div class="soil-data-title clear">
            <p class="fl view-index">土壤数据观测指标</p>
            <div class="soil-drop fr">
              <span class="view-depth">观测深度</span>
              <el-select v-model="selectedDepths" placeholder="请选择" 
                :disabled="tableData.length > 0 ? false:true">
                <el-option
                  v-for="item in depths"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="table-content">
            <table>
              <thead>
                <tr>
                  <th width="268">指标名称</th>
                  <th width="268">观测值</th>
                </tr>
              </thead>
              <tbody v-loading.lock="soilLoading" v-if="tableData.length > 0">
                <tr v-for="item in tableData">
                  <td width="268">{{item.name}}</td>
                  <td width="268">{{item.value == -9999 ? "-" : item.value}}{{item.unit}}</td>
                </tr>
              </tbody>
              <tbody v-else-if="tableData.length === 0 && ! soilLoading" style="height: 200px" class="pr">
                <expect-data :showSectionData="true" ></expect-data>
              </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>

    <div class="responsible-person-container">
      <span class="responsible-person">负责人： {{responsiblePersonInfo.land_owner}}</span>
      <span class="responsible-phone">联系电话： {{responsiblePersonInfo.land_owner_tel}}</span>
    </div>

  </div>
</template>

<script>
  import echart from '../echart/index.js'
  import {mapGetters} from 'vuex'
  import request from 'api/request'
  import config from '../config/index.js'
  import expectData from 'components/expectData/'

  export default {
    props: {
      showPopDetail: {
        type: Boolean,
        default: false,
      },
      cropItem: {
          type: Array,
          default: []
      },
      cropHistoryData: {
          type: Array,
          default: []
      },
      healthyStatus: {
          type: String,
          default: '好'
      },
      landId: {
        type: Number,
        default: 0,
      },
      yieldStats: {
        type: Object,
        default: null
      },
      allLineChart: {
        type: Object,
        default: null
      },
      nearTowYear: {
        type: Object,
        default: null
      },
      popClassName: {
        type: String,
        default: ''
      },
      landCrop: {
        type: String,
        default: ''
      },
      popDetailIndex: {
        type: Number,
        default: 0,
      },
      responsiblePersonInfo: {
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
        listMenu: ['种植详情','健康状况','产量预估', '土壤数据'],
        currentIndex: 0,
        showHistory: false,
        depths: [],
        selectedDepths: 1,
        elements: {},
        tableData: [],
        value: 0,
        soilLoading: false,
        showSectionData: false
      }
    },
    computed: {
      ...mapGetters({
        getScreenHeight: 'getScreenHeight'
      })
    },
    mounted() {
      this.getConfigData()
    },
    methods: {
      getConfigData() {
        request.soilElementConfig().then((response) => {
          if (response && response.status == 200 && response.data.status === 0) {
            this.depths = this.getDepths(response.data.data.depths)
            this.elements = response.data.data.elements
          } else {
            // 
          }
        })
      },
      getDepths(depths) {
        var result = []
        for (var i = 1; i < 9; i++) {
          var name 
          if (i === 1) {
            name = `0m ~ ${depths[i] / 100}m`
          } else {
            name = `${this.getMeter(depths[i-1])}m ~ ${this.getMeter(depths[i])}m`
          }
          result.push({value: i, name})
        }

        return result
      },
      getPointData(lonlat) {
        this.soilLoading = true
        var params = {
          element_name: "ALL",
          element_depths: [this.selectedDepths],
          lon: lonlat[0],
          lat: lonlat[1] 
        }
        request.soilPointElement(params).then((response)=> {
          if (response && response.status == 200 && response.data.status === 0) {
            this.formatTableData(response.data.data)
          } else {
            // 
          }

          this.soilLoading = false
        })
      },
      formatTableData(data) {
        this.tableData = []
        for(var key in data) {
          var name = config.soil[key].name
          var unit = config.soil[key].unit
          var value = data[key][this.selectedDepths]
          var index = config.soil[key].index
          value = Number(value).toFixed(config.soil[key].fixedTo)

          this.tableData.push({name, value, unit, index})
        }
        this.tableData.sort((obj1, obj2) => obj1.index - obj2.index)
      },
      getMeter(depths) {
        var meter = Number(depths / 100).toFixed(3)
        return meter
      },
      closeDetail(){
        this.$emit('closeDetail')
      },
      menuClick(index){
        this.currentIndex = index
        this.$emit('changeLayer', index)
      },
    },
    watch: {
      popDetailIndex(index) {
        this.currentIndex = index
      },
      lonlat(lonlat) {
        this.getPointData(lonlat)
      },
      selectedDepths(value) {
        this.getPointData(this.lonlat)
      }
    },
    components: {
      expectData
    }
  }
</script>

<style 
lang="less" scoped>
@import '../../../assets/style/common';
@import '../../../assets/style/reset.less';
.top-red {
  color: #e60000;
}
.down-green {
  color: #82bd05;
}
.flat-blue {
  color: #01b8af;
}
.good {
  color: #fff;
  background: #7fb66c;
  border: 1px solid #346b19;
}
.better {
  background: #c1e079;
  border: 1px solid #619323;
}
.normal {
  background: #f6f3a0;
  border: 1px solid #b7aa00;
}
.poor {
  background: #fedc8e;
  border: 1px solid #fda02e;
}
.bad {
  color: #fff;
  background: #f07a5e;
  border: 1px solid #d00303;
}
.crop-item-chart {
  .legend-con {
    right: 10px;
    top: -67px;
  }
  .legend-con .legend {
    height: 245px;
  }
  span {
    .adv-normal-primary-btn();
    position: absolute;
    right: 77px;
    top: 5px;
    z-index: 2;
  }
}
.crop-echart {
  width: 450px;
  height: 250px;
  padding: 10px 0;
  margin-left: 20px;
  margin-bottom: 16px;
}
.item-title {
  margin: 16px 0 20px  20px;
  span {
    float: left;
    display: block;
    padding: 7px 8px;
    margin-right: 14px;
    .adv-common-border-radius();
    .adv-font-big();
  }
}
.popdetail {
  width: 514px;
  background: #fff;
  position: fixed;
  top: 400px;
  right: 0px;
  overflow: hidden;
  .adv-common-border-radius;
  .adv-boxshadow();

  .popdetail-title {
    .adv-title-normal();
    width: 100%;
    line-height: 38px;
    padding-left: 20px;
    background: #f7fcfa;
    border-bottom: 1px solid @border-color;
    em {
      margin-left: 6px;
    }
    .close-btn {
      right: 30px;
      top: 10px;
      cursor: pointer;
      &:hover {
        color: #367f05;
      }
    }
  }
  .popdetail-list {
    .popdetail-group {
      border-bottom: 1px solid @border-color;
      overflow: hidden;
      li {
        float: left;
        padding: 10px 14px;
        margin-left: 12px;
        border-bottom: 3px solid #fff;
        cursor: pointer;
        .adv-font-normal();
        &:hover {
          color: #577e00;
        }
      }
      .active,.active:hover {
        color: #9ed132;
        border-bottom: 3px solid #9ed132;
      }
    }
    .popdetail-item {
      .crop-detail {
        .item-title {
          span {
            background: #efefef;
            .adv-font-small();
          }
        }
        .history-title {
          margin-left: 20px;
          margin-bottom: 20px;
        }
        .popdetail-item-time {
            margin-left: 20px;
            .pop-hr {
              top: 2px;
              left: 5px;
              height: 170px;
              border-left: 1px solid #8abe1e;
            }
            ul {
              position: relative;
              li {
                margin-bottom: 24px;
                div {
                  display: table-cell;
                  vertical-align: middle;
                }
                .pop-icon {
                  position: relative;
                  z-index: 2;
                  background: #fff;
                   span {
                    display: block;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    border: 1px solid #8abe1e;
                   }
                   .active {
                    background: #8abe1e;
                   }
                }
                .pop-list {
                  padding-left: 12px;
                }
              }
            }
          }
      }
    }
    .output-value {
      padding-bottom: 26px;
      .output-value-title {
        margin: 16px 0 22px 20px;
        .adv-font-normal();
      }
      .output-trend {
        margin-left: 20px;
        font-size: 38px;
      }
      .output-legend {
        top: 26px;
        right: 22px;
        li {
          margin-bottom: 10px;
        }
        span {
           margin-right: 10px;
           display: inline-block;
        }
      }
    }

    .soil-data {
      .table-content {
        width: 94%;
        border-radius: 4px;
        margin: 0 3%;
        border: 1px solid #a3a3a3;
        margin-bottom: 10px;
        min-height: 150px;
        thead {
          display: block;
          width: 100%;
          border-bottom: 1px solid #a3a3a3;
          .mixin-gradient-bg(#f6f6f6;#e5e5e5);
        }
        tr {
          width: 100%;
        }
        td,th {
              text-align: center;
              height: 32px;
        }
        tbody {
          width: 100%;
          display: block;
          max-height: 200px;
          overflow-x: hidden;
          tr {
            &:nth-child(2n) {
              background: #ecf7fc;
            }
          }
        }
      }
      .soil-data-title {
        .view-index {
          font-size: 14px;
          margin: 20px;
        }
      }
      .soil-drop {
        margin: 12px 14px;
        .view-depth {
          margin-right: 10px;
        }
      }
    }
  }
  .responsible-person-container {
    .adv-text-line-height-normal();
    .adv-font-normal();
    padding: 10px 16px;
    line-height: 14px;
    border-top: 1px solid #c9c9c9;
    text-align: right;
    .responsible-phone {
      margin-left: 22px;
    }
  }
  
}  
</style>