<template>
  <div class="left-tab-position lefttab-zIndex" :style="{'margin-left': menuWidth + 10 + 'px'}" :class="className">
    <div class="left-tab">
    <div class="pf">
      <div class="list-all" :style="{'max-height': getScreenHeight - 60 + 'px'}">
        <div
          class="only-list"  
          v-if="onlyList" 
          :class="!showList ? 'fadeout-left' : 'fadein-left'"
          >
          <h3 class="detail-list-bg no-select pr ">
          </h3>
          <slot name="list"></slot>
        </div>

        <div v-else class="detail-list" 
             :class="!showList ? 'fadeout-left' : 'fadein-left'">
            <div  class="back-detail" 
                  v-show="backList"
                  :class="{'addlist-animate' : backList,'removelist-animate' : !backList}">
                <h3 class="detail-list-product no-select pr ">
                  <span class="back-detail ps no-select back-detail-color"
                        @click="changeState">
                        <i class="back-list-icon iconfont icon-icon_retractsvg"></i>
                        <span class="back-list-title">{{listTitle}}</span>
                  </span>
                </h3>
              <slot name="detail"></slot>
            </div>
            <div class="back-list"
                 v-show="!backList"
                 :class="{'addlist-animate' : !backList,'removelist-animate' : backList}">
              <h3 class="detail-list-bg no-select pr ">
                <span class="back-detail ps no-select product-title"
                  v-if="!noDetail"
                >{{title}}</span>
              </h3>
              <slot name="list"></slot>
            </div>
          </div>
        </div>

      <div class="list-menu ps" :class="showList ? 'list-menu-to-right' : 'list-menu-to-left'" @click="toggleList">
        <em class="cf-back" :class="!showList ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"></em>

        <div v-show="leftTab.length > 0" class="list-ctl">
          <div 
            v-if="leftTab[0].tip && leftTab[0].tip !== ''" 
            v-for="(item, key) in leftTab">
            <el-tooltip effect="light"
              :content="item.tip" 
              placement="right-start" 
              popper-class="tips-popover">
              <span 
                :class="key == index ? 'cf-active':''"
                @click="clickMenu(key)">
                {{item.name}}
              </span>
            </el-tooltip>
          </div>

          <span 
            v-if="!leftTab[0].tip && leftTab[0].name"
            v-for="(item, key) in leftTab"
            :class="key == index ? 'cf-active':''"
            @click="clickMenu(key)">
            {{item.name}}
          </span>
        </div>
          
      </div>

    </div>
  </div>
  </div>
</template>


<script>
import {mapGetters} from 'vuex'
  export default{
    props:{
      leftTab:{
        type: Array,
        default:[]
      },
      title: {
        type: String,
        default: ''
      },
      backList: {
        type: Boolean,
        default: false
      },
      onlyList: {
        type: Boolean,
        default: false
      },
      index: {
        type: Number,
        default: 0
      },
      showList: {
        type: Boolean,
        default: true
      },
      noDetail: {
        type: Boolean,
        default: false
      },
      listTitle: {
        type: String,
        default: '返回列表'
      }
    },
    data(){
      return {
        el:'.left-tab',
        className: ''
      }
    },
    computed: {
      ...mapGetters({
        getScreenHeight: 'getScreenHeight',
        menuWidth: 'menuWidth'
      })
    },
    methods: {
      changeState () {
        this.$emit('changeState')
      },
      clickMenu(index) {
        this.$emit('clickMenu', index)
      },
      toggleList() {
        this.$emit('toggleList', !this.showList)
      }
    },
    watch: {
      menuWidth(width){
        if(width){
          this.className = 'menu-left-animation'
        }
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
    @import '../../assets/style/common';
  .left-tab-position {
    position: absolute;
    top: @header-height + 9;
    left: 0px;
    .left-tab {
      position: absolute;
      left: 0;
      top: 0;
    }
    /*.list-all {
      overflow: hidden;
    }*/
    .detail-list, .only-list {
      .adv-boxshadow();
      .adv-font-small();
      line-height: 32px;
      position: relative;
      width: @list-width;
      background: #fff;
      border-radius: 4px 0 4px 4px;
      
      .detail-list-bg {
        height: 40px;
        padding-left: 18px;
        border-radius: 4px 0 0 0;
        overflow: hidden;
        .back-detail {
          .adv-height(32px);
          top: 8px;
          left: 14px;
          cursor: default;
        }
        .product-title {
          .adv-height(40px);
          .adv-font-big();
          left: 0;
          top: 0;
          width: @list-width - 14;
          padding-left: 14px;
          background: #9fd032;
          color: #fff;
          border-radius: 4px 0 0 0;
        }
      }
      .detail-list-product {
        height: 32px;
        width: 342px;
        padding-left: 12px;
        font-weight: @font-weight-normal;
        .back-list-icon {
          .adv-font-normal();
          color: #989898;
          padding-right: 5px;
          vertical-align: middle;
        }
        span {
          cursor: pointer;
          vertical-align: middle;
        }
      }
    }
    .back-detail-color {
      &:hover {
        .back-list-title {
          color: #77843f;
          text-decoration: underline;
        }
      }
    }
    .list-menu {
      top: 0px;
      left: @list-width;
      width: 32px;
      height: 32px;
      background: @assistant-bg;
      border-radius: 0px 4px 4px 0;
      cursor: pointer;
      .adv-boxshadow();
        &:hover{
           .cf-back{
            color: #778f31;
           }
        }
      .list-ctl {
        .adv-boxshadow();
      }
      .cf-back {
        .adv-font-big();
        display: block;
        width: 18px;
        margin: 8px auto;
        cursor: pointer;
        color: #8391a5;
      }
      .cf-active {
        color: #fff;
        background: #9fd032;
      }
      span {
        background: #fff;
        display: block;
        cursor: pointer;
        .adv-height(32px);
        .adv-horizontal-center(32px);
      }
    }
  }

  @keyframes fadein {
    0% {
      left: -(@list-width + 10);
      width: 0px;
    }
    1%{
      width: @list-width;
    }
    100% {
      left: 0px;
    }
  }
  .fadein-left {
    .adv-animation(fadein;.25s;1;forwards);    
  }
  @keyframes fadeout {
    0% {
      left: -142px;
    }
    99% {
      width: @list-width;
    }
    100% {
      left: -(@list-width + 10);
      width: 0px;
    }
  }
  .fadeout-left {
    .adv-animation(fadeout;.25s;1;forwards);
  }

  @keyframes list-menu-tol-eft {
    0% {
      left: @list-width - 8;
    }
    100% {
      left: 0px;
    }
  }
  .left-tab .list-menu-to-left {
    .adv-animation(list-menu-tol-eft;.4s;1;forwards);
  }
  
  @keyframes list-menu-to-right {
    0% {
      left: 0px;
    }
    100% {
      left: @list-width;
    }
  }
  .left-tab .list-menu-to-right {
    .adv-animation(list-menu-to-right;.4s;1;forwards);
  }
  
</style>
