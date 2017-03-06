<template>
  <div class="left-tab">
    <div>

        <div  v-if="onlyList" 
          :class="!showList ? 'fadeout-left' : 'fadein-left'"
          class="only-list">
          <h3 class="detail-list-bg no-select pr ">
            <em>{{title}}</em>
          </h3>
          <slot name="list"></slot>
        </div>

        <div v-else class="detail-list" :class="!showList ? 'fadeout-left' : 'fadein-left'">
          <div class="back-detail" 
            v-show="backList"
            :class="{'addlist-animate' : backList,'removelist-animate' : !backList}"
            >
            <h3 class="detail-list-bg no-select pr ">
              <el-tooltip :content="title"  placement="bottom" effect="light" :disabled="title.length<16">
                  <em>{{title}}</em>
              </el-tooltip>
              <span class="back-detail ps no-select"
                @click="changeState"
              >返回列表</span>
            </h3>
            <slot name="detail"></slot>
          </div>
          <div class="back-list"
               v-show="!backList"
               :class="{'addlist-animate' : !backList,'removelist-animate' : backList}">
            <h3 class="detail-list-bg no-select pr ">
              <em>{{title}}</em>
              <span class="back-detail ps no-select"
                v-if="!noDetail"
                @click="changeState"
              >查看详情</span>
            </h3>
            <slot name="list"></slot>
          </div>
        </div>

      <div class="list-menu ps" :class="showList ? 'to-right' : 'to-left'">
        <em class="iconfont cf-back" :class="!showList ? 'icon-jiantou' : 'icon-33'" 
        @click="toggleList"></em>

        <div v-show="leftTab.length > 0">
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
        default: {}
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
  .left-tab {
    position: fixed;
    top: 80px;
    left: 10px;
    /*width: 363px;*/
    z-index: 1;
    .detail-list, .only-list {
      font-size: 12px;
      line-height: 32px;
      position: relative;
      width: 318px;
      background: #fff;
      border: 1px solid #ededed;
      border-radius: 0 0 4px 4px;
      box-shadow: -4px 2px 8px #aeaeae;
      .detail-list-bg {
        line-height: 40px;
        height: 40px;
        width: 300px;
        padding-left: 18px;
        border-bottom: 1px solid #ededed;
        background: #f1f4f4;
        em {
          font-size: 14px;
          width: 200px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          display: inherit;
        }
        .back-detail {
          line-height: 20px;
          top: 8px;
          right: 6px;
          width: 68px;
          height: 20px;
          text-align: center;
          border: 1px solid #cdd0d0;
          background: #fff;
          border-radius: 4px;
          cursor: pointer;
          &:hover {
            background:#d1eeac;
          }
        }
      }
    }
    .list-menu {
      top: 0px;
      left: 320px;
      width: 39px;
      background: #fff;
      box-shadow: 1px 2px 4px #a7a7a7;
      .cf-back {
        display: block;
        line-height: 40px;
        font-size: 20px;
        height: 36px;
        text-align: center;
        cursor: pointer;
        box-shadow: 1px 0 4px #edecec inset;
      }
      .icon-jiantou {
        line-height: 36px;
      }
      .cf-active {
        color: #fff;
        background: #55b101;
        box-shadow: 1px 0 4px #689df3 inset;
      }
      span {
        font-size: 14px;
        width: 30px;
        background: #fff;
        line-height: 36px;
        display: block;
        padding: 0 5px;
        height: 36px;
        overflow: hidden;
        cursor: pointer;
        border-top: 1px solid #e5e5e5;
        box-shadow: 1px 0 4px #edecec inset;
      }
    }
  }

  @keyframes fadein {
    0% {
      left: -328px;
      width: 0px;
    }
    1%{
      width: 318px;
    }
    100% {
      left: 0px;
    }
  }
  .fadein-left {    
    animation-name: fadein;
    animation-duration: .5s; 
    animation-iteration-count: 1; 
    animation-fill-mode: forwards;
  }

  @keyframes fadeout {
    0% {
      left: 0px;
    }
    99% {
      width: 318px;
    }
    100% {
      left: -328px;
      width: 0px;
    }
  }
  .fadeout-left {
    animation-name: fadeout;
    animation-duration: .5s; 
    animation-iteration-count: 1; 
    animation-fill-mode: forwards;
  }

  @keyframes toleft {
    0% {
      left: 320px;
    }
    100% {
      left: -8px;
    }
  }
  .to-left {
    animation-name: toleft;
    animation-duration: .5s; 
    animation-iteration-count: 1; 
    animation-fill-mode: forwards;
  }
  
  @keyframes toright {
    0% {
      left: -8px;
    }
    100% {
      left: 320px;
    }
  }
  .to-right {
    animation-name: toright;
    animation-duration: .5s; 
    animation-iteration-count: 1; 
    animation-fill-mode: forwards;  //  停留在最后一帧
  }
  
</style>
