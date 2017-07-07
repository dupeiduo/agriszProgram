<template>
  <div class="tbdetail-list-pr pr" :class="className">
    <div class="tbdetail-list ps" v-if="tableData.length > 0">
      <table>
        <thead>
          <tr>
            <th width="15%">编号</th>
            <th width="15%">作物</th>
            <th width="20%" @click="sortByArea">面积(亩)
              <span>
                <i class="iconfont icon-xiangshangjiantou" :class="orderByArea ? '' : 'active'"></i>
                <i class="iconfont icon-xiangshangjiantou1 down" :class="orderByArea ? 'active' : ''"></i>
              </span>
            </th>
            <th width="30%" @click="sortByHealth">健康状况
              <span>
                <i class="iconfont icon-xiangshangjiantou" :class="orderByHealth ? 'active' : ''"></i>
                <i class="iconfont icon-xiangshangjiantou1 down" :class="orderByHealth ? '' : 'active'"></i>
              </span>
            </th>
            <th width="20%">查看</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in currentPageData">
            <td>#{{item.objectId}}</td>
            <td>{{item.name}}</td>
            <td>{{item.area}}</td>
            <td :style="{color:item.color}">{{item.healthy}}</td>
            <td class="check-detail" @click="showLayerById(item.objectId)">
              <i class="iconfont icon-search"></i>
              <em class="animated fadeInRight fade-animation">查看</em>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="point-page no-select">
        <i class="el-icon-arrow-left" @click="prePage"></i>
        <span>{{pageIndex}}/{{pageCount}}</span>
        <i class="el-icon-arrow-right" @click="nextPage"></i>
      </p>
    </div>
    <expect-data v-else :showSectionData="true"></expect-data>
  </div>
</template>

<script>
import expectData from 'components/expectData/'
  export default {
    props: {
      tableData: {
        type: Array,
        default: []
      },
      className: {
        type: String,
        default: 'left-tab-animation-in-left'
      }
    },
    data() {
      return {
        currentPageData: [],
        pageIndex: 1,
        pageSize: 6,
        pageCount: 0,
        currentIndex: -1,
        orderByArea: true,
        orderByHealth: true,
        showSectionData: false
      }
    },
    mounted() {
       this.initCurrentPageData()
    },
    methods: {
      showLayerById(id) {
        this.$emit('showLayerById', id)
      },
      initCurrentPageData() {
        this.pageCount = Math.ceil(this.tableData.length / this.pageSize)
        var start = (this.pageIndex - 1) * this.pageSize
        var end = this.pageIndex * this.pageSize
        this.currentPageData = this.tableData.slice(start,end)
      },
      prePage(){
        if (this.pageIndex > 1) {
          this.pageIndex--
          this.initCurrentPageData()
        }
      },
      nextPage(){
        if (this.pageCount > this.pageIndex) {
          this.pageIndex++
          this.initCurrentPageData()
        }
      },
      sortByArea() {
        this.orderByArea = !this.orderByArea
        this.$emit('sortTableByArea', this.orderByArea)
      },
      sortByHealth() {
        this.orderByHealth = !this.orderByHealth
        this.$emit('sortTableByHealth', this.orderByHealth)
      }
    },
    watch: {
      tableData(data) {
        if (data && data.length > 0) {
          this.pageIndex = 1
          this.initCurrentPageData()
        }
      }
    },
    components: {
      expectData
    }
  }
</script>

<style 
lang="less" scoped>
@import '../../../assets/style/common';
.tbdetail-list-pr {
  width: @list-width;
  z-index: 2;
  overflow: hidden;
  border-bottom: 1px solid @border-color;
}
  .tbdetail-list {
    width: @list-width;
    cursor: pointer;
    background: #fff;
    table {
       width: 100%;
       thead tr {
          cursor: default;
          border-bottom: 1px solid #d8d8d8;
          height: 36px;
          line-height: 36px;
          .adv-gradient(#fff; #f7f7f7);
          th {
            span {
              position: absolute;
              top: -3px;
              right: 9px;
              i {
                font-size: 12px;
                height: 18px;
                display: block;
                color: #a4a3a3;
                cursor: pointer;
              }
              .down {
                line-height: 1;
              }
              .active {
                color: green;
              }
            }
          }
      }
       tbody {
        border-bottom: 1px solid #d8d8d8;
        tr {
          td {
          text-align: center;
          .adv-height(30px);
          }
          &:nth-child(2n) {
            background: #eef5fb;
          }
          .check-detail:hover {
            em {
              display: block;
              animation-duration: 0.35;
              -webkit-animation-duration: 0.35;
            }
            i {
              display: none;
            }
          }
          .check-detail {
            i {
              font-size: 12px;
            }
            i,em {
              display: block;
              height: 30px;
            }
            em {
              display: none
            }
          }
        }
       }
    }
  }
  .point-page {
    text-align: center;
    line-height: 30px;
    i {
      font-size: 14px;
      color: #c1c1c1;
      cursor: pointer;
      &:hover {
        color: #999;
      }
    }
    span {
      color: #7a7a7a;
    }
  }
</style>