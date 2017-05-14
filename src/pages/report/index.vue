<template>
  <div class="report clear">
    <v-leftList
      :leftList="leftList" 
      :loading="leftLoading"
      @changeTopic="changeState"></v-leftList>
    <div class="right-container">
      <div class="reports">
        <div class="style-ctl" :class="className">
          <div class="right-svg">
            <span class="iconfont icon-liebiao-copy1"
              :class="styleCtl == 'vertical' ? 'active' : ''"
              @click="styleCtl = 'vertical'"
            >书架模式</span>
            <span class="iconfont icon-reorder pr set-top"
              :class="styleCtl == '' ? 'active' : ''"
              @click="styleCtl = ''"
            >列表模式</span>
          </div>
        </div>
        <reportList v-if="styleCtl ===''"
            :reportContent="reportContent" 
            @scrollToBottom="scrollToBottom"
            :styleCtl="styleCtl"
            :clientH="clientH + 20"
            :noMore="noMore"
            class="report-bottom"
            >
            </reportList>
        <v-list v-else
            :reportObject="reportVContent" 
            @scrollToBottom="scrollToBottom"
            :styleCtl="styleCtl"
            :clientH="clientH + 30"
            :noMore="noMore"
            class="report-bottom"
        ></v-list>
      </div>
    </div> 
  </div>
</template>

<script>
  import vLeftList from 'pages/report/leftList/';
  import request from 'api/request.js';
  import format from 'api/model.js';
  import reportList from 'components/reportList/';
  import vList from 'pages/report/vList/';
  export default {
    data() {
        return {
          leftLoading: false,
          leftList: [],
          reportContent: [],
          reportData: [],
          reportVContent: null,
          perPage: 20,
          topicId: null,
          curPage: 1,
          total: -1,
          styleCtl:'vertical',
          clientH: -1,
          noMore: false,
          className: ''
        }
      },
      mounted() {
        this.clientH = document.documentElement.clientHeight - 153 || document.body.clientHeight - 153;
        var formatedType = format.formatRepType
        this.leftLoading = true
        request.reportType().then((requestData)=> {
          this.leftList = formatedType(requestData.data);
          this.leftLoading = false
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
                this.reportData = format.formatReportVList(requestData.data.data);
                this.reportVContent = this.reportData.datastore
              } else {
                this.reportData = format.formatReportVList(requestData.data.data, this.reportData);
                this.reportVContent = this.reportData.datastore
              }
            }
          })
        },
        scrollToBottom(toBottom, scrollTop) {
          if (scrollTop !== 0) {
            this.className = 'bottom-show'
          } else {
            this.className = ''
          }
          if (toBottom) {
            if (this.total && this.total <= this.perPage * this.curPage) {
              this.noMore = true
              return
            }
            this.curPage += 1;
            this.getReportList(this.curPage, this.perPage, this.topicId)
          }
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
        vList
      }
  }
</script>
<style 
    lang="less"
    rel="stylesheet/less"
    scoped>
    @import '../../assets/style/reset';
    .report {
      position: relative;
    }
    .right-container {
      margin-left: 176px;
      .reports {
        position: relative;
        top: @top;
        background: #f0f0f0;
      }
    }
    .bottom-show {
      box-shadow: 0px 2px 7px #b5b5b5;
    }
    .style-ctl {
        position: relative;
        margin: 0 auto;
        padding: 0 14px;
        background: #fff;
        .mixin-height(54px);
          .right-svg {
            position: absolute;
            right: 38px;
              .active,.active:hover {
                  color: #498d3d;
                  cursor: default;
                  text-decoration: none;
              }
              span {
                font-size: 16px;
                margin-left: 15px;
                cursor: default;
                color: #90a2a9;
                &:hover {
                  cursor: pointer;
                  color: #6cbc35;
                  text-decoration: underline;
                }
              }
          }
       @media screen and ( min-width: 1440px) {
        width: 1088px;
       }
      @media screen and ( max-width: 1062px) {
        width: 632px;
      }
      @media screen and ( max-width: 840px) {
         width: 615px;
      }
      @media screen and ( max-width: 820px) {
         width: 590px;
      }
     }
    @media screen and ( max-width: 1256px) {
      .right-container {
        .report-list {
            width: 858px;
        }
      }
    }
</style>