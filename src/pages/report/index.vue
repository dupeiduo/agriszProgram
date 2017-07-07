<template>
  <div class="report clear" 
      :style="{width: screenWidth - menuWidth + 'px',left: menuWidth + 'px'}"
      :class="animationClassName"
      >
    <v-leftList
      :leftList="leftList" 
      :loading="leftLoading"
      @changeTopic="changeState">
    </v-leftList>
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
            :clientH="getScreenHeight - 135"
            :noMore="noMore"
            >
            </reportList>
        <v-list 
            v-else
            :loading="listLoading"
            @scrollToBottom="scrollToBottom"
            :reportObject="reportVContent" 
            :styleCtl="styleCtl"
            :clientH="getScreenHeight - 130"
            :noMore="noMore"
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
  import {mapGetters} from 'vuex'
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
          className: '',
          clientW: '',
          animationClassName: '',
          listLoading: true
        }
      },
      computed: {
      ...mapGetters({
        menuWidth: 'menuWidth',
        screenWidth: 'screenWidth',
        getScreenHeight: 'getScreenHeight'
      })},
      mounted() {
        this.clientH = document.documentElement.clientHeight - 153 || document.body.clientHeight - 153;
        this.clientW = document.documentElement.clientWidth || document.body.clientclientWidth;
        var formatedType = format.formatRepType
        this.leftLoading = true
        request.reportType().then((response)=> {
          if (response && response.status === 200 && response.data.status === 200) {
            this.leftList = formatedType(response.data.data);
            
          } else {
            // 无报告专题数据
          }
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

          this.listLoading = true
          
          request.reportList(params).then((response) => {
            if (response && response.status === 200 && response.data.status === 200) {
              
              this.total = response.data.total;
              if (this.styleCtl === '') {
                if (curPage == 1) {
                  this.reportContent = format.formatReportList(response.data.data);
                } else {
                  this.reportContent = this.reportContent.concat(format.formatReportList(response.data.data));
                }
              } else {
                if (curPage == 1) {
                  this.reportData = format.formatReportVList(response.data.data);
                  this.reportVContent = this.reportData.datastore
                } else {
                  this.reportData = format.formatReportVList(response.data.data, this.reportData);
                  this.reportVContent = this.reportData.datastore
                }
              }
              this.listLoading = false
            } else {
              this.listLoading = false
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
        menuWidth(width){
          if(width){
            this.animationClassName = 'menu-left-animation'
          }
       },
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
    @import '../../assets/style/common';
    .report {
      position: relative;
    }
    .right-container {
      margin-left: 176px;
      .reports {
        position: relative;
        top: @header-height - 1;
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
        background: @assistant-bg;
        z-index: 2;
        .adv-height(54px);
          .right-svg {
            position: absolute;
            right: 38px;
              .active,.active:hover {
                  color: #498d3d;
                  cursor: default;
                  text-decoration: none;
              }
              span {
                .adv-font-big();
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
     }
</style>