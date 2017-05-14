<template>
    <div class="v-list" v-scroll="onScroll" :style="{'height':clientH + 20 + 'px'}">
    <div v-for="data in reportObject">
      <div v-for="(year, yIndex) in data.value">
        <h3 class="vertical-title" :class="year.quarter === 0 ? 'ver-active':''">{{data.year + '年' + quarters[year.quarter]}}</h3>
        <ul class="report-list"
          v-if="year.value && year.value.length > 0">
          <li class="report-single" 
            v-for="(item,index) in year.value"
            v-if="!!item"
            :class="styleCtl"
            >
            <div class="report-left">
              <a v-if="styleCtl !== ''" :href="item.pdf_url" target="_blank">
                  <img @mouseenter="showAllTitle(index, yIndex, item.title)" @mouseleave="hideAllTitle" :src="item.img_url">
              </a>
              <img v-else :src="item.img_url">
              <span :class="item.report_class">
                <em>{{item.report_label}}</em>
              </span>
            </div>
            <div class="report-content">
              <p class="report-h3">
                <span class="report-title font14" :class="(hoverIndex === index && yIndex === yearIndex) ? 'hover-title-class' : ''">{{item.title}}</span>
                <span class="report-date ps">{{item.time}}</span>
              </p>
              <p class="report-p" v-limitLine>{{item.misc}}</p>
              <a :href="item.pdf_url" target="_blank">浏览全文 &gt;</a>
            </div>
            <h3>
              <a>
                <form :action="baseUrl + 'report/downPdf'"  method="post">
                  <input type="hidden" name="pdfUrl" :value="item.pdf_url">
                  <input type="hidden" name="pdfTitle" :value="item.title">
                  <input type="submit" class="animated fadeInRight" id="down-animated" value="点击下载">
                </form>
               <span class="re-bj iconfont icon-xiazai1"></span>
              </a>
            </h3>
          </li>
        </ul>

        <div class="report-list wait-report" 
          v-if="year.value && year.value.length === 0 && year.isNew">
          <i class="iconfont icon-jingqingqidai-"></i><br/>敬请期待…
        </div>

        <div class="report-list none-data" 
          v-if="year.value && year.value.length === 0 && !year.isNew"
          ><i class="iconfont icon-baogao-1"></i><br/>暂无报告
        </div>

      </div>
    </div>

    <p v-if="noMore" class="no-more">
      <span class="none-words">没有更多了</span>
    </p>
  </div> 
</template>
<script>
import config from 'config/env/config.env.js';
  export default {
    props: {
      reportObject: {
        type: Array,
        default: []
      },
      styleCtl: {
        type: String,
        default:''
      },
      clientH: {
        type: Number,
        default: null
      },
      noMore: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        baseUrl: config.phpUrl,
        quarters: ["第一季度","第二季度","第三季度","第四季度"],
        hoverIndex: -1,
        yearIndex: -1,
      }
    },
    directives: {
      limitLine: {
        bind: function(el) {
          $clamp(el, {
            clamp: 2
          })
        }
      }
    },
    methods: {
      onScroll: function(e, position) {
        var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        var scrollTop = position.scrollTop;
        var scrollHeight = document.getElementsByClassName('report-list')[0].scrollHeight
        
        this.$emit('scrollToBottom', (scrollHeight <= scrollTop + clientHeight), scrollTop);
        
      },
      showAllTitle(index, yIndex, title) {
        if (title.length > 11) {
          this.hoverIndex = index
          this.yearIndex = yIndex
        }
      },
      hideAllTitle() {
        this.hoverIndex = -1
        this.yearIndex = -1
      }
    }
  }
</script>
<style
    lang="less"
    rel="stylesheet/less"
    scoped>
    @import '../../../assets/style/reset';
    .v-list {
      @media screen and ( min-width: 1440px) {
        width: 1088px;
      }
      @media screen and ( max-width: 1256px) {
        width: 858px;
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
    .no-more {
      height: 30px;
      font-size: 18px;
      margin: 15px 0;
      color: #dfdad9;
      text-align: center;
    }
    .v-list {
      background: #fff;
      overflow-x: hidden;
      margin: 0 auto;
      padding: 0 14px;
      .none-icon {
        display: block;
        font-size: 50px;
        color: #cfc9ca;
      }
      .none-data,.wait-report {
        position: relative;
        top: 10px;
        font-size: 18px;
        color: #dfdad9;
        text-align: center;
        padding-bottom: 12px;
        i {
          font-size: 44px;
          color: #dfdad9;
        }
      }
      .none-words {
        display: block;
        font-size: 14px;
        color: #cfc9ca;
      }
      .ver-active:after {
          position: relative;
          top: -2px;
          left: 5px;
          content:'新';
          border-radius: 50%;
          background: #fa9f01;
          display: inline-block;
          color: #fff;
          font-size: 12px;
          .mixin-width(18px);
          .mixin-height(18px);
        }
      .vertical-title {
        font-size: 16px;
        width: 96%;
        height: 38px;
        line-height: 42px;
        margin-bottom: 8px;
        background: url("@{imgurl}report/vertical-title.png") -1px top no-repeat;
        padding-left: 20px;
        border-bottom: 2px solid #e4e4e4;
      }
      .report-list {
        overflow: hidden;
        margin: 0 auto 0 45px;
        @media screen and ( min-width: 1440px){
          margin: 0 auto 0 64px;
        }
        @media screen and ( max-width: 1280px){
          margin: 0 auto 0 56px;
        }
        @media screen and ( max-width: 800px){
          margin: 0 auto 0 105px;
        }
        .report-single:hover {
          background: #eefbf4;
        }
        .report-single {
          position: relative;
          float: left;
          width: 100%;
          margin-bottom: 16px;
          border-top: 1px solid #e0e0e0;
          border-right: 1px solid #e0e0e0;
          border-bottom: 2px solid #e0e0e0;
          border-left: 1px solid #e0e0e0;
          .mixin-boxshadow();
          #down-animated {
           cursor: pointer;
           .mixin-animation-duration();
         }
         .report-left {
          position: relative;
          float: left;
          overflow: hidden;
          width: 120px;
          height: 106px;
          img {
              width: 174px;
              height: 182px;
              margin-right: 8px;
              background: #eef3f0;
          }
          .re-orange {
            border-top: solid 40px #ffa817;
          }
          .re-red {
            border-top: solid 40px #ff5421;
          }
          span {
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            color: #fff;
            border-right: solid 40px transparent;
            em {
              display: block;
              position: absolute;
              top: -36px;
              left: 6px;
            }
          }
        }
        .report-content {
          position: relative;
          margin-left: 130px;
          .report-h3 {
            color: #333;
            .mixin-height(32px);
            .report-date {
              right: 10px;
            }
          }
          .report-p {
            overflow: hidden;
            height: 34px;
            margin-right: 3px;
          }
          a {
            display: block;
            width: 65px;
            margin-top: 20px;
            color: #428bca;
          }
        }
        h3:hover {
          input {
            display: block;
          }
          em {
            display: block;
          }
          .re-bj {
            display: none;
          }
        }
        h3 {
          position: absolute;
          right: 0;
          bottom: 0;
          a {
            position: absolute;
            right: 4px;
            bottom: 4px;
            input {
              height: 25px;
              color: #7089d2;
              background: none;
              display: none;
            }
            .re-bj {
              width: 28px;
              height: 22px;
              color: #7d7c7b;
              display: block;
            }
          }
        }
      }
      .vertical:hover {
        transform: scale(1.05);
        .report-h3 {
          span {
            font-weight: bold;
            transition: all .4s ease-in-out;
            background: #fff;
          }
          .report-date {
            background: #fff !important;
          }
        }
      }
      .vertical {
        width: 174px;
        height: 182px;
        margin: 8px 8px 10px;
        padding: 0;
        overflow: hidden;
        .report-content {
          margin-left: 0;
          .report-h3 {
            position: absolute;
            top: -55px;
            color: #fff;

            .report-title {
              display: inherit;
              color: #fff;
              background: rgba(0,0,0,.4); 
              .mixin-height(36px);
              .mixin-ellipsis(160px);
            }
            .hover-title-class {
              margin-top: -10px;
              line-height: 24px;
              height: 48px;
              white-space: normal;
            }
            .report-date {
              position: static;
              display: block;
              background: #f0fcf2;
              color: #676c68;
              line-height: 28px;
              height: 32px;
            }
            span {
              padding: 0 10px;
            }
          }
          .report-p {
            display: none !important;
          }
          a {
            display: none;
          }
        }
        .report-left {
          float: none;
          width: 192px;
          height: 170px;
        }
      }
    }
  }
</style>