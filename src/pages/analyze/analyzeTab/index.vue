<template>
  <div class="al-wrap-tb">
    <table class="al-tb">
          <thead class="table-title">
            <tr>
              <td><i class="iconfont icon-riqi icon-data"></i> 日期</td>
              <td><i class="iconfont icon-pingjia icon-pj"></i> 评价</td>
              <td><i class="iconfont icon-icon11-copy-copy-copy icon-port"></i> 环比</td>
              <td>详情</td>
            </tr>
          </thead>
          <tbody class="al-tb-tbody" :data-key="type">
            <tr v-for="(item, index) in tabData">
                <td>{{item.date}}</td>
                <td :class="`al-status-color${item.levelClass}`">{{item.level}}</td>
                <td>{{item.compare}}<span class="iconfont" :class="item.className"></span></td>
                <td class="show-pie" >
                  <span class="iconfont icon-bingtu compare-all"
                        @mouseover="showEchart(index)"
                        @mouseout="hideEchart"
                  ></span>
                </td>
            </tr>
          </tbody>
          <tbody v-show="tabData.length == 0" class="al-nonedata none-data" >暂无数据</tbody>
    </table>
    <div class="statistics" id="statistics">
        <my-echart class="analyze-statistics pr" :options="option"></my-echart>
    </div>
  </div>
</template>

<script>
  import echart from '../echart/index.js'
  import configData from '../../../config/data.js'
  export default {
    props: {
      tabData: {
        type: Array,
        default: [],
      },
      options: {
        type: Array,
        default: null
      },
      type: {
        type: String,
        default: ''
      }
    },
    data() {
        return {
          statistics: null,
          option: {}
        }
      },
      mounted() {
       this.statistics = document.getElementById('statistics');
      },
      methods: {
        showEchart(index){
          var y = event.clientY
          var x = event.clientX - 280
          this.statistics.style.top = `${y}px`
          this.statistics.style.left = `${x}px`
          this.statistics.style.display = 'block'
          var config = configData
          var levelObject = this.options[index]
          var type = this.type.toString().remove('-5')
          var _pieData = [];
          for(var item in levelObject) {
            if (item == 'misc') break;
            levelObject[item].a;
            levelObject[item].p;
            var dataItem = {
              name: config.productLegendConf[type][item].name, 
              value: levelObject[item].a
            }
            _pieData.push(dataItem);
          }
          this.option = echart.getPie(_pieData)
        },
        hideEchart(){
          this.statistics.style.display = 'none'
        }
      },
      components: {
      }
  }
</script>
<style 
    lang="less"
    rel="stylesheet/less"
    scoped>
    .al-tb {
      width: 100%;
        td {
          position: relative;
          width: 26%;
          height: 30px;
          text-align: center;
        }
        .table-title {
          font-size: 14px !important;
            tr {
              td {
                height: 45px;
                border-bottom: 1px solid #d2d2d2;
                    .icon-data {
                            color: #4991b9;
                        }
                     .icon-pj {
                          color: #e68c9e;
                      }
                     .icon-port {
                          color: #dea955;
                      }
                      i {
                          font-size: 24px !important;
                          position: relative;
                          top: 4px;
                          display: inline-block;
                          width: 32px;
                          height: 22px;
                      }
              }
            }
        }
        .al-tb-tbody {
          tr:nth-child(2n+1) {
              background: #f7f7f7;
          }
          tr:nth-child(2n) {
              background: #f2f2f2;
          }
          tr {
              height: 33px;
              border-bottom: 1px solid #fff;
                .al-status-color1-true {
                    color: #d16514;
                }
                .al-status-color2-true {
                    color: #6fb011;
                }
                .al-status-color3-true {
                    color: #e0b300;
                }
                .al-status-color4-true {
                    color: #e98c04;
                }
                .al-status-color5-true {
                    color: #56b515;
                }
                .al-status-color1-false {
                    color: #efc836;
                }
                .al-status-color2-false {
                    color: #a7a502;
                }
                .al-status-color3-false {
                    color: #f96b82;
                }
                .al-status-color4-false {
                    color: #d64628;
                }
                .al-status-color5-false {
                    color: #a63722;
                }
                td {
                    .compare-all {
                        font-size: 16px !important;
                        position: absolute;
                        top: 8px;
                        left: 50%;
                        width: 18px;
                        height: 18px;
                        margin-left: -9px;
                        color: #b5b5b5;
                      }
                      .evaluat-top {
                        color: #e96979;
                      }
                      .evaluat-bottom {
                        color: #90c131;
                      }
                      .evaluat-level {
                        color: #3fb4b0;
                      }
                      span {
                          position: absolute;
                          top: 8px;
                          left: 70%;
                          width: 10px;
                          height: 14px;
                        }
                }
          }
        }
        .al-nonedata {
          width: 400%;
          display: block;
          line-height: 50px;
        }
    }
    .statistics {
      position: fixed;
      z-index: 300;
      right: 170px;
      display: none;
      width: 250px;
      height: 200px;
      border-radius: 5px;
      background: #fff;
      -webkit-box-shadow: 4px 0 3px #e5e5e5;
      -moz-box-shadow: 4px 0 3px #e5e5e5;
      box-shadow: 4px 0 3px #e5e5e5;
        .analyze-statistics {
          top: 10px;
          left: 10px;
          width: 230px;
          height: 160px;
      }
  }
</style>