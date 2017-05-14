<template>
  <div class="left-tab">
    <div class="pr">
        <div  v-if="onlyList" 
          :class="!showList ? 'fadeout-left' : 'fadein-left'"
          class="only-list">
          <h3 class="detail-list-bg no-select pr ">
          </h3>
          <slot name="list"></slot>
        </div>

        <div v-else class="detail-list" :class="!showList ? 'fadeout-left' : 'fadein-left'">
          <div class="back-detail" 
            v-show="backList"
            :class="{'addlist-animate' : backList,'removelist-animate' : !backList}"
            >
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

      <div class="list-menu ps" :class="showList ? 'to-right' : 'to-left'" @click="toggleList">
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
</template>


<script>
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
        el:'.left-tab'
      }
    },
    computed: {

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
    components: {
      
    }
  }
</script>


<style  
    lang="less" 
    rel="stylesheet/less" 
    scoped>
    @import '../../assets/style/reset';
  .left-tab {
    position: fixed;
    top: 57px;
    left: 10px;
    z-index: 1;

    .back-list {
      /*border-radius: 4px 0 4px 4px;
      overflow-x: hidden;*/
    }

    .detail-list, .only-list {
      font-size: 12px;
      line-height: 32px;
      position: relative;
      width: 358px;
      background: #fff;
      border-radius: 4px 0 4px 4px;
      /*overflow-x: hidden;*/
      .mixin-boxshadow();
      
      .detail-list-bg {
        height: 40px;
        padding-left: 18px;
        border-radius: 4px 0 0 0;
        overflow: hidden;
        .back-detail {
          top: 8px;
          left: 14px;
          cursor: default;
          .mixin-height(32px);
        }
        .product-title {
          left: 0;
          top: 0;
          font-size: 16px;
          width: 344px;
          padding-left: 14px;
          background: #9fd032;
          color: #fff;
          .mixin-height(40px);
        }
      }
      .detail-list-product {
        height: 32px;
        width: 342px;
        padding-left: 12px;
        font-weight: normal;
        .back-list-icon {
          color: #989898;
          font-size: 14px;
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
      left: 358px;
      width: 32px;
      height: 32px;
      background: #fff;
      border-radius: 0px 4px 4px 0;
      cursor: pointer;
      .mixin-boxshadow();
        &:hover{
           .cf-back{
            color: #778f31;
           }
        }
      .list-ctl {
        .mixin-boxshadow();
      }
      .cf-back {
        display: block;
        font-size: 16px;
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
        .mixin-height(32px);
        .mixin-width(32px);
      }
    }
  }

  @keyframes fadein {
    0% {
      left: -368px;
      width: 0px;
    }
    1%{
      width: 358px;
    }
    100% {
      left: 0px;
    }
  }
  .fadein-left {
    .mixin-animation(fadein;.55s;1;forwards);    
  }
  @keyframes fadeout {
    0% {
      left: -10px;
    }
    99% {
      width: 358px;
    }
    100% {
      left: -368px;
      width: 0px;
    }
  }
  .fadeout-left {
    .mixin-animation(fadeout;.55s;1;forwards);
  }

  @keyframes toleft {
    0% {
      left: 350px;
    }
    100% {
      left: -10px;
    }
  }
  .left-tab .to-left {
    width: 40px;
    height: 40px;
    .cf-back {
      margin: 12px auto;
      font-size: 20px;
      transition: all .4s ease;
    }
    .mixin-animation(toleft;.4s;1;forwards);
  }
  
  @keyframes toright {
    0% {
      left: -10px;
    }
    100% {
      left: 358px;
    }
  }
  .left-tab .to-right {
    .mixin-animation(toright;.4s;1;forwards);
  }
  
</style>
