<template>
  <div class="healthy-status">
    <h3 class="healthy-status-title pr">作物健康状况统计图</h3>
    <div class="clear">
      <ul class="legend fl">
        <li class="pr" :class="item.legendClass" v-for="(item,index) in legend">
           <em class="ps"></em>
           <span class="ps">{{item.status}}<i>{{item.number}}</i></span>
        </li>
      </ul>
      <div class="healthy-echart-bg fl">
        <my-echart class="healthy-echart" :options="option"></my-echart>
      </div>
    </div>
  </div>
</template>

<script>
import echart from '../echart/index.js'
  export default {
    props: {
      legend: {
        type: Array,
        default: []
      },
      options: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        option: {}
      }
    },
    mounted() {
    },
    methods: {
       
    },
    watch: {
      options(options) {
        if (options) {
          this.option = echart.getPie(options)
        }
      }
    },
    components: {
      
    }
  }
</script>

<style 
lang="less" scoped>
 @import '../../../assets/style/common';
.ml14 {
  margin-left: 14px;
  }
.mr14 {
  margin-right: 14px;
}
.pl14 {
  padding-left: 14px;
} 
 .healthy-status {
    line-height: normal;
    background: #fff;
    padding: 12px 14px 10px;
    box-sizing: border-box;
    .healthy-status-title {
      .adv-title-after-vertical-line-normal();
      margin-bottom: 10px;
    }
    .legend {
      width: 26%;
      padding-bottom: 10px;
      li {
        width: 84px;
        height: 20px;
        margin-bottom: 6px;
        .adv-common-border-radius();
        em {
          left: 8px;
          top: 6px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        span {
            right: 8px;
            top: 2px;
            i {
              margin-left: 4px;
            }
        }
      }
      .good {
        color: #fff;
        background: #7fb66c;
        border: 1px solid #346b19;
        em {
          background: #346b19; 
        }
      }
      .better {
        background: #c1e079;
        border: 1px solid #619323;
        em {
          background: #619323;
        }
      }
      .normal {
        background: #f6f3a0;
        border: 1px solid #b7aa00;
        em {
          background: #b7aa00;
        }
      }
      .poor {
        background: #fedc8e;
        border: 1px solid #fda02e;
        em {
          background: #fda02e;
        }
      }
      .bad {
        color: #fff;
        background: #f07a5e;
        border: 1px solid #d00303;
        em {
          background: #d00303;
        }
      }
    }
    .healthy-echart-bg {
      width:  74%;
      height: 170px;
      .healthy-echart {
        width: 250px;
        height: 170px;
      }
    }
 }
</style>