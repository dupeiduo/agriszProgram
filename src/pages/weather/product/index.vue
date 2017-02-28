<template>
  <div>
    <left-tab class="weath-prod"
        :showList="showList"
        @toggleList="toggleListStatus"
        :leftTab="[{name: '产品'}, {name: '介绍'}]"
        :title="title"
        :onlyList="true"
        :index="pindex"
        @clickMenu="clickMenu">
      <div slot="list">
        <div v-if="pindex === 0" class="product">
          <p>选择产品</p>
          <div @click="toggle = !toggle"
            :class="toggle ? 'product-active' : ''">
            <h3>
              <span class="triangle-right"></span>
              {{listData[0].name}}
              <i class="fr">{{listData[0].value.length}}</i>
            </h3>
            <transition name="custom-classes-transition"
            enter-active-class="fade-expand"
            leave-active-class="fade-shrink">
            <div v-show="toggle" class="toggle-container" id="toggle-container">
              <ul>
                <li v-for="(item, index) in listData[0].value"
                :class="(curIndex == index) ? 'active' : ''"
                @click="showProduct(index)">
                {{item.name}}
              </li>
            </ul>
          </div>   
        </transition>
      </div>
          <p>图层样式</p>
          <div class="block slider-container">
            <opacity-ctl 
              :opacity="opacity"
              @changeOpacity="changeOpacity"
              ></opacity-ctl>
          </div>
        </div>
        <div v-else class="help" :style="{'max-height':cHeight}">
          <p>气象插值产品是利用了数据插值的科学方法，加工气象站点的气象数据后得到的气象数据产品。</p>
          <p>在离散数据的基础上补插连续函数，使得这条连续曲线通过全部给定的离散数据点。插值是离散函数逼近的重要方法，利用它可通过函数在有限个点处的取值状况，估算出函数在其他点处的近似值。插值：用来填充图像变换时像素之间的空隙。</p>
          <p>早在6世纪，中国的刘焯已将等距二次插值用于天文计算。17世纪之后，I.牛顿，J.-L.拉格朗日分别讨论了等距和非等距的一般插值公式。在近代，插值法仍然是数据处理和编制函数表的常用工具，又是数值积分、数值微分、非线性方程求根和微分方程数值解法的重要基础，许多求解计算公式都是以插值为基础导出的。</p>
        </div>
      </div>
    </left-tab>
  </div>
</template>

<script>
import leftTab from 'components/leftTab'

  export default {
    data () {
      return {
        backList: false,
        title: '气象数据产品',
        pindex: 0,
        opacity: 90,
        toggle: false,
        curIndex: -1,
        showList: false,
        cHeight: ''
      }
    },
    props: {
      listData: {
        type: Array,
        default: []
      }
    },
     mounted(){
      var cHeight = document.documentElement.clientHeight || document.body.clientHeight;
          this.cHeight = (cHeight - 100) + 'px';
    },
    methods: {
      clickMenu(index) {
        this.pindex = index
        this.showList = true
        if (index === 0) {
          this.pindex = index
          this.title = '气象数据产品'
        } else {
          this.pindex = index
          this.title = '气象数据产品介绍'
        }
      },
      toggleListStatus(isShow) {
        this.showList = isShow;
      },
      showProduct(index) {
        this.showList = false
        this.curIndex = index;
        this.$emit('addWpLayer', this.listData[0].value[index])
      },
      changeOpacity(value) {
        this.$emit('ctlOpacity', value)
      }
    },
    components: {
      leftTab
    }
  }
</script>

<style 
  lang="less">
  .weath-prod {
    .product {
      .product-active {
         h3:hover {
            background: #838486;
         }
         h3 {
            color: #fff;
            border-radius: 4px 4px 0 0;
            background: #85898a;
              .triangle-right {
                -webkit-transform: rotate(90deg);
                -moz-transform: rotate(90deg);
                -ms-transform: rotate(90deg);
                transform: rotate(90deg);
                border-left: 6px solid #fff;
            }
         }
         ul {
            border-right: 1px solid #838486;
            border-bottom: 1px solid #838486;
            border-left: 1px solid #838486;
        }
      }
      h3 {
        margin: 5px 10px 0;
        cursor: pointer;
        line-height: 40px;
        height: 40px;
        padding-left: 10px;
        border-radius: 4px;
          .triangle-right {
            display: inline-block;
            width: 0;
            height: 0;
            margin: 10px 10px 0 4px;
            border-top: 3px solid transparent;
            border-bottom: 3px solid transparent;
            border-left: 6px solid #777;
          }
          i {
            line-height: 20px;
            width: 20px;
            height: 20px;
            margin: 10px;
            text-align: center;
            color: #fff;
            border-radius: 50%;
            background: #777;
          }
        &:hover {
          background: #eee;
        }
      }
      div {
        ul {
          margin: 0 10px;
          li:last-child {
            border-bottom: none;
          };
          li {
            border-radius: 3px;
            cursor: pointer;
            padding: 2px 10px;
            border-bottom: 1px solid #ddd;
            &:hover {
              text-decoration: underline;
              color: #2f3031;
            }

          }
          .active {
            background: #eee;
          }
        }
      }
      p {
        font-size: 14px;
        margin: 18px 0 10px 0;
        padding-left: 10px;
      }
      .slider-container{
        margin-top: 0;
      }
      .toggle-container {
        margin: 0px;
        border: none; 
        overflow: hidden;
          .active,
          li {
            background: #fff;
          }
      }
    }
      
    .help {
      padding-left: 18px;
      line-height: 36px;
      margin: 10px;
      padding: 0 10px;
      overflow-x: hidden;
      p {
        font-size: 12px;
        line-height: 30px;
        overflow-y: auto;
        text-indent: 2em;
        border-bottom: none;
      }
    }
  }


  @keyframes expandme {
    0% {
      height: 0px;
    }
    100% {
      height: auto;
    }
  }
  .fade-expand {
    animation-name: expandme;
    animation-duration: .2s; 
    animation-iteration-count: 1; 
  }
  @keyframes shrinkme {
    0% {
      height: auto;
    }
    100% {
      height: 0px;
    }
  }
  .fade-shrink {
    animation-name: shrinkme;
    animation-duration: .2s; 
    animation-iteration-count: 1; 
  }
</style>