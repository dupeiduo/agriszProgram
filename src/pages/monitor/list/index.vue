<template>
  <div class="monitor-list">
    <ul v-if="list.length > 0">
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
    <h3 v-else>－暂无数据－</h3>
  </div>
</template>

<script type="text/javascript">
  export default {
    props: {
      list: {
        type: Array,
        default: []
      },
      curIndex: {
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
  }

</script>

<style 
  lang="less"
  scoped
  >
  @import '../../../assets/style/reset';
  .monitor-list {
    
    ul {
      width: 356px;
      max-height: 585px;
      overflow-x: hidden;
      background: #fff;
      .mixin-common-border();
      .gradient {
        .mixin-gradient();
        &:hover {
          .mixin-gradient();
        }
        .classification-title {
          font-weight: 600;
        }
        .list-txt {
          p {
            color: #4e4c4c;
          }
        }  
      }
      li {
        position: relative;
        clear: both;
        padding: 0 16px;
        height: 116px;
        border-right: 1px solid #d2d2d2;
        border-bottom: 1px solid #d2d2d2;
        text-align: left;
        &:hover {
          background: #eee;
        }
        span {
          float: left;
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
          float: left;
          margin-left: 10px;
        }
        .check-detail {
          position: absolute;
          bottom: 10px;
          right: 18px;
          font-size: 12px;
          font-weight: normal;
          background: #fff;
          color: #969696;
          cursor: pointer;
          .mixin-width(68px);
          .mixin-height(24px);
          .mixin-border(#969696;4px);
          &:hover {
            color: #6e9716;
            .mixin-border(#6e9716;4px);
          }
        }
        .list-txt h3 {
          font-size: 14px;
          line-height: 40px;
          position: relative;
          width: 250px;
          height: 32px;
          margin-top: 6px;
          color: #484848;
        }
        .list-txt p {
          line-height: 20px;
          font-size: 12px;
          width: 250px;
          color: #989696;
        }
      }
      .gradient {
        .check-detail:hover{
          color: #969696;
          .mixin-border(#969696;4px);
        }
      }
      @media screen and (max-height: 830px) {
        height: 500px;
        overflow: scroll;
      }
      @media screen and (max-height: 678px) {
        height: 448px;
        overflow: scroll;
      }
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