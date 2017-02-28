<template>
  <div>
    <div class="d-line"
      @mousedown="getStartPosition"
      @mouseup="getEndPosition"
      @mousemove="getLength"
      :style="{width: dlWidth + 'px'}">
      <ul>
        <li v-for="(item, index) in dlData"
          :style="{background: (curIndex === index ? '-webkit-linear-gradient(bottom,#c4ddfb,#fff)' : '')}"
          :class="(item.hasData ? '' : 'no-product')"
          @click="clickItem(item.date, index)">
          <h3>{{item.period}}</h3>
          <em></em>
          <div>
            <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
          </div>
          <p class="date-tip">
            {{item.hasData ? '点击查看' : '暂无数据'}}
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
      }
    },
    data(){
      return {
        dlWidth: 0,
        left: 0,
        currentX: 0,
        startDrag: false,
        binded: false
      }
    },
    watch: {
      dlData: function (dlData) {
        this.dlWidth = this.dlData.length * 110
        this.setEleLeft(this.curIndex)
      },
      curIndex: function (index) {
        this.setEleLeft(index)
      }
    },
    methods: {
      clickItem(date, index) {
        this.$emit('change', {date, index})
      },
      getCssValue(element, propertyName) {
        return element.currentStyle ? 
               element.currentStyle[propertyName] : 
               document.defaultView.getComputedStyle(element ,false)[propertyName]; 
      },
      getStartPosition(event) {
        var _target = event.currentTarget;
        this.startDrag = true;
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
        var _target = event.currentTarget;
        this.startDrag = false;  
        this.left = this.getCssValue(_target, "left");
      },
      getLength(event) {
        var dsWidth = this.getCssValue(document.getElementsByClassName('date-selector')[0], "width"),
          sWidth = this.getCssValue(document.getElementsByClassName('date-slider')[0], "width"),
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
        }
      },
      setEleLeft(index) {
        var targ = document.getElementsByClassName('d-line')[0],
          elLeft = Number(this.getCssValue(targ, 'left').slice(0,-2)),
          left = (index * 110 - 300)
        
        if (left + elLeft < 300 && elLeft + left > -300) {
          return
        }
        targ.style.left = -left + 'px'
      }
    }
  }
</script>
<style lang="less" scoped>
  .d-line {
    overflow: hidden;
    cursor: move;
    z-index: -10;
    height: 90px;
    margin-top: 8px;
    position: relative; 
  }
  ul {
    margin-top: 28px;
    li {
      height: 40px;
      float: left;
      border-left: 1px solid #a0a0a0;
      border-bottom: 8px solid #9dc8fb;
      padding-top: 12px;
      position: relative;

      h3 {
        font-weight: normal;
        font-size: 12px;
        position: absolute;
        top: -16px;
        left: 0;
      }
      em {
        position: absolute;
        left: -5px;
        bottom: -8px;
        width: 10px;
        height: 10px;
        z-index: 2;
        background: #fdfad1;
        border-radius: 50%;
      }

      div {
        border-bottom: 1px solid #9e9e9e;
        position: relative;
        top: 3px;
        span {
          width: 10px;
          height: 32px;
          display: inline-block;
          border-left: 1px dotted #ccc;
          
          &:first-child {
            border-left: 0px dotted #ccc;
          }
        }
      }
      .date-tip {
        display: none;
        text-align: center;
        position: relative;
        width: 100px;
        top: -35px;
        left: 5px;
        color: #977c00;
      }
      &:hover {
        background: -webkit-linear-gradient(bottom,#c4ddfb,#fff);
        .date-tip {
          display: block;
        }
      }
    }

    .no-product {
      border-bottom: 8px solid #a0a0a0;
    }
    .active {
      border-bottom: 8px solid #b1edfc;
    }
  }
</style>