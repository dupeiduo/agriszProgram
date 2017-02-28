<template>
  <div class="market-wrap clear">
    <ul class="market-list">
      <li :class="menuBtnCtl == '' ? 'on': ''" @click="clickMarket">市场行情</li>
      <li :class="menuBtnCtl == 'active' ? 'on': ''" @click="clickNews">资讯简报</li>
    </ul>
    <p class="market-title">
		<a class="first-nav" href="#">市场信息</a>
		<a @click="backMarket">&nbsp;&nbsp;&gt;&nbsp;&nbsp;{{subTitle}}</a>
		<a v-if="showMenu">&nbsp;&nbsp;&gt;&nbsp;&nbsp;{{menuPopTitle}}</a>
	</p>
    <div class="market-price pr" v-show="menuBtnCtl == ''">
    <div v-show="ctlEchart">
    		<market-section :sectionTitle="sectionTitle='选择农产品'">
    			<div slot="section-content">
    				<div>
    					<my-button 
    					:buttons="cropList" 
    					@btnClick="clickCrops"
    					:curIndex="cropsIndex"
              class="btn-top"
    					></my-button>
    				</div>
    				<div class="market-video-echart pr">
    					<p class="market-echart-switch ps"
    						@click="isLineChart = !isLineChart">
    						切换产品视图
    						<i class="iconfont"
    							:class="isLineChart ? 'icon-iconfontcolor58' : 'icon-zhuzhuangtu'"></i>
    					</p>
    					<p class="market-legend ps">周平均价格</p>
    					<div class="chart-none-data" id="chart-none-data"></div>
    					<my-echart 
    						id="price-chart" 
    						:options="chartData" 
    						:style="{'width': eWidth}"
    						v-loading.body="chartLoading"
    						></my-echart>
    				</div>
    			</div>
    		</market-section>
    		<market-section :sectionTitle="sectionTitle='选择市场'" class="mt15">
    			<div slot="section-content">
    				<my-button 
    				:buttons="areaButtons" 
    				:field="'area_name'" 
    				@btnClick="clickArea"
    				:curIndex="areaIndex"
    				id="market-item"
            :showTip="true"
            :showCount="true"
            tipField="is_exist"
            class="btn-top"
    				></my-button>
    				<market-table 
    					:tableData="tableData" 
    					:changeEchart="showPriceDetail"
    					v-loading.body="tbLoading"
    					></market-table>
    				<el-pagination
    				class="market-pager"
    				layout="prev, pager, next"
    				:current-page="pageIndex"
    				:page-size="pageCount"
    				:page-count="totalPage"
    				@current-change ="changePage"
    				>
    			</el-pagination>
    		</div>
    	</market-section>
    </div>
    	<pop-echart id="showEchart" 
    		:eTableData="popTbData"
    		:options="detChart" 
    		:exportExcel="exportExcel"
        v-loading.body="popLoading"
    		></pop-echart>
    </div>
<!--     <p class="market-title market-auto">
        <a href="">市场信息&nbsp;&nbsp;&gt;&nbsp;&nbsp;</a>
        <a href="#">资讯简报</a>
	</p> -->
    <div class="market-list-wrap" v-show="menuBtnCtl == 'active'">
    	<div class="market-content-contain" v-show="popCtl">
			<hr class="hr-bold">
			<div class="market-content-report">
				<p class="market-content-p">
					<span class="market-report-block ps"></span>
					简报
					<el-breadcrumb separator="" class="report-more ps">
						<el-breadcrumb-item :to="{ path: 'report' }">查看全部</el-breadcrumb-item>
					 	 <el-breadcrumb-item></el-breadcrumb-item>
					</el-breadcrumb>
				</p>
				<hr>
				<report-list
					:reportContent="reportContent" 
				></report-list>
			</div>
			<div class="market-content-news">
				<p class="market-content-p"><span class="market-report-block ps"></span>资讯</p>
				<hr>
				<market-news v-if="newsList.length > 0"
          :newsList="newsList" 
          :newsContent="newsContent" 
          @scrollToBottom="scrollToBottom"></market-news>
        <h3 v-else style="{text-align:center;}">－暂无数据－</h3>
			</div>
    	</div>
    	<pop-news  id="showPop" :backNews="backNews" :popNewsData ="popNewsData"></pop-news>
    </div>
  </div>
</template>

<script>
  import request from 'api/request.js'
  import format from 'api/model.js'
  import marketContent  from 'pages/market/menuBtn/'
  import popNews  from 'pages/market/popNews/'
  import marketSection  from 'pages/market/marketSection/'
  import marketNews  from 'pages/market/marketNews/'
  import marketTable  from 'pages/market/marketTable/'
  import popEchart  from 'pages/market/popEchart/'
  import reportList from 'components/reportList/'
  import chart from '../echart/index.js'
  import configData from '../../../config/data.js'

  export default {
    data() {
        return {
          menuBtnCtl: '',
          reportContent: [],
          section: 'market_info',
          newsList: [],
          pageSize: 20,
          pageIndex: 1,
          newsIndex: 1,
          popCtl: true,
          popNewsData: {},
          newsContext: [],
          areaButtons: [],
          pageCount: 6,
          tableData: [],
          cropList: [],
          cropsIndex: -1,
          areaIndex: -1,
          ctlEchart: true,
          popTbData: {},
          popLoading: false,
          chartData: null,
          chartLoading: false,
          isLineChart: true,
          showMenu: false,
          eWidth: '',
          cropId: '',
          totalPage: -1,
          detChart: {},
          subTitle: '',
          menuPopTitle: '',
          dataType: '',
          tbIndex: -1,
          tbLoading: false
        }
      },
      mounted() {
        this.getCrops();
        var eWidth = document.documentElement.clientWidth || document.body.clientWidth;
        this.eWidth = (eWidth - 160) + 'px';

        this.dataType = configData.market.dateType.value;
      },
      methods: {
        initLineChart(index) {
          var options = {
            fpId: this.cropList[index].id,
            dateType: this.dataType
          }
          var cropName = this.cropList[index].name;
          this.chartLoading = true;
          request.lineAveragePrice(options).then((requestData) => {
            this.chartLoading = false;
            if (requestData.status != 200 || requestData.data.status != 0) {
              document.getElementById('chart-none-data').style.display = 'block';
            } else {
              var formated = format.formatMarketLine(requestData.data);
              this.chartData = chart.lineChart(formated.xAxis, formated.yAxis, formated.maxPrice, cropName);
              document.getElementById('chart-none-data').style.display = 'none';
            }
          });
        },
        initBarChart(index) {
          var options = {
            fpId: this.cropList[index].id,
            dateType: this.dataType
          }
          var cropName = this.cropList[index].name;
          this.chartLoading = true;
          request.barAveragePrice(options).then((requestData) => {
            this.chartLoading = false;
            if (requestData.status != 200 || requestData.data.status != 0) {
              document.getElementById('chart-none-data').style.display = 'block';
            } else {
              var formated = format.formatMarketBar(requestData.data);
              this.chartData = chart.barChart(formated.xAxis, formated.yAxis, cropName)
              document.getElementById('chart-none-data').style.display = 'none';
            }
          });
        },
        detailChart() {
          var options = {
            fpId: this.cropList[this.cropsIndex].id,
            marketId: this.tableData[this.tbIndex].market_id,
            dateType: this.dataType
          }
          var cropName = this.cropList[this.cropsIndex].name;
          this.popLoading = true;
          request.cropSingleLine(options).then((requestData) => {
            this.popLoading = false;
            if (requestData.status != 200 || requestData.data.status != 0) {
              document.getElementById('chart-none-data').style.display = 'block';
              console.log(requestData.error_msg);
            } else {
              var formated = format.formatPriceLine(requestData.data);

              this.detChart = chart.detailChart(formated.xAxis, formated.yAxis, formated.startDate, formated.endDate, formated.maxPrice, cropName);
              document.getElementById('chart-none-data').style.display = 'none';
            }
          });
        },
        clickMarket() {
          this.subTitle = this.cropsIndex >= 0 ? this.cropList[this.cropsIndex].name + '价格行情' : '价格行情'
          this.menuBtnCtl = '';
          document.getElementById('showEchart').style.display = 'none';
          this.ctlEchart = true;
          this.showMenu = false
        },
        backMarket() {
          document.getElementById('showEchart').style.display = 'none';
          document.getElementById('showPop').style.display = 'none';
          this.ctlEchart = true;
          this.showMenu = false;
          this.popCtl = true;
        },
        clickNews() {
          this.subTitle = '资讯简报'
          this.menuBtnCtl = 'active';
          this.getReport(1, 1);
          this.getNewsList(this.newsIndex);
          this.popCtl = true;
          this.showMenu = false;
          document.getElementById('showPop').style.display = 'none'
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
        newsContent(index) {
          this.popCtl = false;
          document.getElementById('showPop').style.display = 'block';
          this.popNewsData = this.newsContext[index];

          this.showMenu = true
          this.menuPopTitle = "正文"
        },
        backNews() {
          this.popCtl = true;
          this.showMenu = false;
          this.popCtl = true;
          document.getElementById('showPop').style.display = 'none'
        },
        getArea() {
          var cropId = this.cropList[this.cropsIndex].id
          request.existMarketInProvince(this.dataType, cropId).then((data) => {
            this.areaButtons = format.formatMarkets(data.data)
            this.areaIndex = 0
          })
        },
        getCrops() {
          request.cropList().then((data) => {
            this.cropList = data.data.data;
            this.cropsIndex = 0
          })
        },
        clickCrops(index) {
          this.cropsIndex = index;
        },
        clickArea(index) {
          this.areaIndex = index;
        },
        getMarkets() {
          if (this.cropsIndex < 0 || this.areaIndex < 0) {
            return
          }
          var areaId = this.areaButtons[this.areaIndex].area_id,
            cropId = this.cropList[this.cropsIndex].id
          var options = {
            areaId: areaId,
            cropId: cropId,
            dateType: this.dataType,
            pageIndex: this.pageIndex,
            pageCount: this.pageCount
          }
          var formated = format.formatMarketInfo;
          this.tbLoading = true;
          request.marketPriceInfo(options).then((requestData) => {
            this.tbLoading = false;
            this.tableData = formated(requestData.data.data).data;
            this.totalPage = formated(requestData.data.data).totalPage;
          })
        },
        showPriceDetail(index) {
          this.tbIndex = index;
          document.getElementById('showEchart').style.display = 'block';
          this.ctlEchart = false;
          this.showMenu = true;
          this.popTbData = this.tableData[index];
          this.menuPopTitle = this.tableData[index].market_name;
          this.detailChart();
        },
        changePage(index) {
          this.pageIndex = index
          this.getMarkets()
        },
        exportExcel() {
          var options = {
            fpId: this.cropList[this.tbIndex].id,
            marketId: this.tableData[this.tbIndex].market_id,
            dateType: this.dataType,
            fileName: this.tableData[this.tbIndex].market_name + this.cropList[this.tbIndex].name + '价格信息'
          }
          request.dlPriceExcel(options);
        }
      },
      watch: {
        cropsIndex(index) {
          this.subTitle = this.cropList[index].name + '价格行情'
          this.initLineChart(index)
          this.getMarkets();
          this.getArea();
        },
        isLineChart(isLine) {
          this.chartData = null
          if (isLine) {
            this.initLineChart(this.cropsIndex)
          } else {
            this.initBarChart(this.cropsIndex)
          }
        },
        areaIndex(index) {
          this.getMarkets();
        }
      },
      components: {
        reportList,
        marketNews,
        popNews,
        marketSection,
        marketTable,
        popEchart
      }
  }
</script>
<style 
  lang="less" 
  rel="stylesheet/less" 
  scoped>
  .mt15 {
  	margin-top: 15px;
  }
  .market-wrap {
	    height: auto;
	    padding-top: 64px;
        .btn-top {
          margin-top: 10px;
        }
	      .market-list {
	      	z-index: 3;
	      	position: fixed;
	      	width: 100%;
	        padding-left: 80px;
	        border-bottom: 2px solid #15c13a;
	        background: #fff;
	          .on {
	                color: #fff;
	                background: #15c13a;
	            }
	          li {
	            font-size: 14px;
	            float: left;
	            padding: 20px 22px;
	            cursor: pointer;
	            color: #434343;
	        }
	      }
	      .market-title {
	      	z-index: 2;
	      	line-height: 42px;
	      	position: fixed;
	      	top: 124px;
	      	background: #fff;
	      	height: 42px;
	      	width: 100%;
	      	padding-left: 80px;
            color: #9b9b9b;
	            a:last-child {
	               color: #10ad33;
	            }
            	a {
	                display: inline-block;
	                cursor: pointer;
	                color: #9b9b9b;
             	}   
		   }
	      .market-price {
		        min-height: 600px;
		        padding: 102px 80px 0 80px;
		        	 .market-video-echart {
		        	 	margin-top: 6px;
					    border-top: 1px solid #d7d7d7;
					    background: #fafafa;
					    	.market-echart-switch {
					    		z-index: 1;
					    		top: 0;
					    		left: 0;
							    line-height: 30px;
							    display: inline-block;
							    width: 116px;
							    height: 30px;
							    margin: 14px 0 0 60px;
							    cursor: pointer;
							    text-align: center;
							    background: #f5fbe4;
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
							.market-legend {
							    line-height: 24px;
							    top: 14px;
							    right: 46px;
							    width: 100px;
							    height: 24px;
							    text-align: center;
							    border: 1px solid #d7d7d7;
							    background: #fff;
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
							#price-chart {
								position: relative;
							    width: 600px;
							    height: 400px;
							}
		        	 }
	      }
	      .market-list-wrap {
	      	padding-top: 94px;
	      }
	      .market-content-contain {
	      		.market-width {
	      			width: 742px;
	      			margin: 0 auto;
	      		}
	      		.hr-bold {
	      			width: 100%;
	      			border: 1px solid #e5e5e5;
	      		}
	      		hr {
				    margin: 10px 0;
				    border: 1px solid #eee;
				}
				.market-content-report,
				.market-content-news {
					width: 742px;
					margin: 0 auto;
					padding-bottom: 20px;
						.market-content-p {
						    font-size: 14px;
						    line-height: 30px;
						    position: relative;
						    height: 30px;
						    padding-left: 12px;
						    color: #125f6d;
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
				}
	      }
	 .market-pager {
	 	width: 100%;
	 	padding: 15px 0px;
	 	text-align: center;
	 }
	 .market-table-wrap {
	 	width: 99%;
	 	margin: 0 auto;
	 }
  }
</style>