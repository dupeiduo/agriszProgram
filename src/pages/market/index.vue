<template>
  <div class="market">
    <div class="menu">
      <ul class="market-list">
        <li v-for="(menu, index) in menus" 
          :class="menuIndex === index ? 'active': ''" 
          @click="menuClick(index)">{{menu}}</li>
      </ul>

      <div v-if="menuIndex === 0 && !showPriceMain" class="bread-crumb pr" style="background: #fff">
        <span class="bread-main" @click="showPriceMain=true">全国{{mainBread}}</span>
        <span class="bread-sub" :style="{color: '#10ad33'}">&nbsp;&nbsp;&gt;&nbsp;&nbsp;{{subBread}}</span>
        <i class="go-back" @click="showPriceMain=true">返回</i>
      </div>
      <div v-if="menuIndex === 1" class="bread-crumb" style="background: #fff">
        <span class="bread-main-market" @click="showPriceMain=true">市场信息</span>&nbsp;&nbsp;&gt;&nbsp;&nbsp;
        <span class="bread-sub" :class="showNewsMain ? '' : 'bread-main'" :style="{color: !showNewsMain ? '#9b9b9b': '#10ad33'}" @click="showNewsMain=true">资讯</span>
        <span v-if="!showNewsMain" :style="{color: '#10ad33'}" class="bread-third">&nbsp;&nbsp;&gt;&nbsp;&nbsp;正文</span>

        <i class="go-back" @click="newsBack">返回</i>
      </div>
      <hr class="hr-bold pf" v-if="(menuIndex === 0 && !showPriceMain) || menuIndex === 1" 
      :style="{'top':'149px','z-index':4}">
    </div>

    <div v-if="menuIndex === 0" class="price">
      <div v-if="showPriceMain" class="price-main">
        <div v-if="cropIndex >= 0">
          <div class="select-bg">
             <div class="crops clear" v-loading.lock="cropLoading">
              <p class="fl">选择农产品:</p>
              <my-button 
                :buttons="cropBtns" 
                @btnClick="cropClick"
                :curIndex="cropIndex"
                ></my-button>
            </div>
            <div class="areas clear"  v-loading.lock="areaLoading">
              <p class="fl">选择地区:</p>
              <my-button 
                :buttons="areaBtns" 
                @btnClick="areaClick"
                :curIndex="areaIndex"
                :showTip="true"
                :showCount="true"
                tipField="is_exist"
                :field="'area_name'" 
                ></my-button>
            </div>
          </div>
          <div class="markets"  v-loading.lock="marketLoading">
            <market-table 
              :tableData="tableData" 
              :changeEchart="showPriceDetail"
              v-loading.lock="tbLoading"
              :showNoData="showNoData"
              class="mt15">
            </market-table>
            <el-pagination
               small
               class="market-pager"
               layout="prev, pager, next"
               :current-page="pageIndex"
               :page-size="pageCount"
               :page-count="totalPage"
               @current-change ="changePage">
            </el-pagination>
              <div class="price-line pr">
              <p class="crop-title">全国{{cropBtns[cropIndex].name}}价格走势</p>
              <p class="market-legend ps"><i class="iconfont icon-tuli"></i>近七日均价</p>
              <div class="chart-none-data" id="chart-none-data"></div>
              <my-echart 
                class="crop-chart" 
                :options="chartData" 
                :style="{'width': eWidth}"
                v-loading.lock="lineLoading"
                ></my-echart>
            </div>

            <div class="price-bar pr">
              <p class="crop-title">全国{{cropBtns[cropIndex].name}}价格分布</p>
              <p class="market-legend ps"><i class="iconfont icon-block"></i>近七日均价</p>
              <div class="chart-none-data" id="chart-none-data"></div>
              <my-echart 
                class="price-chart" 
                :options="barchartData" 
                :style="{'width': eWidth}"
                v-loading.lock="barLoading"
                ></my-echart>
            </div>
          </div>
        </div>
          
      </div>

      <div v-else class="price-detail">
        <pop-echart
          :eTableData="popTbData"
          :options="detChart"
          :baroptions="bardetChart"
          :exportExcel="exportExcel"
          v-loading.lock="popLoading"
          >  
        </pop-echart>
      </div>
    </div>

    <div v-else class="news">
      <div v-if="showNewsMain" class="news-main">
        <div class="market-content-report">
          <p class="market-content-p">
            <span class="market-report-block ps"></span>
            简报
            <el-breadcrumb separator="" class="report-more ps">
              <el-breadcrumb-item :to="{ path: 'report' }">查看全部</el-breadcrumb-item>
               <el-breadcrumb-item></el-breadcrumb-item>
            </el-breadcrumb>
          </p>
          <hr class="hr-bold">
          <report-list
            :reportContent="reportContent" 
          ></report-list>
        </div>

        <div class="news-list">
          <p class="market-content-p">
            <span class="market-report-block ps"></span>
            资讯
          </p>
          <hr class="hr-bold">
          <market-news v-if="newsList.length > 0"
            :newsList="newsList" 
            :newsContent="newsContent" 
            @scrollToBottom="scrollToBottom">
          </market-news>
          <h3 v-else-if="newsList.length == 0 && popLoading" style="text-align:center">－暂无数据－</h3>
        </div>
      </div>

      <div v-else class="news-detail">
        <pop-news :backNews="backNews" :popNewsData ="popNewsData"></pop-news>
      </div>
    </div>

    <footerLite></footerLite>
  </div>
</template>

<script>
import request from 'api/request.js'
import format from 'api/model.js'
import exReq from 'api/exclusiveRequest.js'
import popNews  from 'pages/market/popNews/'
import marketNews  from 'pages/market/marketNews/'
import marketTable  from 'pages/market/marketTable/'
import popEchart  from 'pages/market/popEchart/'
import reportList from 'components/reportList/'
import chart from './echart/index.js'
import configData from '../../config/data.js'
import footerLite from 'components/footerlite/'

  export default {
    data() {
      return {
        eWidth: '',
        dataType: '',

        menus: ["市场行情", "资讯简报"],
        menuIndex: 0,
        showPriceMain: true,
        showNewsMain: true,
        mainBread: "",
        subBread: "",

        cropBtns: [],
        cropIndex: -1,
        cropLoading: false,

        areaBtns: [],
        areaIndex: -1,
        areaLoading: false,

        tableData: [],
        tbIndex: -1,
        tbLoading: false,

        popTbData: null,
        detChart: null,
        bardetChart: null,
        popLoading: false,

        markets: [],
        marketIndex: -1,
        marketLoading: false,

        lineLoading: false,
        barLoading: false,

        chartData: null,
        barchartData: null,

        lineNoData: false,
        barNoData: false,

        pageSize: 20,
        pageCount: 6,
        pageIndex: 1,
        totalPage: 0,


        reportContent: [],
        section: 'market_info',

        newsList: [],
        newsIndex: 1,

        newsContext: [],

        popNewsData: [],

        showNoData: false,
      }
    },
    mounted() {
      this.getCrops();
      var eWidth = document.documentElement.clientWidth || document.body.clientWidth;
      this.eWidth = (eWidth - 196) + 'px';

      this.dataType = configData.market.dateType.value;
    },
    methods: {
      menuClick(index) {
        this.menuIndex = index
        if (index === 0) {
          this.showPriceMain = true
        } else {
          this.showNewsMain = true
        }
      },
      newsBack() {
        if (this.showNewsMain) {
          this.menuIndex = 0
        } else {
          this.showNewsMain = true
        }
      },
      cropClick(index) {
        this.cropIndex = index
      },
      areaClick(index) {
        this.areaIndex = index
      },
      getCrops() {
        request.cropList().then((data) => {
          this.cropBtns = data.data.data;
          this.cropIndex = 0
        })
      },
      getAreas(index) {
        var cropId = this.cropBtns[index].id
        this.areaLoading = true;
        request.existMarketInProvince(this.dataType, cropId).then((data) => {
          this.areaLoading = false;
          this.areaBtns = format.formatAllMarkets(data.data)
          this.areaIndex = 0
        })
      },
      getMarkets() {
        if (this.cropIndex < 0 || this.areaIndex < 0) {
          return
        }
        var areaId = this.areaBtns[this.areaIndex].area_id,
          cropId = this.cropBtns[this.cropIndex].id
        var options = {
          areaId: areaId,
          cropId: cropId,
          dateType: this.dataType,
          pageIndex: this.pageIndex,
          pageCount: this.pageCount
        }
        
        this.tbLoading = true;
        
        if (this.cancelHandler && this.cancelHandler.cancelRequest) {
          this.cancelHandler.cancelRequest("cancel request")
          this.cancelHandler = null
        }
        this.cancelHandler = request.marketPriceInfo(options)
        
        this.cancelHandler.then((requestData) => {          
          this.tbLoading = false
          this.showNoData = true
          this.cancelHandler = null
          var formated = format.formatMarketInfo(requestData.data.data);
          this.tableData = formated.data;
          this.totalPage = formated.totalPage;
        }).catch((err) => {
          console.log(err)
        })
      },
      changePage(index) {
        this.pageIndex = index
        this.getMarkets()
      },
      initLineChart(index) {
        var options = {
          fpId: this.cropBtns[index].id,
          dateType: this.dataType
        }
        var cropName = this.cropBtns[index].name;
        this.lineLoading = true;
        request.lineAveragePrice(options).then((requestData) => {
          this.lineLoading = false;
          if (requestData.status != 200 || requestData.data.status != 0) {
            this.lineNoData = true
          } else {
            var formated = format.formatMarketLine(requestData.data);
            this.chartData = chart.lineChart(formated.xAxis, formated.yAxis, formated.maxPrice, cropName, formated.minPrice);
            this.lineNoData = false
          }
        });
      },
      initBarChart(index) {
        var options = {
          fpId: this.cropBtns[index].id,
          dateType: this.dataType
        }
        var cropName = this.cropBtns[index].name;
        this.barLoading = true;
        request.barAveragePrice(options).then((requestData) => {
          this.barLoading = false;
          if (requestData.status != 200 || requestData.data.status != 0) {
            this.barNoData = true
          } else {
            var formated = format.formatMarketBar(requestData.data);
            this.barchartData = chart.barChart(formated.xAxis, formated.yAxis, cropName)
            this.barNoData = false
          }
        });
      },
      showPriceDetail(index) {
        this.showPriceMain = false
        this.tbIndex = index;

        this.popTbData = this.tableData[index];
        this.subBread = this.tableData[index].market_name;
        this.detailChart();
      },
      detailChart() {
        var options = {
          fpId: this.cropBtns[this.cropIndex].id,
          marketId: this.tableData[this.tbIndex].market_id,
          dateType: this.dataType
        }
        var cropName = this.cropBtns[this.cropIndex].name;
        this.popLoading = true;
        request.cropSingleLine(options).then((requestData) => {
          this.popLoading = false;
          if (requestData.status != 200 || requestData.data.status != 0) {
            console.log(requestData.error_msg);
          } else {
            var formated = format.formatPriceLine(requestData.data);
            this.detChart = chart.detailChart(formated.xAxis, formated.yAxis, formated.startDate, formated.endDate, formated.maxPrice, cropName, formated.minPrice);
          }
        });
      },
      exportExcel() {
        var options = {
          fpId: this.cropBtns[this.cropIndex].id,
          marketId: this.tableData[this.tbIndex].market_id,
          dateType: this.dataType,
          fileName: this.tableData[this.tbIndex].market_name + this.cropBtns[this.cropIndex].name + '价格信息'
        }
        request.dlPriceExcel(options);
      },
      getReport(perPage, curPage) {
        var formated = format.formatReports,
          params = new FormData();
        params.append('section', this.section);
        params.append('perPage', perPage);
        params.append('curPage', curPage);
        request.sectionRepor(params).then((requestData) => {
          if (requestData.data.total && requestData.data.total > 0) {
            this.reportContent = formated(requestData.data);
          }
        })
      },
      backNews() {
        this.showNewsMain = true
      },
      newsContent(index) {
        this.showNewsMain = false
        this.popNewsData = this.newsContext[index];
        this.menuPopTitle = "正文"
      },
      getNewsList(pageIndex) {
        var formated = format.formatMarketNews,
          params = new FormData();
        params.append('perPage', this.pageSize);
        params.append('curPage', pageIndex);
        request.marketNews(params).then((newsData) => {
          this.total = newsData.data.total;
          var newsData = formated(newsData.data);
          if (pageIndex == 1) {
            this.newsList = newsData.data
            this.newsContext = newsData.content;
          } else {
            this.newsContext = this.newsContext.concat(newsData.content)
            this.newsList = this.newsList.concat(newsData.data)
          }
        })
      },
      scrollToBottom() {
        if (this.total && this.total <= this.pageSize * this.newsIndex) {
          return
        } else {
          this.newsIndex += 1;
          this.getNewsList(this.newsIndex)
        }
      },
    },
    watch: {
      cropIndex(index) {
        this.mainBread = this.cropBtns[index].name + '价格行情'

        this.getAreas(index);
        this.getMarkets();
        this.initLineChart(index)
        this.initBarChart(index)
      },
      areaIndex(index) {
        this.getMarkets()
      },
      menuIndex(index) {
        if (index !== 0) {
          this.getReport(1,1)
          this.getNewsList(this.newsIndex);
          this.$router.push('/market?target=news')
        }
      },
      showPriceMain(show) {
        if (show) {
          this.$router.push('/market?target=price')
        } else {
          this.$router.push('/market?target=pricedetail')
        }
      },
      showNewsMain(show) {
        if (show) {
          this.$router.push('/market?target=news')
        } else if (this.menuIndex === 1 ) {
          this.$router.push('/market?target=detail')
        }
      },
      $route:{
        handler: function (route) {
          var query = route.query
          if (query.target === 'detail') {
            if (this.popNewsData) {
              this.menuIndex = 1
              this.showNewsMain = false
            } else {
              this.$router.push("/market?target=news")
            }
          } else if (query.target === 'news') {
            if (this.newsList) {
              this.menuIndex = 1
              this.showNewsMain = true
            } else {
              this.$router.push("/market?target=price")
            }
          } else if (query.target === 'pricedetail') {
            if (this.popTbData) {
              this.menuIndex = 0
              this.showPriceMain = false
            } else {
              this.$router.push("/market?target=price")
            }
          } else if (query.target === 'price') {
            this.menuIndex = 0
            this.showPriceMain = true
          }
        },
        immediate: true
      }
    },
    components: {
      footerLite,
      popEchart,
      reportList,
      marketNews,
      marketTable,
      popNews
    }
  }
</script>
<style 
lang="less" scoped>
@import '../../assets/style/reset';
.market {
    height: auto;
    padding-top: @top;
    background: #f0f0f0;
  .menu {
    .market-list {
      z-index: 4;
        position: fixed;
        width: 100%;
        padding-left: 80px;
        border-bottom: 5px solid #9ed132;
        background: #fff;
        .active,.active:hover {
          color: #fff;
          background: #9ed132;
        }
        li {
          font-size: 14px;
          float: left;
          padding: 20px 22px;
          cursor: pointer;
          color: #434343;
          &:hover {
            background: #eafcd5;
          }
        }
    }

    .bread-crumb {
      z-index: 2;
      position: fixed;
      top: 112px;
      background: #f0f0f0;
      width: 100%;
      padding: 14px 80px;
      color: #9b9b9b;

      span:last-child {
        color: #10ad33;
        cursor: default;
      }

      .bread-main,.bread-main-market {
        &:hover{
          text-decoration: underline;
        }
      }
      .bread-main-market {
        cursor: default;
      }
      .bread-main {
        cursor: pointer;
      }
      .go-back {
        color: #fff;
        position: absolute;
        top: 10px;
        right: 242px;
        background: #92c42c;
        padding: 3px 10px;
        border-radius: 2px;
        z-index: 10;
        cursor: pointer;
      }
    }
  }

  .price {
    .price-main {
      .areas {
        height: 144px;
      }
    }
    padding: 109px 80px 0;
    .select-bg {
      border-radius: 4px;
      background: #fff;
      overflow: hidden;
      div {
        margin: 10px 14px 0;
        p {
          line-height: 24px;
          margin-right: 15px;
        }
      }
      .crops {
        border-bottom: 2px solid #dcdcdc;
      }
    }
    .price-line {
      .crop-chart,.price-chart {
        position: relative;
        width: 600px;
        margin: 0 18px;
        height: 524px;
        padding-bottom: 10px;
        .mixin-border(#dcdcdc;4px);
      }
    }

    .price-bar {
      .price-chart {
        position: relative;
        width: 600px;
        margin: 0 18px;
        height: 395px;
        .mixin-border(#dcdcdc;4px);
      }
    }
  }
  .news {
    background: #fff;
    .news-main {
      position: relative;
      top: 118px;
      width: 742px;
      margin: 0 auto 30px;
      .market-content-report {
        padding-bottom: 20px;
      }
      .market-content-p {
          font-size: 14px;
          position: relative;
          padding-left: 12px;
          color: #125f6d;
          .mixin-height(30px);
            .market-report-block {
              top: 0;
              left: 0;
              width: 3px;
              height: 30px;
              background: #9dd2da;
          }
          .report-more {
            font-size: 14px;
              right: 0;
              top: 10px;
              cursor: pointer;
              color: #125f6d
          }
        }
      .market-content-report {
        .report-list {
          padding: 0;
          .report-single {
            width: 100%;
          }
        }
      }
    }
    
    .news-detail {
      position: relative;
      top: 92px;
    }
  }
  .markets {
    margin: 8px 0 36px;
    padding-bottom: 20px;
    background: #fff;
    border-radius: 4px;
  }
  .market-pager {
    width: 100%;
    padding: 0 0 10px;
    border-bottom: 1px solid #dcdcdc;
    text-align: center;
  }
  .crop-title {
    line-height: 56px;
    font-size: 16px;
    padding-left: 26px;
    &:before {
      position: absolute;
      left: 14px;
      top: 14px;
      width: 5px;
      height: 26px;
      content: "";
      display: inline-block;
      background: #9ed132;
    }
  }
  .market-legend {
    z-index: 3;
    font-size: 12px;
    top: 77px;
    right: 42px;
    i {
      font-size: 12px;
      margin-right: 6px;
      color: #6688da;
    }
  }
}
.hr-bold {
  width: 100%;
  border: 1px solid #e5e5e5;
}
</style>