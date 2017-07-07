<template>
  <div class="market-echart-detail ps">
    <div class="market-echart-wrap">
      <div class="pop-detail">
        <div class="market-crop-title clear">
        <span class="detail-title">{{eTableData.farm_product_name}}行情. {{eTableData.market_name}}</span>
        <div class="market-button fr">
          <span class="no-select export-excel" @click="exportExcel">导出表格&nbsp;&nbsp;<i class="iconfont icon-xiazai1 re-bj"></i></span>
        </div>
      </div>
      <div class="table-content" :style="{'width': screenWidth - 180 - menuWidth + 'px'}">
        <table class="market-table tb-detail">
          <tbody>
            <tr>
              <td class="market-td-bg" width="20%">
                <p class="market-table-title">{{eTableData.market_name}}</p>
              </td>
              <td width="15%">
                <h3 class="market-table-crop">{{eTableData.farm_product_name}}</h3>
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
                <h3>
                  <span class="market-table-compare-title">相比于{{eTableData.rateFlag}}</span>
                  <span class="market-compare">
                    <i :class="eTableData.color" style="font-size:24px;">{{eTableData.delta}}</i>
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
      </div>
      <div class="detail-echart">
        <div class="line-deatil-echart pr">
          <p class="market-legend ps"><i class="iconfont icon-tuli"></i>近七日均价</p>
          <my-echart 
            class="price-detail-chart"
            :options="options"
            :style="{'width': screenWidth - 167 - menuWidth + 'px','height': '400px'}">
          </my-echart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
 import {mapGetters} from 'vuex'
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
      this.echartWidth = document.documentElement.clientWidth || document.body.clientWidth;
      var eHeight = document.documentElement.clientHeight || document.body.clientHeight;
      this.echartHeight = eHeight;
      var sT = document.body.scrollTop || document.documentElement.scrollTop;
        sT = 0;
    },
    computed: {
    ...mapGetters({
        menuWidth: 'menuWidth',
        screenWidth: 'screenWidth',
        getScreenHeight: 'getScreenHeight'
    })},
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
  @import '../../../assets/style/common';
  .pl80 {
    padding-left: 80px;
    padding-right: 80px;
  }
  .table-content {
    margin: 0 auto;
  }
  .market-echart-detail {
    background: #f0f0f0;
    .pop-detail {
      .adv-common-border-radius();
      padding-bottom: 14px;
      background: @assistant-bg;
    }
    .detail-echart {
      .adv-common-border-radius();
      margin: 8px 0 36px;
      background: @assistant-bg;
      .line-deatil-echart {
        padding-bottom: 8px;
        border-bottom: 1px solid #eee;
      }
    }
    .market-crop-title {
      .adv-title-after-vertical-line-normal();
      font-weight: normal;
      line-height: 52px;
      height: 44px;
      padding-left: 13px;
        .detail-title{
          .adv-font-big();
        }
        .market-button {
          margin-right: 20px;
          .export-excel {
            .adv-fixed-big-primary-btn();
            .adv-font-small();
            background: #92c42c;
            color: #fff;
            height: 29px;
              i {
                  .adv-font-big();
              }
              &:hover {
                background: #7bab12;
              }
          }
        }
    }
    .market-table {
        .adv-common-border-radius();
        width: 100%;
        background: #f3fbeb;
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
              .market-table-crop{
                .adv-font-normal();
                font-weight: bold;
              }
              .market-table-price{
                .adv-font-small();
                font-weight: bold;
              }
              .market-td-bg {
                .adv-font-small();
                padding-right: 20px;
                padding-left: 20px;
                text-align: left;
                background: #f3fbeb;
              }
              .market-table-compare {
                text-align: left;
                padding-left: 60px;
                .market-table-compare-title {
                  .adv-font-small();
                  font-weight: bold;
                }
                .market-compare {
                  margin-left: 10px;
                }
                .market-green {
                      color: #6cbe7e;
                        .rate-unit {
                          .adv-font-small();
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
      .adv-font-small();
      top: 24px;
      right: 42px;
      z-index: 3;
      i {
        .adv-font-small();
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