<template>
  <div class="suit-detail" :class="showMe ? 'animation-suit-inleft' : 'animation-suit-outleft'">
    
    <div  v-loading.lock="loading" class="pr">
      <div class="legend-container" v-if="showLegend">
        <div class="legend">
          <span class="legend-item" v-for="item in legend">
            <i :style="{background: item.color}"></i>
            <em>{{item.name}}</em>
          </span>
        </div>
        <span class="close-btn el-icon-close ps" @click="hideDetail"></span>
      </div>
      <span v-else class="close-btn el-icon-close ps" @click="hideDetail"></span>
      
      <div class="current-address">
        <i class="address-icon"></i>
        <span class="address-name font16">{{addressName}}</span>
      </div>

      <span class="suit-lonlat suit-common">{{lonlatStr}}</span>

      <div class="comment-bg">
        <p class="componet">
          <span>综合评价</span>
          <span class="stars">
            <i class="iconfont icon-xingxing" 
              v-for="item in stars"
              :style="{color: item ===1 ? '#8fc31e' : '#dcdcdc'}"></i>
          </span>
          <span class="comment-content">{{commentContent}}</span>
        </p>
      </div>

      <div class="suit-params-detail">
        <h3 class="params-title">{{cropName}}种植的影响因素详情</h3>

        <ul class="params-detail">
          <li class="params-li" v-for="item in eleGroup">
            <h3 class="suit-common">{{item}}</h3>
            <ul>
              <li v-for="param in eleSuit" 
                v-if="param.group === item"
                :style="{background: param.bg, border: '1px solid' + param.border}">
                <em class="point" :style="{background: param.point}"></em>
                &nbsp;{{param.name}}:
                <span>{{param.content}}</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import mapctl from '../map/index.js'
import request from 'api/request.js'
import model from 'api/model.js'
import configData from '../../../config/data.js'

export default {
  props: {
    showLegend: {
      type: Boolean,
      default: false
    },
    legend: {
      type: Array,
      default: []
    },
    showMe: {
      type: Boolean,
      default: false
    },
    paramList: {
      type: Array,
      default: []
    },
    params: {
      type: Object,
      default: null
    },
    addressName: {
      type: String,
      default: ''
    },
    cropName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      lonlatStr: '',
      stars: [],
      commentContent: '',
      loading: false,
      eleGroup: [],
      eleSuit: []
    }
  },
  mounted() {

  },
  methods: {
    hideDetail() {
      this.$emit('hideDetail')
    },
    requestSuitInfo(params) {
      this.lonlatStr = mapctl.getLonlat(params.coordinate)

      this.loading = true
      request.singlePointSuitInfo(params.surId, params.coordinate).
      then( (response) => {
        if (response && response.status == 200 && response.data.status == 0) {
          this.processElement(response.data.data);
        } else {
          // TODO: no data
        }
        this.loading = false
      });
    },
    processElement(data) {
      this.eleGroup = []
      this.eleSuit = []

      for (var i = 0; i < this.paramList.length; i++) {

        if (this.paramList[i].group && this.eleGroup.indexOf(this.paramList[i].group) < 0) {
          this.eleGroup.push(this.paramList[i].group)
        }
        
        for (var j = 0; j < data.length; j++) {

          if (data[j].element_id === this.paramList[i].id) {

            if (this.paramList[i].tag === "result") {
              var sutInfo = this.getSutContent(data[j].value)
              this.commentContent = sutInfo ? sutInfo.content : "无数据"
              this.setStars(data[j].value)

            } else {
              var sutInfo = this.getSutContent(data[j].value)
              if (sutInfo) {
                var item = {
                  group: this.paramList[i].group,
                  name: this.paramList[i].name,
                  content: sutInfo.content,
                  point: sutInfo.point,
                  bg: sutInfo.bg,
                  border: sutInfo.border
                }
              } else {
                var item = {
                  group: this.paramList[i].group,
                  name: this.paramList[i].name,
                  content: "无数据",
                  point: '#9c9c9c', 
                  bg: '#f1f1f1', 
                  border: '#bfbfbf'
                }
              }

              this.eleSuit.push(item)
            }
          }
        }
      }
    },
    setStars(value) {
      if (value == 1) {
        this.stars = [1,0,0,0,0]
      } else if (value == 2) {
        this.stars = [1,1,1,0,0]
      } else if (value >= 3) {
        this.stars = [1,1,1,1,1]
      } else {
        this.stars = [0,0,0,0,0]
      }
    },
    getSutContent(value) {
      console.log(value)
      if (value == -1) {
        return null
      }
      var colors = [
        {point: '#66d702', bg: '#e8febf', border: '#b8ea5e'},
        {point: '#00bbc2', bg: '#d5f5f3', border: '#49c7c1'},
        {point: '#9c9c9c', bg: '#f1f1f1', border: '#bfbfbf'},
      ]
      for (var i = 0; i < configData.plant.sutable.length; i++) {
        if (configData.plant.sutable[i].value == value) {
          var content = configData.plant.sutable[i].name
          var point = colors[i].point
          var bg = colors[i].bg 
          var border = colors[i].border
          return {point, bg, border, content}
        }
      };
    },
    doFadein() {

    },
    doFadeout() {

    }
  },
  watch: {
    params: {
      handler: function (params) {
        if (params) {
          this.requestSuitInfo(params)
        }
      },
      deep: true
    },
    paramList: {
      handler: function (list) {
        if (list && list.length > 0) {
          // console.log(list)
        }
      },
      deep: true
    },
    showMe(show) {
      if (show) {
        this.doFadein()
      } else {
        this.doFadeout()
      }
    }
  }
}
</script>

<style 
lang="less" scoped>
@import '../../../assets/style/reset';
@color: #898989;
.suit-common {
    display: block;
    margin-bottom: 12px;
    color: @color;
}
  .suit-detail {
    z-index: 2;
    position: fixed;
    right: -524px;
    bottom: 45px;
    width: 524px;
    height: 320px;
    background: #fff;
    border-radius: 4px;
    .mixin-boxshadow();
    @media screen and ( max-height: 800px) {
      height: 350px;
    }
    .legend-container {
      width: 524px;
      height: 38px;
      background: #f8f9f9;
      border-radius: 4px 4px 0 0;
      .mixin-boxshadow();
      
      .legend {
        .legend-item {
          margin: 11px 0 0 22px;
          display: inline-block;

          i {
            display: inline-block;
            width: 22px;
            height: 22px;
            float: left;
            border-radius: 2px;
          }
          em {
            float: left;
            padding: 1px 8px;
            font-size: 14px;
            float: left;
          }
        }
      }
    }

    .close-btn {
      right: 10px;
      top: 10px;
      cursor: pointer;
    }
    .current-address {
      line-height: 50px;
      padding-left: 12px;
      .address-icon,.address-name {
        vertical-align: middle;
      }
    }
    .address-icon {
      display: inline-block;
      width: 24px;
      height: 24px;
      background: url(/static/assets/img/map/altitude-little.png) center center no-repeat;
      vertical-align: middle;
    }
    .suit-lonlat,.comment-bg,.suit-params-detail {
      padding-left: 26px;
    }
    .suit-lonlat {
      
    }
    .comment-bg {
      background: #f1f4f4;
      line-height: 36px;
      .stars, .comment-content {
        margin-left: 14px;
      }
    }
    .suit-params-detail {
      .params-title {
        line-height: 46px;
        font-size: 14px;
      }
    }
    .params-detail {
      overflow: hidden;
      .params-li {
        float: left;
        ul {
          li {
            padding: 6px 10px;
            margin-right: 22px;
            background: #e7f5d5;
            border-radius: 4px;
            margin-bottom: 10px;

            .point {
              width: 6px;
              height: 6px;
              display: inline-block;
              border-radius: 3px;
            }
          }
        }
      }
    }
  }
  @keyframes suit-inleft {
    0% {
      opacity: 0;
      right: -524px;
    }
    100% {
      opacity: 1;
      right: 14px;
    }
  }
  .animation-suit-inleft {
    .mixin-animation(suit-inleft;.5s;1;forwards)
  }
  @keyframes suit-outleft {
    0% {
      opacity: 1;
      right: 14px;
    }
    100% {
      opacity: 0;
      right: -524px;
    }
  }
  .animation-suit-outleft {
    .mixin-animation(suit-outleft;.5s;1;forwards)
  }
</style>