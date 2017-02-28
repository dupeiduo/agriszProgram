<template>
  <div class="monitor-list">
    <ul v-if="list.length > 0" :style="{'max-height':cHeight}">
      <li 
        v-for="(item, index) in list"
        :class="curIndex === index ? 'gradient' : ''"
        @click="indexChange(index)">
        <span :class="'list-n' + (index + 1)"></span>
        <div class="list-txt">
        <h3>
          {{item.product_title}}
          <el-tooltip class="tips" effect="light" 
            :content="list[index].product_explanation" placement="right-start" popper-class="tips-popover">
            <i class="tool-tip">?</i>
          </el-tooltip>
        </h3>
        <p>{{item.product_misc}}</p>
        </div>
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
        cHeight: ''
      }
    },
     mounted(){
      var cHeight = document.documentElement.clientHeight || document.body.clientHeight;
          this.cHeight = (cHeight - 320) + 'px';
    },
    methods: {
      indexChange (index) {
        this.$emit('listChange', index)
      }
    }
  }

</script>

<style 
  lang="less"
  scoped
  >
  @import '../../../assets/style/reset';
  .monitor-list {
    ul {
      overflow-x: hidden;
      background: #fff;
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
        width: 328px;
        height: 82px;
        padding: 0 10px;
        border-right: 1px solid #d2d2d2;
        border-bottom: 1px solid #d2d2d2;
        cursor: pointer;
        text-align: left;
        &:hover {
          background: #f5fded;
        }
        span {
          float: left;
          width: 48px;
          height: 48px;
          margin-top: 16px;
          border-radius: 50%;
        }
        .list-n1 {
          background: url('/static/assets/img/monitor/listn1.png') no-repeat;
        }
        .list-n1 {
          background: url('/static/assets/img/monitor/listn1.png') no-repeat;
        }
        .list-n2 {
          background: url('/static/assets/img/monitor/listn2.png') no-repeat;
        }
        .list-n3 {
          background: url('/static/assets/img/monitor/listn3.png') no-repeat;
        }
        .list-n4 {
          background: url('/static/assets/img/monitor/listn4.png') no-repeat;
        }
        .list-n5 {
          background: url('/static/assets/img/monitor/listn5.png') no-repeat;
        }
        .list-n6 {
          background: url('/static/assets/img/monitor/listn6.png') no-repeat;
        }
        .list-txt {
          float: left;
          margin-left: 10px;
        }
        .list-txt h3 {
          font-size: 14px;
          line-height: 40px;
          position: relative;
          width: 248px;
          height: 34px;
          color: #484848;
        }
        .list-txt p {
          line-height: 20px;
          font-size: 12px;
          width: 220px;
          color: #989696;
        }
        .list-txt h3 i {
          font-size: 10px;
          line-height: 14px;
          position: absolute;
          right: 10px;
          width: 14px;
          height: 14px;
          text-align: center;
          color: #bbbec2;
          border: 1px solid #bbbec2;
          border-radius: 50%;
          background: #fff;
        }
      }
    }
  }
  .tips {
    float: right;
    margin-top: 10px;
  }
</style>