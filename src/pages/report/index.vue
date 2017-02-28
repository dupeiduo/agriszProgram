<template>
  <div class="report clear">
    <v-leftList :leftList="leftList" @changeTopic="changeState"></v-leftList>
    <div class="right-container">
      <div class="reports">
        <div class="style-ctl">
          <div class="right-svg">
            <span class="iconfont icon-liebiao-copy1"
              :class="styleCtl == 'vertical' ? 'active' : ''"
              @click="styleCtl = 'vertical'"
            ></span>
            <span class="iconfont icon-reorder pr set-top"
              :class="styleCtl == '' ? 'active' : ''"
              @click="styleCtl = ''"
            ></span>
          </div>
        </div>
        <reportList v-if="styleCtl ===''"
            :reportContent="reportContent" 
            @scrollToBottom="scrollToBottom"
            :styleCtl="styleCtl"
            :clientH="clientH"
            :noMore="noMore"
            class="report-bottom"
            >
            </reportList>
        <v-list v-else
            :reportObject="reportVContent" 
            @scrollToBottom="scrollToBottom"
            :styleCtl="styleCtl"
            :clientH="clientH"
            :noMore="noMore"
            class="report-bottom"
        ></v-list>
        <footerlite></footerlite>
      </div>
    </div> 
  </div>
</template>

<script>
  import vLeftList from 'pages/report/leftList/';
  import request from 'api/request.js';
  import format from 'api/model.js';
  import reportList from 'components/reportList/';
  import footerlite from 'components/footerlite/';
  import vList from 'pages/report/vList/';
  export default {
    data() {
        return {
          leftList: [],
          reportContent: [],
          reportVContent: null,
          perPage: 20,
          topicId: null,
          curPage: 1,
          total: -1,
          styleCtl:'vertical',
          clientH: -1,
          noMore: false
        }
      },
      mounted() {
       
          this.clientH = document.documentElement.clientHeight - 90 || document.body.clientHeight - 90;
        var formatedType = format.formatRepType,
          _this = this;
        request.reportType().then(function(requestData) {
          _this.leftList = formatedType(requestData.data);
        })
      },
      methods: {
        changeState(topicId) {
          this.reportContent = [''];
          this.curPage = 1;
          this.total = 0;
          this.noMore = false
          this.getReportList(this.curPage, this.perPage, topicId);
          this.topicId = topicId;
        },
        getReportList(curPage, perPage, topicId) {
          var params = new FormData();
          params.append('curPage', curPage);
          params.append('perPage', perPage);
          params.append('topicId', topicId);
          request.reportList(params).then((requestData) => {
            this.total = requestData.data.total;
            if (this.styleCtl === '') {
              if (curPage == 1) {
                this.reportContent = format.formatReportList(requestData.data.data);
              } else {
                this.reportContent = this.reportContent.concat(format.formatReportList(requestData.data.data));
              }
            } else {
              if (curPage == 1) {
                this.reportVContent = format.formatReportVList(requestData.data.data);
              } else {
                this.reportVContent = format.formatReportVList(requestData.data.data, this.reportVContent)
              }
            }
          })
        },
        scrollToBottom() {
          if (this.total && this.total <= this.perPage * this.curPage) {
            this.noMore = true
            return
          }
          this.curPage += 1;
          this.getReportList(this.curPage, this.perPage, this.topicId)
        }
      },
      watch: {
        styleCtl() {
          this.curPage = 1
          this.getReportList(this.curPage, this.perPage, this.topicId)
        }
      },
      components: {
        vLeftList,
        reportList,
        footerlite,
        vList
      }
  }
</script>
<style 
    lang="less"
    rel="stylesheet/less"
    scoped>
    .report {
      position: relative;
      overflow: hidden;
    }
    .right-container {
      margin-left: 176px;
      .reports {
        position: relative;
        top: 68px;
        background: #dfdddd;
      }
    }
    .style-ctl {
          line-height: 54px;
          position: relative;
          width: 100%;
          height: 54px;
          margin: 0 auto;
          padding: 0 14px;
          background: #fff;
      }
    .style-ctl {
          .right-svg {
            position: absolute;
            right: 38px;
              .active {
                  color: #fdbe9a;
              }
              span {
                font-size: 20px;
                margin-left: 15px;
                cursor: pointer;
                color: #90a2a9;
              }
          }
     }
    @media screen and ( min-width: 1440px) {
        .right-container {
          .style-ctl {
              width: 1088px;
          }
        }
    }
    @media screen and ( max-width: 1256px) {
      .right-container {
        .report-list {
            width: 858px;
        }
      }
    }
    @media screen and ( max-width: 1062px) {
      .right-container {
        .style-ctl {
            width: 632px;
        }
      }
    }
    @media screen and ( max-width: 840px) {
      .right-container {
        .style-ctl {
            width: 615px;
        }
      }
    }
    @media screen and ( max-width: 820px) {
      .right-container {
        .style-ctl {
            width: 590px;
        }
      }
    }
</style>