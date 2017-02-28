<template>
  <div class="market-echart-detail ps">
  <div class="market-echart-wrap pl80">
    <div class="market-crop-title clear">
      <span class="fl font16 detail-title">{{eTableData.farm_product_name}}行情. {{eTableData.market_name}}</span>
      <div class="market-button fr">
        <span class="no-select export-excel" @click="exportExcel">导出表格<i class="iconfont icon-xiazai1 re-bj"></i></span>
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
    <p class="market-legend ps">周平均价格</p>
    <my-echart 
       class="price-detail-chart"
      :options="options"
      :style="{'width': echartWidth}">
  </my-echart>
    <div class="price-detail-chart" :style="{'width': echartWidth}">
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
      exportExcel: {
        type: Function
      }
    },
    data(){
      return {
        echartWidth: '',
      }
    },
    mounted(){
      var eWidth = document.documentElement.clientWidth || document.body.clientWidth;
      this.echartWidth = eWidth - 160 + 'px';
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
    top: 116px;
    left: 0;
    display: none;
    width: 100%;
    background: #fff;
      .market-crop-title {
        line-height: 44px;
        height: 44px;
        padding-left: 20px;
        border-top: 1px solid #d7d7d7;
        border-right: 1px solid #d7d7d7;
        border-left: 1px solid #d7d7d7;
        background: #f5fbe4;
          .market-button {
            margin-top: -7px;
            margin-right: 7px;
            .export-excel:hover {
              background: #cce38a;
            };
            .export-excel {
              line-height: 30px;
              display: inline-block;
              width: 116px;
              height: 30px;
              margin: 14px 0 0 60px;
              cursor: pointer;
              text-align: center;
              background: #dceab5;
                i {
                    font-size: 16px;
                    line-height: 30px;
                    display: inline-block;
                    float: right;
                    width: 30px;
                    height: 30px;
                    text-align: center;
                    color: #798558;
                    background: #dbecb5;
                }
            }
        }
      }
      .market-table {
          width: 100%;
            tr {
              position: relative;
              cursor: pointer;
              border: 1px solid #d7d7d7;
              border-top: 1px solid #fff;
                td {
                    height: 74px;
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
                  background: #fff;
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
          line-height: 24px;
          top: 134px;
          right: 126px;
          width: 100px;
          height: 24px;
          text-align: center;
          border: 1px solid #d7d7d7;
          background: #fff;
      }
      .market-legend:before {
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-top: -3px;
        margin-right: 4px;
        content: '';
        vertical-align: middle;
        border-radius: 50%;
        background: #61d4fb;
    }
    .price-detail-chart {
      height: 350px;
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