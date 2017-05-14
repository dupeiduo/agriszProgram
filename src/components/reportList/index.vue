<template>
  <div :style="{'height':clientH + 'px',paddingTop: '14px'}"  v-scroll="onScroll" class="report-list">
    <ul v-show ="reportContent.length > 0"
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
            <span class="report-title font14">
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
              <input type="submit" class="animated fadeInRight" id="down-animated" value="点击下载">
            </form>
           <span class="re-bj iconfont icon-xiazai1"></span>
          </a>
        </h3>
      </li>
    </ul>
    <div  class="report-list none-data" 
          v-show="reportContent.length === 0"
          :style="{'height':clientH + 'px'}"
          >暂无数据
    </div>
    <p v-if="noMore" class="none-data">
      <span class="none-words">没有更多了</span>
    </p>
  </div> 
</template>
<script>
import config from 'config/env/config.env.js';
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
        baseUrl: config.phpUrl
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
    components: {}
  }
</script>
<style
    lang="less"
    rel="stylesheet/less"
    scoped>
    @import '../../assets/style/reset';

  .report-list {
    overflow-x: hidden;
    padding: 0px 14px 14px;
    margin: 0 auto;
    background: #fff;
    .none-words {
      display: block;
      font-size: 14px;
      color: #cfc9ca;
    }
  }
  .report-list {
      .report-single:hover {
        background: #eefbf4;
      }
      .report-single {
        position: relative;
        float: left;
        width: 99%;
        margin-bottom: 16px;
        border-top: 1px solid #e0e0e0;
        border-right: 1px solid #e0e0e0;
        border-bottom: 2px solid #e0e0e0;
        border-left: 1px solid #e0e0e0;
        .mixin-boxshadow();

          #down-animated {
             -webkit-animation-duration: .34s;
             cursor: pointer;
          }
          .report-left {
            position: relative;
            float: left;
            overflow: hidden;
            width: 102px;
            height: 106px;
            background: #eef3f0;
              img {
                width: 102px;
                height: 106px;
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
            margin-left: 130px;
              .report-h3 {
                line-height: 32px;
                height: 32px;
                color: #333;
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
        img {
            transition: all .24s ease-in-out;
            -webkit-transform: scale(1.06);
            -moz-transform: scale(1.06);
            -o-transform: scale(1.06);
            transform: scale(1.06);
        }
        .report-h3 {
          span {
              font-size: 16px;
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
                    line-height: 36px;
                    display: inherit;
                    height: 36px;
                    color: #fff;
                    background: rgba(0,0,0,.4); 
                }
                .report-date {
                    line-height: 40px;
                    position: static;
                    display: block;
                    height: 40px;
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
    @media screen and ( min-width: 1440px) {
        .right-container {
          .report-list,
          .style-ctl {
              width: 1088px;
          }
          .report-list {
              box-shadow: 1px 4px 13px #d0d0d0;
          }
          .reports {
              background: #dfdddd;
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
        .report-list {
            width: 632px;
        }
      }
    }
    @media screen and ( max-width: 842px) {
      .right-container {
        .report-list {
            overflow-x: scroll;
        }
      }
    }
    @media screen and ( max-width: 840px) {
      .right-container {
        .report-list {
            width: 615px;
        }
      }
    }
    @media screen and ( max-width: 820px) {
      .right-container {
        .report-list {
            width: 590px;
        }
      }
    }
</style>