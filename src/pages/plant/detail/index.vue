<template>
  <div class="suit-detail pop-zIndex" :class="className">
    
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
        <span class="address-name" v-loading.lock="addressLoading">{{addressName}}</span>
      </div>

      <span class="suit-lonlat suit-common">{{lonlatStr}}</span>

      <div class="comment-bg">
        <div class="componet">
          <p class="rate-result">评价结果</p>
          <h3 class="comment-rate">
            <span class="comment-content">{{commentContent}}</span>
            <span class="stars">
             <i class="iconfont icon-xingxing" 
                v-for="item in stars"
                :style="{color: item ===1 ? '#8fc31e' : '#dcdcdc'}">
             </i>
            </span>
          </h3>
        </div>
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
    },
    addressLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      lonlatStr: '',
      stars: [],
      commentContent: '',
      loading: false,
      eleGroup: [],
      eleSuit: [],
      className: ''
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
    showMe(show) {
      if (show) {
        this.doFadein()
        this.className = 'animation-suit-inleft'
      } else {
        this.doFadeout()
        this.className = 'animation-suit-outleft'
      }
    }
  }
}
</script>

<style 
lang="less" scoped>
@import '../../../assets/style/common';
@color: #898989;
.suit-common {
    display: block;
    margin-bottom: 8px;
    color: @color;
}
  .suit-detail {
    position: fixed;
    bottom: 45px;
    right: -524px;
    width: 524px;
    background: #fff;
    border-radius: 4px;
    padding-bottom: 8px;
    .adv-boxshadow();
    .legend-container {
      width: 524px;
      height: 38px;
      background: #f8f9f9;
      border-radius: 4px 4px 0 0;
      .adv-boxshadow();
      
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
            .adv-font-normal();
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
      margin: 8px 0 4px 0;
      padding-left: 14px;
      .address-icon,.address-name {
        vertical-align: middle;
      }
      .address-name{
        .adv-font-big();
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
      padding-left: 22px;
    }
    .comment-bg {
      background: #f1f6f7;
      line-height: 34px;
      border-top: 1px solid #b3b5b4;
      border-bottom: 1px solid #b3b5b4;
      .rate-result {
        .adv-font-normal();
        line-height: 45px;
      }
      .comment-rate {
        margin-bottom: 5px;
        .stars {
          margin-left: 14px;
          i {
            font-size: 24px;
            margin-right: 14px;
          }
        }
        .comment-content {
          font-size: 36px;
        }
      }
    }
    .suit-params-detail {
      .params-title {
        .adv-font-normal();
        font-weight: normal;
        line-height: 42px;
      }
    }
    .params-detail {
      overflow: hidden;
      .params-li {
        float: left;
        &:nth-child(2) {
          width: 110px;
          margin: 0 34px;
        }
        &:nth-child(1){
          width: 142px;
        }
        &:nth-child(3) {
          width: 160px;
        }
        ul {
          li {
            background: #e7f5d5;
            border-radius: 4px;
            margin-bottom: 10px;
            padding: 6px 0 6px 8px;
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
    .adv-animation(suit-inleft;.5s;1;forwards)
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
    .adv-animation(suit-outleft;.5s;1;forwards)
  }
</style>