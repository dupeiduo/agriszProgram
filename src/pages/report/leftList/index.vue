<template>
    <div class="left-container fl pr"
         v-loading.lock="loading"  
         :style="{'height':getScreenHeight - 50 + 'px'}">
    <ul class="report-type" 
      v-if="leftList.length > 0">
      <li class="special-report" 
          v-for="(item,index) in leftList" 
          :class="index == curIndex ? 'on' : ''"
          @click="curIndex = index"
          >
        <a>{{item.topic_name}}</a>
        <span class="report-common">
          <i class="iconfont " :class="index == curIndex ? 'icon-xiangyou' : 'icon-NOTEPAD'"></i>
        </span>
      </li>
    </ul>
    <expect-data
      v-else-if="leftList.length === 0 && !loading" 
      :showSectionData="true"
      :style="{height: clientH + 'px'}"
      ></expect-data>
  </div>
</template>

<script>
import expectData from 'components/expectData/'
import {mapGetters} from 'vuex'
  export default {
    props: {
      leftList: {
        type: Array,
        default: []
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        clientH: -1,
        curIndex: -1,
        showSectionData: false,
      }
    },
    mounted() {
    },
    computed: {
     ...mapGetters({
      menuWidth: 'menuWidth',
      screenWidth: 'screenWidth',
      getScreenHeight: 'getScreenHeight'
    })},
    methods: {},
    components: {
      expectData
    },
    watch: {
      leftList: function(leftList) {
        if (leftList && leftList.length > 0) {
          this.curIndex = 0;
        }

      },
      curIndex: function(index) {
        var topicId = this.leftList[index].topic_id
        this.$emit('changeTopic', topicId);
      }
    }
  }
</script>
<style 
    lang="less"
    rel="stylesheet/less"
    scoped>
    @import '../../../assets/style/common';
    .left-container {
      z-index: 3;
      height: 800px;
      width: 176px;
      margin-top: 47px;
      background: #ebf7e0;
      border-right: 1px solid #d0d0d0;
        .report-type {
          width: 176px;
          padding-top: 10px;

            .on,.on:hover {
              .adv-gradient(#beea6a;#a0d13d);
                    a {
                      .adv-font-small();
                      text-decoration: none;
                      color: #fff;
                    }
                    i {
                      color: #fff;
                }
            }
            
            li {
              position: relative;
              height: 42px;
              padding-left: 26px;
              border-top: 1px solid transparent;
              border-right: 1px solid #e5e5e5;
              border-bottom: 1px solid #e5e5e5;
              border-left: 1px solid transparent;
              cursor: pointer;

              &:nth-child(1) {
                border-top: 1px solid #e5e5e5;
              }
                a {
                  line-height: 42px;
                  display: inline-block;
                  color: #545252;
                  .adv-ellipsis(96px);
                }
              span {
                position: absolute;
                right: 12px;
                clear: both;
                overflow: hidden;
                margin-top: 12px;
                  i {
                    .adv-font-normal();
                    float: left;
                    width: 14px;
                    height: 14px;
                    color: #a0ac91;
                }
              }
            &:hover {
                 background: #f8fef1;
              }
          }
      }

      .none-data {
        position: relative;
        top: 30px;
        text-align: center;
      }
  }
</style>