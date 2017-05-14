<template>
  <div>
    <div class="d-line"
      @mousedown="getStartPosition"
      @mouseup="getEndPosition"
      @mousemove="getLength"
      :style="{width: dlWidth + 'px'}">
      <ul>
        <li v-for="(item, index) in dlData"
          :style="{background: (curIndex === index ? '#d6f48f' : '')}"
          :class="(item.hasData ? '' : 'no-product')"
          @click="clickItem(item.date, index)">
          <h3>{{item.period}}</h3>
          <em></em>
          <div class="tl-item">
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
        binded: false,
        isMove: false
      }
    },
    watch: {
      dlData: function (dlData) {
        this.dlWidth = this.dlData.length * 111
        this.setEleLeft(this.curIndex)
      },
      curIndex: function (index) {
        this.setEleLeft(index)
      }
    },
    methods: {
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
        }
      },
      setYear(left) {
        var marginLeft = -parseInt(left.toString().replace('px', '')),
          yearWidth = this.dlWidth - marginLeft - 80,
          year = yearWidth / (36 * 111)
        
        this.$emit('setCurYear', new Date().getFullYear() - Math.floor(year))
      },
      setEleLeft(index) {
        var targ = document.getElementsByClassName('d-line')[0],
          elLeft = Number(this.getCssValue(targ, 'left').slice(0,-2)),
          left = (index * 111 - 111),
          relWidth = this.dlWidth + elLeft,
          dsWidth = this.getCssValue(document.getElementsByClassName('date-selector')[0], "width")
        
        dsWidth = Number(dsWidth.slice(0,-2))
        
        if (relWidth > -dsWidth && relWidth < dsWidth) {  // start or end 
          return
        }

        if (left + elLeft < (dsWidth - 111) && elLeft + left > -111) {
          return
        }

        if (this.dlWidth - left < dsWidth) {
          left = this.dlWidth - dsWidth
        }
        left = left == -111 ? 0 : left
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
    height: 42px;
    margin-top: 8px;
    position: relative; 
  }
  ul {
    li {
      height: 22px;
      float: left;
      border-left: 1px solid #bebebe;
      border-bottom: 6px solid #8fcb0c;
      position: relative;

      h3 {
        font-weight: normal;
        font-size: 12px;
        position: absolute;
        top: 3px;
        left: 50%;
        width: 60px;
        text-align: center;
        transform: translate(-50%,0);
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
        width: 110px;
      }
      .date-tip {
        display: none;
        text-align: center;
        position: relative;
        width: 110px;
        top: 3px;
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
</style>