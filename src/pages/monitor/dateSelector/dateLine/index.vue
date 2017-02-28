<template>
  <div class="date-line" :class="expand ? 'dl-expand' : 'dl-shrink'">
    <div class="dl-header">
      <i>{{curYear}}</i><span></span>
    </div>
    <t-line class="dl-body"
      :curIndex="curIndex"
      :dlData="dateLineData"
      @change="change"></t-line>
    <div class="dl-footer" @click="expand = !expand">
      <span class="iconfont" 
        :class="expand ? 'icon-xiangzuo' : 'icon-xiangyou'"></span>
    </div>
  </div>
</template>

<script>
import {dateUtil} from 'plugins/utils.js'
import tLine from './tline'
  export default{
    props: {
      dlData: {
        type: Object,
        default: null
      },
      start:{
        type: Date,
        default: new Date('2010-01-01')
      },
      end:{
        type: Date,
        default: new Date()
      },
      date: {
        type: Date,
        default: new Date()
      }
    },
    data(){
      return {
        expand: false,
        curIndex: 0,
        dateLineData: [],
        curYear: ''
      }
    },
    mounted() {
      this.expandCtl(this.dlData !== null && this.dlData.index !== 0)
    },
    methods: {
      change(data) {
        this.curIndex = data.index;
        var date = new Date(data.date);
        this.$emit('changeDate', date)
      },
      expandCtl(expand) {
        this.expand = expand
      }
    },
    watch: {
      dlData: function (dlData) {
        this.expandCtl(this.dlData !== null && this.dlData.index !== 0)
        this.curIndex = dlData.index
        this.dateLineData = dlData.data
        this.curYear = this.dateLineData[this.curIndex].date.toString().substr(0, 4)
      },
      date: function (date) {
        var dateStr = dateUtil.formatDate(date)

        for (var i = this.dateLineData.length - 1; i >= 0; i--) {
          if(this.dateLineData[i].date === dateStr) {
            this.curIndex = i;
            this.curYear = this.dateLineData[i].date.toString().substr(0, 4)
            return
          }
        }
      }
    },
    components: {
      tLine

    }
  }
</script>
<style 
lang="less" 
scoped>
@import '../../../../assets/style/reset';
.date-line {
  position: relative;
  overflow: hidden;
  height: 102px;

  .dl-header {
    position: absolute;
    background: #fff;
    width: 45px;
    height: 98px;
    color: #539ef9;
    left: 222px;
    font-size: 14px;
    text-align: center;
    z-index: 3;
    margin-top: 1px;
    i {
      position: relative;
      top: 20px;
    }
    span {
      position: absolute;
      width: 5px;
      height: 50px;
      top: 36px;
      left: 25px;
      border-left: 1px solid #a0a0a0;
    }
  }
  .dl-body {
    background: #fff;
    z-index: 0;
    height: 100px;
    margin-left: 220px;
    position: absolute;
    left: 0;
    background-color: #fff;
    border: 1px solid #d0d0d0;
    .box-bottom;
  }
  .dl-footer {
    position: absolute;
    right: 0;
    top: 0;
    width: 20px;
    height: 101px;
    line-height: 100px;
    text-align: center;
    font-size: 20px;
    color: #949494;
    cursor: pointer;
    border-left: 1px solid #d0d0d0;
    background: -webkit-linear-gradient(top,#ffffff,#e6e5e5);
    z-index: 20;
  }
}
@keyframes shrink {
  0% {
    width: 100%;
  }
  100% {
    width: 240px;
  }
}
.dl-shrink {
  .mixin-animation(shrink;.5s;1;forwards);
}

@keyframes expand {
  0% {
    width: 240px;
  }
  100% {
    width: 100%;
  }
}
.dl-expand {
  .mixin-animation(expand;.5s;1;forwards)
}
</style>