<template>
  <div>
    <div class="container">
      <span class="bg-color"></span>
      <span class="up iconfont icon-icon1460361798771" 
        @click="pre"></span>

      <ul  v-if="sliders.length !== 3"
        :class="className">
        <li
          v-for="(item, index) in list"
          :class="(curSlider === item) ? 'active' : ''">
          <i>{{item}}</i>
        </li>
      </ul>
      <!-- not good -->
      <ul v-else :class="className">
        <li
          v-for="(item, index) in list"
          :class="(curSlider === item) ? 'active' : ''">
          <i v-if="item === 1">上旬</i>
          <i v-else-if="item === 2">中旬</i>
          <i v-else>下旬</i>
        </li>
      </ul>

      <span class="down iconfont icon-jiantou-copy-copy-copy-copy-copy" 
        @click="next"></span>
    </div>
  </div>
</template>

<script>
import {dateUtil} from 'plugins/utils.js'


export default{
    props: {
      sliders: {
        type: Array,
        default: []
      },
      current: {
        type: Number,
        default: 0
      },
      grade: {
        type: String,
        default: 'y'
      }
    },
    data(){
      return {
        marginTop: 0,
        className: '',
        list: [],
        curSlider: 0,
        beforeAnimate: false,
        timeHandler: null,
      }
    },
    methods: {
      pre() {
        this.clearAnimate()
        var len = this.sliders.length
        if (len === 3) {
          if (this.current === 1) {
            this.list = [2,3,1,2]
            this.curSlider = 3
          } else if (this.current === 2) {
            this.list = [3,1,2,3]
            this.curSlider = 1
          } else {
            this.list = [1,2,3,1]
            this.curSlider = 2
          }
          
        } else {
          if (this.current === this.sliders[0]) {
            this.list.unshift(this.sliders[len - 2])
            this.curSlider = this.sliders[len - 1]
          } else if (this.current === this.sliders[1]) {
            this.list.unshift(this.sliders[len - 1])
            this.curSlider = this.sliders[0]
          } 
          else {
            this.list.unshift(this.current -2)
            this.curSlider = this.current - 1
          }
        }

        this.doAnimate("slide-down")
      },
      next() {
        this.clearAnimate()
        var len = this.sliders.length
        if (len === 3) {
          if (this.current === 1) {
            this.list = [3,1,2,3]
            this.curSlider = 2
          } else if (this.current === 2) {
            this.list = [1,2,3,1]
            this.curSlider = 3
          } else {
            this.list = [2,3,1,2]
            this.curSlider = 1
          }
        } else {
          if (this.current === this.sliders[len - 1]) {
            this.list.push(this.sliders[1])
            this.curSlider = this.sliders[0]
          } else if (this.current === this.sliders[len - 2]) {
            this.list.push(this.sliders[0])
            this.curSlider = this.sliders[len - 1]
          }
           else {
            this.list.push(this.current + 2)
            this.curSlider = this.current + 1;
          }
        }
        
        this.doAnimate("slide-up")
      },
      doAnimate(className) {
        this.className = className
        this.beforeAnimate = true
        this.timeHandler = setTimeout(() => {
          this.className=""
          this.beforeAnimate = false
          this.$emit('change', {
            index: this.curSlider,
            grade: this.grade
          })
        }, 500) // clear class name
      },
      clearAnimate() {
        if (this.beforeAnimate) {
          clearTimeout(this.timeHandler)
          setTimeout(() =>  {
            this.className=""
            this.beforeAnimate = false
            this.$emit('change', {
              index: this.curSlider,
              grade: this.grade
            })
          }, 0)
        } 
      }
    },
    watch: {
      current: function (current, oldValue) {
        this.curSlider = current;
        var len = this.sliders.length
        if (current === this.sliders[0]) {
          this.list = [this.sliders[len -1], current, this.sliders[1]]
        } else if(current === this.sliders[len -1]) {
          this.list = [this.sliders[len -2], current, this.sliders[0]]
        } else {
          this.list = [current - 1 ,current, current + 1]
        }
      }
    }
  }
</script>

<style 
  lang="less" scoped>
  .container {
    &:hover  {
      .iconfont {
        display: block;
      }
      ul {
        background: #eeeeee;
      }
    }
    &:last-child {
      border: none;
    }
    &:nth-child(2) {
      width: 73px;
    }
  }
  span {
    display: none;
    position: absolute;
    font-size: 20px;
    color: #74a5fd;
    cursor: pointer;
    width: 72px;
    height: 33px;
    line-height: 33px;
    z-index: 5;
    background: #eeeeee;
  }
  .up {
  }
  .down {
    top: 68px;
    font-size: 19px;
  }
  ul {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 72px;
    border-right: 1px solid #d2d2d2;
    li {
      height: 33px;
      line-height: 33px;
      overflow: hidden;
      color: #2c3e50;
    }
    .active {
      color: #539ef9;
      font-size: 16px;
    }
  }
  
  @keyframes slideup {
    0% {
      margin-top: 0px;
    }
    100% {
      margin-top: -33px;
    }
  }
  .slide-up {
    animation-name: slideup;
    animation-duration: .5s; 
    animation-iteration-count: 1; 
    animation-fill-mode: forwards;  //  停留在最后一帧
  }
  @keyframes slidedown {
    0% {
      margin-top: -33px;
    }
    100% {
      margin-top: 0px;
    }
  }
  .slide-down {
    animation-name: slidedown;
    animation-duration: .5s; 
    animation-iteration-count: 1; 
    animation-fill-mode: forwards;  //  停留在最后一帧
  }
</style>
