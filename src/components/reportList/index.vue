<template>
  <div :style="{'height':clientH + 'px',paddingTop: '14px'}"  v-scroll="onScroll" class="report-list pr">
    <ul v-if ="reportContent.length > 0"
      >
      <li class="report-single" 
        v-for="(item,index) in reportContent"
        :class="styleCtl"
        >
        <div class="report-left">
          <a v-if="styleCtl !== ''" :href="item.pdf_url" target="_blank">
            <img :src="item.img_url">
          </a>
          <img v-else :src="item.img_url">
          <span :class="item.report_class">
            <em>{{item.report_label}}</em>
          </span>
        </div>
        <div class="report-content">
          <p class="report-h3">
            <span class="report-title">
              <!-- <el-tooltip :content="item.title"  placement="bottom" effect="light" v-if="styleCtl === ''"> -->
                {{item.title}}
              <!-- </el-tooltip> -->
            </span>
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
              <input type="submit" class="animated fadeInRight fade-animation" value="点击下载">
            </form>
           <span class="re-bj iconfont icon-xiazai1"></span>
          </a>
        </h3>
      </li>
    </ul>
    <expect-data
          v-else
          :showPageData="true"
          :left="false"
          :top="false"
          >
    </expect-data>
    <p v-if="noMore" class="none-data">
      <span class="none-words">没有更多了</span>
    </p>
  </div> 
</template>
<script>
import config from 'config/env/config.env.js';
import expectData from 'components/expectData/'
  export default {
    props: {
      reportContent: {
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
        showPageData: false
      }
    },
    watch: {},
    directives: {
      limitLine: {
        bind: function(el) {
          $clamp(el, {
            clamp: 2
          })
        }
      }
    },
    mounted() {
    },
    methods: {
      onScroll: function(e, position) {
        var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        var scrollTop = position.scrollTop;
        var scrollHeight = document.getElementsByClassName('report-list')[0].scrollHeight
        this.$emit('scrollToBottom', (scrollHeight <= scrollTop + clientHeight), scrollTop);
      }
    },
    components: {
      expectData
    }
  }
</script>
<style
    lang="less"
    rel="stylesheet/less"
    scoped>
    @import '../../assets/style/common';

  .report-list {
    overflow-x: hidden;
    padding: 0px 14px 14px;
    margin: 0 auto;
    background: @assistant-bg;
    min-height: 100px;
    .none-data{
      text-align: center;
      .none-words {
        .adv-font-normal();
        display: block;
        color: #cfc9ca;
      }
    }
  }
  .report-list {
      .report-single:hover {
        background: #eefbf4;
      }
      .report-single {
        position: relative;
        float: left;
        width: 100%;
        margin-bottom: 16px;
        border: 1px solid #e0e0e0;
        border-bottom: 2px solid #e0e0e0;
        box-shadow: 0 1px 2px #e7e7e7;
        box-sizing: border-box;
          #down-animated {
             -webkit-animation-duration: .34s;
             cursor: pointer;
          }
          .report-left {
            position: absolute;
            top: 8px;
            left: 8px;
            overflow: hidden;
            width: 110px;
            height: 104px;
            background: #eef3f0;
              img {
                width: 110px;
                height: 104px;
                margin-right: 8px;
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
            padding-left: 126px;
            height: 120px;
              .report-h3 {
                .adv-title-normal();
                height: 44px;
                font-weight: normal;
                line-height: 44px;
                  .report-date {
                    .adv-text-line-height-small;
                    top: 6px;
                    right: 8px;
                }
              }
              .report-p {
                .adv-text-line-height-small();
                height: 34px;
                margin-right: 3px;
                overflow: hidden;
              }
              a {
                  display: block;
                  width: 65px;
                  margin-top: 14px;
                  color: #428bca;
              }
          }
          h3 {
            position: absolute;
            right: 0;
            bottom: 0;
              a {
                position: absolute;
                right: 4px;
                bottom: 6px;
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
            &:hover {
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
          }
      }
      .vertical:hover {
        img {
            transition: all .24s ease-in-out;
            -webkit-transform: scale(1.06);
            -moz-transform: scale(1.06);
            -o-transform: scale(1.06);
            transform: scale(1.06);
        }
        .report-h3 {
          span {
              .adv-font-big();
              transition: all .4s ease-in-out;
          }
        }
      }
      .vertical {
        width: 192px;
        height: 208px;
        margin: 8px;
        padding: 0;
        overflow: hidden;
          .report-content {
            margin-left: 0;
              .report-h3 {
                position: relative;
                top: -38px;
                color: #fff;
                .report-title {
                    .adv-font-normal();
                    line-height: 36px;
                    display: inherit;
                    height: 36px;
                    color: #fff;
                    background: rgba(0,0,0,.4); 
                }
                .report-date {
                    .adv-height(40px);
                    position: static;
                    display: block;
                    background: #f0fcf2;
                    color: #676c68;
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
</style>