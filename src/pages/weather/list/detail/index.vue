<template>
  <div class="list-detail" >
    <div class="list-title-container">
      <h3 class="list-title">请点击地图, 查看气象历史走势数据</h3> 
    </div>

    <ul class="list-container clear">
      <li 
        v-for="(item, index) in diffList" 
        class="main-li-title fl pr"
        :class="currentCategory === index ? 'checkedTitleStyle' : ''"
        @click="chooseCategory(index)"
        >
        <i class="iconfont" :class="item.icon" :style="{color: currentCategory === index ? item.color : '#3e3e3e'}"></i>
        <i class="categray-name">{{item.name}}</i>
        <i :class="currentCategory === index ? 'list-slider' : ''"  ></i>
        <i :class="currentCategory === index ? 'list-slider-triangle' : ''"  ></i>
      </li>
    </ul>

    <ul class="li-child-container clear" :style="{'max-height': showMe ? screenHeight - echartHeight - 368+ 'px' : screenHeight - 368 + 'px' ,'min-height':listMinHeight + 'px'}">

      <li class="clear second-level-li"
          v-if="groupFirst.length === 0 ? false : true"
          >
        <i class="li-txt-border"
           v-for="(itemChild, index) in groupFirst"
           :class="[currentRange1 === index ? 'checkedRangeStyle' : '']"
          
           @click="chooseRangeFirst(index)">
          <i class="li-txt" 
              :class="((groupFirst.length % 2) === 0) && (index === groupFirst.length - 1 || index === groupFirst.length - 2) || ((groupFirst.length / 2) !== 0) && (index === groupFirst.length - 1) ? 'no-border' : ''"
          >{{itemChild.name}}</i>
        </i>
      </li>

      <li class="clear second-level-li"
          v-if="groupSecond.length === 0 ? false : true"
          >
        <i class="li-txt-border"
           v-for="(itemChild, index) in groupSecond"
           :class="[currentRange2 === index ? 'checkedRangeStyle' : '']"
          
           @click="chooseRangeSecond(index)">
          <i class="li-txt" 
              :class="(((groupSecond.length % 2) === 0) && (index === groupSecond.length - 1 || index === groupSecond.length - 2)) || (((groupSecond.length / 2) !== 0) && (index === groupSecond.length - 1)) ? 'no-border' : ''"
          >{{itemChild.name}}</i>
        </i>
      </li>

      <li class="clear second-level-li"
          v-if="groupThird.length === 0 ? false : true"
          >
        <i class="li-txt-border"
           v-for="(itemChild, index) in groupThird"
           :class="[currentRange3 === index ? 'checkedRangeStyle' : '']"
          
           @click="chooseRangeThird(index)">
          <i class="li-txt" 
              :class="((groupThird.length % 2) === 0) && (index === groupThird.length - 1 || index === groupThird.length - 2) || ((groupThird.length / 2) !== 0) && (index === groupThird.length - 1) ? 'no-border' : ''"
          >{{itemChild.name}}</i>
        </i>
      </li>

      <li class="clear second-level-li"
          v-if="groupFourth.length === 0 ? false : true"
          >
        <i class="li-txt-border"
           v-for="(itemChild, index) in groupFourth"
           :class="[currentRange4 === index ? 'checkedRangeStyle' : '']"
          
           @click="chooseRangeFourth(index)">
          <i class="li-txt" 
              :class="((groupFourth.length % 2) === 0 && (index === groupFourth.length - 1) || (index === groupFourth.length - 2)) || ((groupFourth.length % 2) !== 0) && (index === groupFourth.length - 1) ? 'no-border' : ''"
          >{{itemChild.name}}</i>
        </i>
      </li>
    </ul>

  </div>
</template>
<script>
  import configData from '../../config/index.js'
  import {mapGetters} from 'vuex'

  export default{
    props:{
      echartHeight:{
        type: Number,
        default: 212
      },
      showMe: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return {
        diffList: configData.menu,
        subMenu: configData.menu[0].child,
        subGroup: configData.menu[0].child.group,
        currentCategory: 0,
        currentIconColor: configData.menu[0].color,
        currentRange1: 0,
        currentRange2: 0,
        currentRange3: 0,
        currentRange4: 0,
        listMinHeight: 100,

        groupFirst:[],
        groupSecond:[],
        groupThird:[],
        groupFourth:[],
      }
    },
    computed: {
      ...mapGetters({
        screenHeight: 'getScreenHeight'
      })
    },

    mounted(){
      this.chooseCategory(0)
      this.formatListGroup(this.subMenu)
    },
    methods:{
      formatListGroup(list){
        this.groupFirst = []
        this.groupSecond = []
        this.groupThird = []
        this.groupFourth = []
        for (var i = 0; i < list.length; i++) {
          if (list[i].group === 1) {
            this.groupFirst.push(list[i])
          }else if (list[i].group === 2) {
            this.groupSecond.push(list[i])
          }else if (list[i].group === 3) {
            this.groupThird.push(list[i])
          }else if (list[i].group === 4) {
            this.groupFourth.push(list[i])
          }
        }
      },
      chooseCategory(index){
        this.subMenu = this.diffList[index].child
        this.formatListGroup(this.subMenu)
        this.currentCategory = index
        this.chooseRangeFirst(0)
      },
      initCurrentRange(){
        this.currentRange1 = -1
        this.currentRange2 = -1
        this.currentRange3 = -1
        this.currentRange4 = -1
      },
      chooseRangeFirst(index){
        this.initCurrentRange()
        this.currentRange1 = index
        this.$emit('getCategory',this.groupFirst[index])
      },
      chooseRangeSecond(index){
        this.initCurrentRange()
        this.currentRange2 = index
        this.$emit('getCategory',this.groupSecond[index])

      },
      chooseRangeThird(index){
        this.initCurrentRange()
        this.currentRange3 = index
        this.$emit('getCategory',this.groupThird[index])

      },
      chooseRangeFourth(index){
        this.initCurrentRange()
        this.currentRange4 = index
        this.$emit('getCategory',this.groupFourth[index])
      },
    },
    watch: {
  
    },
    components: {}
  }
</script>
<style
 lang="less" scoped>
 @import '../../../../assets/style/common';
 

 .list-detail { 
    &:fitst-child {
      margin-left: 0;
    }
    .list-title-container {
      padding: 9px 0;
      background: @product-list-bg;
      .list-title{
        .adv-title-normal();
        padding-left: 14px;
      }
    }
    .list-container {
      border-bottom: 4px solid #e5e5e5;
      
      .main-li-title {
        .adv-font-normal();
        box-sizing: border-box;
        padding: 11px 19px;
        color: #a4a4a4;
        cursor: pointer;
        .categray-name {
          &:hover {
            color: #3e3e3e;
          };
        }
        .list-slider {
          position: absolute;
          bottom: -4px;
          right: 0;
          background: #97cb6f;
          display: block;
          width: 85%;
          height: 4px;
        }
        .list-slider-triangle {
          position: absolute;
          bottom: 0;
          left: 50%;
          content: '';
          width: 0;
          height: 0;
          border:4px solid transparent;
          border-bottom-color: #97cb6f;
        }
      }
      .checkedTitleStyle {
        color: #3e3e3e;
      }
    }
    .li-child-container {
      width: 100%;
      overflow: auto;
      background: #fafafa;
      border-bottom: 4px solid #e5e5e5;
      .second-level-li {
        border-bottom: 2px solid #c9c9c9;
        &:last-child {
          border: none;
        }
        .li-txt-border {
          width: 50%;
          float: left;
          padding: 0 8px;
          overflow: hidden;
          box-sizing: border-box;
          display: inline-block;
          text-align: center;
          cursor: pointer;
          &:nth-child(odd) {
            border-right: 1px solid #e5e5e5;
          }
          &:nth-child(even) {
            border-right: none;
          }
          .li-txt {
            padding: 15px 0;
            box-sizing: border-box;
            display: block;
            text-align: center;
            line-height: 12px;
            border-bottom: 1px solid #e5e5e5;
          }
          .no-border {
              border-bottom: none;
            }
        }
        .checkedRangeStyle {
          background: #eaf3db;
          color: #6ea101;
        }
        
      }
    }
 }
  
</style>


