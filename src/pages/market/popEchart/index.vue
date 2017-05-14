<template>
  <div class="market-echart-detail ps">
    <div class="market-echart-wrap pl80">
      <div class="pop-detail">
        <div class="market-crop-title clear">
        <span class="fl font16 detail-title">{{eTableData.farm_product_name}}行情. {{eTableData.market_name}}</span>
        <div class="market-button fr">
          <span class="no-select export-excel" @click="exportExcel">导出表格&nbsp;&nbsp;<i class="iconfont icon-xiazai1 re-bj"></i></span>
        </div>
      </div>
      <table class="market-table tb-detail">
        <tbody>
          <tr>
            <td class="market-td-bg" width="20%">
              <p class="market-big-title">{{eTableData.market_name}}</p>
            </td>
            <td width="15%">
              <h3 class="font14">{{eTableData.farm_product_name}}</h3>
            </td>
            <td width="25%">
              <h3 class="market-table-price">最新价格
                <i>
                  <b>{{eTableData.price}}</b>
                  元/kg
                </i>
              </h3>
            </td>
            <td width="40%" class="market-table-compare">
              <h3>相比于{{eTableData.rateFlag}}
                <span class="market-compare">
                  <i :class="eTableData.color" class="font24">{{eTableData.delta}}</i>
                  <i class="rate-unit" :class="eTableData.color">元/kg</i>
                  <span id="priceIcon" class="iconfont" :class="eTableData.image"></span>
                  <span class="change-percent" :class="eTableData.color">{{eTableData.desc}}</span>
                </span>
              </h3>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
      <div class="detail-echart">
        <div class="line-deatil-echart pr">
          <p class="market-legend ps"><i class="iconfont icon-tuli"></i>近七日均价</p>
          <my-echart 
            class="price-detail-chart"
            :options="options"
            :style="{'width': echartWidth,'height': echartHeight - 370 +'px','min-height': '400px'}">
          </my-echart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    props: {
      eTableData: {
        type: Object,
        default: {}
      },
      options: {
        type: Object,
        default: {}
      },
      baroptions: {
        type: Object,
        default: null
      },
      exportExcel: {
        type: Function
      }
    },
    data(){
      return {
        echartWidth: '',
        echartHeight: ''
      }
    },
    mounted(){
      var eWidth = document.documentElement.clientWidth || document.body.clientWidth;
      this.echartWidth = eWidth - 160 + 'px';
      var eHeight = document.documentElement.clientHeight || document.body.clientHeight;
      this.echartHeight = eHeight;
      var sT = document.body.scrollTop || document.documentElement.scrollTop;
        sT = 0;
    },
    computed: {

    },
    methods: {
    },
    components: {
    }
  }
</script>
<style 
  lang="less" 
  rel="stylesheet/less" 
  scoped>
  .pl80 {
    padding-left: 80px;
    padding-right: 80px;
  }
  .market-echart-detail {
    left: 0;
    width: 100%;
    background: #f0f0f0;
    .pop-detail {
      padding-bottom: 14px;
      border-radius: 4px;
      background: #fff;
    }
    .detail-echart {
      margin: 8px 0 36px;
      background: #fff;
      border-radius: 4px;
      .line-deatil-echart {
        padding-bottom: 8px;
        border-bottom: 1px solid #eee;
      }
    }
    .market-crop-title {
      position: relative;
      line-height: 52px;
      height: 44px;
      padding-left: 28px;
        .market-button {
          margin-right: 26px;
          .export-excel {
            line-height: 28px;
            display: inline-block;
            width: 90px;
            height: 28px;
            margin-top: 20px;
            cursor: pointer;
            text-align: center;
            background: #92c42c;
            color: #fff;
            border-radius: 4px;
              i {
                  font-size: 16px;
              }
              &:hover {
                background: #7bab12;
              }
          }
      }
      &:before {
        position: absolute;
        left: 14px;
        top: 14px;
        width: 5px;
        height: 26px;
        content: '';
        display: inline-block; 
        background: #9ed132;
      }
    }
    .market-table {
        width: 96%;
        margin: 0 20px 0px;
        background: #f3fbeb;
        border-radius: 4px;
        overflow: hidden;
          tr {
            position: relative;
              td {
                  height: 54px;
                  text-align: center;
                    i {
                        margin-left: 10px;
                        color: #f7a302;
                          b {
                              font-size: 22px;
                          }
                    }
              }
              .market-td-bg {
                padding-right: 20px;
                padding-left: 20px;
                text-align: left;
                background: #f3fbeb;
              }
              .market-table-compare {
                text-align: left;
                padding-left: 60px;
                  .market-compare {
                    margin-left: 10px;
                }
                .market-green {
                      color: #6cbe7e;
                        .rate-unit {
                          font-size: 12px;
                      }
                  }
                   .market-red {
                    color: #e96678;
                   }
                   .market-blue {
                    color: #24b5b0;
                   }
              }
        }
    }
    .market-legend {
      z-index: 3;
      font-size: 12px;
      top: 24px;
      right: 42px;
      i {
        font-size: 12px;
        margin-right: 6px;
        color: #6688da;
      }
    }
  }
  .chart-none-data {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: 50%;
    display: none;
    width: 216px;
    height: 90px;
    margin-top: -45px;
    margin-left: -108px;
    background: url(/static/assets/img/common/no-data.png) no-repeat;
  }
</style>