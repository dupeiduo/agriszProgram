<template>
  <div class="dcp-opcityctl no-select" 
    :style="{width: width + 'px'}">
    <div class="play-container iconfont"
      :class="play ? 'icon-kaishi' : 'icon-kaishi1'"
      @click="play = !play">
    </div>
    <div class="line" :style="{width: lineWidth + 'px'}">
      <span class="bg-line" 
        @click="goToPositon"
        @mouseout="showTip = false"
        @mousemove="showTipDate"
        :style="{width: lineWidth + 'px'}"></span>
      <span class="sel-line"
        @click="goToPositon"
        @mouseout="showTip = false"
        @mousemove="showTipDate"
        :style="{width: left + 'px'}"></span>
      <i class="slider drager ps" 
        :style="{left: left + 'px'}">
          <span class="cf-tl-slider-date" style="display: block;">{{curDate}}</span>
      </i>
      <div class="date-items">
        <div class="tip-date"
          v-if="showTip"
          :style="{left: tipLeft + 'px'}"
          >{{tipDate}}</div>
        <span 
          :style="{left: item.left + 'px'}"
          v-for="item in tlData">
          <p>{{item.date}}</p>
          <i @click="goToPositon"></i>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
  import {dateUtil} from 'plugins/utils.js'
  import {elementUtil} from 'plugins/utils.js'
  import tools from '../opctools/index.js'
  export default {
    data() {
      return {
        play: false,
        timeInter: null,
        left: '0',
        curDate: '',
        width: 1280,
        fitScreen: 0,
        lineWidth: 1209,
        tlData: [],
        showTip: false,
        tipDate: '',
        tipLeft: 0,
        model: null
      }
    },
    props: {
      dates: {
        type: Array,
        default: []
      },
      time: {
        type: Number,
        default: 1800
      },
      step: {
        type: Number,
        default: 1.5
      }
    },
    mounted() {
      var bodyWidth = Number(this.getCssValue(document.body, 'width').slice(0, -2)) - 10
      if (bodyWidth > 1280) {
        fitScreen = (bodyWidth - 1280) / 2
        this.width = 1280
      } else {
        this.width = bodyWidth
      }
      // minus player width
      this.lineWidth = this.width - 60 - 20

      var line = document.getElementsByClassName('line')[0],
          slider = document.getElementsByClassName('drager')[0]
      elementUtil.drag(line, slider, 0, this.lineWidth, (left) => {
        this.left = left
        this.$emit('changeOpacity', this.left / this.lineWidth)
      })
    },
    methods: {
      autoPlay() {
        this.play = true
        clearInterval(this.timeInter)
        var _time = 0,
          speed = Math.ceil(this.lineWidth / this.time);

        this.timeInter = setInterval(() => {
          _time +=  this.step
          this.left = Number(this.left) + speed * this.step

          if (_time >= this.time || this.left >= this.lineWidth - 11) {
            this.left = this.lineWidth - 11
            clearInterval(this.timeInter)
            this.play = false
          }
        }, this.step)
      },
      getCssValue(el, propName) {
        return el.currentStyle ? 
               el.currentStyle[propName] : 
               document.defaultView.getComputedStyle(el ,false)[propName]; 
      },
      renderDate(dates) {
        var len = dates.length;
        var timeLen = dates[len - 1].getTime() - dates[0].getTime()

        for (let i = 0; i < len; i++) {
          this.tlData[i] = {}
          this.tlData[i].date = dateUtil.formatDateToMonthZH(dates[i])
          this.tlData[i].left = (dates[i].getTime() - dates[0].getTime()) / timeLen * this.lineWidth;
        }
        this.autoPlay()
      },
      goToPositon(event) {
        var x = event.clientX
        this.left = x - 60 - 23
      },
      showTipDate(event) {
        var x = event.clientX,
          date = new Date(),
          len = this.dates.length,
          timeLen = this.dates[len - 1].getTime() - this.dates[0].getTime(),
          timeLeft = timeLen / this.lineWidth,
          time;
        this.tipLeft = x - 60 - 23
        if (this.tipLeft < 80 || this.lineWidth - this.tipLeft < 100) {
          this.showTip = false
        } else {
          time = this.tipLeft * timeLeft + this.dates[0].getTime();
          date.setTime(time);
          this.tipDate = dateUtil.formatDateToMonthZH(date)
          this.showTip = true
        }
      }
    },
    watch: {
      play: function (play) {
        if (play) {
          this.left = (this.left >= this.lineWidth - 11) ? 0 : this.left
          this.autoPlay();
        } else {
          clearInterval(this.timeInter)
        }
      },
      dates: function (dates) {
        if (dates && dates.length > 0) {
          this.renderDate(dates)
          this.model = tools.createModel(dates)
        }
      },
      left: function (left) {
        tools.refreshModel(this.model, Number(left/ this.lineWidth), tools.suLiner)
        this.$emit('layerOpacity', this.model.layers)
      }
    },
    beforeDestroy(){
      // unbind events
      // var line = document.getElementsByClassName('line')[0],
      //     slider = document.getElementsByClassName('drager')[0]
      // line.removeEventListerner('onmouseup')
      // line.removeEventListerner('onmousemove')
      // slider.removeEventListerner('onmousedown')
      // document.removeEventListerner('onmouseup')
    }
  }
</script>


<style lang="less" rel="stylesheet/less" scoped>
  .dcp-opcityctl {
    position: relative;
    background: #fff; 
    height: 66px;
    margin: 5px;

    .play-container {
      float: left;
      line-height: 54px;
      width: 59px;
      height: 52px;
      margin: 7px 4px;
      cursor: pointer;
      text-align: center;
      color: #a7ccfa;
      border-right: 1px solid #d2d2d2;
    }
    .icon-kaishi {
      font-size: 40px;
      line-height: 48px
    }
    .icon-kaishi1 {
      font-size: 44px;
      line-height: 54px
    }
    .line {
      position: absolute;
      height: 66px;
      left: 70px;

      .slider {
        position: absolute;
        z-index: 3;
        top: 25px;
        width: 22px;
        height: 28px;
        cursor: move;
        background: url(/static/assets/img/common/time-bar.png) no-repeat;
      }
      span {
        position: absolute;
        height: 12px;
        bottom: 15px;
        cursor: pointer;
        box-shadow: inset 1px 1px 2px #9e9e9e;
        z-index: 1;
      }
      .bg-line {
        background: #d2d2d2;
      }
      .sel-line {
        background: #8dbff7;
      }
      .date-items {
        position: absolute;
        width: 100%;
        height: 66px;
        .tip-date {
          position: absolute;
          top: 9px;
        }
        span {
          position: absolute;

          &:nth-last-child(1) {
            p {
              left: -60px;
            }
          }
          p {
            display: inline-block;
            top: -30px;
            position: absolute;
            width: 100px;
            z-index: 5;
          }
          i {
            position: absolute;
            z-index: 2;
            display: block;
            width: 7px;
            height: 18px;
            margin: -8px 0;
            border: 1px solid #c8c8c7;
            border-radius: 2px;
            background: #fff;
            background: linear-gradient(top,#fff,#f5fded);
            box-shadow: 1px 1px 2px #dcdcdc;
          }
        }
      }
    }
      
  }
    
</style>