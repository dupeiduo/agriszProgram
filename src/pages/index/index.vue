<template>
  <div class="homepage">
    <v-scroll 
      :bannertitle="allTitle" 
      :carousel_img="carousel_img"
      v-show="allTitle.length > 0"
      ></v-scroll>
    <div class="platform-introduction pr" style="opacity: 1;">
      <div class="turn-top turn-black ps"></div>
      <div class="home-p animated fadeInDown">
        <h3>平台介绍</h3>
        <p>PLATFORM INTRODUCTION</p> 
        <span></span>
      </div>
      <p class="introduction-page animated fadeInDown">
        以先进的遥感及农业数据处理技术，获取并提供高精度农业大数据，并以此为基础配合国家农业互联网+、农业大数据的总体战略，联合新华通讯社、中国供销集团等机构，为政府用户、行业企业、农业人员，提供有价值的农产品大宗交易、流通、金融衍生服务。<br>
        现行系统立足于作物地上、地下基础数据监测，通过专业的遥感解译技术和流程，以及土壤墒情、光、温、压等日频率气象数据等，在作物生长周期提供分布、面积、长势、旱情、估产等农情监测服务，作物生长出现问题及时预警并给出合理建议，保障农业生产的安全性；通过遥感图像精细化、网格化管理可以辅助提高作物产量，节水节肥；灵活的数据分析工具和相应的农情分析报告为地方政府涉农工作提供及时、全面、标准化的监测工具、管理工具、决策辅助工具。
      </p>
    </div>
    <div class="platform-function pr">
      <div class="common-width">
        <div class="home-p">
          <h3>平台功能</h3>
          <p>PLATFORM FUNCTION</p> 
        </div>
        <ul class="function-ul">
          <li @click="goMonitor(0)">
            <a class="growth-link" href="javascript:void(0)">
              <span>
                <h3 class="function-icon iconfont icon-changshi-"></h3>
                <h3>作物长势</h3>
              </span>
              <p>依据作物物候信息提供常态化监测作物生长发育状况</p>
            </a>
          </li>
          <li @click="goMonitor(2)">
            <a class="drought-link" href="javascript:void(0)">
              <span>
                <h3 class="function-icon iconfont icon-weibiaoti-"></h3>
                <h3>区域旱情</h3>
              </span>
              <p>依据高时间分辨率遥感数据提供动态监测区域干旱状况</p>
            </a>
          </li>
          <li>
            <a href="/weather">
              <span>
                <h3 class="function-icon iconfont icon-qixiang"></h3> 
                <h3>气象数据</h3>
              </span>
              <p>依据国家气象局权威数据提供多种类高时效的气象数据</p>
            </a>
          </li>
          <li>
            <a href="/analyze">
              <span>
                <h3 class="function-icon iconfont icon-tongji-"></h3> 
                <h3>数据统计</h3>
              </span>
              <p>依靠高效的分析功能提供直观准确的数据统计分析服务</p>
            </a>
          </li>
          <li>
            <a href="/classify">
              <span>
                <h3 class="function-icon iconfont icon-fenbu-"></h3> 
                <h3>作物分布</h3>
              </span>
              <p>依靠精确的计算模型提供区域作物分布、面积监测信息</p>
            </a>
          </li>
          <li>
            <a href="/report">
              <span>
                <h3 class="function-icon iconfont icon-baogao-"></h3>
                <h3>农情报告</h3>
              </span>
              <p>依靠专家团队分析系统数据提供定制化农业指导、农情分析</p>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <p-bottonTurn :bottomReport="bottomReport"></p-bottonTurn>
    <p-footer></p-footer>
  </div>
</template>
<style 
   lang="less"
   rel="stylesheet/less"
   scoped>
  .homepage {
    position: relative;
    z-index: 2;
    background: #fff;
  }
  .platform-introduction {
    height: 384px;
    background: url(/static/assets/img/home/bg-shading.png) repeat-x;
    .turn-black {
      bottom: 24px;
      left: 50%;
      width: 26px;
      height: 26px;
      margin-left: -14px;
      background: url(/static/assets/img/home/turn-black.gif) no-repeat;
    }
    .home-p {
      font-size: 20px;
      padding-top: 26px;
      text-align: center;
      h3 {
        font-size: 20px;
        line-height: 38px;
      }
      span {
        display: block;
        width: 100px;
        height: 14px;
        margin: 18px auto 34px;
        background: url(/static/assets/img/home/home-icon.png) 0 0 no-repeat;
      }
    }
    .introduction-page {
      font-size: 14px;
      line-height: 24px;
      width: 800px;
      margin: 0 auto;
      text-align: center;
      text-indent: 2em;
      color: #956c18;
    }
  }
  .platform-function {
    height: 508px;
    background: url(/static/assets/img/home/bg-function.png);
    background-size: cover;
    .common-width {
      width: 800px;
      margin: 0 auto;
      .home-p {
        color: #5e574a;
        text-align: center;
        h3 {
          font-size: 20px;
          line-height: 38px;
        }
      }
      .function-ul {
        overflow: hidden;
        margin-top: 28px;
        li {
          float: left;
          width: 158px;
          margin: 0 52px 28px;
          text-align: center;
          a {
            display: block;
            cursor: pointer;
            span {
              display: block;
              width: 112px;
              height: 112px;
              margin: 0 auto;
              -webkit-transition: border 1s ease-in-out;
              -moz-transition: border 1s ease-in-out;
              -ms-transition: border 1s ease-in-out;
              -o-transition: border 1s ease-in-out;
              transition: border 1s ease-in-out;
              border: 10px solid #e6e6d5;
              border-radius: 50%;
              background: #fff;
              .function-icon {
                font-size: 52px;
                margin-top: 12px;
                color: #ba8c2f;
                font-weight: normal;
              }           
            }
            span:hover {
              animation: glow 1s infinite ease-in-out alternate;
            }
            @keyframes glow {
              0% {
                border-color: rgba(230,230,213,.6);
              }
              100% {
                border-color: #e6e6d5;
              }
            }
          }
          a:hover {
            span {
              background: #ba8c2f;
              h3 {
                color: #fff;
              }
            }
          }
        }
      }
    }
  }
</style>
<script>
  import vScroll from 'pages/index/bannerScroll/index';
  import pFooter from 'components/footer/';
  import pBottonTurn from 'pages/index/bottomTurn/';
  import request from 'api/request.js'
  import format from 'api/model.js'
  import axios from 'axios'
  export default{
    data(){
      return {
        carousel_img:'',
        allTitle:[
          {
            title: ''
          }
        ],
        bottomReport:[
          {
            title :'农业数据报告',
            pdf_url : '',
            img_url :''
          },
          {
            title :'农业数据报告',
            pdf_url : '',
            img_url :''
          },
          {
            title :'农业数据报告',
            pdf_url : '',
            img_url :''
          }
        ]
      }
    },
    mounted() {
      var _this = this;
      axios.all([request.homeCarousel(), request.homeReport()])
      .then(axios.spread(function(carousel, report) {
        var formated = format.formatHomeData(carousel.data, report.data);
        _this.bottomReport = report.data.data;
        _this.allTitle = formated.carousel.BannerTitle;
        _this.carousel_img = formated.carousel.carousel_img

      }))
      
    },
    methods: {
      goMonitor(index) {
        var fromHome = true;
        this.$router.push(`/monitor?index=${index}`)
      }
    },
    components: {
      vScroll,
      pFooter,
      pBottonTurn
    }
  }
</script>