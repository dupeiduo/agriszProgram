<template>
  <div class="monitor-list">
    <ul v-if="list.length > 0" :style="{height: listHeight + 'px'}">
      <li 
        v-for="(item, index) in list"
        :class="curIndex === index ? 'gradient' : ''">
        <span :class="'list-n' + (index + 1)"></span>
        <div class="list-txt">
        <h3>
          {{item.product_title}}
        </h3>
        <el-tooltip class="tips" effect="light" 
            :content="list[index].product_explanation" placement="right-start" popper-class="tips-popover">
            <i class="tool-tip iconfont icon-wenti"></i>
          </el-tooltip>
        <p v-limitLine>{{item.product_misc}}</p>
        </div>
        <h2 class="check-detail" @click="indexChange(index)">{{curIndex === index ? '返回详情': '查看详情'}}</h2>
      </li>
    </ul>
    <expect-data class="list-nodata-bg pr" :showSectionData="true" v-else-if="list.length === 0"></expect-data>
  </div>
</template>

<script type="text/javascript">
import expectData from 'components/expectData/'
  export default {
    props: {
      list: {
        type: Array,
        default: []
      },
      curIndex: {
        type: Number,
        default: 0
      },
      listHeight: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        cHeight: '',
        checkDetail: ''
      }
    },
     mounted(){
    },
    methods: {
      indexChange (index) {
        this.$emit('listChange', index)
      }
    },
    directives: {
      limitLine: {
        bind: function(el) {
          $clamp(el, {
            clamp: 2
          })
        }
      }
    },
    components: {
      expectData
    }
  }

</script>

<style 
  lang="less"
  scoped
  >
  @import '../../../assets/style/common';
  .monitor-list { 
    ul {
      overflow: auto;
      width: 358px;
      max-height: 868px;
      background: #fff;
      border-radius: 0px 0px 4px 4px;
      .gradient {
        .adv-gradient();
        &:hover {
          .adv-gradient();
        }
        .classification-title {
          font-weight: 600;
        }
        .list-txt {
          p {
            color: #4e4c4c;
          }
        }  
        .check-detail:hover{
          color: @disabled-color;
          border: 1px solid @disabled-color;
        }
      }
      li {
        position: relative;
        height: 116px;
        padding: 19px 16px 36px;
        box-sizing: border-box;
        border-bottom: 1px solid #d2d2d2;
        &:last-child {
          border-bottom: 1px solid #fff;
        }
        &:hover {
          background: #eee;
        }
        span {
          position: absolute;
          top: 0;
          left: 16px;
          width: 56px;
          height: 56px;
          margin-top: 24px;
          border-radius: 50%;
        }
        .list-n1 {
          background: url('@{imgurl}monitor/listn1.png') no-repeat;
        }
        .list-n2 {
          background: url('@{imgurl}monitor/listn2.png') no-repeat;
        }
        .list-n3 {
          background: url('@{imgurl}monitor/listn3.png') no-repeat;
        }
        .list-n4 {
          background: url('@{imgurl}monitor/listn4.png') no-repeat;
        }
        .list-n5 {
          background: url('@{imgurl}monitor/listn5.png') no-repeat;
        }
        .list-n6 {
          background: url('@{imgurl}/monitor/listn6.png') no-repeat;
        }
        .list-txt {
          padding-left: 66px;
        }
        .check-detail {
          .adv-fixed-small-btn();
          position: absolute;
          bottom: 7px;
          right: 18px;
          border: 1px solid @disabled-color;
          font-weight: normal;
          color: @disabled-color;
          background: #fff;
          &:hover {
            color: #6e9716;
            border: 1px solid #6e9716;
          }
        }
        .list-txt h3 {
          .adv-title-normal();
          color: #484848;
        }
        .list-txt p {
          .adv-text-line-height-small();
          height: 36px;
          margin-top: 10px;
          margin-right: 10px;
          overflow: hidden;
          color: @disabled-color;
        }
      }
    }

    .list-nodata-bg {
      width: 358px;
      min-height: 300px; 
      overflow-y: auto;
      .adv-border-bottom-radius();
    }
  }
  .tips {
      position: absolute;
      right: 16px;
      top: 10px;
      font-size: 20px;
      color: #989898;
  }

</style>