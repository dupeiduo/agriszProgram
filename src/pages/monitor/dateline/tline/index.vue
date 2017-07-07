<template>
  <div>
    <div class="d-line pr"
      @mousedown="getStartPosition"
      @mouseup="getEndPosition"
      @mousemove="getLength"
      :style="{width: dlWidth + 'px'}">
      <ul class="d-line-list" :class="lineClassName">
        <li class="d-line-li"
          v-for="(item, index) in dlData"
          :style="{background: (curIndex === index ? '#d6f48f' : '')}"
          :class="(item.hasData ? '' : 'no-product')"
          @click="clickItem(item.date, index)">
          
          <div class="animation-detail pr">
            <span class="d-line-top" :style="{background: (curIndex === index ? '#d6f48f' : '')}"></span>
            <template  v-if="item.atmos && item.atmos.length > 0">
              <ul class="d-line-weather" v-loading.lock="atmosLoading">
                <li>累计降水量 <span class="color-blue">{{item.atmos[0] | dataFilter}}mm</span></li>
                <li>降水距平 <span class="color-blue">{{item.atmos[1] | dataFilter}}mm</span></li>
                <li>气温最大值 <span class="color-red">{{item.atmos[2] | dataFilter}}℃</span></li>
                <li>气温平均值 <span class="color-red">{{item.atmos[3] | dataFilter}}℃</span></li>
                <li>气温最小值 <span class="color-red">{{item.atmos[4] | dataFilter}}℃</span></li>
                <li>气温距平值 <span class="color-red">{{item.atmos[5] | dataFilter}}℃</span></li>
              </ul>
              <div class="history ps">历史</div>
            </template>

            <template v-else-if="item.forecast && item.forecast.length > 0">
              <ul class="wether-detail" v-loading.lock="forecastLoading"
                v-if="item.forecast[0].date == item.date">
                <li v-for="fore in item.forecast" class="pr">
                  <b>{{fore.day}}</b>
                  <span v-if="fore.nodata" class="iconfont" :class="fore.icon"></span>
                  <span v-else class="iconfont" :class="fore.icon" :style="{color: fore.color}"></span>
                </li>
              </ul>
              <div class="predict ps">预报</div>
            </template>
              
            <template v-else>
              <div class="none-data ps">
                <span class="iconfont icon-iconfontgantanhao"></span>
                暂无数据
              </div>
            </template>
          
          </div>
          <h3>{{item.period}} <span v-if="item.marker" class="iconfont icon-jinggao"></span></h3>
          <em></em>
          <div class="tl-item">
          </div>
          <p class="date-tip">
            {{item.hasData ? '点击查看' : '暂无数据'}} <span v-if="item.marker" class="iconfont icon-jinggao"></span>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  
  export default{
    props: {
      dlData:{
        type: Array,
        default: []
      },
      curIndex: {
        type: Number,
        default: -1
      },
      className: {
        type: String,
        default: ''
      },
      atmosLoading: {
        type: Boolean,
        default: false
      },
      forecastLoading: {
        type: Boolean,
        default: false
      },
      changeTimeHeight: {
         type: Boolean,
         default: false
      }
    },
    data(){
      return {
        dlWidth: 0,
        left: 0,
        currentX: 0,
        startDrag: false,
        binded: false,
        isMove: false,
        itemWidth: 155,
        lineClassName: 'animation-change-bottom'
      }
    },
    filters: {
      dataFilter(value) {
        if (value == -9999) {
          return " - "
        } else {
          return value
        }
      }
    },
    watch: {
      dlData: {
        handler: function (dlData) {
          this.dlWidth = this.dlData.length * this.itemWidth
          this.setEleLeft(this.curIndex)
        },     
      },
      changeTimeHeight(show){
        if(show){
          this.lineClassName = 'animation-change-top'
        }else {
          this.lineClassName = 'animation-change-bottom'
        }
      },
      curIndex: function (index) {
        this.setEleLeft(index)
      }
    },
    methods: {
      changeWeather(show){
        this.$emit('changeWeather',show)
      },
      clickItem(date, index) {
        if (!this.isMove) {
          this.$emit('change', {date, index})
        }
      },
      getCssValue(element, propertyName) {
        return element.currentStyle ? 
               element.currentStyle[propertyName] : 
               document.defaultView.getComputedStyle(element ,false)[propertyName]; 
      },
      getStartPosition(event) {
        var _target = event.currentTarget;
        this.startDrag = true
        this.isMove = false

        this.left = this.getCssValue(_target, "left");
        this.currentX = event.clientX;

        if (!this.binded) {
          this.binded = true

          document.onmouseup = () => {
            this.startDrag = false;  
            this.left = this.getCssValue(_target, "left");
          }
        }
      },
      getEndPosition(event) {
        this.startDrag = false
      },
      getLength(event) {
        this.isMove = true
        var dsWidth = this.getCssValue(document.getElementsByClassName('date-selector')[0], "width"),
          sWidth = '0px',
          tlLength = Number(dsWidth.slice(0,-2)) - Number(sWidth.slice(0,-2)) - 21, // get the length of date line
          leftBoundary = 45,  //  cur-year width
          rightBoundary = this.dlWidth - tlLength,
          e = event ? event: window.event,
          _target = e.currentTarget;
        if(this.startDrag){
          let nowX = e.clientX;
          let disX = nowX - this.currentX;
          if (parseInt(this.left) + disX <= -rightBoundary ) {
            _target.style.left =  `${-rightBoundary}px`;
          } else if (parseInt(this.left) + disX > leftBoundary) {
            _target.style.left = `${leftBoundary}px`;
          } else {
            _target.style.left = parseInt(this.left) + disX + "px";
          }
          this.setYear(_target.style.left)
          console.log(disX)
          if(disX < 5 && disX > -5) {
            this.isMove = false
          } else {
            this.isMove = true
          }
        }
      },
      setYear(left) {
        var marginLeft = -parseInt(left.toString().replace('px', '')),
          yearWidth = this.dlWidth - marginLeft - 80,
          year = yearWidth / (36 * this.itemWidth)
        
        this.$emit('setCurYear', new Date().getFullYear() - Math.floor(year))
      },
      setEleLeft(index) {
        var targ = document.getElementsByClassName('d-line')[0],
          elLeft = Number(this.getCssValue(targ, 'left').slice(0,-2)),
          left = (index * this.itemWidth - this.itemWidth),
          relWidth = this.dlWidth + elLeft,
          dsWidth = this.getCssValue(document.getElementsByClassName('date-selector')[0], "width")
        
        dsWidth = Number(dsWidth.slice(0,-2))
        
        if (relWidth > -dsWidth && relWidth < dsWidth) {  // start or end 
          return
        }

        if (left + elLeft < (dsWidth - this.itemWidth) && elLeft + left > -this.itemWidth) {
          return
        }

        if (this.dlWidth - left < dsWidth) {
          left = this.dlWidth - dsWidth
        }
        left = left == -this.itemWidth ? 0 : left
        targ.style.left = -left + 'px'
      }
    }
  }
</script>
<style 
lang="less" scoped>
@import '../../../../assets/style/common';
.color-blue {
  color: #1d64f9;
}
.color-red {
  color: #f01917;
}
  @item-width: 154px;
  .d-line {
    overflow: hidden;
    cursor: move;
    z-index: -10;
    position: relative;
    .btn {
      right: 0;
      top: 0;
    }
  }
  .d-line-list {
    .icon-jinggao {
      color: red;
    }
    .d-line-li {
      float: left;
      border-left: 1px solid #bebebe;
      border-bottom: 6px solid #8fcb0c;
      position: relative;
      .animation-detail {
        height: 140px;
        background: #fff;
        border-bottom: 1px solid #bebebe;
        .history,
        .predict {
            right: 10px;
            bottom: 10px;
            width: 34px;
            text-align: center;
            height: 14px;
            line-height: 14px;
            color: #bebebe;
            border: 1px solid #d2d2d2;
            border-radius: 4px;
        }
        .d-line-top {
          display: block;
          width: 154px;
          height: 4px;
          background: #c2c2c2;
        }
        .d-line-weather {
          height: 130px;
          padding-left: 6px;
          padding-top: 6px;
          background: #fff;
          border-bottom: 1px solid #bebebe;
          li {
            margin-bottom: 5px;
          }
        }
        .wether-detail {
          width: 150px;
          height: 124px;
          margin-top: 12px;
          overflow: hidden;
          li {
            width: 24px;
            height: 36px;
            margin: 0 3px;
            text-align: center;
            float: left;
            b {
              display: block;
              width: 24px;
              height: 15px;
              font-weight: normal;
            }
            span {
              width: 24px;
              line-height: 24px;
              display: block;
            }
            .icon-question1 {
              bottom: -6px;
              left: -2px;
              font-size: 22px;
              color: #c9c9c9;
            }
          }
        }
      }
      .none-data {
        font-size: 18px;
        left: 50%;
        top: 50%;
        transform: translate(-50%;-50%);
        text-align: center;
        color: #b8b8b8;
        span {
          font-size: 18px;
          display: block;
        }
      }
      h3 {
        width: 80px;
        font-weight: normal;
        font-size: 12px;
        position: absolute;
        bottom: 3px;
        left: 50%;
        text-align: center;
        transform: translate(-50%,0);
        span {
          color: red;
        }
      }
      em {
        position: absolute;
        left: -1px;
        bottom: -6px;
        width: 1px;
        height: 6px;
        z-index: 2;
        background: #ecff8a;
      }

      .tl-item {
        position: relative;
        top: 3px;
        width: @item-width;
      }
      .date-tip {
        display: none;
        text-align: center;
        position: relative;
        width: @item-width;
        bottom: 22px;
        color: #000;
      }
      &:hover {
        background: #deefb4;
        h3 {
          display: none;
        }
        .date-tip {
          display: block;
        }
      }
    }

    .no-product {
      border-bottom: 6px solid #a0a0a0;
      &:hover {
        background: #e0e0e0;
        border-bottom: 6px solid #b1b4b4;
      }
    }
    .active {
      border-bottom: 6px solid #b1edfc;
    }
  }
  .animation-change-bottom {
    .d-line-li {
      h3 {
        bottom: 2px;
      }
      .date-tip {
        bottom: -2px;
      }
      .animation-detail {
        display: none;
      }
      .adv-animation(change-bottom;.5s;1;forwards);
    }
  }
  @keyframes change-bottom {
    0% {
        height: 164px;
    }
    100% {
        height: 22px;
    }
  }
  .animation-change-top {
    .d-line-li {
      .date-tip {
        top: 3px;
      }
      .animation-detail {
        display: block;
      }
      .adv-animation(change-top;.5s;1;forwards)
    }
  }
  @keyframes change-top {
    0% { 
        height: 22px;
    }
    100% {
        height: 164px;
    }
  }
</style>